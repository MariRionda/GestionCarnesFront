import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import NavBar from "../../Components/Navbar/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { deletePagoVentaAchurasById, deletePagoVentaById, getClienteByName, getPagosVentaAchurasByCliente, getPagosVentasByCliente, getVentasAchurasByCliente, getVentasByCliente, putSaldoVenta, putSaldoVentaAchuras } from "../../Redux/Actions/Actions"
import style from './Detalle_Pagos.module.scss'
import swal from "sweetalert"
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew"

export default function Detalle_Pagos_Clientes() {
    
    const dispatch = useDispatch()
    const {nombre}=useParams()

    useEffect(() => {
        dispatch(getPagosVentasByCliente(nombre))
        dispatch(getPagosVentaAchurasByCliente(nombre))
        dispatch(getClienteByName(nombre))
        dispatch(getVentasByCliente(nombre))
        dispatch(getVentasAchurasByCliente(nombre))
    }, [dispatch])

    const pagos = useSelector((state)=>state.pagosByCliente)
    const pagosAchuras = useSelector((state)=>state.pagosAchurasByCliente)
    const cliente = useSelector((state)=>state.clienteByNombre)
    const ventas = useSelector((state)=>state.AllVentasByCliente)
    const ventasAc = useSelector((state)=>state.AllVentasAchurasByCliente)


    let pagosT=[ ...pagos, ...pagosAchuras]
    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
    }
    let monto

    const deletePago = (id, ventaID, monto, cliente)=>{
        swal({
            title: "¿Está seguro que desea eliminar el pago?",
            text: "Una vez eliminada perdera todos sus datos 😰",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                swal('Escriba "eliminar pago" para confirmar:', {
                    content: "input",
                    })
                    .then((value) => {
                    if(value==="eliminar pago"){
                    
                        if(cliente){
                            let venta = ventas.find(a=>a.id==ventaID)
                            let saldo2= venta.saldo + monto
                            dispatch(putSaldoVenta(ventaID, saldo2))
                            dispatch(deletePagoVentaById(id))
                            dispatch(getPagosVentasByCliente(nombre))

                        }
                        else{
                            let venta = ventasAc.find(a=>a.id==ventaID)
                            let saldo2= venta.saldo + monto
                            dispatch(putSaldoVentaAchuras(ventaID, saldo2))
                            dispatch(deletePagoVentaAchurasById(id))
                            dispatch(getPagosVentaAchurasByCliente(nombre))
                        }
                        swal("Se eliminó el pago", {
                            icon: "success",
                        })

                    }
                    else {
                        swal("Frase incorrecta, no se eliminó la faena");
                    }
                });
            } else {
                swal("No se eliminó la faena");
                }
        })
        
    }

    return(
        <div className={style.conteiner}>
            <NavBar
                title={`Pagos de ${nombre}`}
            />
            <div className={style.tablefaena}>
                <table className="table">
                    <tbody>
                        <tr className="table-dark">
                            <td>ID</td> 
                            <td>Fecha</td>  
                            <td>Forma de Pago</td>
                            <td>Monto</td>
                            <td>Eliminar</td>
                        </tr>
                        {pagosT.map((e,i) => {
                            return(
                                <tr key={i} className={"table-primary"}> 
                                    <td>{e.cliente?e.ventaID+"-V":e.ventaID+"-VAch"}</td> 
                                    <td>{e.fecha}</td> 
                                    <td>{e.formaDePago}</td>
                                    <td align="center">{
                                        monto = currencyFormatter({
                                        currency: "USD",
                                        value : e.monto
                                        })
                                    }</td>
                                    <td>
                                    <ButtonNew
                                        style={"delete"}
                                        icon={"delete"}
                                        onClick={() => {deletePago(e.id, e.ventaID, e.monto, e.cliente?e.cliente:false)}}
                                    /></td>
                                </tr>
                            )
                        })} 
                    </tbody>
                </table>
            </div>            
        </div>            
    )
}