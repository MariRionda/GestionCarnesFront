import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import NavBar from '../../Components/Navbar/Navbar'
import { getAllClientes, getClienteByName, postNewVentaAchura, setAlert } from "../../Redux/Actions/Actions";
import style from "./Ventas.module.scss";
//calendario-----------------------------------
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
//Form Venta
var formVA = {
    id: '',
    clien:'',
    fecha: new Date().toLocaleDateString('en'),
    cantidad:0,
    precioUnitario:0,
    total:null,
    saldo:null
};
//titleForm
//validaciones form VentaAchuras
export const validate = (venta) => {
    let error = {};
    if (!venta.clien) error.clien = "Falta cliente";
    if (!venta.cantidad) error.cantidad = "Falta cantidad";
    else if (!/^([0-9])*$/.test(venta.cantidad)) error.cantidad = "Cantidad debe ser un número";
    if (!venta.precioUnitario) error.precioUnitario = "Falta precio unitario";
    else if (!/^([0-9])*$/.test(venta.precioUnitario)) error.precioUnitario = "Precio debe ser un número";
    return error;
};

const Form_Venta_Achuras = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllClientes())
    }, [dispatch])
    
    //estados globales
    const alert_msj= useSelector ((state)=>state.alert_msj);
    const clientes = useSelector((state)=>state.AllClientes);

    useEffect(() => {
        if(alert_msj!==""){
            swal({
                title: alert_msj,
                icon: alert_msj==="Venta creada con éxito"?"success":"warning", 
                button: "ok",
            })}
            dispatch(setAlert())
    }, [alert_msj]) 

    

    //Estados locales
    const [form, setForm] = useState(formVA);
    const [error, setError] = useState({});

    useEffect(() => {
        dispatch(getClienteByName(form.clien))
    }, [form])

    const cliente = useSelector((state)=>state.clienteByNombre);

    //handleChange de la Venta completa
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

    //handleSubmit de la Venta completa
    const handleSubmit = (e) => {
        e.preventDefault();
        if(
        !error.cantidad && form.cantidad &&
        !error.precioUnitario && form.precioUnitario &&
        !error.clien && form.clien
        ){
            form.total=form.precioUnitario*1*form.cantidad
            form.saldo=form.total
            form.fecha=form.fecha.getTime()
            form.id="VA"+Math.floor(Math.random()*1000000)
            console.log(form)
            dispatch(postNewVentaAchura(form))
            setForm(formVA);
        }
        else{
            swal({
                title: "Datos incorrectos, por favor intente nuevamente",
                icon: "warning",
                button: "ok",
            })
        }
    };
    //carga de calendario
    const handleChangeDate = (date) => {  
        setForm({
        ...form,
        fecha:  date
        });
    };
    //Select de Cliente
    function handleSelectCl(e) {
        setForm({
            ...form,
            clien: e.target.value
        })
    }

    //ir a ventas para ver el detalle
    const handleDet = () => {
        navigate("/Ventas")
    };

    //tema del calendario
    const outerTheme = createTheme({
        palette: {
            primary: {
                main: '#00585C'
            },
        },
        });

    return (
        <div className={style.ConteinerVenta}>
            <NavBar
            title={"Nueva Venta de Achuras"}
            />
            <div className={style.formContainer}>
                <form className={style.form}>
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>Cliente: </h5>
                        <select className="selectform" onChange={(e)=> handleSelectCl(e)}>
                            <option defaultValue>-</option>
                            {clientes.length > 0 &&  
                            clientes.map((c,i) => (
                                    <option	key={i} value={c.nombre}>{c.nombre.length<20?c.nombre:c.nombre.slice(0,17)}</option>
                                    ))
                            }
                        </select>
                    </div>
                    <div className={style.formItemDate}>
                        <h5 className={style.titleForm}>Fecha: </h5>
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
                        <h5 className={style.titleForm}>Cantidad: </h5>
                        <input
                            type="number"
                            value={form.cantidad==0?"":form.cantidad}
                            id="cantidad"
                            name="cantidad"
                            onChange={handleChange}
                            placeholder="00"
                            className={error.cantidad & 'danger'}
                        />
                    </div>
                    <p className={error.cantidad ? style.danger : style.pass}>{error.cantidad}</p>
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>$/Un: </h5>
                        <input
                            type="number"
                            value={form.precioUnitario==0?"":form.precioUnitario}
                            id="precioUnitario"
                            name="precioUnitario"
                            onChange={handleChange}
                            placeholder="0.00"
                            className={error.precioUnitario & 'danger'}
                        />
                    </div>
                    <p className={error.precioUnitario ? style.danger : style.pass}>{error.precioUnitario}</p>
                    <div className={style.buttons} id={style.buttonOk}>

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

export default Form_Venta_Achuras;