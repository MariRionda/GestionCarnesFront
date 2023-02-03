import React from "react";
import tableVentaStyle from "./tableVentaStyle.module.scss"


export default function Table_Stock({array}){
  
    return(
        <div className={tableVentaStyle.conteiner}>

            <table className="table">
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th>1/2 Res</th>
                    <th>1/4 D</th>
                    <th>1/4 T</th>
                    
                </tr>
            </thead>
            <tbody>
            {array.map((e,j) => {

                    return(

                    <tr key={j}  className={"table-info"}>
                    {e.map((a,i) => {
                        return(
                        <td key={i}>{a}</td>    
                        )
                    })}    
                    </tr>
                    )
            })
            }
            </tbody>
        </table>

        </div>
    )
}




