import React from "react";
import tableVentaStyle from "./tableVentaStyle.module.scss"


export default function Table_Cliente({email,nombre,telefono,direccion, cuil}){


    return(
        <div className={tableVentaStyle.conteiner}>
        <table className="table">
            <tbody>
                <tr className="table-info">
                    <td >Nombre</td>
                    <td className={tableVentaStyle.tdr}>{nombre}</td>
                </tr>
                <tr className="table-info">
                    <td >Cuil</td>
                    <td className={tableVentaStyle.tdr}>{cuil}</td>
                </tr>
                <tr className="table-info">
                    <td >Teléfono</td>
                    <td className={tableVentaStyle.tdr}>{telefono}</td>
                </tr>
                <tr className="table-info">
                    <td >e-mail</td>
                    <td className={tableVentaStyle.tdr}>{email}</td>
                </tr>
                <tr className="table-info">
                    <td >Dirección</td>
                    <td className={tableVentaStyle.tdr}>{direccion}</td>
                </tr>
            </tbody>
        </table>

        </div>
    )
}




