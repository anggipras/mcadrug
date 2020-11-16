import React, {useEffect, useState} from 'react';
import Header from './../../components/Header'
import Axios from 'axios';
import { API_URL_SQL } from '../../helpers/apiurl';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux'
import {OpenModal} from './../../redux/actions'
import TheModal from './../../components/Modal'
import Swal from 'sweetalert2'


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

    const renderRightSide = () => {
        return thetag.map((val,ind)=> {
            return (
                <div key={ind}>
                    {val.tag} &nbsp;
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
            <div className='row mx-2 mt-5'>
                <div className='col-md-3'>
                    <div>
                        {renderLeftSide()}
                    </div>
                    <Button variant="contained" color="primary" onClick={onOpenMod}>
                        Beli
                    </Button>
                </div>
                <div className='row col-md-9'>
                    {renderRightSide()}
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