import React, { useEffect } from 'react';
import {Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux'

import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/register/Register'
import Profile from './pages/profiles/profile'
import History from './pages/users/History'
import Verified from './pages/verified/verified'
import ManageProduct from './pages/admin/ManageProd'
import ManageTrans from './pages/admin/ManageTrans'
import SearchDrug from './pages/searchdrug/SearchDrug'
import ProfileDrug from './pages/searchdrug/profileDrug'
import Loading from './components/Loading'
import NotFound from './components/NotFound'
import {KeepLogin} from './redux/actions'

function App({KeepLogin, isLoading, role}) {

  useEffect(()=> {
    let datauser = localStorage.getItem('user')
    if(datauser) {
      KeepLogin()
    } 
  },[])

  const renderProtectedRoutes = () => {
    if(role === 'admin') {
      return(
        <>
          <Route exact path='/ManageProduct' component={ManageProduct} />
          <Route exact path='/ManageTrans' component={ManageTrans} />
        </>
      )
    } 
  }

  if(isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/verified' component={Verified} />
        <Route exact path='/Profile' component={Profile} />
        <Route exact path='/History' component={History} />
        <Route exact path='/SearchDrug/:drugname' component={SearchDrug} />
        <Route exact path='/ProfileMedicine/:id' component={ProfileDrug} />
        {renderProtectedRoutes()}
        <Route path='*' component={NotFound} />
      </Switch>
    </div>
  );
}

const Mapstatetoprops = ({Auth}) => {
  return {
    ...Auth
  }
}

export default connect(Mapstatetoprops,{KeepLogin}) (App);