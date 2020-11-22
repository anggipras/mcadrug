import React, { useEffect, useRef, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Button from '@material-ui/core/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {connect} from 'react-redux'
import {OpenModal, CloseModal, AcceptPrice, LessPrice} from './../redux/actions'
import {priceFormatter} from './../helpers/priceformatter'
import { API_URL_SQL } from '../helpers/apiurl';
import Axios from 'axios';
import {useHistory} from 'react-router-dom'

const TheModal = ({CloseModal, OpenModal, AcceptPrice, LessPrice, modalcart, cart, id, token, minprice}) => {
    const [thecart, setthecart] = useState([])
    const [indexedit, setindexedit] = useState(-1)
    const [inputmodal, setinputmodal] = useState({
        qtyInput: useRef()
    })

    useEffect(()=> {
        setthecart(cart)
    },[])

    useEffect(()=> {
        if(thecart) {
            setthecart(cart)
        } 
    },[cart, indexedit, thecart])

    const togglecart = () => {
        CloseModal()
    }

    const renderTotalPrice = () => {
        if(thecart) {
            var total = thecart.reduce((total, num)=> {
                return total + (num.price * num.qty)
            }, 0)
            if(total >= 10000) {
                AcceptPrice()
            } else {
                LessPrice()
            }
            return total
        } else {
            return null
        }
    }

    const saveChangeAmount = (idMed) => {
        Axios.post(`${API_URL_SQL}/transac/addtocart`,{
            userid: id,
            medid: idMed,
            qty: parseInt(inputmodal.qtyInput.current.value)
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res)=> {
            setindexedit(-1)
            OpenModal(res.data)
        }).catch((err)=> {
            console.log(err.response.data.message);
        })
    }

    const renderCart = () => {
        if(thecart) {
            return thecart.map((val, index)=> {
                if(index == indexedit) {
                    return (
                        <TableRow key={val.idmed}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>
                                <div style={{maxWidth:'200px'}}>
                                    <img width='100%' height='100%' src={API_URL_SQL + val.photo} alt={val.drugname}/>
                                </div>
                            </TableCell>
                            <TableCell>{val.drugname}</TableCell>
                            <TableCell>
                                <input 
                                    type = 'text' 
                                    ref = {inputmodal.qtyInput} 
                                    defaultValue = {val.qty}
                                    />
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={()=> saveChangeAmount(val.idmed)}>
                                    Simpan
                                </Button>
                                <Button variant="contained" color="secondary" onClick={()=> setindexedit(-1)}>
                                    Batal
                                </Button>
                            </TableCell>
                            <TableCell>{priceFormatter(val.price)}/{val.package}</TableCell>
                            <TableCell>{priceFormatter(val.price*val.qty)}</TableCell>
                        </TableRow>
                    )
                } else {
                    return(
                        <TableRow key={val.idmed}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>
                                <div style={{maxWidth:'200px'}}>
                                    <img width='100%' height='100%' src={API_URL_SQL + val.photo} alt={val.drugname}/>
                                </div>
                            </TableCell>
                            <TableCell>{val.drugname}</TableCell>
                            <TableCell>{val.qty}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={()=> setindexedit(index)}>
                                    Edit
                                </Button>
                            </TableCell>
                            <TableCell>{priceFormatter(val.price)}/{val.package}</TableCell>
                            <TableCell>{priceFormatter(val.price*val.qty)}</TableCell>
                        </TableRow>
                    )
                }
            })
        } else {
            return null
        }
    }

    let history = useHistory()
    const paymentMethod = () => {
        history.push('/Payment')
    }

    return (
        <div>
            <Modal size='lg' isOpen={modalcart} toggle={togglecart} >
                <ModalHeader toggle={togglecart}>CART</ModalHeader>
                <ModalBody>
                    <TableContainer >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell colSpan='2'>Produk</TableCell>
                                    <TableCell>Kuantitas</TableCell>
                                    <TableCell>Edit Jumlah</TableCell>
                                    <TableCell>Harga</TableCell>
                                    <TableCell>Bayar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderCart()}
                            </TableBody>
                            <TableFooter>
                                <TableCell colSpan={5}>Minimal Belanja <span style={{color:'black',fontSize:20}}>Rp. 10.000,-</span></TableCell>
                                <TableCell style={{fontWeight:'700', color:'black', fontSize:20}}>Subtotal Harga</TableCell>
                                <TableCell style={{color:'black',fontSize:20}}>{priceFormatter(renderTotalPrice())}</TableCell>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" disabled={minprice === true} onClick={paymentMethod}>
                        Lanjutkan Belanja
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

const Mapstatetoprops = ({Auth}) => {
    return {
        ...Auth
    }
}

export default connect(Mapstatetoprops, {OpenModal, CloseModal, AcceptPrice, LessPrice})(TheModal)