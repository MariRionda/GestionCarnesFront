import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllFaenas, getAllVentas, getAllVentasultimos30dias, getSaldoAllComrpas, getSaldoAllFaenas, getSaldoAllVentas} from "../../Redux/Actions/Actions.js"
import NavBar from "../../Components/Navbar/Navbar"
import styleBalance from "./Balance.module.scss"
import Graph from "../../Components/Graph/Graph.jsx";



export default function Balance(){

const dispatch = useDispatch()

    useEffect(() => {

    dispatch(getAllFaenas())
    dispatch(getAllVentas())
    dispatch(getSaldoAllComrpas())
    dispatch(getSaldoAllVentas())
    dispatch(getSaldoAllFaenas())
    dispatch(getAllVentasultimos30dias())
    }, [dispatch])


    const AllFaenas = useSelector((state)=>state.AllFaenas)
    const VentasUltimos30Dias = useSelector((state)=>state.VentasUltimos30Dias)
    const saldoTotalProveedores = useSelector((state)=>state.saldoAllCompras)
    const saldoTotalClientes = useSelector((state)=>state.saldoAllVentas)
    const saldoTotalFaenas = useSelector((state)=>state.saldoAllFaenas)

    let [kgStock,setKgStock] = useState(0)
    let [totalEst,setTotalEst] = useState(0)
    let [gananciaMensual,setGananciaMensual] = useState(0)

    AllFaenas.map((a)=>{
        a.detalle.map((r)=>{
            
                    if(r.CuartoT==0 && r.CuartoD==0 && r.stock==true && r.costo_kg){
                                                        kgStock+=r.kg
                                                        totalEst+=r.costo_kg*r.kg*1.07
                                                    }
                    if(r.CuartoT>0 && r.stock==true ){
                                        kgStock+=r.CuartoT
                                        totalEst+=r.costo_kg*r.CuartoT*1.07
                                    }
                    if(r.CuartoD>0 && r.stock==true ){
                                        kgStock+=r.CuartoD
                                        totalEst+=r.costo_kg*r.CuartoD*1.07
                                    }
                })
        })
console.log(totalEst)
    
        if(VentasUltimos30Dias.length)VentasUltimos30Dias.map(a=>{gananciaMensual+=(a.total-a.costo)})

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
        }

    const totalEstenPesos = currencyFormatter({
        currency: "USD",
        value : totalEst
        })
    const gananciaMensualEnPesos = currencyFormatter({
        currency: "USD",
        value : gananciaMensual
        })
    const saldoFaenaPendienteEnPesos = currencyFormatter({
        currency: "USD",
        value : saldoTotalFaenas
        })
    const saldoProvPendienteEnPesos = currencyFormatter({
        currency: "USD",
        value : saldoTotalProveedores
        })
    const saldoClientePendienteEnPesos = currencyFormatter({
        currency: "USD",
        value : saldoTotalClientes
        })
    const saldoPagarEnPesos = currencyFormatter({
        currency: "USD",
        value : (saldoTotalFaenas+saldoTotalProveedores)
        })

    return(
        <div className={styleBalance.ConteinerBalance}>
                <NavBar
                title="Balance"
                />
                <div className={styleBalance.tableBalance}>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td className="table-warning">Ganancia mensual</td>
                                <td className="table-warning">{gananciaMensualEnPesos}</td>
                            </tr>
                            <tr>
                                <td className="table-dark" colSpan="2">Stock</td>
                            </tr>
                            <tr>
                                <td className="table-warning">Cantidad</td>
                                <td className="table-warning">{kgStock} kg</td>
                            </tr>
                            <tr>
                                <td className="table-warning">Valor estimado</td>
                                <td className="table-warning">{totalEstenPesos}</td>
                            </tr>
                            <tr>
                                <td className="table-dark" colSpan="2">Proveedores</td>
                            </tr>
                            <tr>
                                <td className="table-warning">Saldo pendiente</td>
                                <td className="table-warning">{saldoProvPendienteEnPesos}</td>
                            </tr>
                            <tr>
                                <td className="table-dark" colSpan="2">Clientes</td>
                            </tr>
                            <tr>
                                <td className="table-warning">Saldo pendiente</td>
                                <td className="table-warning">{saldoClientePendienteEnPesos}</td>
                            </tr>
                            <tr>
                                <td className="table-dark" colSpan="2">Faena</td>
                            </tr>
                            <tr>
                                <td className="table-warning">Saldo pendiente</td>
                                <td className="table-warning">{saldoFaenaPendienteEnPesos}</td>
                            </tr>
                        
                            <tr>
                                <td className="table-dark" colSpan="2">General</td>
                            </tr>
                            <tr>
                                <td className="table-success">Saldo total a cobrar</td>
                                <td className="table-success">{saldoClientePendienteEnPesos}</td>
                            </tr>
                            <tr>
                                <td className="table-danger">Saldo total a pagar</td>
                                <td className="table-danger">{saldoPagarEnPesos}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* <Graph
                    className={styleBalance.Graph}
                /> */}
            
        </div>
    )
}