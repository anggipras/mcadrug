import React from 'react';
import Header from './../../components/Header'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Slider from "react-slick";

const useStyles = makeStyles((theme) => ({
    formControl: {
      marginLeft: theme.spacing(0),
      marginTop: '10%',
      minWidth: 200,
    },
  }));
  
export default function Home() {
    const classes = useStyles();

    const settings = {
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 5000,
        autoplaySpeed: 3000,
        pauseOnHover: false
      };

    return (
        <>
            <Header />
            <div className='d-flex'>
                <div style={{paddingLeft: '2%', paddingRight: '5%'}}>
                    <FormControl className={classes.formControl}>
                        <InputLabel style={{fontSize: '15px'}} htmlFor="grouped-native-select">KATEGORI</InputLabel>
                        <Select style={{fontSize: '15px'}} native defaultValue="" id="grouped-native-select">
                            <option aria-label="None" value="" />
                            <option value={1}>OBAT GENERIK</option>
                            <option value={2}>SUPLEMEN</option>
                            <option value={3}>HERBAL</option>
                            <option value={4}>ALAT KESEHATAN</option>
                        </Select>
                    </FormControl>
                </div>
                <div style={{width:'75%', paddingTop: '3%'}}>
                    <Slider {...settings} >
                        <div>
                            <img src='https://www.k24klik.com/images/banner/xapotek_online_k24klik_20201031015852257564_banner--2-.jpg.pagespeed.ic.tU6j1Drxnb.jpg' style={{objectFit:'cover'}} width='100%' height='100%' alt='img'/>
                        </div>
                        <div>
                            <img src='https://www.k24klik.com/images/banner/xapotek_online_k24klik_20201031092251257564_SHOPEE-PAY-K24KLIK-WEB-BANNER.jpg.pagespeed.ic.uYVNKleTlE.jpg' style={{objectFit:'cover'}} width='100%' height='100%' alt='img' />
                        </div>
                        <div>
                            <img src='https://www.k24klik.com/images/banner/xapotek_online_k24klik_20201021020251257564_Banner-OVO-SOS--6-.png.pagespeed.ic.CykCHp0N9O.png' style={{objectFit:'cover'}} width='100%' height='100%' alt='img' />
                        </div>
                    </Slider>
                </div>
            </div>
        </>
    );
}