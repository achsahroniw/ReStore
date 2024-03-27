import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { Product } from "../../app/models/product"
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

// Membuat adapter untuk mengelola entitas Product
const productsAdapter = createEntityAdapter<Product>()

// Membuat thunk async untuk mengambil daftar produk
export const fetchProductsAsync = createAsyncThunk<Product[]>(
  'catalog/fetchProductsAsync',
  async (_, thunkAPI) => {
    try {
      // Mengambil daftar produk dari server menggunakan agent.Catalog.list()
      return await agent.Catalog.list();
    } catch (error: any) {
      // Jika terjadi error, tampilkan di console 
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
)

// Membuat thunk async untuk mengambil detail produk
export const fetchProductAsync = createAsyncThunk<Product, number>(
  'catalog/fetchProductAsync',
  async (productId, thunkAPI) => {
    try {
      // Mengambil detail produk dari server menggunakan agent.Catalog.details(productId)
      return await agent.Catalog.details(productId);
    } catch (error: any) {
      // Jika terjadi error, tampilkan di konsol
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
)

// Membuat slice untuk mengelola state catalog
export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: productsAdapter.getInitialState({
    productsLoaded: false, // Status awal apakah produk sudah dimuat
    status: 'idle' // Status awal request
  }),
  reducers: {},
  // Penanganan action secara otomatis berdasarkan lifecycle action async
  extraReducers(builder) {
    // Menangani aksi pending untuk fetchProductsAsync
    builder.addCase(fetchProductsAsync.pending, (state) => {
      // Update status menjadi 'pendingFetchProducts' untuk menunjukkan sedang mengambil semua produk
      state.status = 'pendingFetchProducts';
    });
    // Menangani aksi fulfilled untuk fetchProductsAsync
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      // Update state dengan semua produk menggunakan adapter
      productsAdapter.setAll(state, action.payload);
      // Update status menjadi 'idle' dan productsLoaded menjadi true
      state.status = 'idle';
      state.productsLoaded = true;
    });
    // Menangani aksi rejected untuk fetchProductsAsync
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action.payload);
      // Update status menjadi 'idle' jika terjadi error
      state.status = 'idle';
    });
    // Menangani aksi pending untuk fetchProductAsync
    builder.addCase(fetchProductAsync.pending, (state) => {
      // Update status menjadi 'pendingFetchProduct' untuk menunjukkan sedang mengambil semua produk
      state.status = 'pendingFetchProduct';
    });
    // Menangani aksi fulfilled untuk fetchProductAsync
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapter.upsertOne(state, action.payload); // Menyimpan detail produk ke state
      state.status = 'idle'; // Mengubah status menjadi idle setelah permintaan selesai
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action);
      state.status = 'idle'; // Mengubah status menjadi idle jika permintaan gagal
    });
  },
})

// Membuat selector untuk mengakses state catalog
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)