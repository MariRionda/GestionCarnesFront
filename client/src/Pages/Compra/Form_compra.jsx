import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import {getAllFaenas, getAllProveedores, getProveedorByName, postNewCompra, putReses, putSaldoProveedor, setAlertCompra} from "../../Redux/Actions/Actions";
import NavBar from '../../Components/Navbar/Navbar'
import styleFormC from './Form_Compra.module.scss';
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew";

let formC = {
    proveedor: '',
    fecha: '',
    lugar: '',
    n_dte: '',
    
    kgv_netos:1, //kgv_brutos - kg_desbaste
    costo_flete: null,
    cant_achuras: null,
    precio_venta_achuras: null,
    recupero_precio_kg: null, //precio_venta_achuras/kg_carne
    costo_hac:null,//kgv_netos * precio_kgv_netos
    comision:0, //0,02*costo_hac//true or false
    costo_flete: null,
    costo_veps_unit: null,
    grupos:[],
    saldo:null //saldo de hacienda solamente
};

let FormGCT = {
    categoria: '',            //ingresa                    //costo total=(costo de hacienda)+(costo de flete)+(comision)+(costo Veps)+(costo faena)
    n_tropa: '',              //ingresa                    //costo/kg =   costo total/
    kgv_brutos: null,         //ingresa
    desbaste: 0.07,           //ingresa 
    kg_desbaste:null,       //calcula                      //kgv_brutos * desbaste
    kgv_netos:0,            //calcula
    kg_carne: null,              //trae                    //costo de hacienda = kgneto*precio_kgv_netos
    costo_flete: null,      //calcula d                      //costo flete  
    costo_hac:0,            //calcula  
    costo_faena_kg:0,            //trae
    cosoVeps:0,             //calcula d       
    cant: 0,                  //ingresa
    precio_kgv_netos: null,   //ingresa
    pesoProm:0,             //calcula 
    rinde:0,                //calcula   
    n_grupo:0,              //calcula
};


const categorias = ["Vaquillona", "Novillito", "Vaca", "Toro", "Novillo Pesado"]
let n=0
//validaciones
export const validate = (compra) => {
    let error = {};
    if (!compra.proveedor) error.proveedor = "Falta proveedor";
    if (!compra.fecha) error.fecha = "Falta fecha";
    else if (!/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/.test(compra.fecha)) error.fecha = "Fecha incorrecta";
    if (!compra.n_dte) error.n_dte = "Falta N° DTE";
    if (!compra.categoria) error.categoria = "Falta categoria";
    if (!compra.cant) error.cant = "Falta cant";
    else if (!/^([0-9])*$/.test(compra.cant)) error.cant = "N° debe ser un número";
    if (!compra.kgv_brutos) error.kgv_brutos = "Falta kgV Brutos";
    else if (!/^([0-9])*$/.test(compra.kgv_brutos)) error.kgv_brutos = "kgV Brutos debe ser un número";
    if (!compra.n_tropa) error.n_tropa = "Falta tropa";
    else if (!/^([0-9])*$/.test(compra.n_tropa)) error.n_tropa = "Tropa debe ser un número";
    else if (!/^([0-9])*$/.test(compra.precio_venta_achuras)) error.precio_venta_achuras = "$ Venta de Achuras debe ser un número";
    if (!compra.costo_flete) error.costo_flete = "Falta Costo de Flete";
    else if (!/^([0-9])*$/.test(compra.costo_flete)) error.costo_flete = "Costo de Flete debe ser un número";
    if (!compra.costo_veps_unit) error.costo_veps_unit = "Falta costo de VEP/Un";
    else if (!/^([0-9])*$/.test(compra.costo_veps_unit)) error.costo_veps_unit = "costo de VEP/Un debe ser un número";
    return error;
};

const Form_Compra = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Estados globales
    const alert_msj= useSelector ((state)=>state.postCompra);
    const proveedores = useSelector((state)=>state.AllProveedores);
    const faenas = useSelector((state)=>state.AllFaenas)
    
    useEffect(() => {
        dispatch(getAllProveedores())
        dispatch(getAllFaenas())
    }, [dispatch])

    useEffect(() => {
        if(alert_msj!==""){
            swal({
                title: alert_msj,
                icon: alert_msj==="Compra creada con éxito"?"success":"warning", 
                button: "ok",
            })}
        dispatch(setAlertCompra())
    }, [alert_msj])

        

 
 
    //estados locales
    const [form, setForm] = useState(formC);
    const [error, setError] = useState({});
    const [formGCT, setFormCGT] = useState(FormGCT);
    const [error2, setError2] = useState({});
    const [Switch_Comision, setSwitch_comision] = useState(false);

    let proveedor
    useEffect(() => {
        if(form.proveedor!=='')proveedor=proveedores.find(a=>a.nombre==form.proveedor)
    }, [form])


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
            if(true){
                formGCT.kg_desbaste = formGCT.kgv_brutos*formGCT.desbaste
                formGCT.kgv_netos = formGCT.kgv_brutos - formGCT.kg_desbaste
                formGCT.costo_hac = formGCT.kgv_netos * formGCT.precio_kgv_netos
                formGCT.pesoProm = formGCT.kg_carne/formGCT.cant
                formGCT.rinde = formGCT.kg_carne  * 100 / (formGCT.kgv_netos)
                formGCT.n_grupo = n+1
                form.grupos.unshift(formGCT)
                setFormCGT(FormGCT)
            }
        }
        catch(err){
            console.log(err)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(
            !error.proveedor && form.proveedor &&
            !error.fecha && form.fecha &&
            !error.n_dte && form.n_dte &&
            !error.categoria && form.categoria &&
            !error.cant && form.cant &&
            !error.kgv_brutos && form.kgv_brutos &&
            !error.desbaste && form.desbaste &&
            !error.n_tropa && form.n_tropa &&
            !error.precio_venta_achuras && form.precio_venta_achuras &&
            !error.costo_flete && form.costo_flete &&
            !error.costo_veps_unit && form.costo_veps_unit
        ){
            //cargo el resto de las propiedades
            form.kg_desbaste = form.kgv_brutos*1 * form.desbaste;
            form.kgv_netos = form.kgv_brutos*1 - form.kg_desbaste*1;
            if(faenas.length>0){
                faenas.map((c)=>{
                if(c.tropa==form.n_tropa){
                    form.kg_carne=c.total_kg
                    form.costo_faena = c.costo_total
                } 
            })}
            if(form.cant!==null)form.cant_achuras=form.cant*1
            form.rinde = (form.kgv_netos>0 ? form.kg_carne  * 100 / (form.kgv_netos) : 0);
            if(form.kg_carne>0){form.recupero_precio_kg = form.precio_venta_achuras*1  / (form.kg_carne*1)}
            form.costo_hac = form.kgv_netos*1  * form.precio_kgv_netos;
            if(Switch_Comision===true) form.comision = 0.02 * form.costo_hac;
            form.costo_veps = form.costo_veps_unit*1  * form.cant*1;
            if(form.costo_faena==null) form.costo_faena=1
            form.costo_total = (form.costo_faena*1)  + (form.costo_veps*1)  + (form.costo_flete*1)  + (form.costo_hac*1) ;
            if(form.kg_carne!==null){form.costo_kg = (form.costo_total*1) / (form.kg_carne*1)}
            form.saldo = form.costo_hac
            if(form.kg_carne==null) form.kg_carne=1
            dispatch(putReses(form.costo_kg, form.n_tropa, form.categoria))
            dispatch(postNewCompra(form))
            let saldo = proveedor.saldo + form.saldo
            dispatch(putSaldoProveedor(proveedor.id, saldo))
            document.getElementById("proveedor").selectedIndex = 0
            document.getElementById("categoria").selectedIndex = 0
            document.getElementById("tropa").selectedIndex = 0
            setForm(formC);
            setSwitch_comision(false)
        }
        else{
            swal({
                title: "Faltan Datos",
                icon: "warning", 
                button: "ok",
            })
        }
    };

    function handleSelectCat(e) {
        setForm({
            ...form,
            categoria: e.target.value 
        })
    }
    function handleSelectPr(e) {
        setForm({
            ...form,
            proveedor:  e.target.value
        })
    }
    function handleSelectTr(e) {
        setForm({
            ...form,
            n_tropa:  e.target.value
        })
    }

    const handleDet = () => {
        navigate("/Compras")
    };

    const switchCom = ()=>{
        if(Switch_Comision==false)setSwitch_comision(true)
        else if(Switch_Comision==true)setSwitch_comision(false);
    }

    return (
        <div className={styleFormC.wallpaper}>
            <NavBar
            title={"Nueva Compra"}
            />
            <div className={styleFormC.formContainer}>
                <form className={styleFormC.form}>
                    <div className={styleFormC.formItem}>
                        <h5 className={styleFormC.title}>Proveedor: </h5>
                        <select id="proveedor" className="selectform" onChange={(e)=> handleSelectPr(e)}>
                            <option value="" selected>-</option>
                            {proveedores.length > 0 &&  
                            proveedores.map((p) => (
                                    <option	value={p.nombre}>{p.nombre}</option>
                                    ))
                            }
                        </select>
                    </div>
                    <div className={styleFormC.formItem}>
                        <h5 className={styleFormC.title}>Fecha: </h5>
                        <input
                            type="text"
                            value={form.fecha}
                            id="fecha"
                            name="fecha"
                            onChange={handleChange}
                            placeholder="00-00-0000"
                            className={error.fecha & 'danger'}
                        />
                    </div>
                    <p className={error.fecha ? styleFormC.danger : styleFormC.pass}>{error.fecha}</p>
                    <div className={styleFormC.formItem}>
                        <h5 className={styleFormC.title}>Lugar: </h5>
                        <input
                            type="text"
                            value={form.lugar}
                            id="lugar"
                            name="lugar"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styleFormC.formItem}>
                        <h5 className={styleFormC.title}>N° DTE: </h5>
                        <input
                            type="text"
                            value={form.n_dte}
                            id="n_dte"
                            name="n_dte"
                            onChange={handleChange}
                            className={error.n_dte & 'danger'}
                        />
                    </div>
                    <p className={error.n_dte ? styleFormC.danger : styleFormC.pass}>{error.n_dte}</p>

{/* -----------------------------------------------------------------------------------------------------------------------------------*/}
                    <div className={styleFormC.cardGrupo}>

                    <div className={styleFormC.formItem}>
                        <div>
                            <select id="categoria" className="selectform" onChange={(e)=> handleSelectCat(e)}>
                                <option value="" selected>Categoría</option>
                                {categorias.length > 0 &&  
                                categorias.map((c) => (
                                        <option	value={c}>{c}</option>
                                        ))
                                }
                            </select>
                        </div>
                        <div className={styleFormC.numero}>
                            <h5 className={styleFormC.title}>N°: </h5>
                            <input
                                type="number"
                                value={form.cant}
                                id="cant"
                                name="cant"
                                onChange={handleChange}
                                className={styleFormC.size1}
                            />
                        </div>
                    </div>
                    <p className={error.cant ? styleFormC.danger : styleFormC.pass}>{error.cant}</p>
                    <div className={styleFormC.formItem}>
                        <h5 className={styleFormC.title}>kgV Brutos: </h5>
                        <input
                            type="number"
                            value={form.kgv_brutos}
                            id="kgv_brutos"
                            name="kgv_brutos"
                            onChange={handleChange}
                            placeholder="00"
                            className={styleFormC.size2}
                        />
                    </div>
                    <p className={error.kgv_brutos ? styleFormC.danger : styleFormC.pass}>{error.kgv_brutos}</p>
                    <div className={styleFormC.formItem}>
                        <h5 className={styleFormC.title}>Desbaste: </h5>
                        <input
                            type="number"
                            value={form.desbaste}
                            id="desbaste"
                            name="desbaste"
                            onChange={handleChange}
                            placeholder="00"
                            className={error.desbaste & styleFormC.danger}
                        />
                    </div>
                    <p className={error.desbaste ? styleFormC.danger : styleFormC.pass}>{error.desbaste}</p>
                    <div className={styleFormC.formItem}>
                        <div>
                            <h5 className={styleFormC.title}>$/kgV Neto: </h5>
                        </div>
                        <div className={styleFormC.numero}>
                            <h5 className={styleFormC.title}>$ </h5>
                            <input
                                type="number"
                                value={form.precio_kgv_netos}
                                id="precio_kgv_netos"
                                name="precio_kgv_netos"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={styleFormC.size2}
                            />
                        </div>
                    </div>
                    <p className={error.precio_kgv_netos ? styleFormC.danger : styleFormC.pass}>{error.precio_kgv_netos}</p>
                    <div className={styleFormC.formItem}>
                            <h5 className={styleFormC.title}>N° Tropa: </h5>
                            <select id="tropa" className="selectform" onChange={(e)=> handleSelectTr(e)}>
                                <option value="" selected>-</option>
                                {faenas.length > 0 &&  
                                faenas.map((c) => (
                                        <option	value={c.tropa}>{c.tropa}</option>
                                        ))
                                }
                            </select>
                        </div>
                    <p className={error.n_tropa ? styleFormC.danger : styleFormC.pass}>{error.n_tropa}</p>        
                    </div>
                    <div className={styleFormC.button}>
                        <ButtonNew
                            onClick={handleSubmitGrupos}
                            style={"right"}
                            icon={"right"}
                        />
                    </div>


{/*----------------------------------------------------------------------------------------------------------------------------*/}
                        {/* <div className={styleFormF.formItem2}>
                            <div className={styleFormF.inbox}>
                                <div className={styleFormF.item}>
                                    <h5 className={styleFormF.title}>Correlativo: </h5>
                                    <input
                                        type="text"
                                        value={formGCT.correlativo}
                                        id="correlativo"
                                        name="correlativo"
                                        onChange={handleChangeCF}
                                        placeholder="0000"
                                        className={styleFormF.size2}
                                    />
                                </div>
                                <p className={error2.correlativo ? styleFormF.danger : styleFormF.pass}>{error2.correlativo}</p>
                                <div className={styleFormF.item}>
                                    <select id="categoria" className="selectform" onChange={(e)=> handleSelect(e)}>
                                        <option value="" selected>Categoría</option>
                                            {categorias.length > 0 &&  
                                            categorias.map((c) => (
                                                <option	value={c}>{c}</option>
                                            ))
                                            }
                                    </select>
                                    <p className={error2.categoria ? styleFormF.danger : styleFormF.pass}>{error2.categoria}</p>
                                    <div className={styleFormF.numero}>
                                        <h5 className={styleFormF.title}>kg </h5>
                                        <input
                                            type="number"
                                            value={formGCT.kg}
                                            id="kg"
                                            name="kg"
                                            onChange={handleChangeCF}
                                            placeholder="00"
                                            className={styleFormF.size2}
                                        />
                                    </div>
                                    <p className={error2.kg ? styleFormF.danger : styleFormF.pass}>{error2.kg}</p>
                                </div>
                            </div>
                    </div>
                    <div className={styleFormF.button}>
                        <ButtonNew
                            onClick={Object.entries(error2).length===0 || Object.entries(error3).length===0 ? handleSubmitRes : null}
                            style={"right"}
                            icon={"right"}
                        />
                    </div> */}
{/* ----------------------------------------------------------------------------------------------------------------------------------------------------- */}

                                
                    <div className={styleFormC.formItem}>
                        <div>
                            <h5 className={styleFormC.title}>$ Ventas de Ach.: </h5>
                        </div>
                        <div className={styleFormC.numero}>
                            <h5 className={styleFormC.title}>$ </h5>
                            <input
                                type="number"
                                value={form.precio_venta_achuras}
                                id="precio_venta_achuras"
                                name="precio_venta_achuras"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={styleFormC.size2}
                            />
                        </div>
                    </div>
                    <p className={error.precio_venta_achuras ? styleFormC.danger : styleFormC.pass}>{error.precio_venta_achuras}</p>
                    <div className={styleFormC.formItem}>
                        <h5 className={styleFormC.title}>Comisión: </h5>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={()=>switchCom()}/>
                        </div>
                    </div>
                    <div className={styleFormC.formItem}>
                        <div>
                            <h5 className={styleFormC.title}>Costo Flete: </h5>
                        </div>
                        <div className={styleFormC.numero}>
                            <h5 className={styleFormC.title}>$ </h5>
                            <input
                                type="number"
                                value={form.costo_flete}
                                id="costo_flete"
                                name="costo_flete"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={styleFormC.size2}
                            />
                        </div>
                    </div>
                    <p className={error.costo_flete ? styleFormC.danger : styleFormC.pass}>{error.costo_flete}</p>
                    <div className={styleFormC.formItem}>
                        <div>
                            <h5 className={styleFormC.title}>Costo VEPS unit.: </h5>
                        </div>
                        <div className={styleFormC.numero}>
                            <h5 className={styleFormC.title}>$ </h5>
                            <input
                                type="number"
                                value={form.costo_veps_unit}
                                id="costo_veps_unit"
                                name="costo_veps_unit"
                                onChange={handleChange}
                                placeholder="0.00"
                                className={styleFormC.size2}
                            />
                        </div>
                    </div>
                    <p className={error.costo_veps_unit ? styleFormC.danger : styleFormC.pass}>{error.costo_veps_unit}</p>
                    <div className={styleFormC.buttons}>
                        <div className={styleFormC.shortButtons}>
                            <ShortButton
                                title="📃 Detalle"
                                onClick={handleDet}
                                color="primary"
                            />
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