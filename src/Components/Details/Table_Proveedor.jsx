import React from "react";
import tableVentaStyle from "./tableVentaStyle.module.scss"



export default function Table_Proveedor({ProveedorById}){




    return(
        <div className={tableVentaStyle.conteiner}>
        <table className="table">
            <tbody>
                <tr className="table-info">
                    <td>Nombre</td>
                    <td>{ProveedorById.nombre}</td>
                </tr>
                <tr className="table-info">
                    <td>Teléfono</td>
                    <td>{ProveedorById.telefono}</td>
                </tr>
                <tr className="table-info">
                    <td>e-mail</td>
                    <td>{ProveedorById.email}</td>
                </tr>
                <tr className="table-info">
                    <td>Dirección</td>
                    <td>{ProveedorById.direccion}</td>
                </tr>
            </tbody>
        </table>

        </div>
    )
}


