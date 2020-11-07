import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {connect} from 'react-redux'
import {SaveDataFunc, disabledBtn} from './../../../redux/actions'

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function PersonalData(props) {
  const classes = useStyles();

  const [datausers, setdatausers] = useState({
    firstname: useRef(),
    lastname: useRef(),
    phone: useRef(),
    birthdate: useRef(),
    address: useRef(),
  })

  const [state, setState] = React.useState({
    checkedA: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    if(event.target.checked) {
      let firstname = datausers.firstname.current.value.toLowerCase()
      let lastname = datausers.lastname.current.value.toLowerCase()
      let phone = datausers.phone.current.value
      let birthdate = datausers.birthdate.current.value
      let address = datausers.address.current.value

      let completeData = {
        firstname,
        lastname,
        phone,
        birthdate: new Date(birthdate),
        address
      }

      console.log(completeData);
      props.SaveDataFunc(completeData)
    } else {
      props.disabledBtn()
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Data Personal
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="Nama Depan"
            fullWidth
            autoComplete="given-name"
            inputRef={datausers.firstname}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Nama Belakang"
            fullWidth
            autoComplete="family-name"
            inputRef={datausers.lastname}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="phone"
            name="phone"
            label="Nomor Telepon"
            fullWidth
            autoComplete="phone"
            inputRef={datausers.phone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="date"
            type="date"
            label="Birthdate"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            inputRef={datausers.birthdate}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address"
            name="address"
            label="Alamat Lengkap"
            fullWidth
            autoComplete="address"
            inputRef={datausers.address}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={state.checkedA} onChange={handleChange} color="secondary" name="checkedA" value="yes" />}
            label="Konfirmasi Data Personal"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const Mapstatetoprops = (state) => {
  return {
      Auth: state.Auth
  }
}

export default connect(Mapstatetoprops,{SaveDataFunc, disabledBtn}) (PersonalData);