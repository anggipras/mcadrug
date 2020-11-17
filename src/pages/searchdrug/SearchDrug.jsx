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
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {OpenModal} from './../../redux/actions'
import TheModal from './../../components/Modal'
import Swal from 'sweetalert2'

const useStyles = makeStyles({
  media: {
    height: 120,
  },
});

function DrugCard({OpenModal, role, id, token, match}) {
    const classes = useStyles();
    const [drug, setdrug] = useState([])
    const [page, setpage] = useState(1)
    const [countmed, setcountmed] = useState('')

    useEffect(()=> {
        let drugdata = localStorage.getItem('searchdata')
        if(drugdata) {
            Axios.get(`${API_URL_SQL}/search/specifieddrug/${drugdata}`)
            .then((res)=> {
                setdrug(res.data.dataSpecMedic)
                setcountmed(res.data.countMedicines[0].amountofmed)
            }).catch(err=> {
                console.log(err.response.data.message);
            })
        } else {
            fetchdata()
        }
    },[])

    useEffect(()=> {
        let drugdata = localStorage.getItem('searchdata')
        if(!drugdata) {
            fetchdata()
        } else {
            Axios.get(`${API_URL_SQL}/search/specifieddrug/${match.params.drugname}`)
            .then((res)=> {
                setdrug(res.data.dataSpecMedic)
                setcountmed(res.data.countMedicines[0].amountofmed)
            }).catch(err=> {
                console.log(err.response.data.message);
            })
        }
    },[page, match])

    const fetchdata = async () => {
        try {
          var res = await Axios.get(`${API_URL_SQL}/search/searchdrug?page=${page}`)
          setdrug(res.data.dataMedicines)
          setcountmed(res.data.countMedicines[0].amountofmed)
        } catch (error) {
            console.log(error.response.data.message);
        }
      }

    const movePage = (value) => {
        setpage(value)
    }

    const renderPage = () => {
        let amountPage = Math.ceil(countmed/8)
        let arr = new Array(amountPage)
        for(let i=0; i<arr.length; i++) {
            if((i+1)===page) {
                arr[i] = (
                    <PaginationItem key={i} disabled>
                        <PaginationLink >
                            {i+1}
                        </PaginationLink>
                    </PaginationItem>
                )
            } else {
                arr[i] = (
                    <PaginationItem key={i} onClick={()=>movePage(i+1)} >
                        <PaginationLink >
                            {i+1}
                        </PaginationLink>
                    </PaginationItem>
                )
            }
        }
        return arr
    }

    const onOpenMod = (idMed) => {
        if(role === 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Anda Admin tidak bisa beli!',
              })
        } else {
            Axios.post(`${API_URL_SQL}/transac/addtocart`,{
                userid: id,
                medid: idMed
            },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res)=> {
                OpenModal(res.data)
            }).catch((err)=> {
                console.log(err.response.data.message);
            })
        }
    }

    const renderCard = () => {
        return drug.map((val, ind)=> {
            return (
                <div key={ind} className='col-md-3 py-2'>
                    <Card className='shadow bg-white rounded' style={{maxWidth: 250}}>
                        <CardActionArea>
                            <Link to={'/ProfileMedicine/'+val.id}>
                                <CardMedia
                                    className={classes.media}
                                    image={API_URL_SQL + val.photo}
                                    style={{width: '100%', height: '170px'}}
                                />
                            </Link>
                            <CardContent style={{height: '80px'}}>
                                <Typography gutterBottom style={{fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {val.drugname}
                                </Typography>
                            </CardContent>
                            <Typography gutterBottom style={{fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff8c00'}}>
                                Rp. {val.price} / {val.package}
                            </Typography>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary" onClick={()=>onOpenMod(val.id)}>
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
            <TheModal />
            <div className='row m-0 mt-5 px-5'>
                {renderCard()}
            </div>
            <Pagination className='px-5' aria-label="Page navigation example">
            {renderPage()}
            </Pagination>
        </>
    );
}

const Mapstatetoprops = ({Auth}) => {
    return {
        ...Auth
    }
}

export default connect(Mapstatetoprops, {OpenModal})(DrugCard)