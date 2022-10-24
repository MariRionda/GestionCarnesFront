import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getComrpaByID, getPagosComprasByID } from "../../Redux/Actions/Actions";
import CardGruposDetalle from "../Cards/CardGruposDetalle/CardGruposDetalle.jsx";
import tableComprasStyle from "./tableCompraStyle.module.scss"




export default function TableCompra({id_c}){

        const dispatch = useDispatch()

        useEffect(() => {
                dispatch(getComrpaByID(id_c))
                dispatch(getPagosComprasByID(id_c))
        }, [id_c])

        const CompraByID = useSelector((state)=>state.CompraByID)
        // useEffect(()=>{
        //         if(CompraByID.n_tropa)dispatch(getFaenasByTropa(CompraByID.n_tropa))
        // },[CompraByID])

        const AllPagosbyCompra= useSelector((state)=>state.AllPagosbyCompra)

        // const AllPagosbyFaena = useSelector((state)=>state.AllPagosbyFaena)
        // console.log(AllPagosbyFaena[0])
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
                value : CompraByID.saldo
                })

                let costohenpesos = currencyFormatter({
                        currency: "USD",
                        value : CompraByID.costo_total_hac
                        })
                let costofleteenpesos = currencyFormatter({
                        currency: "USD",
                        value : CompraByID.costo_flete
                        })
                let costovepsenpesos = currencyFormatter({
                        currency: "USD",
                        value : CompraByID.costo_veps_unit
                        })
                let costovepstotalenpesos = currencyFormatter({
                        currency: "USD",
                        value : CompraByID.costo_veps_total
                        })
                // let pagofaenanpesos = currencyFormatter({
                //         currency: "USD",
                //         value : FaenaByTropa.saldo
                //         })
                let precioachuraspesos = currencyFormatter({
                        currency: "USD",
                        value : CompraByID.precio_venta_achuras_unit
                                })
                let pagos1
                // let pagos2


                const array=[]
        for(const [key,value] of Object.entries(CompraByID)){ //a 0 cambiar por id de compra
               if(key!=="saldo" && key!=="grupos")array.push({key,value})

        }
        console.log(array)

        return(
                <div className={tableComprasStyle.conteiner}>
                        <table className="table">
                        <tbody>
                        {array.map((e,i) => {
                                return (
                                <tr key={i} className={"table-warning"}>
                                        <td>{e.key.includes("_")?(e.key.replace("_"," ").includes("_")?e.key.replace("_"," ").replace("_"," "):e.key.replace("_"," ")):e.key }</td>
                                        
                                        <td  className={tableComprasStyle.tdr}>{e.key!=="costo_total_hac" && e.key!=="costo_flete"&& e.key!=="costo_veps_unit" && e.key!=="costo_veps_total"  && 
                                                e.key!=="id" && e.key!=="precio_venta_achuras_unit" && typeof(e.value)=="number"?e.value.toFixed(2):e.key=="costo_total_hac"?costohenpesos:e.key=="costo_flete"?
                                                costofleteenpesos:e.key=="costo_veps_unit"?costovepsenpesos:e.key=="costo_veps_total"?costovepstotalenpesos:e.key=="precio_venta_achuras_unit"?precioachuraspesos:e.value}</td>            
                                </tr>
                                );
                        })}
                                <tr>
                                        <td class="table-dark">Pagos Hacienda</td>
                                        <td class="table-dark"></td>
                                </tr>
                                
                                {AllPagosbyCompra.map((e)=>
                                        <tr>
                                                <td>{e.fecha}</td>
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

                    {/* <tr>
                            <td class="table-dark">Pagos Faena</td>
                            <td class="table-dark"></td>

                    </tr> */}
                    {/* {AllPagosbyFaena.length>0?AllPagosbyFaena.map((e)=>
                    <tr>
                            <td>{e.fecha}</td>
                            <td>{pagos2 = currencyFormatter({
                        currency: "USD",
                        value : e.monto
                                })}</td>
                    </tr>
                    ):<td></td>} */}
                    {/* <tr>
                            <td>Saldo</td>
                            <td>{pagofaenanpesos}</td>
                    </tr> */}
                    
            </tbody>
        </table>

        <div>
        {CompraByID.grupos?CompraByID.grupos.map((a)=>{
                
                <CardGruposDetalle
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

// ({ tropa, categoria, kgv_brutos, desbaste, kgv_netos, cant, precio_kgv_netos, onClick})