import tableVentaStyle from "./tableVentaStyle.module.scss"
import {getFaenaById} from "../../Redux/Actions/Actions.js"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Table_Det_Faena({faena}){

    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(getFaenaById(id))
    // }, [dispatch])

    // const faena = useSelector((state)=>state.FaenaById)

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
    }
    let costoFaena=currencyFormatter({
        currency: "USD",
        value : faena.costo_faena_kg
    })
    let Total = currencyFormatter({
        currency: "USD",
        value : faena.costo_total
    })
    let Saldo = currencyFormatter({
        currency: "USD",
        value : faena.saldo
    })

    return(
        <div className={tableVentaStyle.conteiner}>
            <table className="table">
                <tbody>
                    <tr className="table-info">
                        <td>Tropa</td>
                        <td className={tableVentaStyle.tdr}>{faena.tropa}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Fecha</td>
                        <td className={tableVentaStyle.tdr}>{(new Date(faena.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Frigorífico</td>
                        <td className={tableVentaStyle.tdr}>{faena.frigorifico}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Proveedor</td>
                        <td className={tableVentaStyle.tdr}>{faena.proveedor}</td>
                    </tr>
                    <tr className="table-info">
                        <td >CompraID</td>
                        <td className={tableVentaStyle.tdr}>{faena.compraID}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Cantidad de medias</td>
                        <td className={tableVentaStyle.tdr}>{faena.total_medias}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Total de kg</td>
                        <td className={tableVentaStyle.tdr}>{faena.total_kg}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Costo Faena/kg</td>
                        <td className={tableVentaStyle.tdr}>{costoFaena}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Costo Total</td>
                        <td className={tableVentaStyle.tdr}>{Total}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Saldo</td>
                        <td className={tableVentaStyle.tdr}>{Saldo}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}








