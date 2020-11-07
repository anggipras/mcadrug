import Axios from 'axios'
import {API_URL, API_URL_SQL} from './../../helpers/apiurl'

export const LoginThunk = (datalogin) => {
    return (dispatch)=> {
        dispatch({type: 'LOADING'})
        Axios.post(`${API_URL_SQL}/auth/login`,datalogin)
        .then((res)=> {
            localStorage.setItem('user', JSON.stringify(res.data))
            dispatch({type: 'LOGIN', payload: res.data})
        }).catch((err)=> {
            dispatch({type: 'ERROR', payload: err.response.data.message})
        })
        // Axios.get(`${API_URL}/users`,{
        //     params: {
        //         email: email,
        //         password: pass
        //     }
        // }).then((res)=> {
        //     if(res.data.length) {
        //         localStorage.setItem('user', JSON.stringify(res.data[0]))
        //         console.log(res.data[0]);
        //         dispatch({type: 'LOGIN', payload: res.data[0]})
        //     } else {
        //         dispatch({type: 'ERROR', payload: 'Kata sandi atau email salah'})
        //     }
        // }).catch(err=> {
        //     dispatch({type: 'ERROR', payload: 'Server tidak ada'})
        // })
    }
}

export const KeepLogin = () => {
    return (dispatch)=> {
        dispatch({type: 'LOADING'})
        let datauser = localStorage.getItem('user')

        if(datauser){
            datauser = JSON.parse(datauser)
            Axios.get(`${API_URL_SQL}/auth/keeplogin/${datauser.id}`)
            .then((res)=> {
                localStorage.setItem('user', JSON.stringify(res.data))
                dispatch({type: 'LOGIN', payload: datauser})
            }).catch((err)=> {
                dispatch({type: 'ERROR'})
            })
            // Axios.get(`${API_URL}/users/${datauser.id}`)
            // .then((res)=> {
            //     localStorage.setItem('user', JSON.stringify(res.data))
            //     dispatch({type: 'LOGIN', payload: datauser})
            // }).catch((err)=> {
            //     dispatch({type: 'ERROR'})
            // })
        }
    }
}

export const LogoutFunc = () => {
    return {
        type: 'LOGOUT'
    }
}

export const RegisThunk = (completeDataRegis) => {
    return (dispatch)=> {
        dispatch({type: 'LOADING'})
        Axios.post(`${API_URL_SQL}/auth/register`,completeDataRegis)
        .then((res)=> {
            localStorage.setItem('user', JSON.stringify(res.data))
            dispatch({type: 'REGISTER', payload: res.data})
        }).catch((err)=> {
            dispatch({type: 'ERROR', payload: err.response.data.message})
        })

        // Axios.get(`${API_URL}/users`,{
        //     params:{
        //         username: completeDataRegis.username
        //     }
        // }).then((resa)=> {
        //     if(resa.data.length) {
        //         dispatch({type:'ERROR', payload: 'Username sudah ada'})
        //     } else {
        //         completeDataRegis.role = 'user'
        //         console.log(completeDataRegis);
        //         Axios.post(`${API_URL}/users`,completeDataRegis)
        //         .then((res)=> {
        //             localStorage.setItem('user', JSON.stringify(res.data))
        //             dispatch({type: 'REGISTER', payload: res.data})
        //         }).catch(err=> {
        //             dispatch({type: 'ERROR', payload: 'Server tidak ada'})
        //         })
        //     }
        // }).catch(err=> {
        //     dispatch({type: 'ERROR', payload: 'Server tidak ada'})
        // })
    }
}

export const SaveDataFunc = (obj) => {
    return {
        type: 'SAVEDATA',
        payload: obj
    }
}

export const disabledBtn = () => {
    return {
        type: 'DISABLEDBTN',
    }
}

export const verifiedAction = (newDataIn) => {
    return {
        type: 'LOGIN',
        payload: newDataIn
    }
}