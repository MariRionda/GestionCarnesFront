import React from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../Components/Navbar/Navbar";
import CardSmall from "../../Components/Cards/Card_Small/Card_Small";
import styleF from "./Faenas.module.scss";
import LargeButton from "../../Components/Buttons/Button_Large/Button_Large";
import ButtonPago from "../../Components/Buttons/Button_Pago/Button_Pago";

const data = require("../../Components/Details/data.json")

export default function Faenas(){

    const navigate = useNavigate();

    return(
        <div className={styleF.ConteinerCompras}>
            <NavBar
            title={"Faenas"}
            />
            <div>
                <div className={styleF.contTitle}>
                    <h1 className={styleF.titleP}>Pendientes</h1>
                </div>
                <div className={styleF.title}>
                    <div><b>Fecha</b></div>
                    <div><b>|</b></div>
                    <div><b>Frigorífico</b></div>
                    <div><b>|</b></div>
                    <div><b>Saldo($)</b></div>
                </div>
                <div className={styleF.cardsCont}>
                    {data.faena.map((a)=>{
                        return(
                            <CardSmall
                                id={a.ID_Faena}
                                fecha={a.Fecha}
                                otro={a.Frigorifico}
                                monto={a.Saldo}
                                tipo={"Faenas"}
                                pago={true}
                                nav={"Form_Pago_Faena"}
                            />
                        )
                    })
                    }
                </div>
                <div className={styleF.buttonLarge}>
                    <LargeButton
                        title={"Historial de Faenas"}
                        onClick={()=>navigate("/Historial_Faena")}
                    ></LargeButton>
                </div>
            </div>
        </div>
    )
}