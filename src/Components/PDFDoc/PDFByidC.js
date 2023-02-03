import React from "react";
import {Page, Text, View, Document, PDFViewer, Image} from '@react-pdf/renderer';
import {Table, TableHeader, TableCell, TableBody, DataTableCell} from 'react-pdf-table-fork'

export default function DocPDFbyidC({pagosAnteriores, pago, compra, nombre, array }){
    
    let pagos = [...pagosAnteriores, ...pago]
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
                <Document>
                    <Page size='A4'>
                        <View>
                            <View style={{width:"100%"}}>
                                <Image src="https://res.cloudinary.com/dk2al2urj/image/upload/v1675458253/MyPortfolio/pdf_membrete_ohrlms.jpg"/>
                            </View>
                            <View style={{margin:"4vh", marginTop:0}}>
                                <View>
                                    <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica", marginBottom:"2vh"}}>Fecha de emisión: {fecha}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize:"2vh", textAlign:"center", textDecoration:'underline', fontFamily:"Helvetica-Bold"}}>Detalle de Pago</Text>
                                </View>
                                <View style={{marginTop:"2vh", marginBottom:"2vh"}}>
                                    <Text style={datosCliente}>A continuacion se detalla el pago realizado por Carnes Don Alberto al proveedor {nombre}: </Text>
                                </View>
                                {pagos.length>0?
                                <View>
                                    <Text style={titlePagos}>Pagos:</Text>
                                    <Table data = {pagos}>
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
                                </View>
                                :<View></View>}
                                {/* <Text style={titlePagos}>Pago actual:</Text>
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
                                </Table> */}
                                <View style={{marginTop:"2.5vh", marginBottom:"0.5vh"}}>
                                    <Text style={datosClienteBold}>Detalle de la Compra:</Text>
                                </View>
                                <Table data = {array}>
                                    <TableHeader includeBottomBorder={false}
                                                includeLeftBorder={false}
                                                includeRightBorder={false}
                                                includeTopBorder={false}>
                                        <TableCell style={border}><Text style={tableTitle}>categoría</Text></TableCell>
                                        <TableCell style={border}><Text style={tableTitle}>cantidad</Text></TableCell> 
                                        <TableCell style={border}><Text style={tableTitle}>kgv netos</Text></TableCell>
                                        <TableCell style={border}><Text style={tableTitle}>$/kgv netos</Text></TableCell>
                                        <TableCell style={border}><Text style={{fontSize:"1.5vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica-Bold", textAlign:"right"}}>Subtotal</Text></TableCell>
                                    </TableHeader>
                                    <TableBody  includeBottomBorder={false}
                                                includeLeftBorder={false}
                                                includeRightBorder={false}
                                                includeTopBorder={false}>
                                        <DataTableCell getContent={(e)=>e.categoria} style={tableText}/>
                                        <DataTableCell getContent={(e)=>e.cant} style={tableText}/>
                                        <DataTableCell getContent={(e)=>e.kgv_netos} style={tableText}/>
                                        <DataTableCell getContent={(e)=>currencyFormatter({
                                                                            currency: "USD",
                                                                            value : e.precio_kgv_netos
                                                                        })} style={tableText}/>
                                        <DataTableCell getContent={(e)=>currencyFormatter({
                                                                            currency: "USD",
                                                                            value : e.precio_kgv_netos*e.kgv_netos
                                                                        })} style={{fontSize:"1.5vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica", textAlign:"right"}}/>
                                    </TableBody>
                                </Table>
                                <View style={{marginTop:"3vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                    <Text style={datosClienteBold}>Total:   {currencyFormatter({
                                                                            currency: "USD",
                                                                            value : compra.costo_total_hac
                                                                        })}</Text>
                                </View>
                                <View style={{marginTop:"0.1vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                    <Text style={datosClienteBold}>Total Pagado:   {currencyFormatter({
                                                                            currency: "USD",
                                                                            value : (compra.costo_total_hac-compra.saldo)
                                                                        })}</Text>
                                </View>
                                <View style={{marginTop:"0.1vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                    <Text style={datosClienteBold}>Saldo:   {currencyFormatter({
                                                                            currency: "USD",
                                                                            value : compra.saldo
                                                                        })}</Text>
                                </View>
                                <View style={{marginTop:"0.1vh", marginBottom:"0.1vh"}}>
                                    <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica", marginTop:"10vh"}}>Firma</Text>
                                </View>
                            </View>
                        </View>
                    </Page>
                </Document>       
        )
}