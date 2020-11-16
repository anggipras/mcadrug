import React, { useEffect, useState } from 'react';
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
import {OpenModal, CloseModal} from './../redux/actions'
import {priceFormatter} from './../helpers/priceformatter'
import { API_URL_SQL } from '../helpers/apiurl';

const TheModal = ({CloseModal, modalcart, cart}) => {
    const [thecart, setthecart] = useState([])

    useEffect(()=> {
        setthecart(cart)
    },[])

    useEffect(()=> {
        if(thecart.length) {
            setthecart(cart)
        }
    },[cart])

    const togglecart = () => {
        CloseModal()
    }

    const renderCart = () => {
        return thecart.map((val, index)=> {
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
                    <TableCell>{priceFormatter(val.price)}</TableCell>
                    <TableCell>{priceFormatter(val.price*val.qty)}</TableCell>
                </TableRow>
            )
        })
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
                                    <TableCell>Harga</TableCell>
                                    <TableCell>Kuantitas</TableCell>
                                    <TableCell>Bayar</TableCell>
                                    <TableCell>Subtotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderCart()}
                            </TableBody>
                            <TableFooter>
                                <TableCell colSpan={4}></TableCell>
                                <TableCell style={{fontWeight:'700', color:'black', fontSize:20}}>Subtotal Harga</TableCell>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary">
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

export default connect(Mapstatetoprops, {OpenModal, CloseModal})(TheModal)