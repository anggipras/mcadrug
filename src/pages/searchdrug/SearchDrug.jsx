import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Header from './../../components/Header'
import Axios from 'axios';
import { API_URL_SQL } from '../../helpers/apiurl';

const useStyles = makeStyles({
  media: {
    height: 120,
  },
});

function DrugCard() {
    const classes = useStyles();
    const [drug, setdrug] = useState([])

    useEffect(()=> {
        let drugdata = localStorage.getItem('searchdata')
        console.log(drugdata);
        if(drugdata) {
            Axios.get(`${API_URL_SQL}/search/specifieddrug/${drugdata}`)
            .then((res)=> {
                setdrug(res.data)
            }).catch(err=> {
                console.log(err.response.data.message);
            })
        } else {
            Axios.get(`${API_URL_SQL}/search/searchdrug`)
            .then((res)=> {
                setdrug(res.data)
            }).catch(err=> {
                console.log(err.response.data.message);
            })
        }
    },[])

    const renderCard = () => {
        return drug.map((val, ind)=> {
            return (
                <div className='col-md-2 py-2'>
                    <Card key={ind} className='shadow bg-white rounded' style={{maxWidth: 250}}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={API_URL_SQL + val.photo}
                                style={{width: '100%', height: '170px'}}
                            />
                            <CardContent style={{height: '80px'}}>
                                <Typography gutterBottom style={{fontSize: '13px', marginLeft: '10%'}}>
                                    {val.drugname}
                                </Typography>
                            </CardContent>
                            <Typography gutterBottom style={{fontSize: '15px', marginLeft: '20%', color: '#ff8c00'}}>
                                Rp. {val.price} / {val.package}
                            </Typography>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary">
                                Beli
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            )
        })
    }

    return (
        <>
            <Header />
            <div className='row m-0 mt-5 p-0'>
                {renderCard()}
            </div>
        </>
    );
}

export default DrugCard