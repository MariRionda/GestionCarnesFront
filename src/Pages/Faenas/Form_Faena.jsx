import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {getAllProveedores, postNewFaena, setAlert} from "../../Redux/Actions/Actions";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew";
import NavBar from '../../Components/Navbar/Navbar';
import style from './Faenas.module.scss';
import CardReses from "../../Components/Cards/CardReses/CardReses";
//calendario-----------------------------------
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import CardResesFaena from "../../Components/Cards/CardResesFaena/CardResesFaena";


//Form Faena
const formF = {
    fecha: new Date().toLocaleDateString('en'),
    frigorifico: '',
    tropa: '',
    proveedor: '',
    detalle:[],
    costo_faena_kg:0,
    total_kg:0,
    total_medias:0,
    costo_total:0,
    saldo:0,
    estadoCompra:"false"
};
//Form para cargar las reses del detalle de Faena
const formComF = {
    kg: '',
    garron: '',
    kg1: '',
    kg2:'',
    correlativo: '',
    categoria: '',
    
    
};
//var para sumar medias
var m=0;
var Frig2=[];

//Array para select de frigorífico
const frigorificos = ["Frigorífico1", "Frigorífico2"]
const categorias = ["Vaquillona", "Novillito", "Vaca", "Toro", "Novillo Pesado"]


//validaciones form Faena
export const validate = (faena) => {
    let error = {};
    if (!faena.fecha) error.fecha = 'Falta seleccionar fecha';
    if (!faena.frigorifico) error.frigorifico = "Falta frigorifico";
    if (!faena.tropa) error.tropa = "Falta tropa";
    if (!faena.proveedor) error.proveedor = "Falta proveedor";
    if (!faena.costo_faena_kg) error.costo_faena_kg = "Falta costo de Faena/kg";
    if (!/^\d*(\.\d{1})?\d{0,1}$/.test(faena.costo_faena_kg)) error.costo_faena_kg = "costo de Faena debe ser un número";
    if (faena.detalle.length<1) error.detalle = "Falta detalle";
    return error;
};
//validaciones de reses frigorifico Frigorifico1
export const validate2 = (res) => {
    let error2 = {};
    if (!/^\d*(\.\d{1})?\d{0,1}$/.test(res.kg)) error2.kg = "kg debe ser un número";
    if (res.kg>400) error2.kg = "kg debe ser menor";
    if (!res.categoria) error2.categoria = "Falta categoría";
    return error2;
};

//validaciones de reses frigorifico Frigorifico2
export const validate3 = (res) => {
    let error3 = {};
    if (!/^\d*(\.\d{1})?\d{0,1}$/.test(res.kg1)) error3.kg1 = "kg1 debe ser un número";
    if (res.kg1>400) error3.kg1 = "kg1 debe ser menor";
    if (!/^\d*(\.\d{1})?\d{0,1}$/.test(res.kg2)) error3.kg2 = "kg2 debe ser un número";
    if (res.kg2>400) error3.kg2 = "kg2 debe ser menor";
    if (!res.categoria) error3.categoria = "Falta categoría";
    return error3;
};


const Form_Faena = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Estados locales
    const [form, setForm] = useState(formF);
    const [formCF, setFormCF] = useState(formComF)
    const [error, setError] = useState({});
    const [error2, setError2] = useState({});
    const [error3, setError3] = useState({});
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
    let [kg_totales,setkg_totales] = useState(0)


    useEffect(() => {
        dispatch(getAllProveedores())
    }, [dispatch])

    //Estados globales
    const alert_msj= useSelector ((state)=>state.alert_msj);

    const proveedores = useSelector((state)=>state.AllProveedores);

    useEffect(() => {
        if(alert_msj!==""){
            swal({
                text: alert_msj,
                icon: alert_msj==="Faena creada con éxito"?"success":"warning", 
                button: "ok",
            })
        dispatch(setAlert())
        form.detalle=[]
        }
    }, [alert_msj])

    //handleChange de la faena completa
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

    //handleChange de reses
    const handleChangeCF = (e) => { 
        e.preventDefault();
        setError2(
        validate2({
            ...formCF,
            [e.target.name]: e.target.value,
        })
        );
        setFormCF({
            ...formCF,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeCF2 = (e) => { 
        e.preventDefault();
        setError3(
        validate3({
            ...formCF,
            [e.target.name]: e.target.value,
        })
        );
        setFormCF({
            ...formCF,
            [e.target.name]: e.target.value,
        });
    };

    //handleSubmit de las reses
    const handleSubmitRes = (e) => {   
        e.preventDefault();
        try{
            if(form.frigorifico==="Frigorífico2"){
                if(
                    !error3.kg1 && formCF.kg1 &&
                    !error3.kg2 && formCF.kg2                    
                ){
                    // dividimos garron en dos reses con correlativo
                    //primera res correlativo garron-kg1
                        var formRes={}
                        formRes.categoria=formCF.categoria
                        formRes.correlativo=formCF.garron+"-A"+formCF.kg1
                        formRes.kg=formCF.kg1*1
                        formRes.stock=true
                        formRes.CuartoD=0
                        formRes.CuartoT=0
                        form.detalle.unshift(formRes)
                    //segunda res correlativo garron-kg2
                        var formRes2={}
                        formRes2.categoria=formCF.categoria
                        formRes2.correlativo=formCF.garron+"-B"+formCF.kg2
                        formRes2.kg=formCF.kg2*1
                        formRes2.stock=true
                        formRes2.CuartoD=0
                        formRes2.CuartoT=0
                        form.detalle.unshift(formRes2)
                        setkg_totales(kg_totales+formCF.kg1*1+formCF.kg2*1)
                }
            }
            else if(form.frigorifico==="Frigorífico1"){
                if(
                    !error2.kg && formCF.kg
                ){
                    var formRes3={}
                    formRes3.categoria=formCF.categoria
                    formRes3.correlativo=formCF.correlativo
                    formRes3.kg=formCF.kg*1
                    formRes3.stock=true
                    formRes3.CuartoD=0
                    formRes3.CuartoT=0
                    setkg_totales(kg_totales+formCF.kg*1)
                    form.detalle.unshift(formRes3)
                }
            }
            document.getElementById("categoria").selectedIndex = 0
            setFormCF(formComF);
        }
        catch (err) {
            swal({
                titleForm: "Alerta",
                text: "Datos incorrectos, por favor intente nuevamente",
                icon: "warning",
                button: "ok",
            })
        }
    }

    //handleSubmit de la faena completa
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(
            !error.fecha && form.fecha &&
            !error.frigorifico && form.frigorifico &&
            !error.tropa && form.tropa &&
            !error.proveedor && form.proveedor &&
            !error.costo_faena_kg && form.costo_faena_kg &&
            !error.detalle && form.detalle
        ){
        form.detalle.map((e)=>{
            form.total_kg= form.total_kg + e.kg*1
        })
        form.fecha=form.fecha.getTime()
        form.total_medias = form.detalle.length
        form.costo_total=form.costo_faena_kg*1*form.total_kg*1
        form.saldo=form.costo_total
        console.log(form)
        dispatch(postNewFaena(form))
        setkg_totales(0)
        document.getElementById("proveedor").selectedIndex = 0
        document.getElementById("frigorifico").selectedIndex = 0
        setForm(formF);
        }
        else{
            swal({
                titleForm: "Alerta",
                text: "Datos incorrectos, por favor intente nuevamente",
                icon: "warning",
                button: "ok",
            })
        }
    };

    //Select de frigoríficos
    function handleSelectFr(e) {
        setForm({
            ...form,
            frigorifico:  e.target.value 
        })
    }
    //Select de proveedores
    function handleSelectPr(e) {
        setForm({
            ...form,
            proveedor:e.target.value 
        })
    }
    //Select de categorías
    function handleSelect(e) {
        setFormCF({
            ...formCF,
            categoria:  e.target.value 
        })
    }

    //funcion para eliminar reses del detalle
    const handleDelete = (e)=>{
        setForm({
            ...form,
            detalle: form.detalle.filter(d => d !== e )
            
        })
        setkg_totales(kg_totales-e.kg*1)
    }

//tema del calendario
    const outerTheme = createTheme({
        palette: {
            primary: {
                main: '#00585C'
            },
        },
        });


    return (
        <div className={style.ConteinerFaenas}>
            <NavBar
            title={"Nueva Faena"}
            />
            <div className={style.formContainer}>
                <form className={style.form}>
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
                    <p className={form.fecha!==new Date().toLocaleDateString('es') ? style.pass : style.danger }>Debe ingresar la fecha</p>
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>Frigorífico: </h5>
                        <select id="frigorifico" className="selectform" onChange={(e)=> handleSelectFr(e)}>
                            <option defaultValue>-</option>
                            {frigorificos.length > 0 &&  
                            frigorificos.map((f,i) => (
                                    <option key={i}	value={f}>{f}</option>
                                    ))
                            }
                        </select>
                    </div>
                    <p className={error.frigorifico ? style.danger : style.pass}>{error.frigorifico}</p>
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>Tropa: </h5>
                        <input
                            type="text"
                            value={form.tropa}
                            id="tropa"
                            name="tropa"
                            onChange={handleChange}
                            placeholder="00000"
                            className={error.tropa & 'danger'}
                        />
                    </div>
                    <p className={error.tropa ? style.danger : style.pass}>{error.tropa}</p>
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>Proveedor: </h5>
                        <select id="proveedor" className="selectform" defaultValue="-" onChange={(e)=> handleSelectPr(e)}>
                            <option defaultValue>-</option>
                            {proveedores.length > 0 &&  
                            proveedores.map((p,i) => (
                                    <option key={i}	value={p.nombre}>{p.nombre.length<20?p.nombre:p.nombre.slice(0,17)}</option>
                                    ))
                            }
                        </select>
                    </div>
                    {/*----------------Carga del detalle---------------------*/}
                    <div className={style.formItem2}>
                        {form.frigorifico==="Frigorífico2"?
                            <div className={style.inbox}>
                                <div className={style.item}>
                                    <h5 className={style.titleForm}>Garrón: </h5>
                                    <input
                                        type="text"
                                        value={formCF.garron}
                                        id="garron"
                                        name="garron"
                                        onChange={handleChangeCF2}
                                        placeholder="0000"
                                        className={style.size2}
                                    />
                                </div>
                                <p className={error3.garron ? style.danger : style.pass}>{error3.garron}</p>
                                <div className={style.item}>
                                    <h5 className={style.titleForm}>kg1: </h5>
                                    <input
                                        type="text"
                                        value={formCF.kg1}
                                        id="kg1"
                                        name="kg1"
                                        onChange={handleChangeCF2}
                                        placeholder="0000"
                                        className={style.size2}
                                    />
                                </div>
                                <p className={error3.kg1 ? style.danger : style.pass}>{error3.kg1}</p>
                                <div className={style.item}>
                                    <h5 className={style.titleForm}>kg2: </h5>
                                    <input
                                        type="text"
                                        value={formCF.kg2}
                                        id="kg2"
                                        name="kg2"
                                        onChange={handleChangeCF2}
                                        placeholder="0000"
                                        className={style.size2}
                                    />
                                </div>
                                <p className={error3.kg2 ? style.danger : style.pass}>{error3.kg2}</p>
                                <div className={style.item}>
                                    <select id="categoria" className="selectform" onChange={(e)=> handleSelect(e)}>
                                        <option  defaultValue>Categoría</option>
                                            {categorias.length > 0 &&  
                                            categorias.map((c,i) => (
                                                <option key={i}	value={c}>{c}</option>
                                            ))
                                            }
                                    </select>
                                </div>
                            </div>
                            :
                            <div className={style.inbox}>
                                <div className={style.item}>
                                    <h5 className={style.titleForm}>Correlativo: </h5>
                                    <input
                                        type="text"
                                        value={formCF.correlativo}
                                        id="correlativo"
                                        name="correlativo"
                                        onChange={handleChangeCF}
                                        placeholder="0000"
                                        className={style.size2}
                                    />
                                </div>
                                <p className={error2.correlativo ? style.danger : style.pass}>{error2.correlativo}</p>
                                <div className={style.item}>
                                    <select id="categoria" className="selectform" onChange={(e)=> handleSelect(e)}>
                                        <option value="" defaultValue>Categoría</option>
                                            {categorias.length > 0 &&  
                                            categorias.map((c,i) => (
                                                <option	value={c} key={i} >{c}</option>
                                            ))
                                            }
                                    </select>
                                    <div className={style.numero}>
                                        <h5 className={style.titleForm}>kg </h5>
                                        <input
                                            type="number"
                                            value={formCF.kg}
                                            id="kg"
                                            name="kg"
                                            onChange={handleChangeCF}
                                            placeholder="00"
                                            className={style.size2}
                                        />
                                    </div>
                                    <p className={error2.kg ? style.danger : style.pass}>{error2.kg}</p>
                                </div>
                            </div>}
                    </div>
                    <div className={style.button}>
                        <ButtonNew
                            onClick={handleSubmitRes}
                            style={"right"}
                            icon={"right"}
                        />
                    </div>
                    
                    {form.detalle.length ?
                        form.detalle.map((e,i)=>{
                            return(
                                <CardResesFaena
                                    key={i}
                                    correlativo={e.correlativo}
                                    categoria={e.categoria}
                                    kg={e.kg}
                                    onClick={()=> handleDelete(e)}
                                />
                            )
                        })
                        :Frig2.length?
                            Frig2.map((e,i)=>{
                                return(
                                    <CardReses
                                        key={i}
                                        garron={e.garron}
                                        categoria={e.categoria}
                                        kg1={e.kg1}
                                        kg2={e.kg2}
                                        onClick={()=> handleDelete(e)}
                                    />
                                )
                            })
                            :null
                    }
                    <div className={style.formItem}>
                        <div>
                            <h5 className={style.titleForm}>Costo Faena/kg: </h5>
                        </div>
                        <div className={style.numero}>
                            <h5 className={style.titleForm}>$ </h5>
                            <input
                                type="text"
                                value={form.costo_faena_kg?form.costo_faena_kg:''}
                                id="costo_faena_kg"
                                name="costo_faena_kg"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={style.size2}
                            />
                        </div>
                    </div>
                    <p className={error.costo_faena_kg ? style.danger : style.pass}>{error.costo_faena_kg}</p>
                    {kg_totales?
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>Kg totales: {kg_totales}kg</h5>
                    </div>:null}
                    {form.detalle.length?
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>Total Reses: {form.detalle.length}</h5>
                    </div>:null}
                    <div className={style.buttons}>
                        <div className={style.shortButtons} id={style.buttonOk}>
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
    );
};

export default Form_Faena;