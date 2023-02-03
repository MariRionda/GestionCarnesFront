import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import NavBar from "../../Components/Navbar/Navbar";
import { getAllIngresosExtras, postNewIngresoExtra, setAlert, setimgurl } from "../../Redux/Actions/Actions";
import style from "./caja.module.scss";
import SubirImagen from "../../Components/SubirImagenes/subirImagenes";
//calendario-----------------------------------
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';


const formPE = {
    id:0,
    fecha: new Date().toLocaleDateString('en'),
    concepto:'',
    monto: 0,
    formaDePago:'',
    img_comp:''
};

const formasDePago=["Efectivo", "Transferencia"]

//validaciones
export const validate = (pago) => {
    let error = {};
    if (!pago.monto) error.monto = "Falta monto";
    else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(pago.monto)) error.monto = "Monto debe ser un número";
    if (!pago.formaDePago) error.forma_pago = "Falta forma de pago";
    return error;
};


export default function FormIngresoExtra(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
    }, [alert_msj])

    const [form, setForm] = useState(formPE);
    const [error, setError] = useState({});


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
            form.id="IE"+Math.floor(Math.random()*1000000)
            form.fecha=form.fecha.getTime()
            form.img_comp = urlImg
            dispatch(postNewIngresoExtra(form))
            document.getElementById("formaDePago").selectedIndex = 0
            setForm(formPE);
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
    //tema del calendario
    const outerTheme = createTheme({
        palette: {
            primary: {
                main: '#640909'
            },
        },
        });
    return(
        <div className={style.conteiner}>
            <NavBar
                title={"Ingresos Extras"}
            />
            <div className={style.formContainer}>
            <form className={style.form}>
                <div className={style.formItemDate}>
                    <h5 className={style.title}>Fecha: </h5>
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
                <p className={form.fecha!==new Date().toLocaleDateString() ? style.pass : style.danger }>Debe ingresar la fecha</p>
                <div className={style.formItem}>
                    <h5 className={style.title}>Concepto: </h5>
                    <input
                        type="text"
                        value={form.concepto}
                        id="concepto"
                        name="concepto"
                        onChange={handleChange}
                    />
                </div>
                <div className={style.formItem}>
                    <h5 className={style.title}>Monto: </h5>
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
                    <p className={error.monto ? style.danger : style.pass}>{error.monto}</p>
                    <div className={style.formItem}>
                        <h5 className={style.title}>Forma de Pago: </h5>
                        <select id="formaDePago" className="selectform" onChange={(e)=> handleSelectFP(e)}>
                            <option defaultValue>-</option>
                            {formasDePago.length > 0 &&  
                                formasDePago.map((p,i) => (
                                    <option	key={i} value={p}>{p}</option>
                                    ))
                            }
                        </select>
                    </div>           
                    <div className={style.formItemInput} >
                            <SubirImagen/>
                            <h5 className={style.title}>Agregar Comprobante</h5>
                    </div>
                    {urlImg?
                    <div className={style.img}>
                        <img src={urlImg?urlImg:"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} className={style.img}/>
                    </div>  
                    :null
                    }                             
                    <div className={style.divButtons}>
                        <div>
                            <ShortButton
                                title="✔ Confirmar"
                                onClick={handleSubmit}
                                color="green"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}