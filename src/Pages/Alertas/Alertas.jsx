import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  getAlertRes, getSaldoAllVentas} from "../../Redux/Actions/Actions.js"
import NavBar from "../../Components/Navbar/Navbar"
import style from "./Alert.module.scss"
import CardAlert from "../../Components/Cards/CardAlert/CardAlert.jsx";



export default function Alertas(){

const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAlertRes())
    }, [dispatch])

    const alertRes = useSelector((state)=>state.alertRes)
    alertRes.sort(function(a,b){
        if(a.fecha>b.fecha){return 1}
        if(a.fecha<b.fecha){return -1}
        return 0})

    let fecha = Date.now()
    return(
        <div className={style.Conteiner}>
                <NavBar
                title="Alertas"
                />
                <div className={style.CardConteiner}>
                {alertRes?.map((a,i)=>{
                    return(

                    <div className={style.CardAlert} key={i}>
                        <CardAlert
                        tropa={a.tropa}
                        categoria={a.res.categoria}
                        correlativo={a.res.correlativo}
                        frigorifico={a.frigorifico}
                        fecha={(new Date(a.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}
                        dias={Math.ceil((fecha - a.fecha)/(24*3600*1000))}
                        />
                    </div>
                )
                }
                )}    
                </div>
        </div>
    )
}