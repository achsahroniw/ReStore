import { useEffect } from 'react';
import ProductList from './ProductList';
import LoadingComponent from '../../app/layout/Loading';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchProductsAsync, productSelectors } from './catalogSlice';

export default function Catalog() {
  // Get daftar produk dari store menggunakan selector
  const products = useAppSelector(productSelectors.selectAll);

  // Get nilai productsLoaded dan status dari state catalog
  const { productsLoaded, status } = useAppSelector(state => state.catalog);

  // Get fungsi dispatch dari useAppDispatch
  const dispatch = useAppDispatch();

  // Jalankan useEffect untuk mengambil data produk saat komponen dimuat/mounted atau ketika `productsLoaded` berubah
  useEffect(() => {
    // Jika produk belum dimuat, jalankan action untuk mengambil produk
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]); // Jalankan effect hanya ketika productsLoaded atau dispatch berubah

  // Tampilkan loading indicator jika status masih dalam proses
  if (status.includes('pending')) return <LoadingComponent message='Loading Products...' />;

  // Render komponen ProductList dengan prop products
  return (
    <>
      <ProductList products={products} />
    </>
  );
}