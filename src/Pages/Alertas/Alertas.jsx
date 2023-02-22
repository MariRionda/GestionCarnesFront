import React, { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {  getAlertRes} from "../../Redux/Actions/Actions.js"
import NavBar from "../../Components/Navbar/Navbar"
import style from "./Alert.module.scss"
import CardAlert from "../../Components/Cards/CardAlert/CardAlert.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';



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
                <div className={alertRes[0]=="sin datos"?style.msjContainer:style.CardConteiner}>
                {alertRes[0]!="sin datos" && alertRes.length>0?
                alertRes.map((a,i)=>{
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
                ):
                alertRes[0]=="sin datos"?
                <div>
                    <h4>No hay Reses en stock con más de diez dias</h4>
                </div>
                :   <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'200px' }}>
                        <CircularProgress />
                    </Box>
                }    
                </div>
        </div>
    )
}