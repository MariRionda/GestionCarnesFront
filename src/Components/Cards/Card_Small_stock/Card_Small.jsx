import React from "react";
import {useNavigate} from 'react-router-dom';
import styleCS from "./Card_Small.module.scss";

const CardSmallStock = ({ id, fecha, frigorifico, tropa, tipo}) => {

    let fechaActual= Date.now()

    const navigate = useNavigate()
    let fechaFormat = (new Date(fecha*1)).toLocaleDateString('es').replaceAll("/", "-")
    return (
        <div className={styleCS.totalCard}>
            <div className={styleCS.cont} onClick={()=>navigate(`/${tipo}/${tropa}`)}>
                <div className={styleCS.items}><p>{fechaFormat}</p></div>
                <div className={styleCS.items}><p>|</p></div>
                <div className={styleCS.items}><p>{Math.ceil((fechaActual-fecha)/(3600*1000*24))}</p></div>
                <div className={styleCS.items}><p>|</p></div>
                <div className={styleCS.items}><p>{frigorifico}</p></div>
                <div className={styleCS.items}><p>|</p></div>
                <div className={styleCS.items}><p>{tropa}</p></div>
            </div>
        </div>
    );
};
export default CardSmallStock;