import React, { useEffect } from "react"
import NavBar from "../../Components/Navbar/Navbar"
import CardLarge from "../../Components/Cards/Card_Large/Card_Large"
import styleVen from "./Ventas.module.scss";
import { getAllVentasAchuras } from "../../Redux/Actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";



export default function Historial_Ventas_Achuras(){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getAllVentasAchuras())
    }, [dispatch])

    const AllVentasAchuras= useSelector((state)=>(state.AllVentasAchuras))

    return(
        <div className={styleVen.ConteinerVentas}>
            <NavBar
            title={"Hist. Ventas de Achuras"}
            />
            <div>
                <div className={styleVen.title}>
                    <div><b>Fecha</b></div>
                    <div><b>|</b></div>
                    <div><b>Cliente</b></div>
                    <div><b>|</b></div>
                    <div><b>Cant</b></div>
                    <div><b>|</b></div>
                    <div><b>Monto($)</b></div>
                    <div><b>|</b></div>
                    <div><b>Saldo($)</b></div>
                </div>
                <div className={styleVen.cardsCont}>
                    {AllVentasAchuras.map((a,i)=>{
                        return(
                            <CardLarge
                                key={i}
                                id={a.id}
                                fecha={a.fecha}
                                para={a.clien}
                                cant={a.cantidad}
                                kg={a.total}
                                monto={a.saldo}
                                tipo={"Ventas/Achuras"}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}