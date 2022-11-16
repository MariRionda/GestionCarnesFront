import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import NavBar from "../../Components/Navbar/Navbar";
import StyleNA from "./StyleNA.module.scss";
import {setlogin_state} from '../../Redux/Actions/Actions.js'
import LargeButton from "../../Components/Buttons/Button_Large/Button_Large";


export default function LogOut(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cerrarSesion = ()=>{
        dispatch(setlogin_state(false))
        localStorage.removeItem('login')
    }

    return(
        <div className={StyleNA.ConteinerLogOut}>
            <NavBar
            title={"Login status ✔ "}
            />
                <div className={StyleNA.ConteinerCompras}>

                </div>
                <div className={StyleNA.buttons}>
                    <div>
                        <LargeButton
                            title={"Ir a Home"}
                            onClick={()=>navigate("/home")}
                        ></LargeButton>
                    </div>
                    <div>    
                    <LargeButton
                        title={"Cerrar Sesión"}
                        onClick={cerrarSesion}
                    ></LargeButton>
                    </div>
                </div>
        </div>
        
      
    )
}