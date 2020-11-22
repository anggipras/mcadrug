import React, {useState, useEffect, useCallback} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {FaCartArrowDown} from 'react-icons/fa'
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Hidden from "@material-ui/core/Hidden";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


import {Link, Switch, Route, useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import {LogoutFunc, SearchMed} from './../redux/actions'
import Axios from 'axios';
import { API_URL_SQL } from '../helpers/apiurl';
import debounce from 'lodash.debounce'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  thecolor:{
    background: '#ff8c00'
  },
  menuButton: {
    marginRight: theme.spacing(0),
    width: '250px',
    height: '90px',
    borderRadius: '0px 0px 0px 0px'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
    marginRight: theme.spacing(3),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(10),
      width: '50%',
    },
  },
  searchIcon: {
    color: 'black',
    height: '35px',
    width: '35px',
    position: 'relative',
    top: '2px'
  },
  inputRoot: {
    color: 'black',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '60ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
  }
}));

function Header({username, isLogin, role, LogoutFunc, cart, SearchMed}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  // const handleMobileMenuOpen = (event) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
    </Menu>
  );
  
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onLogoutClick = () => {
    localStorage.removeItem('user')
    LogoutFunc()
  }

  const drawer = (
    <div style={{position: 'relative', top: '-40px'}}>
      <div className={classes.toolbar} />
      <div className='pl-3'>
        <h5>Welcome,</h5>
        <h3>{username}</h3>
      </div>
      <Divider />
      {
        role === 'user'?
        <List>
          {['Profile', 'History'].map((text, index) => (
            <ListItem button style={{textDecoration: 'none', color: 'black'}} key={text} component={Link} to={"/" + text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        :
        <List>
          {['Profile', 'ManageProduct', 'ManageTrans'].map((text, index) => (
            <ListItem button style={{textDecoration: 'none', color: 'black'}} key={text} component={Link} to={"/" + text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      }
      <Divider />
      <List>
        <Link to='/' style={{textDecoration:'none', color:'black'}}>
          {['Logout'].map((text, index) => (
          <div onClick={onLogoutClick}>
            <ListItem button key={text} >
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </div>
          ))}
        </Link>
      </List>
    </div>
  );

  const [medicine, setMedicine] = useState([])
  const [usersearch, setusersearch] = useState('')
  const [filterMedic, setfiltermedic] = useState([])
  const [isOpen, setOpen] = useState(false)

  useEffect(()=> {
    Axios.get(`${API_URL_SQL}/search/searchdrug`)
    .then((res)=> {
      setMedicine(res.data.dataMedicines)
    }).catch(err=> {
      console.log(err);
    })
  },[])

  const onInputSearch = () => {
    let datasearch = usersearch.toUpperCase()
    localStorage.setItem('searchdata', datasearch)
    SearchMed(datasearch)
  }

  const onSearchDrugChange = (e) => {
    if(e.target.value) {
      setusersearch(e.target.value)
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const filterMed = (search) => {
    let filterdata = medicine.filter((val)=> {
      return val.drugname.includes(search.toUpperCase())
    })
    return setfiltermedic(filterdata)
  }

  const updateSearch = () => {
    filterMed(usersearch)
  }

  const delayedSearch = useCallback(debounce(updateSearch, 1000),[usersearch])

  useEffect(()=> {
    delayedSearch()
  },[usersearch])

  const onMouseOver = (e) => {
    const el = e.target
    el.style.backgroundColor = 'orange'
  }

  const onMouseExit = (e) => {
    const el = e.target
    el.style.backgroundColor = 'white'
  }

  const renderSearchMedic = () => {
    return filterMedic.map((val, ind)=> {
      return (
        <Link to={'/ProfileMedicine/'+val.id}>
          <div key={val.id} style={{
            textDecoration:'none', 
            color:'black',
            cursor: 'pointer',
            borderRadius: 3,
            paddingLeft: '5px'
            }}
            onMouseEnter = {(e)=> onMouseOver(e)}
            onMouseOut = {(e)=> onMouseExit(e)}
            >
            {val.drugname}
          </div>
        </Link>
      )
    })
  }

  const removeSearch = () => {
    localStorage.removeItem('searchdata')
  }

  let history = useHistory()

  const onInputSubmit = (e) => {
    e.preventDefault()
    let datasearch = usersearch.toUpperCase()
    localStorage.setItem('searchdata', datasearch)
    SearchMed(datasearch)
    history.push('/SearchDrug')
    setOpen(false)
  }

  return (
    <div className={classes.grow}>
      <AppBar className={classes.thecolor} position="static">
        <Toolbar>
          <Link to='/'>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={removeSearch}
            >
              <img src='https://www.k24klik.com/themes/booster/images/k24klik_logo2.png.pagespeed.ce.MTM09c8bNd.png' width='100%' />
            </IconButton>
          </Link>
          <form className={classes.search} onSubmit={onInputSubmit}>
              <InputBase
                placeholder="Ketik obat yang dicari"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange = {onSearchDrugChange}
                onBlur = {()=> setTimeout(()=> {
                  setOpen(false)
                  setusersearch('')
                  setfiltermedic([])
                },150)}
              />
          </form>
          {
            isOpen?
            <Box p={1}
              style={{
                width:620,
                position:'absolute',
                top:70,
                right:310,
                zIndex:5,
                borderRadius: 7,
                border: '3px solid black',
                background:'white'
              }}
              anchorEl={isOpen}
              open={Boolean(isOpen)}
              onClose={()=>setOpen(false)}
              >
                <Typography>
                  <Link to='/SearchDrug'>
                    <div style={{
                        color: 'black', 
                        paddingLeft: '5px',
                        cursor: 'pointer',
                        borderRadius: 3,
                      }}
                      onMouseEnter = {(e)=> onMouseOver(e)}
                      onMouseOut = {(e)=> onMouseExit(e)}
                      onClick={onInputSearch}
                      >
                      {usersearch.toUpperCase()}
                    </div>
                  </Link>
                </Typography>
                <Typography>{renderSearchMedic()}</Typography>
              </Box>
              :
              null
          }
          <Link to='/SearchDrug'>
            <button onClick={onInputSearch} style={{border: 'none', borderRadius: '5px 5px 5px 5px', marginLeft: '-20px'}}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
            </button>
          </Link>
          <div className={classes.grow} />
          {
            isLogin?
              role === 'user'?
                <>
                <div className={classes.sectionDesktop}>
                  <IconButton aria-label="show number of carts" color="inherit" onClick={()=>history.push('/Payment')}>
                    <Badge badgeContent={cart.length} color="secondary">
                      <FaCartArrowDown />
                    </Badge>
                  </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleDrawerToggle}
                        color="inherit"
                      >
                      <AccountCircle />
                  </IconButton>
                </div>
                <div>
                <nav aria-label="mailbox folders">
                  {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                  <Hidden smUp implementation="css">
                    <Drawer
                      variant="temporary"
                      anchor={theme.direction === "rtl" ? "left" : "right"}
                      open={mobileOpen}
                      onClose={handleDrawerToggle}
                      classes={{
                        paper: classes.drawerPaper
                      }}
                      ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                      }}
                    >
                      {drawer}
                    </Drawer>
                  </Hidden>
                </nav>
                <main className={classes.content}>
                  <div className={classes.toolbar} />

                  <Switch>
                    <Route path="/Profile" />
                    <Route path="/History" />
                    <Route path="/ManageProduct" />
                    <Route path="/ManageTrans" />
                  </Switch>
                </main>

                </div>
                {/* <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </div> */}
              </>
              :
              <>
                <div className={classes.sectionDesktop}>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleDrawerToggle}
                    color="inherit"
                  >
                  <AccountCircle />
                  </IconButton>
                </div>
                <div>
                <nav aria-label="mailbox folders">
                  {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                  <Hidden smUp implementation="css">
                    <Drawer
                      variant="temporary"
                      anchor={theme.direction === "rtl" ? "left" : "right"}
                      open={mobileOpen}
                      onClose={handleDrawerToggle}
                      classes={{
                        paper: classes.drawerPaper
                      }}
                      ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                      }}
                    >
                      {drawer}
                    </Drawer>
                  </Hidden>
                </nav>
                <main className={classes.content}>
                  <div className={classes.toolbar} />

                  <Switch>
                    <Route path="/Profile" />
                    <Route path="/History" />
                    <Route path="/ManageProduct" />
                    <Route path="/ManageTrans" />
                  </Switch>
                </main>

                </div>
                {/* <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </div> */}
              </>
            :
            <Link to='/login' style={{textDecoration: 'none'}}>
              <div style={{border: '3px solid white'}}>
                <Button edge="end" style={{color: 'white'}}>Masuk / Daftar</Button>
              </div>
            </Link>
          }
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

const Mapstatetoprops = ({Auth}) => {
  return {
    ...Auth
  }
}

export default connect(Mapstatetoprops,{LogoutFunc, SearchMed}) (Header);