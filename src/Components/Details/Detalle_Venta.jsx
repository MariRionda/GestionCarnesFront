import React from "react"
import tableVentaStyle from "./tableVentaStyle.module.scss"


export default function TableVenta({venta, pagos}){
    
    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
        }

        const costoPorKG = currencyFormatter({
            currency: "USD",
            value : venta.costo*1
        })
        const margenEnPesos = currencyFormatter({
            currency: "USD",
            value : venta.margen*1
        })
        const precioPorKGProm = currencyFormatter({
            currency: "USD",
            value : venta.precio_kg_prom*1
        })
        const precioUnit = currencyFormatter({
            currency: "USD",
            value : venta.precioUnitario*1
        })

        const saldoTotalEstenPesos = currencyFormatter({
        currency: "USD",
        value : venta.saldo*1
        })

        const TotalEstenPesos = currencyFormatter({
                currency: "USD",
                value : venta.total*1
        })


    return(
        <div className={tableVentaStyle.conteiner}>

            <table className="table">
            {venta.cliente?
                <tbody>
                    <tr className="table-info">
                        <td>id</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.id}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Fecha</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{(new Date(venta.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}</td>
                    </tr>
                    <tr className="table-info">
                        <td>Cliente</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.cliente}</td>
                    </tr>
                    <tr className="table-info">
                        <td>Cantidad</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.cant}</td>
                    </tr>
                    <tr className="table-info">
                        <td>kg</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.kg}kg</td>
                    </tr>
                    <tr className="table-info">
                        <td>Costo</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{costoPorKG}</td>
                    </tr>
                    <tr className="table-info">
                        <td>Margen</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{margenEnPesos}</td>
                    </tr>
                    <tr className="table-info">
                        <td>Margen %</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.margen_porc.toFixed(2)}%</td>
                    </tr>
                    <tr className="table-info">
                        <td>$/kg promedio</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{precioPorKGProm}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Total</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{TotalEstenPesos}</td>
                    </tr>
                </tbody>
                :
                <tbody>
                    <tr className="table-info">
                        <td>id</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.id}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Fecha</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{(new Date(venta.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}</td>
                    </tr>
                    <tr className="table-info">
                        <td>Cliente</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.clien}</td>
                    </tr>
                    <tr className="table-info">
                        <td>Cantidad</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{venta.cantidad}</td>
                    </tr>
                    <tr className="table-info">
                        <td>Precio Unitario</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{precioUnit}</td>
                    </tr>
                    <tr className="table-info">
                        <td >Total</td>
                        <td className={tableVentaStyle.tdr} colSpan="2">{TotalEstenPesos}</td>
                    </tr>
                </tbody>}
                <tbody>
                    <tr>
                        <td className="table-dark" colSpan="3">Pagos</td>
                    </tr>
                    {pagos?.map((a,i)=>
                    <tr key={i} className="table-info">
                    
                            <td>{(new Date(a.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}</td>
                            <td>{currencyFormatter({
                                currency: "USD",
                                value : a.monto*1
                        })}</td>
                        <td className={tableVentaStyle.tdr}>{a.formaDePago}</td>
                            
                    </tr>
                    )}
                    <tr className="table-secondary">
                            <td>Saldo</td>
                            <td className={tableVentaStyle.tdr}>{saldoTotalEstenPesos}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
