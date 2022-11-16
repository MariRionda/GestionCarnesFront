import React from "react";
import {useNavigate} from 'react-router-dom';
import styleCL from "./Card_Large.module.scss";
import ButtonNew from "../../Buttons/ButtonNew/ButtonNew";

const CardLarge = ({ id, fecha, para, cant, kg, monto, tipo, pago, bstyle, bicon, bonClick}) => {

    const navigate = useNavigate()

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
        }

    const totalEstenPesos = currencyFormatter({
        currency: "USD",
        value : monto
        })

    return (
        <div>
            <div className={styleCL.cont} onClick={()=>navigate(`/${tipo}/${id}`)}>
                <div className={styleCL.items}><p>{id}</p></div>
                <div className={styleCL.items}><p>|</p></div>
                <div className={styleCL.items}><p>{fecha}</p></div>
                <div className={styleCL.items}><p>|</p></div>
                <div className={styleCL.items}><p>{para}</p></div>
                <div className={styleCL.items}><p>|</p></div>
                <div className={styleCL.items}><p>{cant}</p></div>
                <div className={styleCL.items}><p>|</p></div>
                <div className={styleCL.items}><p>{kg}</p></div>
                <div className={styleCL.items}><p>|</p></div>
                <div className={styleCL.items}><p>{totalEstenPesos}</p></div>
            </div>
            {pago===true?
            <div className={styleCL.button_pago}>
                <ButtonNew
                    style={bstyle}
                    icon={bicon}
                    onClick={bonClick}
                />
            </div>
            : null
            }
        </div>
    );
};

export default CardLarge;