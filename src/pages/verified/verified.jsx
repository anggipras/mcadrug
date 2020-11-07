import React, { Component } from 'react';
import Axios from 'axios'
import Querystring from 'query-string'
import {connect} from 'react-redux'
import { API_URL_SQL } from '../../helpers/apiurl';
import {verifiedAction} from './../../redux/actions'
import { Redirect } from 'react-router-dom';

class Verified extends Component {
    state = {
        success: 0
    }

    componentDidMount(){
        console.log(this.props.location.search);
        let locsearch = Querystring.parse(this.props.location.search)
        console.log(locsearch);

        Axios.get(`${API_URL_SQL}/auth/verified`,{
            headers: {
                'Authorization': `Bearer ${locsearch.token}`
            }
        }).then((res)=> {
            console.log(res.data);
            this.props.verifiedAction(res.data)
            localStorage.setItem('user', JSON.stringify(res.data))
            this.setState({success: 1})
        }).catch((err)=> {
            this.setState({success: 2})
        })
    }

    render() { 
        if(this.state.success === 1){
            return <Redirect to='/' />
        }else if(this.state.success === 2){
            return(
            <div>
                <center>
                    <h1>
                       gagal verified
                    </h1>
                </center>
            </div>
            )
        }

        return (
            <div>
                <center>
                    <h1>
                        sedang menunggu verified
                    </h1>
                </center>
            </div>
          );
    }
}

const Mapstatetoprops = (state) => {
    return {
        Auth: state.Auth
    }
}

export default connect(Mapstatetoprops,{verifiedAction})(Verified);