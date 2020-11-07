import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2'
import Header from './../../components/Header'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import Axios from 'axios'
import {API_URL_SQL} from './../../helpers/apiurl'
import {AiFillTags} from 'react-icons/ai'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import ObatBebas from './../../assets/golobat/obatbebas.jpg'
// import ObatBebasTerbatas from './../../assets/golobat/obatbebasterbatas.jpg'
// import ObatKeras from './../../assets/golobat/obatkeras.png'
// import ObatJamu from './../../assets/golobat/obatjamu.png'
// import ObatHerbal from './../../assets/golobat/obatherbal.png'

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  });

function ManageProduct() {
    const classes = useStyles();
    const [modal, setModal] = useState(false)
    const [modaltags, setModalTags] = useState(false)
    const [indextags, setIndexTags] = useState(0)

    const [theimage, settheimage] = useState(null)
    const [medicine, setmedicine] = useState([])
    const [thetags, setthetags] = useState([])
    const [specifiedtags, setspecifiedtags] = useState([])
    const [adddata, setadddata] = useState({
        medicname: useRef(),
        thestock: useRef(),
        theprice: '',
        kemasan: '',
        descript: useRef(),
        indicat: useRef(),
        categ: useRef(),
        compos: useRef(),
        dose: useRef(),
        storcond: useRef(),
        caut: useRef(),
        sideff: useRef(),
        theclass: '',
        drugtag: ''
    })

    useEffect(()=> {
        Axios.get(`${API_URL_SQL}/drug/getalldrug`)
        .then((res)=> {
            console.log(res.data);
            setmedicine(res.data.dataMedicines)
            setthetags(res.data.dataTags)
            setspecifiedtags(res.data.eachTags)
        }).catch(err=> {
            console.log(err);
        })
    },[])
    
    const onPriceChange = (e) => {
        if(e.target.value === '') {
            setadddata({...adddata, theprice: 0})
        }
        if(Number(e.target.value)){
            if(adddata.theprice === 0){
                setadddata({...adddata, theprice: e.target.value[1]})
            }else{
                setadddata({...adddata, theprice: e.target.value})    
            }
        }
    }

    const onImageChange = (e) => {
        if(e.target.files[0]) {
            settheimage(e.target.files[0])
        } else {
            settheimage(null)
        }
    }

    const toggle = () => {
        setModal(!modal)
        settheimage(null)
    }

    const toggleTags = () => {
        setModalTags(!modaltags)
    }

    const onSetClass = (e) => {
        setadddata({...adddata, theclass: e.target.value})
    }

    const onSetKemas = (e) => {
        setadddata({...adddata, kemasan: e.target.value})
    }

    const onAddDrug = () => {
        var formData = new FormData()
        var options = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }

        let drugname = adddata.medicname.current.value.toUpperCase()
        let stock = adddata.thestock.current.value
        let price = adddata.theprice
        let thepackage = adddata.kemasan
        let description = adddata.descript.current.value
        let indication = adddata.indicat.current.value
        let category = adddata.categ.current.value
        let composition = adddata.compos.current.value
        let doses = adddata.dose.current.value
        let storagecond = adddata.storcond.current.value
        let caution = adddata.caut.current.value
        let sideeffect = adddata.sideff.current.value
        let theclasses = adddata.theclass

        let medData = {
            drugname, 
            stock, 
            price, 
            package: thepackage, 
            description, 
            indication, 
            category, 
            composition,
            doses,
            storagecond,
            caution,
            sideeffect,
            class: theclasses
        }
        
        console.log(medData);
        formData.append('drugImage', theimage)
        formData.append('drugData', JSON.stringify(medData))
        Axios.post(`${API_URL_SQL}/drug/adddrug`, formData, options)
        .then((res)=> {
            console.log(res.data);
            setmedicine(res.data)
            setadddata({...adddata, theprice: ''})
            Swal.fire({
                position: 'top',
                icon: 'success',
                title: `Berhasil menambah ${drugname}`,
                showConfirmButton: false,
                timer: 1500
              })
            setModal(false)
        }).catch(err=> {
            console.log(err.response.data.message);
        })
    }

    const onSetTags = (index) => {
        setIndexTags(index)
        setModalTags(!modaltags)
    }

    const onChangeTags = (e) => {
        setadddata({...adddata, drugtag: e.target.value})
    }

    const onAddTag = () => {
        let idDrug = medicine[indextags].id
        let idTag = adddata.drugtag

        Axios.post(`${API_URL_SQL}/drug/inserttag`,{
            idDrug,
            idTag
        }).then((res)=> {
            console.log(res.data);
            setspecifiedtags(res.data)
            toggleTags(false)
        }).catch(err=> {
            console.log(err.response.data.message);
        })
    }

    const onFilterShowTags = () => {
        let filterTags = specifiedtags.filter((val)=> val.medicines_id == medicine[indextags].id)
        console.log(filterTags);

        return filterTags.map((val)=> {
            return (
                <div>
                    {val.tag}
                </div>
            )
        })
    }

    const renderTable = () => {
        return medicine.map((val, ind)=> {
            return (
                <TableRow key={val.id}>
                    <TableCell>{ind+1}</TableCell>
                    <TableCell>{val.drugname}</TableCell>
                    <TableCell>{val.stock}</TableCell>
                    <TableCell>
                        <div style={{width: '100%'}}>
                            Rp.{val.price}
                        </div>
                    </TableCell>
                    <TableCell>{val.package}</TableCell>
                    <TableCell>
                        <div style={{width: '200px'}}>
                            <img width='100%' height='100%' src={API_URL_SQL + val.photo} alt={val.drugname}/>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div style={{width: '400px'}}>
                            {val.description}
                        </div>
                    </TableCell>
                    <TableCell>{val.indication}</TableCell>
                    <TableCell>{val.category}</TableCell>
                    <TableCell>{val.composition}</TableCell>
                    <TableCell>
                        <div style={{width: '200px'}}>
                            {val.doses}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div style={{width: '200px'}}>
                            {val.storagecond}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div style={{width: '200px'}}>
                            {val.caution}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div style={{width: '200px'}}>
                            {val.sideeffect}
                        </div>
                    </TableCell>
                    <TableCell>{val.class}</TableCell>
                    <TableCell>
                        <span 
                            style={{color: '#ff8c00', 
                            fontSize:30, cursor: 'pointer'}} 
                            onClick={()=>onSetTags(ind)}><AiFillTags />
                        </span>
                    </TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            )
        })
    }

    return (
        <>
            <Modal size='lg' style={{marginTop: 80}} isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Data Obat</ModalHeader>
                <ModalBody style={{backgroundColor: '#ff8c00'}}>
                    <div className='row'>
                        <div className='col-md-4'>
                            <input type="file" className='form-control' onChange={onImageChange}/>
                            {
                                theimage?
                                <div className='my-2'>
                                    <img src={URL.createObjectURL(theimage)} 
                                    height = '200' 
                                    width = '200' 
                                    alt = "obat"/>
                                </div>
                                :
                                null
                            }
                        </div>
                        <div className='col-md-4'>
                            <input 
                                type = 'text' 
                                ref = {adddata.medicname} 
                                placeholder = 'Nama Obat' 
                                className = 'form-control mb-2'/>
                            <input 
                                type = 'number' 
                                ref = {adddata.thestock} 
                                placeholder = 'Stock' 
                                className = 'form-control mb-2'/>
                            <div className='row'>
                                <div className='col-md-8'>
                                    <input 
                                        type = 'text' 
                                        onChange = {onPriceChange} 
                                        placeholder = 'Rp...' 
                                        value = {adddata.theprice} 
                                        className = 'form-control mb-2'/>
                                </div>
                                <div className='col-md-4' style={{marginLeft: '-20px'}}>
                                    <select onChange={onSetKemas}>
                                        <option hidden defaultValue>Kemas</option>
                                        <option value="strip">strip</option>
                                        <option value="blister">blister</option>
                                        <option value="tablet">tablet</option>
                                        <option value="pcs">pcs</option>
                                        <option value="botol">botol</option>
                                        <option value="tube">tube</option>
                                        <option value="dos">dos</option>
                                    </select>
                                </div>
                            </div>
                            <textarea 
                                ref = {adddata.descript} 
                                placeholder = 'deskripsi' 
                                cols = "30" 
                                rows = "7"
                                className = 'form-control mb-2' 
                                ></textarea>
                            <input 
                                type = 'text' 
                                ref = {adddata.indicat} 
                                placeholder = 'Indikasi' 
                                className = 'form-control mb-2'/>
                            <input 
                                type = 'text' 
                                ref = {adddata.categ} 
                                placeholder = 'Kategori' 
                                className = 'form-control mb-2'/>
                            <input 
                                type = 'text' 
                                ref = {adddata.compos} 
                                placeholder = 'Komposisi' 
                                className = 'form-control mb-2'/>
                        </div>
                        <div className='col-md-4'>
                            <textarea 
                                ref = {adddata.dose} 
                                placeholder = 'Dosis' 
                                cols = "30" 
                                rows = "3"
                                className = 'form-control mb-2' 
                                ></textarea>
                            <textarea 
                                ref = {adddata.storcond} 
                                placeholder = 'Kondisi Penyimpanan' 
                                cols = "30" 
                                rows = "3"
                                className = 'form-control mb-2' 
                                ></textarea>
                            <textarea 
                                ref = {adddata.caut} 
                                placeholder = 'Perhatian' 
                                cols = "30" 
                                rows = "3"
                                className = 'form-control mb-2' 
                                ></textarea>
                            <textarea 
                                ref = {adddata.sideff} 
                                placeholder = 'Efek Samping' 
                                cols = "30" 
                                rows = "3"
                                className = 'form-control mb-2' 
                                ></textarea>
                            <select onChange={onSetClass}>
                                <option hidden defaultValue>Golongan Obat</option>
                                <option value="obat bebas">Obat Bebas</option>
                                <option value="obat bebas terbatas">Obat Bebas Terbatas</option>
                                <option value="obat keras">Obat Keras</option>
                                <option value="obat jamu">Obat Jamu</option>
                                <option value="obat herbal">Obat Herbal</option>
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onAddDrug}>Tambah</Button>
                    <Button color="secondary" onClick={toggle}>Batal</Button>
                </ModalFooter>
            </Modal>

            {/* for set the drug tags */}
            {
                medicine.length?
                <Modal style={{marginTop: 80}} isOpen={modaltags} toggle={toggleTags} >
                    <ModalHeader toggle={toggleTags}>Set tag {medicine.length? medicine[indextags].drugname : ''}</ModalHeader>
                    <ModalBody>
                        {onFilterShowTags()}
                        <div>
                            <FormControl>
                                <InputLabel style={{fontSize: '15px'}} htmlFor="grouped-native-select">TAGS</InputLabel>
                                <Select onChange={onChangeTags} style={{fontSize: '15px'}} native defaultValue="" id="grouped-native-select">
                                    <option aria-label="None" value="" hidden/>
                                    {
                                        thetags.map((val)=> {
                                            return (
                                                <option value={val.id}>{val.tag.toUpperCase()}</option>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={onAddTag}>Set tag</Button>
                        <Button color="secondary" onClick={toggleTags}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                :
                null
            }

            <Header />
            <div className='px-5 margintop'>
                <Button style={{background: 'linear-gradient(70deg, rgba(112,79,0,1) 0%, rgba(255,200,0,1) 100%)', border: 'none'}} onClick={toggle} className='my-3'>
                    Tambah Obat
                </Button>
                <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table" style={{ width: "auto", tableLayout: "auto" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Nama Obat</TableCell>
                                <TableCell>Stok Obat</TableCell>
                                <TableCell>Harga</TableCell>
                                <TableCell>Kemasan</TableCell>
                                <TableCell>Gambar Obat</TableCell>
                                <TableCell>Deskripsi</TableCell>
                                <TableCell>Indikasi</TableCell>
                                <TableCell>Kategori</TableCell>
                                <TableCell>Komposisi</TableCell>
                                <TableCell>Dosis</TableCell>
                                <TableCell>Kondisi Penyimpanan</TableCell>
                                <TableCell>Perhatian</TableCell>
                                <TableCell>Efek Samping</TableCell>
                                <TableCell>Golongan Obat</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderTable()}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </>
    );
}
 
export default ManageProduct;