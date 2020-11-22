import React, {useEffect, useState} from 'react';
import Header from './../../components/Header'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Slider from "react-slick";
import Axios from 'axios';
import { API_URL_SQL } from '../../helpers/apiurl';

import ObatBebas from './../../assets/golobat/obatbebas.jpg'
import ObatBebasTerbatas from './../../assets/golobat/obatbebasterbatas.jpg'
import ObatKeras from './../../assets/golobat/obatkeras.png'
import ObatJamu from './../../assets/golobat/obatjamu.png'
import ObatHerbal from './../../assets/golobat/obatherbal.png'

const useStyles = makeStyles((theme) => ({
    formControl: {
      marginLeft: theme.spacing(0),
      marginTop: '10%',
      minWidth: 200,
    },
  }));
  
export default function Home() {
    const classes = useStyles();
    const [mostmed, setmostmed] = useState([])

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

    useEffect(()=> {
        Axios.get(`${API_URL_SQL}/search/mostboughtmed`)
        .then((res)=> {
            setmostmed(res.data)
        }).catch((err)=> {
            console.log(err);
        })
    },[])

    const renderMostBought = () => {
        return mostmed.map((val, ind)=> {
            return (
                <div key={ind} className='col-md-3 py-2'>
                    <Card className='shadow bg-white rounded' style={{maxWidth: 250}}>
                        <CardActionArea>
                            <img className='mt-2 ml-2' src={val.class==='obat bebas'? ObatBebas:ObatKeras} alt="golobat"/>
                            <CardMedia
                                className={classes.media}
                                image={API_URL_SQL + val.photo}
                                style={{width: '100%', height: '170px'}}
                            />
                            <CardContent style={{height: '80px'}}>
                                <Typography gutterBottom style={{fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {val.drugname}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            )
        })
    }

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
            <div className='mx-5'>
                <h2 style={{marginTop: '50px'}}>PRODUK TERLARIS</h2>
                <div className='d-flex'>
                    {renderMostBought()}
                </div>
            </div>
        </>
    );
}