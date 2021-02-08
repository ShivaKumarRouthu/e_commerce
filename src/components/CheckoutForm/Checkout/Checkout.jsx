import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Button, Divider, CssBaseline } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { commerce } from '../../../lib/commerce';


import useStyles from './styles';
import PaymentForm from '../PaymentForm';
import AddressForm from '../AddressForm';

const steps = ['Shipping', 'Payment Details'];

const Checkout = ({ cart, onCaptureCheckout, order, error }) => {
  const classes = useStyles();
  const history = useHistory();

  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({});
  const [isFinished, setIshFinished] = useState(false);

  useEffect(() => {
    const generateCheckoutToken = async () => {
      try {
        console.log(cart);
        if(!cart.id) {
          history.push('/');
          return;
        }
        const token = await commerce.checkout.generateToken(cart.id, { type:'cart'});
        setCheckoutToken(token);
      } catch(error) {
        if (activeStep !== steps.length) history.push('/');
      }
    }

    generateCheckoutToken();
  }, [cart]);

  const nextStep = () => setActiveStep((previousActiveStep) => previousActiveStep+1);
  const backStep = () => setActiveStep((previousActiveStep) => previousActiveStep-1);
  const continuePayment = (data) => {
    console.log(data);
    setShippingDetails(data);
    nextStep();
  }

  const timeout = () => {
    setTimeout(() => {
      setIshFinished(true);
    }, 2000);
  }

  let Confirmation = () => order.customer ? (
    <>
      <div>
        <Typography variant='h6'>Thank you for your purchase {order.customer.firstname} {order.customer.lastname}</Typography>
        <Divider className={classes.divider} />
        <Typography variant='subtitle1'>Order reference: {order.customer_reference}</Typography>
        <Button component={Link} to='/' type='button' variant='outlined'>Bace to Home</Button>
      </div>
    </>
  ): isFinished? (
      <>
      <div>
        <Typography variant='h6'>Thank you for your purchase</Typography>
        <Divider className={classes.divider} />
        <Button component={Link} to='/' type='button' variant='outlined'>Bace to Home</Button>
      </div>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  );

  // if(error) {
  //   Confirmation = () => (
  //     <>
  //       <Typography variant="h5">Error: {error}</Typography>
  //       <br />
  //       <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
  //     </>
  //   );
  // }

  const Form = () => (
    activeStep === 0
    ? <AddressForm checkoutToken={checkoutToken} next={continuePayment} />
    : <PaymentForm 
        checkoutToken={checkoutToken} 
        backStep={backStep} 
        shippingDetails={shippingDetails} 
        nextStep={nextStep}
        onCaptureCheckout={onCaptureCheckout}
        timeout={timeout}
      />
  )

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h4' align='center' color='primary'>Checkout</Typography>
          <Stepper className={classes.stepper} activeStep={activeStep}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
        </Paper>
      </main>
    </>
  )
}

export default Checkout;