import React from "react";
import tableVentaStyle from "./tableVentaStyle.module.scss"



export default function TableDetRes({venta}){
    var totalkg=0
    var total$=0
    var array=[]
    const array2=[]

    venta.detalle?.map((a)=>{
    array=[]
    total$+=a.kg*a.$_kg
    totalkg+=a.kg
    
    if(a.Total_Media=="1/4D")a.Correlativo=a.Correlativo.concat(" D")
    if(a.Total_Media=="1/4T")a.Correlativo=a.Correlativo.concat(" T")
    
    for(const [key,value] of Object.entries(a)){ 
    
        if(key!=="costo_kg" && key!=="id" && key!=="kg_total")array.push(value) 
        }
        array2.push(array)
    })
    return(
        <div className={tableVentaStyle.conteiner}>

            <table className="table">
            <thead>
                <tr>
                    <th>Correlativo</th>
                    <th>Categoria</th>
                    <th>1/2 Res</th>
                    <th>kg</th>
                    <th>$/kg</th>                    
                </tr>
            </thead>
            <tbody>
            {array2.length!==0?array2.map((e,j) => {

                    return(

                    <tr key={j}  className={"table-warning"}>
                    {e.length!==0?e.map((a,i) => {
                        return(
                        <td key={i}>{a}</td>    
                        )
                    })
                    :null }   
                    </tr>
                    )
            }):null
            }
            </tbody>
        </table>
        <table className="table">
            <thead>
                <tr>
                    <th>Total KG</th>
                    <th>{venta.kg_total}kg</th>
                </tr>
            </thead>
            <thead>
                <tr>
                    <th>Total $</th>
                    <th>${venta.total}</th>
                </tr>
            </thead>
        </table>
        </div>
    )
}




