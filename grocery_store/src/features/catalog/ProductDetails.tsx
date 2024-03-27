import { Box, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/Loading";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails() {
  // Get ID produk dari URL
  const { id } = useParams<{ id: string }>();
  // Get fungsi dispatch untuk mengirim aksi ke Redux store
  const dispatch = useAppDispatch();
  // Get data basket dan statusnya dari store
  const { basket, status } = useAppSelector(state => state.basket);
  // Get detail produk dari store menggunakan selector
  const product = useAppSelector(state => productSelectors.selectById(state, parseInt(id!)));
  // Get status produk dari store
  const { status: productStatus } = useAppSelector(state => state.catalog)
  // Kelola state untuk kuantitas produk yang dipilih
  const [quantity, setQuantity] = useState(0);
  // Temukan item keranjang yang terkait dengan produk ini
  const item = basket?.items.find(i => i.productId === product?.id);

  // Jika item ditemukan di keranjang, set kuantitas
  // Jika produk belum dimuat dan ada ID, fetch data produk
  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product && id) dispatch(fetchProductAsync(parseInt(id)))
  }, [id, item, dispatch, product]);

  // Perbarui kuantitas hanya jika nilainya valid
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.currentTarget.value) >= 0) {
      setQuantity(parseInt(event.currentTarget.value));
    }
  }

  // Jika item tidak ada di keranjang atau kuantitas yang dipilih lebih besar dari item yang ada:
  // Tambahkan item ke keranjang atau perbarui kuantitas
  // Kurangi kuantitas item di keranjang
  function handleUpdateCart() {
    if (!item || quantity > item.quantity) {
      const updateQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({ productId: product?.id!, quantity: updateQuantity }))
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }))
    }
  }

  // Tampilkan LoadingComponent jika produk sedang dimuat
  if (productStatus.includes('pending')) return <LoadingComponent />

  // Tampilkan NotFound jika produk tidak ditemukan
  if (!product) return <NotFound />

  // Render detail produk dan kontrol untuk update kuantitas dalam keranjang
  return (
    <Box sx={{
      backgroundColor: '#f9f9f9',
      padding: 2,
      borderRadius: 2,
    }}
    >
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img src={product.pictureUrl} alt={product.name} style={{ width: '100% ' }} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant='h3'>
            {product.name}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant='h4' color='secondary'>
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{product.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Quantity in Stock</TableCell>
                  <TableCell>{product.quantityInStock}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                onChange={handleInputChange}
                variant="outlined"
                type="number"
                label="Quantity in Cart"
                fullWidth
                value={quantity}></TextField>
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                disabled={item?.quantity === quantity || !item && quantity === 0}
                loading={status.includes('pending')}
                onClick={handleUpdateCart}
                sx={{ height: '55px' }}
                color='primary'
                size='large'
                variant="contained"
                fullWidth
              >{item ? 'Update Quantity' : 'Add to Cart'}</LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}