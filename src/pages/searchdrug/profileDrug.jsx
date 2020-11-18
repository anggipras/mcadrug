import React, {useEffect, useState} from 'react';
import Header from './../../components/Header'
import Axios from 'axios';
import { API_URL_SQL } from '../../helpers/apiurl';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux'
import {OpenModal} from './../../redux/actions'
import TheModal from './../../components/Modal'
import Swal from 'sweetalert2'
import ObatBebas from './../../assets/golobat/obatbebas.jpg'
import ObatBebasTerbatas from './../../assets/golobat/obatbebasterbatas.jpg'
import ObatKeras from './../../assets/golobat/obatkeras.png'
import ObatJamu from './../../assets/golobat/obatjamu.png'
import ObatHerbal from './../../assets/golobat/obatherbal.png'


function ProfileDrug(props) {
    const [profmed, setprofmed] = useState([])
    const [thetag, setthetag] = useState([])

    useEffect(()=> {
        Axios.get(`${API_URL_SQL}/search/profiledrug/${props.match.params.id}`)
        .then((res)=> {
            setprofmed(res.data.dataProfMedicines)
            setthetag(res.data.profMedTags)
        }).catch(err=> {
            console.log(err.response.data.message);
        })
    },[])


    const renderLeftSide = () => {
        return profmed.map((val, ind)=> {
            return (
                <div key={ind}>
                    <div style={{fontSize: 20, fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {val.drugname}
                    </div>
                    <img style={{border: '2px solid gray', borderRadius: 25}} width='100%' height='100%' src={API_URL_SQL + val.photo} alt='profmedimg'/>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        Harga Rp. <span style={{color: 'orange', fontWeight: '700'}}>{val.price}</span> / {val.package}
                    </div>
                </div>
            )
        })
    }

    const renderRightTagSide = () => {
        return thetag.map((val,ind)=> {
            return (
                <div key={ind} style={{borderBottom: '1px double solid black', borderBottomStyle: 'double'}} className='mr-3'>
                    {val.tag} &nbsp;
                </div>
            )
        })
    }

    const renderRightAllSide = () => {
        return profmed.map((val, ind)=> {
            return (
                <div key={ind}>
                    <div className='my-3'>    
                        <h4>Deskripsi</h4>
                        <div>
                            {val.description}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Indikasi / Manfaat / Kegunaan</h4>
                        <div>
                            {val.indication}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Sub Kategori</h4>
                        <div>
                            {val.category}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Tag</h4>
                        <div className='row mx-0'>
                            {renderRightTagSide()}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Komposisi</h4>
                        <div>
                            {val.composition}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Dosis</h4>
                        <div>
                            {val.doses}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Cara Penyimpanan</h4>
                        <div>
                            {val.storagecond}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Perhatian</h4>
                        <div>
                            {val.caution}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Efek Samping</h4>
                        <div>
                            {val.sideeffect}
                        </div>
                    </div>
                    <div className='my-3'>    
                        <h4>Golongan obat</h4>
                        <div>
                            <img className='mr-2' src={val.class==='obat bebas'? ObatBebas:ObatKeras} alt="golobat"/>
                            {val.class}
                        </div>
                    </div>
                </div>
            )
        })
    }

    const onOpenMod = () => {
        if(props.Auth.role === 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Anda Admin tidak bisa beli!',
              })
        } else {
            Axios.post(`${API_URL_SQL}/transac/addtocart`,{
                userid: props.Auth.id,
                medid: props.match.params.id
            },{
                headers: {
                    'Authorization': `Bearer ${props.Auth.token}`
                }
            }).then((res)=> {
                props.OpenModal(res.data)
            }).catch((err)=> {
                console.log(err.response.data.message);
            })
        }
    }

    return (
        <>
            <Header />
            <TheModal />
            <div className='row mt-5 mx-5'>
                <div className='col-md-3'>
                    <div>
                        {renderLeftSide()}
                    </div>
                    <Button variant="contained" color="primary" onClick={onOpenMod}>
                        Beli
                    </Button>
                </div>
                <div className='row col-md-9'>
                    {renderRightAllSide()}
                </div>
            </div>
        </>
    );
}

const Mapstatetoprops = (state) => {
    return {
        Auth: state.Auth
    }
}

export default connect(Mapstatetoprops, {OpenModal})(ProfileDrug)