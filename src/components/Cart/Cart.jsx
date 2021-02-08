import React from 'react';
import { Container, Grid, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem';
import useStyles from './styles';

const Cart = ({ cart, onItemUpdateQty, onRemoveItem, onCartEmpty }) => {

  const classes = useStyles();

  const EmptyCart = () => (
    <Typography variant='subtitle1'>You have no items in shopping cart,
      <Link to='/' className={classes.link}>start adding some</Link>!
    </Typography>
  );

  const FilledCart = () => (
    <>
      <Grid container spacing={3}>
        {
          cart.line_items.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <CartItem 
                item={item} 
                onItemUpdateQty={onItemUpdateQty} 
                onRemoveItem={onRemoveItem} />
            </Grid>
          ))
        }
      </Grid>
      <div className={classes.cardDetails} >
        <Typography variant='h4' >Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
        <div>
          <Button 
            className={classes.emptyButton} 
            size='large' 
            type='button' 
            variant='contained' 
            color='secondary'
            onClick={onCartEmpty}>Empty Cart</Button>
          <Button 
            component={Link}
            to='/checkout'
            className={classes.checkoutButton} 
            size='large' 
            type='button' 
            variant='contained' 
            color='primary'>Checkout</Button>
        </div>
      </div>
    </>
  );

  if (!cart.line_items) return 'Loading';
  
  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography variant='h3' className={classes.title} gutterBottom>Your Shopping Cart</Typography>
      {
        !cart.line_items.length ? <EmptyCart /> : <FilledCart />
      }
    </Container>
  )
}

export default Cart;
