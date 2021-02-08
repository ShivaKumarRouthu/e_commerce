import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Typography, InputLabel, Button, Grid } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import FormInput from './FormInput';
import { commerce } from '../../lib/commerce';


const AddressForm = ({ checkoutToken, next }) => {

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubDivisions, setShippingSubDivisions] = useState([]);
  const [shippingSubDivision, setShippingSubDivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const methods = useForm();

  useEffect(() => {
    const fetchShippingCountries = async () => {
      const { countries } = await commerce.services.localeListShippingCountries(checkoutToken.id);
      setShippingCountries(countries);
      setShippingCountry(Object.keys(countries)[0]);
    }
    fetchShippingCountries();
  }, []);
  
  useEffect(() => {
    const fetchShippingSubDivisions = async () => {
      const { subdivisions } = await commerce.services.localeListSubdivisions(shippingCountry);
      setShippingSubDivisions(subdivisions);
      setShippingSubDivision(Object.keys(subdivisions)[0]);
    }
    if(shippingCountry) fetchShippingSubDivisions(shippingCountry);
  }, [shippingCountry]);
  
  useEffect(() => {
    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
      const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region});
      setShippingOptions(options);
      if(options[0]) setShippingOption(options[0].id);
    }
    if(shippingSubDivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubDivision);
  }, [shippingSubDivision])
  return (
    <>
      <Typography variant='h6' gutterBottom>Shipping Address</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubDivision, shippingOption}))}>
          <Grid container spacing={3}>
            <FormInput name='firstName' label='First Name' />
            <FormInput name='lastName' label='Last Name' />
            <FormInput name='address' label='Address' />
            <FormInput name='email' label='Email' />
            <FormInput name='city' label='City' />
            <FormInput name='zip' label='Zip/Postal Code' />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {
                  Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name})).map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.label}
                    </MenuItem>
                  ))
                }
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Divisions</InputLabel>
              <Select value={shippingSubDivision} fullWidth onChange={(e) => setShippingSubDivision(e.target.value)}>
                {
                  Object.entries(shippingSubDivisions).map(([code, name]) => ({id: code, label: name})).map((subdivison) => (
                    <MenuItem key={subdivison.id} value={subdivison.id}>
                      {subdivison.label}
                    </MenuItem>
                  ))
                }
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {
                  shippingOptions.map((so) => ({id: so.id, label: `${so.description} - (${so.price.formatted_with_symbol})`})).map((sOption) => (
                    <MenuItem key={sOption.id} value={sOption.id}>
                      {sOption.label}
                    </MenuItem>
                  ))
                }
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: 'flex', justifyContent:'space-between'}}>
            <Button type='button' variant='outlined' component={Link} to='/cart' color='secondary'>Back to Cart</Button>
            <Button type='submit' variant='contained' color='primary'>Next</Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default AddressForm