import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteClienteById, getAllClientes, getClienteByID, getVentasAchurasByCliente, getVentasByCliente } from "../../Redux/Actions/Actions";
import NavBar from "../../Components/Navbar/Navbar";
import CardLarge from "../../Components/Cards/Card_Large/Card_Large";
import styleCl from "./Clientes.module.scss";
import LargeButton from "../../Components/Buttons/Button_Large/Button_Large";
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew";
import Table_Cliente from "../../Components/Details/Table_Cliente";


export default function Detalle_Cliente(){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id}=useParams()

    useEffect(() => {
        dispatch(getClienteByID(id))
    }, [dispatch])

    const ClienteById = useSelector((state)=>(state.ClienteById))

    useEffect(() => {
        if(ClienteById)dispatch(getVentasByCliente(ClienteById.nombre))
        if(ClienteById)dispatch(getVentasAchurasByCliente(ClienteById.nombre))
    }, [ClienteById])

    const AllVentasByCliente = useSelector((state)=>state.AllVentasByCliente)
    const VentasPendientes = AllVentasByCliente.filter((a)=>a.cliente===ClienteById.nombre && a.saldo>0)
    const AllVentasAchurasByCliente = useSelector((state)=>state.AllVentasAchurasByCliente)
    const VentasAchurasPendientes = AllVentasAchurasByCliente.filter((a)=>a.clien===ClienteById.nombre && a.saldo>0)


    const deleteCliente = ()=>{
        swal({
            title: "Está seguro que desea eliminar a "+ ClienteById.nombre,
            text: "Una vez eliminado perdera todos sus datos 😰",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                swal('Escriba "eliminar cliente" para confirmar:', {
                    content: "input",
                    })
                    .then((value) => {
                    if(value==="eliminar cliente"){
                        swal("Se eliminó a "+ ClienteById.nombre, {
                            icon: "success",
                        })
                    dispatch(deleteClienteById(id))
                    dispatch(getAllClientes())
                    navigate('/Clientes')
                    }
                    else {
                        swal("Frase incorrecta, no se eliminó a "+ ClienteById.nombre);
                    }
                });
            } else {
                swal("No se eliminó a "+ ClienteById.nombre);
                }
        })

        
    }

    return(
        <div className={styleCl.ConteinerClientes}>
            <NavBar
                title={"Detalle del Cliente"}
            />
            <div className={styleCl.page}>
                <div className={styleCl.buttonEdit}>
                    <ButtonNew
                        style={"edit"}
                        icon={"edit"}
                        onClick={()=>navigate(`/Clientes/Form/${id}`)}
                    />
                </div>
                <div className={styleCl.buttonDelete}>
                    <ButtonNew
                        style={"delete"}
                        icon={"delete"}
                        onClick={deleteCliente}
                    />
                </div>
                <div className={styleCl.tablecliente}>
                <Table_Cliente
                email={ClienteById.email}
                nombre={ClienteById.nombre}
                telefono={ClienteById.telefono}
                direccion={ClienteById.direccion}
                cuil={ClienteById.cuil}
                />
                </div>
                <div className={styleCl.cont}>
                    <div className={styleCl.contTitle}><h1 className={styleCl.titleP}>Pendientes</h1></div>
                    <div className={styleCl.title}>
                        <div><b>Fecha</b></div>
                        <div><b>|</b></div>
                        <div><b>Cliente</b></div>
                        <div><b>|</b></div>
                        <div><b>Cant</b></div>
                        <div><b>|</b></div>
                        <div><b>kg</b></div>
                        <div><b>|</b></div>
                        <div><b>Saldo($)</b></div>
                    </div>
                    <div className={styleCl.cardsCont}>
                        {VentasPendientes.map((a,i)=>{
                            return(
                                <CardLarge
                                    id={a.id}
                                    key={i}
                                    fecha={a.fecha}
                                    para={a.cliente}
                                    cant={a.cant}
                                    kg={a.kg_total}
                                    monto={a.saldo.toFixed(2)}
                                    tipo={"Ventas"}
                                    pago={true}
                                    bstyle={"new"}
                                    bicon={"new"}
                                    bonClick={()=>navigate(`/Clientes/FormPagoVC/${a.id}`)}
                                />
                            )
                        })
                        }
                        {VentasAchurasPendientes.map((a,i)=>{
                            return(
                                <CardLarge
                                    id={a.id}
                                    key={i}
                                    fecha={a.fecha}
                                    para={a.clien}
                                    cant={a.cantidad}
                                    kg={"achuras"}
                                    monto={a.saldo.toFixed(2)}
                                    tipo={"Ventas/Achuras"}
                                    pago={true}
                                    bstyle={"new"}
                                    bicon={"new"}
                                    bonClick={()=>navigate(`/Clientes/FormPagoVAch/${a.id}`)}
                                />
                            )
                        })
                        }
                    </div>
                    <div className={styleCl.buttonLarge}>
                        <LargeButton
                            title={"Historial de Ventas"}
                            onClick={()=>navigate(`/Clientes/HistorialVentas/${id}`)}
                        ></LargeButton>
                    </div>
                    <div className={styleCl.buttonLarge}>
                        <LargeButton
                            title={"Detalle de Pagos"}
                            onClick={()=>navigate(`/Clientes/DetallePagos/${ClienteById.nombre}`)}
                        ></LargeButton>
                    </div>
                </div>
            </div>
        </div>
    )
}