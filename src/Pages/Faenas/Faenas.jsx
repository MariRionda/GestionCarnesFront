import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/Navbar/Navbar";
import style from "./Faenas.module.scss";
import LargeButton from "../../Components/Buttons/Button_Large/Button_Large";
import { getAllFaenasConSaldo} from "../../Redux/Actions/Actions.js"
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardSmallFaenas from "../../Components/Cards/Card_Small_faenas/Card_Small";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


export default function Faenas(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllFaenasConSaldo())
    }, [dispatch])

    const faenas = useSelector((state)=>state.AllFaenasConSaldo)

    const navigate = useNavigate();

    faenas.sort(function(a,b){
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
                    <h1 className={style.titleP}>Faenas pendientes</h1>
                </div>
                <div className={style.titles}>
                    <div className={style.title1}><b>Fecha</b></div>
                    <div className={style.title2}><b>Frigorífico</b></div>
                    <div className={style.title3}><b>Tropa</b></div>
                    <div className={style.title4}><b>Saldo($)</b></div>
                </div>
                <div className={style.cardsCont}>
                    {faenas[0]!=="sin datos"?
                            faenas.map((a,i)=>{
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
                        
                        
                    }): 
                        <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'200px' }}>
                            <CircularProgress />
                        </Box>
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
                                title={"Pagos - Frigorifico1"}
                                onClick={()=>navigate("/Faenas/DetallePagos/Frigorifico1")}
                            ></LargeButton>
                        </div>
                        <div className={style.buttonLarge}>
                            <LargeButton
                                title={"Pagos - Frigorifico2"}
                                onClick={()=>navigate("/Faenas/DetallePagos/Frigorifico2")}
                            ></LargeButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}