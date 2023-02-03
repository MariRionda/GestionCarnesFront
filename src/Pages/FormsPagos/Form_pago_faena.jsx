import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import NavBar from '../../Components/Navbar/Navbar'
import { getAllComrpas, getAllPagosFaenas, getFaenaById, postNewPagoFaena, putSaldoFaena, setAlert, setimgurl } from "../../Redux/Actions/Actions.js";
import stylePagoF from './Form_pago.module.scss';
//calendario-----------------------------------
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import SubirImagen from "../../Components/SubirImagenes/subirImagenes";

const formPF = {
    fecha: new Date().toLocaleDateString('en'),
    monto: 0,
    formaDePago:'',
    faenaID:0,
    frigorifico:'',
    img_comp:''
};

const formasDePago=["Efectivo", "Transferencia"]


const Form_Pago_Faena = () => {

    const {id}=useParams()

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getFaenaById(id))
    }, [dispatch])
    
    const faena = useSelector((state)=>state.FaenaById);
    const alert_msj= useSelector ((state)=>state.alert_msj);
    const urlImg= useSelector ((state)=>state.urlImg);

    useEffect(() => {
        if(alert_msj!==""){
            swal({
                text: alert_msj,
                icon: alert_msj==="Pago creado con éxito"?"success":"warning", 
                button: "ok",
            })}
            dispatch(setAlert())
            dispatch(getFaenaById(id))
            dispatch(getAllPagosFaenas())
    }, [alert_msj])

    const [form, setForm] = useState(formPF);
    const [error, setError] = useState({});

    //validaciones
    const validate = (pago) => {
    let error = {};
    if (!pago.monto) error.monto = "Falta monto";
    if (faena.saldo*1+10<pago.monto*1) error.monto = "El monto excede el saldo"
    else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(pago.monto)) error.monto = "Monto debe ser un número";
    return error;
};

    const handleChange = (e) => {
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
        !error.monto && form.monto
        ){
            form.frigorifico=faena.frigorifico
            form.faenaID=id
            form.fecha=form.fecha.getTime()
            form.img_comp = urlImg
            form.id="PF"+Math.floor(Math.random()*1000000)
            let saldo= faena.saldo - form.monto
            //poner estos dos dispach en una sola action
            dispatch(postNewPagoFaena(form))
            dispatch(putSaldoFaena(id, saldo))
            document.getElementById("formaDePago").selectedIndex = 0
            setForm(formPF);
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
            formaDePago: e.target.value
        })
    }

    const handleCreate = () => {
        navigate("/Faenas")
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
        value : faena.saldo
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
        <div className={stylePagoF.wallpaper}>
            <NavBar
            title={"Nuevo Pago"}
            />
            <div className={stylePagoF.formContainer}>
                <div className={stylePagoF.detallePro}>
                    <div className={stylePagoF.detalledivs}>
                        <h5 className={stylePagoF.title}>Tropa: </h5>
                        <h4 className={stylePagoF.nameP}>{faena.tropa}</h4>
                    </div>
                    <div className={stylePagoF.detalledivs}>
                        <h5 className={stylePagoF.title}>Saldo: </h5>
                        <h4 className={stylePagoF.nameP}>{saldoEnPesos}</h4>
                    </div>
                </div>
                <form className={stylePagoF.form}>
                    <div className={stylePagoF.formItemDate}>
                        <h5 className={stylePagoF.titleDate}>Fecha: </h5>
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
                    <p className={form.fecha!==new Date().toLocaleDateString() ? stylePagoF.pass : stylePagoF.danger }>Debe ingresar la fecha</p>
                    <div className={stylePagoF.formItem}>
                        <h5 className={stylePagoF.title}>Monto: </h5>
                        <input
                            type="text"
                            value={form.monto?form.monto:''}
                            id="monto"
                            name="monto"
                            onChange={handleChange}
                            placeholder="0.00"
                            className={error.monto & 'danger'}
                        />
                    </div>
                    <p className={error.monto ? stylePagoF.danger : stylePagoF.pass}>{error.monto}</p>
                    <div className={stylePagoF.formItem}>
                        <h5 className={stylePagoF.title}>Forma de Pago: </h5>
                        <select id="formaDePago" className="selectform" onChange={(e)=> handleSelectFP(e)}>
                            <option defaultValue>-</option>
                            {formasDePago.length > 0 &&  
                                formasDePago.map((p,i) => (
                                    <option	key={i} value={p}>{p}</option>
                                    ))
                            }
                        </select>
                    </div>
                    <p className={error.forma_pago ? stylePagoF.danger : stylePagoF.pass}>{error.forma_pago}</p>
                    <div className={stylePagoF.formItemInput} >
                            <SubirImagen/>
                            <h5 className={stylePagoF.title}>Agregar Comprobante</h5>
                    </div>
                    {urlImg?
                    <div className={stylePagoF.img}>
                        <img src={urlImg?urlImg:"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} className={stylePagoF.img}/>
                    </div>  
                    :null
                    }                     
                    <div className={stylePagoF.buttons}>
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

export default Form_Pago_Faena;