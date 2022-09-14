import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";

import NavBar from '../../Components/Navbar/Navbar'

import stylePagoF from './Form_pago.module.scss';

const formPF = {
    fecha: '',
    monto: ''
};

//validaciones
export const validate = (pago) => {
    let error = {};

    if (!pago.fecha) error.fecha = "Falta fecha";
    else if (!/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/.test(pago.fecha)) error.fecha = "Fecha incorrecta";
    if (!pago.monto) error.monto = "Falta monto";
    else if (!/^([0-9])*$/.test(pago.monto)) error.monto = "Monto debe ser un número";
    return error;
};

const Form_Pago_Faena = () => {

    const {id}=useParams()

    const dispatch = useDispatch();
    const navigate = useNavigate();

    

    const [form, setForm] = useState(formPF);
    const [error, setError] = useState({});

    const handleChange = (e) => {
        setError(
        validate({
            ...form,
            [e.target.name]: e.target.value,
        })
        );
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if(
        !error.fecha && form.fecha &&
        !error.monto && form.monto
        ){
        // dispatch(postFaena(form))
        alert( "Pago agregado correctamente");
        setForm(formPF);
        }
        else {
        alert( "Datos incorrectos, porfavor intente nuevamente")
        }
    };

    const handleCreate = () => {
        navigate("/Faenas")
    };

    return (
        <div className={stylePagoF.wallpaper}>
            <NavBar
            title={"Nuevo Pago"}
            />
            <div className={stylePagoF.formContainer}>
                <div className={stylePagoF.detallePro}>
                    <div className={stylePagoF.detalledivs}>
                        <h5 className={stylePagoF.title}>Tropa: </h5>
                        <h4 className={stylePagoF.nameP}>{id}</h4>
                    </div>
                    <div className={stylePagoF.detalledivs}>
                        <h5 className={stylePagoF.title}>Saldo: </h5>
                        <h4 className={stylePagoF.nameP}>"Saldo"</h4>
                    </div>
                </div>
                <form className={stylePagoF.form}>
                    <div className={stylePagoF.formItem}>
                        <h5 className={stylePagoF.title}>Fecha: </h5>
                        <input
                            type="text"
                            value={form.fecha}
                            id="fecha"
                            name="fecha"
                            onChange={handleChange}
                            placeholder="00-00-0000"
                            className={error.monto & 'danger'}
                        />
                    </div>
                    <p className={error.monto ? stylePagoF.danger : stylePagoF.pass}>{error.monto}</p>
                    <div className={stylePagoF.formItem}>
                        <h5 className={stylePagoF.title}>Monto: </h5>
                        <input
                            type="text"
                            value={form.monto}
                            id="monto"
                            name="monto"
                            onChange={handleChange}
                            placeholder="0.00"
                            className={error.monto & 'danger'}
                        />
                    </div>
                    <p className={error.monto ? stylePagoF.danger : stylePagoF.pass}>{error.monto}</p>                    
                    <div className={stylePagoF.buttons}>
                        <ShortButton
                            title="📃Generar Factura"
                            onClick={handleCreate}
                            color="primary"
                        />
                        <ShortButton
                            title="✔ Confirmar"
                            onClick={handleSubmit}
                            color="green"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form_Pago_Faena;