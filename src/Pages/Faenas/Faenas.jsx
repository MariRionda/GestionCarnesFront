import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/Navbar/Navbar";
import style from "./Faenas.module.scss";
import LargeButton from "../../Components/Buttons/Button_Large/Button_Large";
import {getAllFaenas} from "../../Redux/Actions/Actions.js"
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardSmallFaenas from "../../Components/Cards/Card_Small_faenas/Card_Small";


export default function Faenas(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllFaenas())
    }, [dispatch])

    const faenasPendientes = useSelector((state)=>state.faenasPendientes)

    const navigate = useNavigate();

    faenasPendientes.sort(function(a,b){
        if(a.fecha>b.fecha){return -1}
        if(a.fecha<b.fecha){return 1}
        return 0})

    return(
        <div className={style.ConteinerFaenas}>
            <NavBar
            title={"Faenas"}
            onClick={"/home"}
            />
            <div>
                <div className={style.contTitle}>
                    <h1 className={style.titleP}>Pendientes</h1>
                </div>
                <div className={style.titles}>
                    <div className={style.title1}><b>Fecha</b></div>
                    <div className={style.title2}><b>Frigorífico</b></div>
                    <div className={style.title3}><b>Tropa</b></div>
                    <div className={style.title4}><b>Saldo($)</b></div>
                </div>
                <div className={style.cardsCont}>
                    {faenasPendientes.map((a,i)=>{
                        return(
                            <CardSmallFaenas
                                key={i}
                                fecha={a.fecha}
                                frigorifico={a.frigorifico}
                                tropa={a.tropa}
                                saldo={a.saldo}
                                tipo={"Faenas"}
                                pago={true}
                                bstyle={"new"}
                                bicon={"new"}
                                bonClick={()=>navigate(`/Faenas/FormPagos/${a.tropa}`)}
                            />
                        )
                        
                    })
                    }
                </div>
                <div className={style.buttons}>
                    <div className={style.buttonLarge}>
                        <LargeButton
                            title={"Historial de Faenas"}
                            onClick={()=>navigate("/Faenas/Historial")}
                        ></LargeButton>
                    </div>
                    <div className={style.buttonsPagos}>
                        <div className={style.buttonLarge}>
                            <LargeButton
                                title={"Pagos - Natilla"}
                                onClick={()=>navigate("/Faenas/DetallePagos/Natilla")}
                            ></LargeButton>
                        </div>
                        <div className={style.buttonLarge}>
                            <LargeButton
                                title={"Pagos - El Hueco"}
                                onClick={()=>navigate("/Faenas/DetallePagos/El Hueco")}
                            ></LargeButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}