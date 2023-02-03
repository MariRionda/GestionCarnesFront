import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import NavBar from '../../Components/Navbar/Navbar'
import {  getAllPagosVentasAchuras, getClienteByName, getVentaAchurasByID, postNewPagoVentaAchuras, putSaldoVentaAchuras, setAlert, setimgurl } from "../../Redux/Actions/Actions";
import stylePagoV from './Form_pago.module.scss';
//calendario-----------------------------------
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import SubirImagen from "../../Components/SubirImagenes/subirImagenes";

const formPV = {
    fecha: new Date().toLocaleDateString('en'),
    monto: 0,
    formaDePago:'',
    ventaID:0,
    clien:'',
    img_comp:''
};

const formasDePago=["Efectivo", "Transferencia"]



const Form_Pago_Venta_Achuras = () => {

    const {id}=useParams()

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getVentaAchurasByID(id))
    }, [dispatch])

    const venta = useSelector((state)=>state.VentaAchuraByID);
    const alert_msj= useSelector ((state)=>state.alert_msj);

    useEffect(() => {
        dispatch(getClienteByName(venta.clien))
    }, [venta])
    const urlImg= useSelector ((state)=>state.urlImg);

    useEffect(() => {
        if(alert_msj!==""){
            swal({
                text: alert_msj,
                icon: alert_msj==="Pago creado con éxito"?"success":"warning", 
                button: "ok",
            })}
            dispatch(setAlert())
            dispatch(getVentaAchurasByID(id))
    }, [alert_msj])

    const [form, setForm] = useState(formPV);
    const [error, setError] = useState({});

    //validaciones 
    const validate = (pago) => {
    let error = {};
    if (!pago.formaDePago) error.formaDePago = "Falta forma de pago";
    if (!pago.monto) error.monto = "Falta monto";
    if (venta.saldo*1+10<pago.monto*1) error.monto = "El monto excede el saldo"
    else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(pago.monto)) error.monto = "Monto debe ser un número";
    return error;
};

    const handleChange = (e) => {
        e.preventDefault();
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
        e.preventDefault();
        if(
        !error.monto && form.monto
        ){
            form.id="PVA"+Math.floor(Math.random()*1000000)
            form.clien=venta.clien
            form.ventaID=id
            form.fecha=form.fecha.getTime()
            form.img_comp = urlImg
            let saldo2= venta.saldo - form.monto
            if(!saldo2) saldo2="0"
            dispatch(postNewPagoVentaAchuras(form))
            dispatch(putSaldoVentaAchuras(id, saldo2))            
            document.getElementById("formaDePago").selectedIndex = 0
            setForm(formPV);
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
        navigate("/Ventas")
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
        value : venta.saldo
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
        <div className={stylePagoV.wallpaper}>
            <NavBar
            title={"Nuevo Pago"}
            />
            <div className={stylePagoV.formContainer}>
                <div className={stylePagoV.detallePro}>
                    <div className={stylePagoV.detalledivs}>
                        <h5 className={stylePagoV.title}>Cliente: </h5>
                        <h4 className={stylePagoV.nameP}>{venta.clien}</h4>
                    </div>
                    <div className={stylePagoV.detalledivs}>
                        <h5 className={stylePagoV.title}>Saldo: </h5>
                        <h4 className={stylePagoV.nameP}>{saldoEnPesos}</h4>
                    </div>
                </div>
                <form className={stylePagoV.form}>
                    <div className={stylePagoV.formItemDate}>
                        <h5 className={stylePagoV.titleDate}>Fecha: </h5>
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
                    <p className={form.fecha!==new Date().toLocaleDateString() ? stylePagoV.pass : stylePagoV.danger }>Debe ingresar la fecha</p>
                    <div className={stylePagoV.formItem}>
                        <h5 className={stylePagoV.title}>Monto: </h5>
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
                    <p className={error.monto ? stylePagoV.danger : stylePagoV.pass}>{error.monto}</p> 
                    <div className={stylePagoV.formItem}>
                        <h5 className={stylePagoV.title}>Forma de Pago: </h5>
                        <select id="formaDePago" className="selectform" onChange={(e)=> handleSelectFP(e)}>
                            <option defaultValue>-</option>
                            {formasDePago.length > 0 &&  
                                formasDePago.map((p,i) => (
                                    <option key={i} value={p}>{p}</option>
                                    ))
                            }
                        </select>
                    </div>  
                    <p className={error.forma_pago ? stylePagoV.danger : stylePagoV.pass}>{error.forma_pago}</p>
                    <div className={stylePagoV.formItemInput} >
                            <SubirImagen/>
                            <h5 className={stylePagoV.title}>Agregar Comprobante</h5>
                    </div>
                    {urlImg?
                    <div className={stylePagoV.img}>
                        <img src={urlImg?urlImg:"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} className={stylePagoV.img}/>
                    </div>  
                    :null
                    }                    
                    <div className={stylePagoV.buttons}>
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

export default Form_Pago_Venta_Achuras;