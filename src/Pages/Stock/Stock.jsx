import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../../Components/Navbar/Navbar";
import styleSt from "./Stock.module.scss";
import Table_Stock from "../../Components/Details/Table_Stock";
import CardSmallStock from "../../Components/Cards/Card_Small_stock/Card_Small.jsx";
import { getAllFaenas, getFaenasUltimosVeinteDias } from "../../Redux/Actions/Actions";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Stock(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getFaenasUltimosVeinteDias())
    }, [dispatch])

    let AllFaenas = useSelector((state)=>state.ultimasFaenas)
    
    let total_kg=["Total kg","","",0]
    let vaq=["Vaquillona",0,0,0]
    let vaca=["Vaca",0,0,0]
    let nov=["Novillito",0,0,0]
    let toro=["Toro",0,0,0]
    let Novp=["Novillo Pesado",0,0,0]

    AllFaenas.map((e)=>{
            e.detalle.map((a)=>{
                if(a.CuartoT==0 && a.CuartoD==0 && a.stock==true )total_kg[3]+=a.kg
                if(a.CuartoT>0 && a.stock==true)total_kg[3]+=a.CuartoT
                if(a.CuartoD>0 && a.stock==true)total_kg[3]+=a.CuartoD


            if(a.categoria==="Vaquillona" && a.stock==true){
                if(a.CuartoD!==0) vaq[2]++
                else if(a.CuartoT!==0) vaq[3]++
                else vaq[1]++
            }
            if(a.categoria==="Vaca" && a.stock==true){
                if(a.CuartoD!==0) vaca[2]++
                else if(a.CuartoT!==0) vaca[3]++
                else vaca[1]++
            }
            if(a.categoria==="Novillito" && a.stock==true){
                if(a.CuartoD!==0) nov[2]++
                else if(a.CuartoT!==0) nov[3]++
                else nov[1]++
            }
            if(a.categoria==="Toro" && a.stock==true){
                if(a.CuartoD!==0) toro[2]++
                else if(a.CuartoT!==0) toro[3]++
                else toro[1]++
            }
            if(a.categoria==="Novillo Pesado" && a.stock==true){
                if(a.CuartoD!==0) toro[2]++
                else if(a.CuartoT!==0) toro[3]++
                else Novp[1]++
            }
        })
    })

var array=[vaq,vaca,nov,toro,Novp,total_kg]
    return(
        <div className={styleSt.Conteiner}>
            <NavBar
            title={"Stock"}
            />
            {AllFaenas.length?
            <div className={styleSt.contTable}>
                <Table_Stock
                    array={array}
                />
            </div>
            :
            <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'200px' }}>
                            <CircularProgress />
                        </Box>
            }
            <div className={styleSt.title}>
                <div><b>Fecha</b></div>
                <div><b>|</b></div>
                <div><b>Dias</b></div>
                <div><b>|</b></div>
                <div><b>Frigorífico</b></div>
                <div><b>|</b></div>
                <div><b>Tropa</b></div>
            </div>
            <div className={styleSt.cardsCont}>
                {  AllFaenas.map((a,i)=>{ 
                    return(
                        a.detalle.some((e)=> e.stock==true)?
                        <CardSmallStock
                            key={i}
                            fecha={a.fecha}
                            frigorifico={a.frigorifico}
                            tropa={a.tropa}
                            tipo={"Stock/DetalleTropa"}
                        />
                        : null
                    )
                    
                })

                }
            </div>
        </div>
    )
}