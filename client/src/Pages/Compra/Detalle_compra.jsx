import React, { useEffect } from "react"
import swal from "sweetalert"
import NavBar from "../../Components/Navbar/Navbar"
import { useParams, useNavigate } from "react-router"
import TableCompra from "../../Components/Details/Detalle_Compra"
import StyleDetalleCompra from './StyleDetalleCompras.module.scss'
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew"
import LargeButton from "../../Components/Buttons/Button_Large/Button_Large"
import { useDispatch, useSelector } from "react-redux"
import { deleteCompraById, getComrpaByID, getProveedorByName, putSaldoProveedor } from "../../Redux/Actions/Actions"


export default function Detalle_Compra(){

    const dispatch = useDispatch()
    const {id}=useParams()
    const navigate = useNavigate()
console.log(id)
    useEffect(() => {
        dispatch(getComrpaByID(id))
    }, [dispatch])
    const compra = useSelector((state)=>state.CompraByID)
    useEffect(() => {
        dispatch(getProveedorByName(compra.proveedor))
    }, [dispatch])
    const proveedor = useSelector((state)=>state.provByNombre)
console.log(compra)
    const deleteCompra = ()=>{
        swal({
            title: "Está seguro que desea eliminar la compra",
            text: "Una vez eliminada perdera todos sus datos 😰",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                swal('Escriba "eliminar compra" para confirmar:', {
                    content: "input",
                    })
                    .then((value) => {
                    if(value==="eliminar compra"){
                        swal("Se eliminó la compra", {
                            icon: "success",
                        })
                    let saldo= proveedor.saldo - compra.saldo
                    dispatch(putSaldoProveedor(proveedor.id, saldo))
                    dispatch(deleteCompraById(id))
                    navigate('/Compras')
                    }
                    else {
                        swal("Frase incorrecta, no se eliminó la compra");
                    }
                });
            } else {
                swal("No se eliminó la compra");
                }
        })
        
    }

    return(
        <div className={StyleDetalleCompra.ConteinerCompras}>
            <NavBar
                title={"Detalle"}
            />
            <div className={StyleDetalleCompra.page}>
                <div className={StyleDetalleCompra.buttonDelete}>
                    <ButtonNew
                        style={"delete"}
                        icon={"delete"}
                        onClick={deleteCompra}
                    />
                </div>
                <div className={StyleDetalleCompra.TableCompras}>
                    <TableCompra
                        id_c={id}
                    />
                </div>

            </div>
            <LargeButton
                    title={"Detalle de Grupos"}
                    onClick={()=>navigate(`/DetalleGrupos/${id}`)}
                />
        </div>

    )
}
