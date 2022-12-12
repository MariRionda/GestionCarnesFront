import React, { useEffect, useState } from "react"
import NavBar from "../../Components/Navbar/Navbar"
import CardLarge from "../../Components/Cards/Card_Large/Card_Large"
import style from "./Ventas.module.scss";
import { filtrarVentas, getAllVentas } from "../../Redux/Actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createTheme, TextField, ThemeProvider } from "@mui/material";



export default function Historial_Ventas(){

    const AllVentas= useSelector((state)=>(state.AllVentas))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [filter,setFilter] = useState("")

    useEffect(() => {
        dispatch(getAllVentas())
    }, [dispatch])

    const filtrado = (e) =>{
        e.preventDefault()
        setFilter(e.target.value)
        dispatch(filtrarVentas(filter,AllVentas))
        if(e.target.value=="")dispatch(getAllVentas())
    }

    const outerTheme = createTheme({
        palette: {
        primary: {
        main: 'rgb(255, 159, 0)',
    }
}
})

    return(
        <div className={style.ConteinerVenta}>
            <NavBar
            title={"Hist. Ventas"}
            />
            <div  className={style.search}>
                <ThemeProvider theme={outerTheme}>
                    <TextField value={filter} focused="true"  placeholder="ingrese nombre🔎"  onChange={filtrado}/>
                </ThemeProvider>
            </div>
            <div>
                <div className={style.title}>
                    <div><b>Fecha</b></div>
                    <div><b>|</b></div>
                    <div><b>Cliente</b></div>
                    <div><b>|</b></div>
                    <div><b>Cant</b></div>
                    <div><b>|</b></div>
                    <div><b>kg</b></div>
                    <div><b>|</b></div>
                    <div><b>Monto($)</b></div>
                </div>
                <div className={style.cardsCont}>
                    {AllVentas.map((a, i)=>{
                        return(
                            <CardLarge
                                key={i}
                                id={a.id}
                                fecha={a.fecha}
                                para={a.cliente.slice(0,15)}
                                cant={a.cant}
                                kg={a.kg}
                                total={a.total}
                                tipo={"Ventas"}
                            />
                        )
                    })
                    }
                </div>
            </div>
        </div>
    )
}