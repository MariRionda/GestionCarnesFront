import React, { useEffect } from "react";
import NavBar from "../../Components/Navbar/Navbar";
import CardSmall from "../../Components/Cards/Card_Small/Card_Small";
import styleF from "./Faenas.module.scss";
import {getAllFaenas} from "../../Redux/Actions/Actions.js"
import { useDispatch, useSelector } from "react-redux";
import CardSmallFaenas from "../../Components/Cards/Card_Small_faenas/Card_Small";

export default function Historial_Faena(){
    const dispatch = useDispatch()

    useEffect(() => {
    dispatch(getAllFaenas())
    }, [dispatch])

const AllFaenas = useSelector((state)=>state.AllFaenas)
    return(
        <div className={styleF.ConteinerFaenas}>
            <NavBar
            title={"Hist. Faenas"}
            />
            <div>
                <div className={styleF.title}>
                    <div><b>Fecha</b></div>
                    <div><b>|</b></div>
                    <div><b>Frigorífico</b></div>
                    <div><b>|</b></div>
                    <div><b>Tropa</b></div>
                    <div><b>|</b></div>
                    <div><b>Monto($)</b></div>
                </div>
                <div className={styleF.cardsCont}>
                    {AllFaenas.map((a,i)=>{
                        return(
                            <CardSmallFaenas
                                id={a.id}
                                key={i}
                                fecha={a.fecha}
                                frigorifico={a.frigorifico}
                                tropa={a.tropa}
                                saldo={a.costo_total}
                                tipo={"Faenas"}
                                pago={false}
                            />
                        )
                        
                    })
                    }
                </div>
            </div>
        </div>
    )
}