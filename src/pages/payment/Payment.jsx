import React, {useEffect, useRef, useState} from 'react';
import Header from './../../components/Header'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Axios from 'axios';
import {FinishCart} from '../../redux/actions'
import { API_URL_SQL } from '../../helpers/apiurl';
import {priceFormatter} from '../../helpers/priceformatter'
import {credit} from '../../helpers/creditvalidation'
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux'
import {Modal, ModalHeader, ModalBody, ModalFooter, CustomInput} from 'reactstrap'
import Swal from 'sweetalert2'

function Payment(props) {
    const [cart, setcart] = useState([])
    const [paymeth, setpaymeth] = useState({
        idtrans: 0,
        choicemethod: 0,
        invoice: useRef(),
        invoicetrans: null
    })
    const cccard = useRef()
    const [paymod, setpaymod] = useState(false)

    useEffect(()=> {
        Axios.get(`${API_URL_SQL}/transac/getcart`,{
            params:{
                userid: props.id
            }
        }).then((res)=> {
            console.log(res.data);
            console.log(res.data[0].idtrans);
            setcart(res.data)
            setpaymeth({idtrans: res.data[0].idtrans})
        }).catch((err)=> {
            console.log(err);
        })
    },[])

    const renderTotalPrice = () => {
        var total = cart.reduce((total, num)=> {
            return total + (num.price * num.qty)
        }, 0)
        return total
    }

    const renderCart = () => {
        if(cart.length) {
            return cart.map((val, index)=> {
                return (
                    <TableRow key={val.idmed}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>
                            <div style={{maxWidth:'150px'}}>
                                <img width='100%' height='100%' src={API_URL_SQL + val.photo} alt={val.drugname}/>
                            </div>
                        </TableCell>
                        <TableCell>{val.drugname}</TableCell>
                        <TableCell>{val.qty}</TableCell>
                        <TableCell>{priceFormatter(val.price)}/{val.package}</TableCell>
                        <TableCell>{priceFormatter(val.price*val.qty)}</TableCell>
                    </TableRow>
                )
            })
        } else {
            return null
        }
    }

    const oninputFileChange = (e) => {
        if(e.target.files[0]) {
            setpaymeth({...paymeth, invoicetrans: e.target.files[0]})
        } else {
            setpaymeth({...paymeth, invoicetrans: null})
        }
      }

    const onPayClick=()=>{
        const {choicemethod} = paymeth
        if(choicemethod === '1') {
            onPaywithInvoiceTrans()
        } else if(choicemethod === '2') {
            if(credit(parseInt(cccard.current.value))){
                onPaywithCC()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Bukan digit CC!',
                  })
            }
        } else {
            Swal.fire(
                'Metode Pembayaran?',
                'Pilih metode pembayaran terlebih dahulu!',
                'question'
              )
        }
    }
    
    const onPaywithCC = () => {
        console.log('onPaywithCC');
        Axios.post(`${API_URL_SQL}/transac/onpaycc`,{
            idtrans: paymeth.idtrans,
            ccnumber: cccard.current.value,
            cartdata: cart
        },{
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        }).then((res)=> {
            if(res.data === 'berhasil') {
                props.FinishCart([])
                setcart([])
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Terima kasih telah membeli di mcadDrug!',
                    showConfirmButton: false,
                    timer: 1500
                  })
                setpaymod(false)
            }
        }).catch((err)=> {
            console.log(err);
            alert(err)
        })
    }

    const onPaywithInvoiceTrans = () => {
        console.log('onPaywithInvoiceTrans');
        Swal.fire({
            icon: 'error',
            title: 'Metode Belum Tersedia',
            text: 'Maaf karena metode masih dalam tahap pengembangan',
          })
        // var formData=new FormData()
        // var options={
        //     headers:{
        //         'Content-type':'multipart/form-data',
        //         'Authorization': `Bearer ${this.props.token}`
        //     },
        //     params: {
        //         userid: this.props.id
        //     }
        // }

        // formData.append('bukti', this.state.buktitrans)
        // formData.append('data', JSON.stringify({idtrans: this.state.idtrans}))
        // Axios.post(`${API_URLbe}/trans/bayarbukti`,formData,options)
        // .then((res)=> {
        //     if(res.data === 'berhasil') {
        //         this.props.AddcartAction([])
        //         this.setState({cart:[], isOpen:false})
        //     }
        // }).catch(err=> {
        //     console.log(err);
        // })
    }

    const togglepaymod = () => {
        setpaymod(!paymod)
        setpaymeth({invoicetrans: null})
    }

    return (
        <>
            <Modal style={{marginTop:80}} isOpen={paymod} toggle={togglepaymod}>
                <ModalHeader toggle={togglepaymod}>Pembayaran</ModalHeader>
                <ModalBody>
                    <select onChange={(e)=>setpaymeth({...paymeth, choicemethod: e.target.value})} className='form-control' defaultValue={0} >
                        <option value="0" hidden>Pilih Metode Bayar</option>
                        <option value="1">Bukti Transfer</option>
                        <option value="2">Kartu Kredit</option>
                    </select>
                    {
                       paymeth.choicemethod === '2'?
                        <input type='number' className='form-control' ref={cccard} placeholder='masukkan cc'/>
                        :
                       paymeth.choicemethod === '1'?
                        <CustomInput className='form-control' onChange={oninputFileChange} type='file' label={paymeth.invoicetrans?paymeth.invoicetrans.name:'pilih invoice'} />
                        :
                        null
                    }
                    <div>
                        Total Harga  {priceFormatter(renderTotalPrice())}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onPayClick}>
                        Bayar
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Rendering Main Payment Screen */}
            <Header />
            <div className=' pt-3' style={{paddingLeft:'3%',paddingRight:'3%'}}>
                <Paper >
                    <TableContainer >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell colSpan='2'>Produk</TableCell>
                                    <TableCell>Kuantitas</TableCell>
                                    <TableCell>Harga</TableCell>
                                    <TableCell>Bayar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    cart.length?
                                        renderCart()
                                    :
                                    null
                                }
                            </TableBody>
                            <TableFooter>
                                {
                                    cart.length?
                                    <>
                                    <TableCell colSpan={4}></TableCell>
                                    <TableCell style={{fontWeight:'700', color:'black', fontSize:20}}>Subtotal Harga</TableCell>
                                    <TableCell style={{color:'black',fontSize:20}}>{priceFormatter(renderTotalPrice())}</TableCell>
                                    </>
                                    :
                                    null
                                }
                            </TableFooter>
                        </Table>
                    </TableContainer>
                    {
                        cart.length?
                            <Button variant="contained" color="primary" className='my-3' onClick={()=>setpaymod(true)}>
                                Metode Bayar / Pembayaran
                            </Button>
                        :
                            <div style={{fontSize: 30, border: '1px solid orange', backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                CART KOSONG, SILAHKAN BELANJA KEMBALI
                            </div>
                    }
                </Paper>
            </div>
        </>
    );
}

const Mapstatetoprops = ({Auth}) => {
    return {
        ...Auth
    }
}

export default connect(Mapstatetoprops, {FinishCart})(Payment)