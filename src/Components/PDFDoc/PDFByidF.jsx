import React from "react";
import {Page, Text, View, Document, Image} from '@react-pdf/renderer';
import {Table, TableHeader, TableCell, TableBody, DataTableCell} from 'react-pdf-table-fork'

export default function DocPDFByidF({pagosAnteriores, pago, faena, nombre}){

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
                                <Text style={datosCliente}>A continuacion se detalla el pago hecho por Carnes Don Alberto al frigorífico {nombre}: </Text>
                            </View>
                            {pagosAnteriores.length>0?
                            <View>
                            <Text style={titlePagos}>Pagos anteriores:</Text>
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
                                    <DataTableCell getContent={(e)=>e.fecha} style={tableText} weighting={0.4}/>
                                    <DataTableCell getContent={(e)=>e.formaDePago} style={tableText}/>
                                    <DataTableCell getContent={(e)=>currencyFormatter({
                                                                        currency: "USD",
                                                                        value : e.monto
                                                                    })} style={tableText}/>
                                </TableBody>
                            </Table>
                            </View>
                            :<View></View>}
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
                            <View style={{marginTop:"2.5vh", marginBottom:"0.5vh"}}>
                                <Text style={datosClienteBold}>Detalle de la Faena:</Text>
                            </View>
                            <Table data = {faena.detalle}>
                                <TableHeader includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <TableCell style={border}><Text style={tableTitle}>Correlativo</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>Categoría</Text></TableCell>  
                                    <TableCell style={border}><Text style={tableTitle}>kg</Text></TableCell>
                                </TableHeader>
                                <TableBody  includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <DataTableCell getContent={(e)=>e.correlativo} style={tableText}/>
                                    <DataTableCell getContent={(e)=>e.categoria} style={tableText}/>
                                    <DataTableCell getContent={(e)=>e.kg} style={tableText}/>
                                </TableBody>
                            </Table>
                            <View style={{marginTop:"3vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                <Text style={datosCliente}>Costo de Faena/kg:   {currencyFormatter({
                                                                        currency: "USD",
                                                                        value : faena.costo_faena_kg
                                                                    })}</Text>
                            </View>
                            <View style={{marginTop:"0.1vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                <Text style={datosCliente}>kg totales:   {currencyFormatter({
                                                                        currency: "USD",
                                                                        value : faena.total_kg
                                                                    })}</Text>
                            </View>
                            <View style={{marginTop:"3vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                <Text style={datosClienteBold}>Total:   {currencyFormatter({
                                                                        currency: "USD",
                                                                        value : faena.costo_total
                                                                    })}</Text>
                            </View>
                            <View style={{marginTop:"0.1vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                <Text style={datosClienteBold}>Total Pagado:   {currencyFormatter({
                                                                        currency: "USD",
                                                                        value : (faena.costo_total-faena.saldo)
                                                                    })}</Text>
                            </View>
                            <View style={{marginTop:"0.1vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                <Text style={datosClienteBold}>Saldo:   {currencyFormatter({
                                                                        currency: "USD",
                                                                        value : faena.saldo
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