import React from "react";
import tableVentaStyle from "./tableVentaStyle.module.scss"




export default function Tabla_Detalle_Faena({reses}){

    let kgVaca=0;
    let kgToro=0;
    let kgNovillito=0;
    let kgVaquillona=0;
    let kgNovPes=0;

    reses.map(a=>{
        if(a.categoria==="Vaca"){
            kgVaca+=a.kg
        }
        if(a.categoria==="Vaquillona"){
            kgVaquillona+=a.kg
        }
        if(a.categoria==="Novillito"){
            kgNovillito+=a.kg
        }
        if(a.categoria==="Toro"){
            kgToro+=a.kg
        }
        if(a.categoria==="Novillo Pesado"){
            kgNovPes+=a.kg
        }
    })

    

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
        }

    let totalEstenPesos

    return(
        <div className={tableVentaStyle.conteiner}>
            <table className="table">
                <tbody>
                    <tr className="table-dark">
                        <td>Correlativo</td> 
                        <td>Categoria</td> 
                        <td>kg</td>
                    </tr>
                    {reses.map((e,i) => {
                        totalEstenPesos = currencyFormatter({
                            currency: "USD",
                            value : e.precio_kg?e.precio_kg:0
                        })
                        return(
                            <tr key={i} className={"table-info"}>
                                {e.stock==true?<td><b>{e.correlativo}</b></td>:<td>{e.correlativo}</td>} 
                                <td>{e.categoria?e.categoria:null}</td> 
                                <td>{e.kg?e.kg:null}</td> 
                            </tr>
                        )
                    })}
                    {kgNovillito?
                    <tr className={"table-secondary"}>
                        <td colSpan="2"><b>Total kg Novillito</b></td>
                        <td colSpan="2">{kgNovillito}</td>
                    </tr>:null}
                    {kgNovPes?
                    <tr className={"table-secondary"}>
                        <td colSpan="2"><b>Total kg Novillo Pesado</b></td>
                        <td colSpan="2">{kgNovPes}</td>
                    </tr>:null}
                    {kgToro?
                    <tr className={"table-secondary"}>
                        <td colSpan="2"><b>Total kg Toro</b></td>
                        <td colSpan="2">{kgToro}</td>
                    </tr>:null}
                    {kgVaca?
                    <tr className={"table-secondary"}>
                        <td colSpan="2"><b>Total kg Vaca</b></td>
                        <td colSpan="2">{kgVaca}</td>
                    </tr>:null}
                    {kgVaquillona?
                    <tr className={"table-secondary"}>
                        <td colSpan="2"><b>Total kg Vaquillona</b></td>
                        <td colSpan="2">{kgVaquillona}</td>
                    </tr>:null}
                </tbody>
            </table>
        </div>
    )
}




