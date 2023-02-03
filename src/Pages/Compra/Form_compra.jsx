import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import {getAllFaenas, getAllProveedores, getFaenasByTropa, getGruposByTropa, postNewCompra, putEstadoCompraFaena, putStockReses, setAlert} from "../../Redux/Actions/Actions";
import NavBar from '../../Components/Navbar/Navbar'
import style from "./Compras.module.scss";
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew";
import CardGrupos from "../../Components/Cards/CardGrupos/CardGrupos.jsx"
//calendario-----------------------------------
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';


let formC = {
    id:'',
    proveedor: '',//
    fecha: new Date().toLocaleDateString('en'),//
    lugar: '',//
    n_dte: '',//
    kgv_brutos_totales:0,//
    kgv_netos_totales:0,//
    kg_carne_totales:0,//
    costo_flete: 0,//
    cant_achuras: 0,//
    precio_venta_achuras_unit: 0,//
    recupero_precio_kg: 0, //precio_venta_achuras/kg_carne//
    costo_total_hac:0,//kgv_netos * precio_kgv_netos//
    costo_flete: 0,//
    costo_veps_unit: 0,//
    cant_total:0,//
    grupos:[],//
    saldo:null, //saldo de hacienda solamente
    por_comision: 2,
};

let FormGCT = {
    categoria: '',            //ingresa                    //costo total=(costo de hacienda)+(costo de flete)+(comision)+(costo Veps)+(costo faena)
    n_tropa: '',              //ingresa                    //costo/kg =   costo total/
    kgv_brutos: 0,         //ingresa
    desbaste: 0,           //ingresa 
    kgv_netos: 0,            //calcula
    kg_carne: 0,              //trae                    //costo de hacienda = kgneto*precio_kgv_netos
    costo_flete: 0,      //calcula d                      //costo flete  
    costo_hac:0,            //calcula  
    costo_faena_kg:0,         //trae
    costo_faena:0,          //calcula
    cosoVeps:0,             //calculad
    costo_total:0,          //calcula d
    costo_kg:0,              //calcula d       
    cant:'',                  //ingresa
    precio_kgv_netos: '',   //ingresa
    pesoProm:0,             //calcula 
    rinde:0,
    recupero:0,                //calcula   
    n_grupo:0,              //calcula
    comision:0,
};


const categorias = ["Vaquillona", "Novillito", "Vaca", "Toro", "Novillo Pesado"]
let n=0

//validaciones
export const validate = (compra) => {
    let error = {};
    if (!compra.proveedor) error.proveedor = "Falta proveedor";
    if (!compra.n_dte) error.n_dte = "Falta N° DTE";
    if (!compra.categoria) error.categoria = "Falta categoria";
    if (!compra.cant) error.cant = "Falta cant";
    else if (!/^([0-9])*$/.test(compra.cant)) error.cant = "N° debe ser un número";
    if (!compra.kgv_brutos) error.kgv_brutos = "Falta kgV Brutos";
    else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(compra.kgv_brutos)) error.kgv_brutos = "kgV Brutos debe ser un número";
    // if (!compra.n_tropa) error.n_tropa = "Falta tropa";
    // else if (!/^([0-9])*$/.test(compra.n_tropa)) error.n_tropa = "Tropa debe ser un número";
    else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(compra.precio_venta_achuras)) error.precio_venta_achuras = "$ Venta de Achuras debe ser un número";
    if (!compra.costo_flete) error.costo_flete = "Falta Costo de Flete";
    else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(compra.costo_flete)) error.costo_flete = "Costo de Flete debe ser un número";
    if (!compra.costo_veps_unit) error.costo_veps_unit = "Falta costo de VEP/Un";
    else if (!/^\d*(\.\d{1})?\d{0,1}$/.test(compra.costo_veps_unit)) error.costo_veps_unit = "costo de VEP/Un debe ser un número";
    return error;
};

const Form_Compra = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllProveedores())
        dispatch(getAllFaenas())
    }, [dispatch])

    //Estados globales
    let alert_msj= useSelector ((state)=>state.alert_msj);
    let proveedores = useSelector((state)=>state.AllProveedores);
    let AllFaenas = useSelector((state)=>state.AllFaenas)
    let faenasDisp = AllFaenas.filter(a=>a.estadoCompra!==true)


    useEffect(() => {
        if(alert_msj!==""){
            swal({
                text: alert_msj,
                icon: alert_msj==="Compra creada con éxito"?"success":"warning", 
                button: "ok",
            })}
        dispatch(setAlert())
        form.grupos=[]
    }, [alert_msj])

    // let gruposRes = useSelector((state)=>state.gruposRes)

    //estados locales
    const [form, setForm] = useState(formC);
    const [error, setError] = useState({});
    const [formGCT, setFormCGT] = useState(FormGCT);
    const [error2, setError2] = useState({});
    const [Switch_KgBrutos, setSwitch_KgBrutos] = useState(true);
    const [tropa, settropa] = useState(0);

    useEffect(() => {
        if(tropa!==0)dispatch(getGruposByTropa(tropa))
    }, [tropa])
    let grupos = useSelector((state)=>state.grupos)

    useEffect(() => {

        if(formGCT.n_tropa)dispatch(getFaenasByTropa(formGCT.n_tropa))
        
    }, [formGCT])
    let faenabytropa = useSelector((state)=>state.FaenaByTropa)
    let proveedor
    useEffect(() => {
        if(form.proveedor!=='')proveedor=proveedores.find(a=>a.nombre==form.proveedor)
    }, [form])
    
    
    const handleChangeG = (e) => {
        e.preventDefault()
        // setError2(
        // validate({
        //     ...formGCT,
        //     [e.target.name]: e.target.value,
        // })
        // );
        setFormCGT({
        ...formGCT,
        [e.target.name]: e.target.value,
        });
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
    const handleSubmitGrupos = (e)=>{
        e.preventDefault();
        try{    
            if(faenabytropa.total_kg){
                    faenabytropa.detalle.filter((a)=>{
                        if(a.categoria==formGCT.categoria){
                            formGCT.kg_carne+=a.kg*1
                        }
                    })
                    if(Switch_KgBrutos==true) formGCT.kgv_netos = formGCT.kgv_brutos - (formGCT.kgv_brutos * formGCT.desbaste)
                    if(Switch_KgBrutos==false) formGCT.kgv_brutos = formGCT.kgv_netos/(1-formGCT.desbaste)
                    formGCT.pesoProm = (formGCT.kgv_brutos*1)/(formGCT.cant*1)
                    formGCT.costo_hac = (formGCT.kgv_netos) * (formGCT.precio_kgv_netos*1)
                    formGCT.costo_faena_kg = faenabytropa.costo_total/faenabytropa.total_kg
                    formGCT.costo_faena = formGCT.costo_faena_kg*formGCT.kg_carne
                    formGCT.rinde = formGCT.kg_carne  * 100 / (formGCT.kgv_netos)
                    formGCT.n_grupo = n++;
                    
                    form.grupos.unshift(formGCT)
                    document.getElementById("categoria").selectedIndex = 0
                    document.getElementById("tropa").selectedIndex = 0
                    setFormCGT(FormGCT)
                }
        }
        catch(err){
            console.log(err)
        }
    }
    //carga de calendario
    const handleChangeDate = (date) => {  
        setForm({
        ...form,
        fecha:  date
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(true
            // -!error.proveedor && form.proveedor &&
            // -!error.fecha && form.fecha &&
            // -!error.n_dte && form.n_dte &&
            // -!error.categoria && form.categoria &&
            // -!error.cant && form.cant &&
            //- !error.kgv_brutos && form.kgv_brutos &&
            // -!error.desbaste && form.desbaste &&
            // -!error.n_tropa && form.n_tropa &&
            // -!error.precio_venta_achuras && form.precio_venta_achuras &&
            // -!error.costo_flete && form.costo_flete &&
            // -!error.costo_veps_unit && form.costo_veps_unit
        ){
            //cargo el resto de las propiedades
            form.id="C"+form.grupos[0].n_tropa
            let arr =[]
            let arrayGrupos = []
            form.grupos.map(a=>{
                form.kgv_brutos_totales+=a.kgv_brutos*1
                form.kgv_netos_totales+=a.kgv_netos*1
                form.costo_total_hac+=a.costo_hac*1
                form.cant_achuras+=a.cant*1
                form.cant_total+=a.cant*1
                form.kg_carne_totales+=a.kg_carne*1
            })
            if(form.kg_carne_totales>0){form.recupero_precio_kg = form.precio_venta_achuras_unit*1*form.cant_achuras  / (form.kg_carne_totales*1)}
            form.grupos.map(a=>{
                if(form.kg_carne_totales*1!==0){a.costo_flete=(form.costo_flete*1*a.kg_carne)/(form.kg_carne_totales*1)}
                a.cosoVeps=form.costo_veps_unit*a.cant
                if(form.por_comision>0) a.comision = (form.por_comision*1/100) * a.costo_hac;
                a.recupero=(form.precio_venta_achuras_unit*1*a.cant )/a.kg_carne
                a.costo_total = a.cosoVeps*1 + a.comision*1 + a.costo_faena*1 + a.costo_hac*1 + a.costo_flete*1 - (form.precio_venta_achuras_unit*1*a.cant )
                a.costo_kg = a.costo_total/(a.kg_carne*1)
                if(!arr.some((t)=>t.tropa==a.n_tropa))arr.push({id:a.n_tropa.toString(), estadoCompra:true, compraID:form.id})
                arrayGrupos.push({tropa:a.n_tropa, categoria:a.categoria, costo_kg:a.costo_kg})
            })
            form.saldo = form.costo_total_hac
            form.fecha=form.fecha.getTime()
            let detalles=[]

            arr.map((t)=>{
                let det = AllFaenas.find((f)=>f.tropa==t.id).detalle
                det.map((r)=>{
                    r.costo_kg= arrayGrupos.find((g)=>g.categoria==r.categoria).costo_kg
                })
                console.log(det)
                detalles.push({detalle:det, id:t.id})
            })
            dispatch(putStockReses(detalles))
            dispatch(putEstadoCompraFaena(arr))
            console.log(form)
            dispatch(postNewCompra(form))
            document.getElementById("proveedor").selectedIndex = 0
            setForm(formC);
        }
        else{
            swal({
                titleForm: "Faltan Datos",
                icon: "warning", 
                button: "ok",
            })
        }
    };

    function handleSelectCat(e) {
        setFormCGT({
            ...formGCT,
            categoria: e.target.value 
        })
    }
    function handleSelectTr(e) {
        setFormCGT({
            ...formGCT,
            n_tropa:  e.target.value
        })
        settropa(e.target.value)
    }

    function handleSelectPr(e) {
        setForm({
            ...form,
            proveedor:  e.target.value
        })
    }
    const handleDelete = (e)=>{
        setForm({
            ...form,
            grupos: form.grupos.filter(d => d !== e)
        })
    }
    const switchKgBrutos = ()=>{
        if(Switch_KgBrutos==false)setSwitch_KgBrutos(true)
        else if(Switch_KgBrutos==true)setSwitch_KgBrutos(false);
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
        <div className={style.ConteinerCompras}>
            <NavBar
            title={"Nueva Compra"}
            />
            <div className={style.formContainer}>
                <form className={style.form}>
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>Proveedor: </h5>
                        <select id="proveedor" className="selectform" onChange={(e)=> handleSelectPr(e)}>
                            <option defaultValue>-</option>
                            {proveedores.length > 0 &&  
                            proveedores.map((p,i) => (
                                    <option	key={i} value={p.nombre}>{p.nombre.length<20?p.nombre:p.nombre.slice(0,17)}</option>
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
                        <h5 className={style.titleForm}>Lugar: </h5>
                        <input
                            type="text"
                            value={form.lugar}
                            id="lugar"
                            name="lugar"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={style.formItem}>
                        <h5 className={style.titleForm}>N° DTE: </h5>
                        <input
                            type="text"
                            value={form.n_dte}
                            id="n_dte"
                            name="n_dte"
                            onChange={handleChange}
                            className={error.n_dte & 'danger'}
                        />
                    </div>
                    <p className={error.n_dte ? style.danger : style.pass}>{error.n_dte}</p>
                    <div className={style.formItem}>
                        <div>
                            <h5 className={style.titleForm}>$ Ach. unit: </h5>
                        </div>
                        <div className={style.numero}>
                            <h5 className={style.titleForm}>$ </h5>
                            <input
                                type="number"
                                value={form.precio_venta_achuras_unit?form.precio_venta_achuras_unit:""}
                                id="precio_venta_achuras_unit"
                                name="precio_venta_achuras_unit"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={style.size2}
                            />
                        </div>
                    </div>
                    <p className={error.precio_venta_achuras ? style.danger : style.pass}>{error.precio_venta_achuras}</p>
                    <div className={style.formItem}>
                        <div>
                            <h5 className={style.titleForm}>Comisión: </h5>
                        </div>
                        <div className={style.numero}>
                            <input
                                type="number"
                                value={form.por_comision}
                                id="por_comision"
                                name="por_comision"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={style.size2}
                            />
                            <h5 className={style.titleForm}> %</h5>
                        </div>
                    </div>
                    <div className={style.formItem}>
                        <div>
                            <h5 className={style.titleForm}>Costo Flete: </h5>
                        </div>
                        <div className={style.numero}>
                            <h5 className={style.titleForm}>$ </h5>
                            <input
                                type="number"
                                value={form.costo_flete?form.costo_flete:''}
                                id="costo_flete"
                                name="costo_flete"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={style.size2}
                            />
                        </div>
                    </div>
                    <p className={error.costo_flete ? style.danger : style.pass}>{error.costo_flete}</p>
                    <div className={style.formItem}>
                        <div>
                            <h5 className={style.titleForm}>Costo VEPS unit.: </h5>
                        </div>
                        <div className={style.numero}>
                            <h5 className={style.titleForm}>$ </h5>
                            <input
                                type="number"
                                value={form.costo_veps_unit?form.costo_veps_unit:''}
                                id="costo_veps_unit"
                                name="costo_veps_unit"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={style.size2}
                            />
                        </div>
                    </div>
                    <p className={error.costo_veps_unit ? style.danger : style.pass}>{error.costo_veps_unit}</p>
                    <div className={style.formItem}>
                        <div>
                            <h5 className={style.titleForm}>KgBrutros/KgNetos </h5>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="kgBrutos" onChange={()=>switchKgBrutos()}/>
                        </div>
                    </div>
                    
                        {tropa!==0 && grupos!==[]?
                            <div className={style.cardGrupo2}>
                            <table className="table">
                            <thead>
                            <tr className="table-dark">
                                    <td>Categoria</td>
                                    <td>Cantidad</td>
                                    <td>kg</td>
                                    <td>0.59</td>
                                    <td>0.58</td>
                                </tr>
                            </thead>
                            <tbody>

                                {grupos?.map(a=>
                                a.cant!==0?
                                <tr className="table-info">
                                    <td>{a.categoria}</td>
                                    <td>{a.cant}</td>
                                    <td>{a.kg}</td> 
                                    <td>{(a.kg/0.59).toFixed(2)}</td> 
                                    <td>{(a.kg/0.58).toFixed(2)}</td> 
                                </tr>
                                :null
                                )}
                                </tbody>
                            </table>
                            </div>
                            :null
                        }

        {Switch_KgBrutos==true?
                    <div className={style.cardGrupo}>
                        <div className={style.formItem}>
                            <h5 className={style.titleForm}>N° Tropa: </h5>
                            <select id="tropa" className="selectform" onChange={(e)=> handleSelectTr(e)}>
                                <option defaultValue>-</option>
                                {faenasDisp.length > 0 &&  
                                    faenasDisp.map((c,i) => (
                                        <option key={i}	value={c.tropa}>{c.tropa}</option>
                                        ))
                                }
                            </select>
                        </div>
                        <div className={style.formItem}>
                            <div>
                                <select id="categoria" className="selectform" onChange={(e)=> handleSelectCat(e)}>
                                    <option value="" defaultValue>Categoría</option>
                                    {categorias.length > 0 &&  
                                    categorias.map((c,i) => (
                                            <option	key={i} value={c}>{c}</option>
                                            ))
                                    }
                                </select>
                            </div>
                            <div className={style.numero}>
                                <h5 className={style.titleForm}>N°: </h5>
                                <input
                                    type="number"
                                    value={formGCT.cant}
                                    id="cant"
                                    name="cant"
                                    onChange={handleChangeG}
                                    className={style.size1}
                                />
                            </div>
                        </div>
                        <div className={style.formItem}>
                            <h5 className={style.titleForm}>kgV Brutos: </h5>
                            <input
                                type="number"
                                value={formGCT.kgv_brutos?formGCT.kgv_brutos:''}
                                id="kgv_brutos"
                                name="kgv_brutos"
                                onChange={handleChangeG}
                                placeholder="00"
                                className={style.size2}
                            />
                        </div>
                        <div className={style.formItem}>
                            <h5 className={style.titleForm}>Desbaste: </h5>
                            <input
                                type="number"
                                value={formGCT.desbaste?formGCT.desbaste:''}
                                id="desbaste"
                                name="desbaste"
                                onChange={handleChangeG}
                                placeholder="00"
                                className={error.desbaste & style.danger}
                            />
                        </div>
                        <div className={style.formItem}>
                            <h5 className={style.titleForm}>kgV Netos: </h5>
                            <h5 className={style.titleForm}>{formGCT.kgv_brutos - (formGCT.kgv_brutos*formGCT.desbaste)}</h5>
                        </div>
                
                        <div className={style.formItem}>
                            <div>
                                <h5 className={style.titleForm}>$/kgV Neto: </h5>
                            </div>
                            <div className={style.numero}>
                                <h5 className={style.titleForm}>$ </h5>
                                <input
                                    type="number"
                                    value={formGCT.precio_kgv_netos}
                                    id="precio_kgv_netos"
                                    name="precio_kgv_netos"
                                    onChange={handleChangeG}
                                    placeholder="0.00"
                                    className={style.size2}
                                />
                            </div>
                        </div>
                    </div>
                    :
                        <div className={style.cardGrupo}>
                            <div className={style.formItem}>
                                <h5 className={style.titleForm}>N° Tropa: </h5>
                                <select id="tropa" className="selectform" onChange={(e)=> handleSelectTr(e)}>
                                    <option defaultValue>-</option>
                                    {faenasDisp.length > 0 &&  
                                        faenasDisp.map((c,i) => (
                                            <option key={i}	value={c.tropa}>{c.tropa}</option>
                                            ))
                                    }
                                </select>
                            </div>
                            <div className={style.formItem}>
                                <div>
                                    <select id="categoria" className="selectform" onChange={(e)=> handleSelectCat(e)}>
                                        <option value="" defaultValue>Categoría</option>
                                        {categorias.length > 0 &&  
                                        categorias.map((c,i) => (
                                                <option	key={i} value={c}>{c}</option>
                                                ))
                                        }
                                    </select>
                                </div>
                                <div className={style.numero}>
                                    <h5 className={style.titleForm}>N°: </h5>
                                    <input
                                        type="number"
                                        value={formGCT.cant}
                                        id="cant"
                                        name="cant"
                                        onChange={handleChangeG}
                                        className={style.size1}
                                    />
                                </div>
                            </div>
                            <div className={style.formItem}>
                                <h5 className={style.titleForm}>kgV Netos: </h5>
                                <input
                                    type="number"
                                    value={formGCT.kgv_netos?formGCT.kgv_netos:''}
                                    id="kgv_netos"
                                    name="kgv_netos"
                                    onChange={handleChangeG}
                                    placeholder="00"
                                    className={style.size2}
                                />
                            </div>
                            <div className={style.formItem}>
                                <h5 className={style.titleForm}>Desbaste: </h5>
                                <input
                                    type="number"
                                    value={formGCT.desbaste?formGCT.desbaste:''}
                                    id="desbaste"
                                    name="desbaste"
                                    onChange={handleChangeG}
                                    placeholder="00"
                                    className={error.desbaste & style.danger}
                                />
                            </div>
                            <div className={style.formItem}>
                                <h5 className={style.titleForm}>kgV Brutos: </h5>
                                <h5 className={style.titleForm}>{(formGCT.kgv_netos/(1-formGCT.desbaste)).toFixed(2)}</h5>
                            </div>
                            <div className={style.formItem}>
                                <div>
                                    <h5 className={style.titleForm}>$/kgV Neto: </h5>
                                </div>
                                <div className={style.numero}>
                                    <h5 className={style.titleForm}>$ </h5>
                                    <input
                                        type="number"
                                        value={formGCT.precio_kgv_netos}
                                        id="precio_kgv_netos"
                                        name="precio_kgv_netos"
                                        onChange={handleChangeG}
                                        placeholder="0.00"
                                        className={style.size2}
                                    />
                                </div>
                            </div>
                        </div>                        
                }
                    <div className={style.button}>
                        <ButtonNew
                            onClick={handleSubmitGrupos}
                            style={"right"}
                            icon={"right"}
                        />
                    </div>

                            {form.grupos.length ?
                    form.grupos.map((e,i)=>{
                        return(
                            <CardGrupos
                                key={i}
                                tropa={e.n_tropa}
                                categoria={e.categoria}
                                kgv_brutos={(e.kgv_brutos*1).toFixed(2)}
                                desbaste={e.desbaste}
                                kgv_netos={(e.kgv_netos*1).toFixed(2)}
                                cant={e.cant}
                                precio_kgv_netos={e.precio_kgv_netos}
                                onClick={()=> handleDelete(e)}
                            />
                        )
                    })
                    : null
}
                    <div className={style.buttons} >
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

export default Form_Compra;

