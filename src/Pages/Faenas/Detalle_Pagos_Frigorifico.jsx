import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import NavBar from "../../Components/Navbar/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { deletePagoFaenaById, getAllFaenas, getPagosFaenasByFrigorifico, putSaldoFaena } from "../../Redux/Actions/Actions"
import style from './Faenas.module.scss'
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew"
import swal from "sweetalert"
import LargeButton from "../../Components/Buttons/Button_Large/Button_Large";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Detalle_Pagos_Frigorifico() {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {nombre}=useParams()

    useEffect(() => {
        dispatch(getPagosFaenasByFrigorifico(nombre))
        dispatch(getAllFaenas())
    }, [dispatch])

    const pagos = useSelector((state)=>state.pagosByFrigorifico)
    const faenas = useSelector((state)=>state.AllFaenas)
    
    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
    }
    let monto
    let faena = {}

    const deletePago = (pago)=>{
        swal({
            title: "¿Está seguro que desea eliminar el pago?",
            text: "Una vez eliminada perdera todos sus datos 😰",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                swal('Escriba "eliminar pago" para confirmar:', {
                    content: "input",
                    })
                    .then((value) => {
                    if(value==="eliminar pago"){
                        let faena = faenas?.find(a=>a.tropa==pago.faenaID)
                        let saldo = faena.saldo*1 + pago.monto*1
                        dispatch(putSaldoFaena(pago.faenaID, saldo))
                        dispatch(deletePagoFaenaById(pago))
                        swal("Se eliminó el pago", {
                            icon: "success",
                        })
                        dispatch(getPagosFaenasByFrigorifico(nombre))
                        dispatch(getAllFaenas())
                    }
                    else {
                        swal("Frase incorrecta, no se eliminó la faena");
                    }
                });
            } else {
                swal("No se eliminó la faena");
                }
        })
        
    }

    return(
        <div className={style.ConteinerFaenas} id={style.ConteinerCenter}>
            <NavBar
                title={`Pagos de ${nombre}`}
            />
            {pagos.length>0 && pagos[0]=="sin datos"?
            <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'200px' }}>
                <CircularProgress />
            </Box>
            :pagos.length>0?
            <div>
                <div className={style.tablefaena}>
                    <table className="table">
                        <tbody>
                            <tr className="table-dark" align="center">
                                <td>Tropa</td>
                                <td>Fecha</td>  
                                <td>Forma de Pago</td>
                                <td>Monto</td>
                                <td>Comp.</td>
                                <td>Recibo</td>
                                <td>Elim</td>                            
                            </tr>
                            {pagos.length!==0 && faenas.length!==0?pagos.map((e,i) => {
                                faena=faenas.find(a=>a.tropa==e.faenaID)
                                return(
                                    <tr key={i} className="table-primary" align="center">
                                        <td>{faena?faena.tropa:"No existe"}</td> 
                                        <td>{(new Date(e.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")}</td> 
                                        <td>{e.formaDePago}</td>
                                        <td align="center">{
                                            monto = currencyFormatter({
                                            currency: "USD",
                                            value : e.monto
                                            })
                                        }</td>
                                        {e.img_comp?
                                        <td ><a href={e.img_comp}>Link</a></td>
                                        : 
                                        <td> - </td>
                                        }
                                        <td ><a href={`/Faenas/DetallePagos/${nombre}/${e.id}/pdf`}>PDF</a></td>
                                        <td>
                                        <ButtonNew
                                            style={"delete"}
                                            icon={"delete"}
                                            onClick={() => {deletePago(e)}}
                                        /></td>                                    
                                    </tr>
                                )
                            }):null} 
                        </tbody>
                    </table>
                </div>
                <div className={style.buttonLarge}>
                    <LargeButton
                        title={"Generar PDF"}
                        onClick={()=>navigate(`/Faenas/DetallePagos/${nombre}/pdf`)}
                    ></LargeButton>
                </div>
            </div>
            :<div><h4 className={style.text}>No existen pagos para éste frigorífico</h4></div>            
            }      
        </div>
    )
}