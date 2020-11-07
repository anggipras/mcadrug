import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class Loading extends Component {
    render() { 
        return (
            <div style={{height:'100vh'}} className='d-flex justify-content-center align-items-center'>
                <Loader type="Circles" color="#ff8c00" height={80} width={80} />
            </div>
          );
    }
}
 
export default Loading;