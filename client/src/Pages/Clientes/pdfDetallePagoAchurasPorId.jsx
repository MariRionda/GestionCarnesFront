import React, {useEffect} from "react";
import {Page, Text, View, Document, PDFViewer, Image} from '@react-pdf/renderer';
import {Table, TableHeader, TableCell, TableBody, DataTableCell} from 'react-pdf-table-fork'
import { useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { getPagosVentaAchurasByCliente, getVentaAchurasByID} from "../../Redux/Actions/Actions"

export default function PdfDetallePagoPorIdCliente(){
    
    const dispatch = useDispatch()
    const {nombre, id}=useParams()

    useEffect(() => {
        dispatch(getPagosVentaAchurasByCliente(nombre))
    }, [nombre])

    let pago = []
    let pagosAnteriores = []

    const pagos = useSelector((state)=>state.pagosAchurasByCliente)
    pago = pagos!==[]?pagos.filter(a=>a.id==id):[]
    pagosAnteriores= pagos!==[]?pagos.filter(a=>(a.ventaID==pago[0].ventaID && a!==pago[0] )):[]
    
    useEffect(() => {
        if(pago.length!==0)dispatch(getVentaAchurasByID(pago[0].ventaID))
    },[pagos])

    let venta = useSelector((state)=>state.VentaAchuraByID)

    let fecha = new Date().toLocaleDateString('es').replaceAll("/", "-")

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
    }
    
    const tableText = {
        margin:"0.5vh",
        borderColor:"white"
    };
    const tableTitle = {
        fontSize:"1.5vh",
        margin:"0.5vh",
        borderColor:"white",
        fontFamily:"Helvetica-Bold"
    };
    const border={
        borderColor:"white"
    };
    const datosCliente = {
        fontSize:"1.5vh",
        margin:"0.5vh",
        fontFamily:"Helvetica"
    }
    const titlePagos = {
        fontSize:"1.5vh",
        margin:"0.5vh",
        marginTop:"1.5vh",
        fontFamily:"Helvetica-Bold"
    }
    const datosClienteBold = {
        fontSize:"1.5vh",
        margin:"0.5vh",
        fontFamily:"Helvetica-Bold"
    }


    return(        
        <PDFViewer style={{width:"100%", height: "95vh"}} >
            <Document>
                <Page size='A4'>
                    <View>
                        <View style={{width:"100%"}}>
                            <Image src="https://res.cloudinary.com/dc8ustv0k/image/upload/v1667830724/GestionApp/membrete_primera_opcion_neo3mh.png"/>
                        </View>
                        <View style={{margin:"4vh", marginTop:0}}>
                            <View>
                                <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica", marginBottom:"2vh"}}>Fecha de emisión: {fecha}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize:"2vh", textAlign:"center", textDecoration:'underline', fontFamily:"Helvetica-Bold"}}>Detalle de Pago</Text>
                            </View>
                            <View style={{marginTop:"2vh", marginBottom:"2vh"}}>
                                <Text style={datosCliente}>A continuacion se detalla el pago recibido por Carnes Don Alberto del cliente {nombre}: </Text>
                            </View>
                            {pagosAnteriores.length>0?
                            <View>
                                <Text style={titlePagos}>Otros pago:</Text>
                                <Table data = {pagosAnteriores}>
                                    <TableHeader includeBottomBorder={false}
                                                includeLeftBorder={false}
                                                includeRightBorder={false}
                                                includeTopBorder={false}>
                                        <TableCell style={border} weighting={0.4}><Text style={tableTitle}>Fecha</Text></TableCell>  
                                        <TableCell style={border}><Text style={tableTitle}>Forma de pago</Text></TableCell>
                                        <TableCell style={border}><Text style={tableTitle}>Monto</Text></TableCell>
                                    </TableHeader>
                                    <TableBody  includeBottomBorder={false}
                                                includeLeftBorder={false}
                                                includeRightBorder={false}
                                                includeTopBorder={false}>
                                        <DataTableCell getContent={(e)=>(new Date(e.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")} style={tableText} weighting={0.4}/>
                                        <DataTableCell getContent={(e)=>e.formaDePago} style={tableText}/>
                                        <DataTableCell getContent={(e)=>currencyFormatter({
                                                                            currency: "USD",
                                                                            value : e.monto
                                                                        })} style={tableText}/>
                                    </TableBody>
                                </Table>
                            </View>:<View></View>}
                            <Text style={titlePagos}>Pago actual:</Text>
                            <Table data = {pago}>
                                <TableHeader includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <TableCell style={border} weighting={0.4}><Text style={tableTitle}>Fecha</Text></TableCell>  
                                    <TableCell style={border}><Text style={tableTitle}>Forma de pago</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>Monto</Text></TableCell>
                                </TableHeader>
                                <TableBody  includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <DataTableCell getContent={(e)=>(new Date(e.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")} style={tableText} weighting={0.4}/>
                                    <DataTableCell getContent={(e)=>e.formaDePago} style={tableText}/>
                                    <DataTableCell getContent={(e)=>currencyFormatter({
                                                                        currency: "USD",
                                                                        value : e.monto
                                                                    })} style={tableText}/>
                                </TableBody>
                            </Table>
                            <View>
                            <View style={{marginTop:"2.5vh", marginBottom:"0.5vh"}}>
                                <Text style={datosClienteBold}>Detalle de la Venta:</Text>
                            </View>
                                <View>
                                    <Table data = {[venta]}>
                                        <TableHeader includeBottomBorder={false}
                                                    includeLeftBorder={false}
                                                    includeRightBorder={false}
                                                    includeTopBorder={false}>
                                            <TableCell style={border}><Text style={tableTitle}>Cantidad de Achuras</Text></TableCell>
                                            <TableCell style={border}><Text style={{fontSize:"1.5vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica-Bold"}}>Precio unitario</Text></TableCell>
                                        </TableHeader>
                                        <TableBody  includeBottomBorder={false}
                                                    includeLeftBorder={false}
                                                    includeRightBorder={false}
                                                    includeTopBorder={false}>
                                            <DataTableCell getContent={(e)=>e.cantidad} style={tableText}/>
                                            <DataTableCell getContent={(e)=>currencyFormatter({
                                                                                currency: "USD",
                                                                                value : e.precioUnitario
                                                                            })} style={{fontSize:"1.5vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica"}}/>
                                        </TableBody>
                                    </Table>
                                </View>                              
                                <View style={{marginTop:"3vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                    <Text style={datosClienteBold}>Total:   {currencyFormatter({
                                                                            currency: "USD",
                                                                            value : venta.total
                                                                        })}</Text>
                                </View>
                                <View style={{marginTop:"0.1vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                    <Text style={datosClienteBold}>Total Pagado:   {currencyFormatter({
                                                                            currency: "USD",
                                                                            value : (venta.total-venta.saldo)
                                                                        })}</Text>
                                </View>
                                <View style={{marginTop:"0.1vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                    <Text style={datosClienteBold}>Saldo:   {currencyFormatter({
                                                                            currency: "USD",
                                                                            value : venta.saldo
                                                                        })}</Text>
                                </View>
                                <View style={{marginTop:"0.1vh", marginBottom:"0.1vh"}}>
                                    <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica", marginTop:"10vh"}}>Carnes Don Alberto</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>        
    )
}