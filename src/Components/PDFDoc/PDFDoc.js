import React from "react";
import {Page, Text, View, Document, Image} from '@react-pdf/renderer';
import {Table, TableHeader,TableCell, TableBody, DataTableCell} from 'react-pdf-table-fork'

export default function DocPDF({pagosT, person, name}){

    let fecha = new Date().toLocaleDateString('es').replaceAll("/", "-")

    function currencyFormatter({ currency, value}) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency
        }) 
        return formatter.format(value)
    }
    pagosT.map(a=> a.newMonto = currencyFormatter({
                                currency: "USD",
                                value : a.monto
                                }))

        
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
    const datosPerson = {
        fontSize:"1.5vh",
        margin:"0.5vh"

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
                            <Text style={{fontSize:"1.5vh", textAlign:"right", fontFamily:"Helvetica"}}>{fecha}</Text>
                        </View>
                        <View>
                            <Text style={{fontSize:"1.8vh", textAlign:"center", textDecoration:'underline', fontFamily:"Helvetica-Bold"}}>Detalle de Pagos</Text>
                        </View>
                        <View style={{marginTop:"2vh", marginBottom:"2vh"}}>
                            <Text style={datosPerson}>{name}: {person.nombre}</Text>
                            <Text style={datosPerson}>Cuil: {person.cuil}</Text>
                            {person.telefono? <Text style={datosPerson}>Teléfono: {person.telefono}</Text>:<null/>}
                            {person.email? <Text style={datosPerson}>E-mail: {person.email}</Text>:<null/>}
                            {person.direccion? <Text style={datosPerson}>Dirección: {person.direccion}</Text>:<null/>}
                        </View>
                        <Table data = {pagosT}>
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
                                            <DataTableCell getContent={(e)=>e.newMonto} style={tableText}/>
                            </TableBody>
                        </Table>
                    </View>
                </View>
            </Page>
        </Document>
    )
}