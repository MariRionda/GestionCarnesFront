import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import NavBar from '../../Components/Navbar/Navbar'
import {getComrpaByID, getPagosComprasByProveedor, getProveedorByName, postNewPagoCompra, putSaldoCompra, setAlert, setimgurl } from "../../Redux/Actions/Actions";
import stylePagoC from './Form_pago.module.scss';
//calendario-----------------------------------
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import SubirImagen from "../../Components/SubirImagenes/subirImagenes";
import emailjs from 'emailjs-com';

const formPC = {
    fecha: new Date().toLocaleDateString('en'),
    monto: 0,
    formaDePago:'',
    compraID: 0,
    proveedor:'',
    img_comp: ''
};

const formasDePago=["Efectivo", "Transferencia"]



const Form_Pago_Compra = () => {
    const host = window.location.origin

    const {id}=useParams()

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getComrpaByID(id))
    }, [dispatch])

    const compra = useSelector((state)=>state.CompraByID);
    const alert_msj= useSelector ((state)=>state.alert_msj);
    const urlImg= useSelector ((state)=>state.urlImg);
  

    useEffect(() => {
        dispatch(getProveedorByName(compra.proveedor))
        
    }, [compra])

    const proveedor = useSelector((state)=>state.provByNombre)
    
    let pagosByProveedor = useSelector((state)=>state.pagosByProveedor)   

    useEffect(() => {
            if(pagosByProveedor.length)sendEmail()
    }, [pagosByProveedor])

    function sendEmail(){
        emailjs.send('service_by3lbzk','template_hob7gmo',{email: proveedor.email, mensaje:`${host}/Proveedores/DetallePagos/${compra.proveedor}/${pagosByProveedor.pop().id}/pdf`},'H7r3DDDUrBVJ25a60')
    }

    useEffect(() => {
        if(alert_msj!==""){
            swal({
                text: alert_msj,
                icon: alert_msj==="Pago creado con éxito"?"success":"warning", 
                button: "ok",
            })}
            dispatch(getComrpaByID(id))
            dispatch(setAlert())
    }, [alert_msj])

    const [form, setForm] = useState(formPC);
    const [error, setError] = useState({});

    //validaciones
    const validate = (pago) => {
        let error = {};
        if (!pago.monto) error.monto = "Falta monto";
        if (compra.saldo*1+10<pago.monto*1) error.monto = "El monto excede el saldo"
        else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(pago.monto)) error.monto = "Monto debe ser un número";
        if (!pago.formaDePago) error.forma_pago = "Falta forma de pago";
        return error;
    };

    const handleChange = (e) => {
        e.preventDefault()
        setError(
        validate({
            ...form,
            [e.target.name]: e.target.value,
        })
        );
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };
    //carga de calendario
    const handleChangeDate = (date) => {  
        setForm({
        ...form,
        fecha:  date
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if(
        !error.formaDePago && form.formaDePago &&
        !error.monto && form.monto
        ){
        form.id="PC"+Math.floor(Math.random()*1000000)
        form.proveedor=compra.proveedor
        form.compraID=id
        form.fecha=form.fecha.getTime()
        form.img_comp = urlImg
        let saldo= compra.saldo - form.monto
        dispatch(postNewPagoCompra(form))
        dispatch(putSaldoCompra(id, saldo))        
        .then((response)=>{
            if(response)dispatch(getPagosComprasByProveedor(compra.proveedor))
        })
        
        document.getElementById("formaDePago").selectedIndex = 0
        setForm(formPC);
        dispatch(setimgurl())
        }
        else {
            swal({
                text: "Datos incorrectos, por favor intente nuevamente",
                icon: "warning",
                button: "ok",
            })
        }
    };



    function handleSelectFP(e) {
        setForm({
            ...form,
            formaDePago:  e.target.value
        })
    }

    const handleCreate = () => {
        navigate("/Compras")
    };

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
        }

    const saldoEnPesos = currencyFormatter({
        currency: "USD",
        value : compra.saldo
        })
    //tema del calendario
    const outerTheme = createTheme({
        palette: {
            primary: {
                main: '#640909'
            },
        },
        });
    return (
        <div className={stylePagoC.wallpaper}>
            <NavBar
            title={"Nuevo Pago"}
            />
            <div className={stylePagoC.formContainer}>
                <div className={stylePagoC.detallePro}>
                    <div className={stylePagoC.detalledivs}>
                        <h5 className={stylePagoC.title}>Proveedor: </h5>
                        <h4 className={stylePagoC.nameP}>{compra.proveedor}</h4>
                    </div>
                    <div className={stylePagoC.detalledivs}>
                        <h5 className={stylePagoC.title}>Saldo: </h5>
                        <h4 className={stylePagoC.nameP}>{saldoEnPesos}</h4>
                    </div>
                </div>
                <form className={stylePagoC.form}>
                    <div className={stylePagoC.formItemDate}>
                        <h5 className={stylePagoC.titleDate}>Fecha: </h5>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale} >
                        <ThemeProvider theme={outerTheme}>
                        <KeyboardDatePicker
                            format="dd-MM-yyyy"
                            value={form.fecha}
                            disableFuture
                            onChange={handleChangeDate}                    
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        </ThemeProvider>  
                        </MuiPickersUtilsProvider>
                    </div>
                    <p className={form.fecha!==new Date().toLocaleDateString() ? stylePagoC.pass : stylePagoC.danger }>Debe ingresar la fecha</p>
                    <div className={stylePagoC.formItem}>
                        <h5 className={stylePagoC.title}>Monto: </h5>
                        <input
                            type="number"
                            value={form.monto?form.monto:''}
                            id="monto"
                            name="monto"
                            onChange={handleChange}
                            placeholder="0.00"
                            className={error.monto & 'danger'}
                        />
                    </div>
                    <p className={error.monto ? stylePagoC.danger : stylePagoC.pass}>{error.monto}</p>
                    <div className={stylePagoC.formItem}>
                        <h5 className={stylePagoC.title}>Forma de Pago: </h5>
                        <select id="formaDePago" className="selectform" onChange={(e)=> handleSelectFP(e)}>
                            <option defaultValue>-</option>
                            {formasDePago.length > 0 &&  
                                formasDePago.map((p,i) => (
                                    <option key={i}	value={p}>{p}</option>
                                    ))
                            }
                        </select>
                    </div>
                    <div className={stylePagoC.formItemInput} >
                            <SubirImagen/>
                            <h5 className={stylePagoC.title}>Agregar Comprobante</h5>
                    </div>
                    {urlImg?
                    <div className={stylePagoC.img}>
                        <img src={urlImg?urlImg:"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} className={stylePagoC.img}/>
                    </div>  
                    :null
                    }  
                    <div className={stylePagoC.buttons}>
                        <ShortButton
                            title="✔ Confirmar"
                            onClick={handleSubmit}
                            color="green"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form_Pago_Compra;