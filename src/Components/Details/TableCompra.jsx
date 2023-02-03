import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getComrpaByID, getPagosComprasByID } from "../../Redux/Actions/Actions";
import CardGruposDetalle from "../Cards/CardGruposDetalle/CardGruposDetalle.jsx";
import tableComprasStyle from "./tableCompraStyle.module.scss"
import tableVentaStyle from "./tableVentaStyle.module.scss"


export default function TableCompra({compra, comision_total}){

        const dispatch = useDispatch()

        useEffect(() => {
                dispatch(getPagosComprasByID(compra.id))
        }, [compra])

        const AllPagosbyCompra= useSelector((state)=>state.AllPagosbyCompra)

        function currencyFormatter({ currency, value}) {
                const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        minimumFractionDigits: 2,
                        currency
                }) 
                return formatter.format(value)
        }
        
        let saldoEnPesos = currencyFormatter({
        currency: "USD",
        value : compra.saldo
        })

        let costohenpesos = currencyFormatter({
                currency: "USD",
                value : compra.costo_total_hac
                })
        let costofleteenpesos = currencyFormatter({
                currency: "USD",
                value : compra.costo_flete
                })
        let costovepsenpesos = currencyFormatter({
                currency: "USD",
                value : compra.costo_veps_unit
                })
        let costovepstotalenpesos = currencyFormatter({
                currency: "USD",
                value : compra.costo_veps_total
                })
        let precioachuraspesos = currencyFormatter({
                currency: "USD",
                value : compra.precio_venta_achuras_unit
                        })
        let comision_total_pesos = currencyFormatter({
                currency: "USD",
                value : comision_total
                        })
        let recupero = currencyFormatter({
                currency: "USD",
                value : compra.recupero_precio_kg
                        })
        let pagos1


                
        return(
                <div className={tableComprasStyle.conteiner}>
                        <table className="table">
                        <tbody>
                                <tr className="table-info">
                                        <td>id</td>
                                        <td className={tableVentaStyle.tdr}>{compra.id}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Fecha</td>
                                        <td className={tableVentaStyle.tdr}>{(new Date(compra.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Proveedor</td>
                                        <td className={tableVentaStyle.tdr}>{compra.proveedor}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Lugar</td>
                                        <td className={tableVentaStyle.tdr}>{compra.lugar}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >N° DTE</td>
                                        <td className={tableVentaStyle.tdr}>{compra.n_dte}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >kgV Brutos Totales</td>
                                        <td className={tableVentaStyle.tdr}>{compra.kgv_brutos_totales?.toFixed(2)}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >kgV Netos Totales</td>
                                        <td className={tableVentaStyle.tdr}>{compra.kgv_netos_totales?.toFixed(2)}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >kg Carne Totales</td>
                                        <td className={tableVentaStyle.tdr}>{compra.kg_carne_totales?.toFixed(2)}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Cant. Animales</td>
                                        <td className={tableVentaStyle.tdr}>{compra.cant_total}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Precio Venta de Achuras</td>
                                        <td className={tableVentaStyle.tdr}>{precioachuraspesos}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Recupero $/kg</td>
                                        <td className={tableVentaStyle.tdr}>{recupero}</td>
                                </tr>
                                {compra.comision_total_pesos?
                                <tr className="table-info">                                        
                                        <td >Comisión</td>
                                        <td className={tableVentaStyle.tdr}>{comision_total_pesos}</td>                 
                                </tr>
                                :null}
                                <tr className="table-info">
                                        <td >Costo VEPs Unit</td>
                                        <td className={tableVentaStyle.tdr}>{costovepsenpesos}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Costo VEPs totales</td>
                                        <td className={tableVentaStyle.tdr}>{costovepstotalenpesos}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Costo Flete</td>
                                        <td className={tableVentaStyle.tdr}>{costofleteenpesos}</td>
                                </tr>
                                <tr className="table-info">
                                        <td >Costo Total Hacienda</td>
                                        <td className={tableVentaStyle.tdr}>{costohenpesos}</td>
                                </tr>

                                <tr>
                                        <td className="table-dark">Pagos Hacienda</td>
                                        <td className="table-dark"></td>
                                </tr>
                                
                                {AllPagosbyCompra.map((e,i)=>
                                        <tr key={i}>
                                                <td>{(new Date(e.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}</td>
                                                <td>{pagos1 = currencyFormatter({
                        currency: "USD",
                        value : e.monto
                                })}</td>
                                        </tr>
                                 )}
                    <tr>
                            <td>Saldo</td>
                            <td>{saldoEnPesos}</td>
                    </tr>

            </tbody>
        </table>

        <div>
        {compra.grupos?compra.grupos.map((a)=>{
                
                <CardGruposDetalle
                key={a.id}
                tropa={a.n_tropa}
                categoria={a.categoria}
                kgv_brutos={a.kgv_brutos}
                desbaste={a.desbaste}
                kgv_netos={a.kgv_netos}
                cant={a.cant}
                precio_kgv_netos={a.precio_kgv_netos}
                />

})
        :null}
        </div>
        </div>
    )
}