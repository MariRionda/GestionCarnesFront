import React from "react";
import {Page, Text, View, Document, Image} from '@react-pdf/renderer';
import {Table, TableHeader,TableCell, TableBody, DataTableCell} from 'react-pdf-table-fork';

export default function DocPDFDetalleC({transaccion,transaccionName, person, name, array, cant}){

    let fecha = new Date().toLocaleDateString('es').replaceAll("/", "-")

    array = array?array:[]

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
    }

    let fechaFormat = (new Date(transaccion.fecha*1)).toLocaleDateString('es').replaceAll("/", "-")
        
    const tableText = {
        margin:"0.5vh",
        borderColor:"white",
        fontSize:"1.25vh",

    };
    const tableTitle = {
        fontSize:"1.25vh",
        margin:"0.5vh",
        borderColor:"white",
        fontFamily:"Helvetica-Bold"
    };
    const border={
        borderColor:"white"
    };
    const datosPerson = {
        fontSize:"1.4vh",
        margin:"0.5vh"

    }
    const datosClienteBold = {
        fontSize:"1.4vh",
        margin:"0.5vh",
        fontFamily:"Helvetica-Bold"
    }

    return(
        <Document>
            <Page size='A4'>
                <View>
                    <View style={{width:"100%"}}>
                        <Image src='https://res.cloudinary.com/dk2al2urj/image/upload/v1675458253/MyPortfolio/pdf_membrete_ohrlms.jpg'/>
                    </View>
                    <View style={{margin:"4vh", marginTop:0}}>
                        <View>
                            <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica"}}>Fecha de emisión: {fecha}</Text>
                        </View>
                        <View>
                            <Text style={{fontSize:"1.8vh", textAlign:"center", textDecoration:'underline', fontFamily:"Helvetica-Bold"}}>Detalle de {transaccionName}</Text>
                        </View>
                        <View style={{marginTop:"2vh", marginBottom:"0.2vh"}}>
                            <Text style={datosPerson}>Fecha: {fechaFormat}</Text>
                        </View>
                        <View style={{marginTop:"0.2vh", marginBottom:"0.2vh"}}>
                            <Text style={datosPerson}>{name}: {person}</Text>
                        </View>
                        {array.length && name=="Proveedor" && array[0].desbaste>0?
                        <View>
                            <View style={{marginTop:"0.2vh", marginBottom:"2vh"}}>
                                <Text style={datosPerson}>Cantidad de animales: {cant}</Text>
                            </View>
                            <Table data = {array}>
                                <TableHeader includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <TableCell style={border}><Text style={tableTitle}>Categoría</Text></TableCell>
                                    <TableCell style={border} weighting={0.4}><Text style={tableTitle}>Cant</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>kgv Brutos</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>Desbaste</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>kgv Netos</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>$/kgv Netos</Text></TableCell>
                                    <TableCell style={border}><Text style={{fontSize:"1.25vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica-Bold", textAlign:"right"}}>Subtotal</Text></TableCell>
                                </TableHeader>
                                <TableBody  includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <DataTableCell getContent={(e)=>e.categoria} style={tableText}/>
                                    <DataTableCell getContent={(e)=>e.cant} style={tableText} weighting={0.4}/>
                                    <DataTableCell getContent={(e)=>(e.kgv_brutos*1).toFixed(2)} style={tableText}/>
                                    <DataTableCell getContent={(e)=>e.desbaste} style={tableText}/>
                                    <DataTableCell getContent={(e)=>(e.kgv_netos*1).toFixed(2)} style={tableText}/>
                                    <DataTableCell getContent={(e)=>currencyFormatter({
                                                                        currency: "USD",
                                                                        value : e.precio_kgv_netos
                                                                    })} style={tableText}/>
                                    <DataTableCell getContent={(e)=>currencyFormatter({
                                                                        currency: "USD",
                                                                        value : (e.precio_kgv_netos*e.kgv_netos)
                                                                    })} style={{fontSize:"1.25vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica", textAlign:"right"}}/>
                                </TableBody>
                            </Table>
                            <View style={{marginTop:"3vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                <Text style={datosClienteBold}>Total:   {currencyFormatter({
                                                                        currency: "USD",
                                                                        value : transaccion.costo_total_hac
                                                                    })}</Text>
                            </View>
                            <View style={{marginTop:"0.1vh", marginBottom:"0.1vh"}}>
                                <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica", marginTop:"10vh"}}>Carnes Don Alberto</Text>
                            </View>
                        </View>
                        :
                        <View>
                            <View style={{marginTop:"0.2vh", marginBottom:"0.2vh"}}>
                                <Text style={datosPerson}>Cliente: Gastón Rodriguez</Text>
                            </View>
                            <View style={{marginTop:"0.2vh", marginBottom:"2vh"}}>
                                <Text style={datosPerson}>Cantidad de animales: {cant}</Text>
                            </View>
                            <Table data = {array}>
                                <TableHeader includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <TableCell style={border}><Text style={tableTitle}>Categoría</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>Cant</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>kgv Netos</Text></TableCell>
                                    <TableCell style={border}><Text style={tableTitle}>$/kgv Netos</Text></TableCell>
                                    <TableCell style={border}><Text style={{fontSize:"1.25vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica-Bold", textAlign:"right"}}>Subtotal</Text></TableCell>
                                </TableHeader>
                                <TableBody  includeBottomBorder={false}
                                            includeLeftBorder={false}
                                            includeRightBorder={false}
                                            includeTopBorder={false}>
                                    <DataTableCell getContent={(e)=>e.categoria} style={tableText}/>
                                    <DataTableCell getContent={(e)=>e.cant} style={tableText}/>
                                    <DataTableCell getContent={(e)=>(e.kgv_netos*1).toFixed(2)} style={tableText}/>
                                    <DataTableCell getContent={(e)=>currencyFormatter({
                                                                        currency: "USD",
                                                                        value : e.precio_kgv_netos
                                                                    })} style={tableText}/>
                                    <DataTableCell getContent={(e)=>currencyFormatter({
                                                                        currency: "USD",
                                                                        value : (e.precio_kgv_netos*e.kgv_netos)
                                                                    })} style={{fontSize:"1.25vh", margin:"0.5vh", borderColor:"white", fontFamily:"Helvetica", textAlign:"right"}}/>
                                </TableBody>
                            </Table>
                            <View style={{marginTop:"3vh", marginBottom:"0.1vh", textAlign:"right"}}>
                                <Text style={datosClienteBold}>Total:   {currencyFormatter({
                                                                        currency: "USD",
                                                                        value : transaccion.costo_total_hac
                                                                    })}</Text>
                            </View>
                            <View style={{marginTop:"0.1vh", marginBottom:"0.1vh"}}>
                                <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica", marginTop:"10vh"}}>Firma</Text>
                            </View>
                        </View>
                        }
                    </View>
                </View>
            </Page>
        </Document>
    )
}