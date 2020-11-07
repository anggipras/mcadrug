import React, {useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import {connect} from 'react-redux'
import {RegisThunk} from './../../../redux/actions'

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function AuthRegis(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [users, setusers] = useState({
    username: useRef(),
    email: useRef(),
    password: useRef(),
    conpass: useRef(),
  })

  const onRegisterClick = (e) => {
    e.preventDefault()
    let user = users.username.current.value
    let email = users.email.current.value
    let pass = users.conpass.current.value

    let dataRegis = {
      username: user,
      email,
      password: pass,
      firstname: props.Auth.firstname,
      lastname: props.Auth.lastname,
      phone: props.Auth.phone,
      birthdate: props.Auth.birthdate,
      address: props.Auth.address
    }
    
    console.log(dataRegis);
    props.RegisThunk(dataRegis)
    setActiveStep(activeStep + 1)
  }

  return (
    <React.Fragment>
      {activeStep === 1 ? (
        <React.Fragment>
          <Typography variant="h5" gutterBottom>
            Terima kasih telah mendaftar.
          </Typography>
          <Typography variant="subtitle1">
            Kami telah mengirimkan verifikasi ke email anda. Mohon cek kembali email anda untuk log in.
          </Typography>
        </React.Fragment>
      ) :
        <>
        <Typography variant="h6" gutterBottom>
          Otentikasi
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              required 
              id="username" 
              label="Username" 
              fullWidth 
              autoComplete="username"
              inputRef={users.username}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="email"
              label="Email"
              fullWidth
              autoComplete="email"
              inputRef={users.email}
            />
          </Grid>
          <Grid item xs={12} >
            <TextField 
              required 
              id="password" 
              label="Password"
              type="password" 
              fullWidth 
              autoComplete="password" 
              inputRef={users.password}
            />
          </Grid>
          <Grid item xs={12} >
            <TextField
              required
              id="confirmpass"
              label="Confirm Password"
              type="password" 
              helperText="Ketik kembali password untuk konfirmasi"
              fullWidth
              autoComplete="confirmpass"
              inputRef={users.conpass}
            />
          </Grid>
        </Grid>
        <div className={classes.buttons}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={onRegisterClick}
            className={classes.button}
          >
            Daftar
          </Button>
        </div>
        </>
      }
    </React.Fragment>
  );
}

const Mapstatetoprops = (state) => {
  return {
      Auth: state.Auth
  }
}

export default connect(Mapstatetoprops,{RegisThunk}) (AuthRegis);