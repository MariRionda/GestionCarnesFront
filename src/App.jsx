import React from 'react';
import Balance from '../src/Pages/Balance/Balance.jsx';
import Compras from '../src/Pages/Compra/Compras.jsx';
import Detalle_Compra from '../src/Pages/Compra/Detalle_compra';
import Form_Compra from '../src/Pages/Compra/Form_compra';
import Historial_Compras from '../src/Pages/Compra/Historial_Compra';
import Clientes from '../src/Pages/Clientes/Clientes.jsx';
import Detalle_Cliente from '../src/Pages/Clientes/Detalle_Cliente';
import Historial_Ventas_Cliente from '../src/Pages/Clientes/Historial_Ventas_Cliente';
import Form_Cliente from '../src/Pages/Clientes/Form_Cliente';
import Detalle_Faena from '../src/Pages/Faenas/Detalle_Faena';
import Faenas from '../src/Pages/Faenas/Faenas.jsx';
import Form_Faena from '../src/Pages/Faenas/Form_Faena.jsx';
import Form_Pago_Faena from '../src/Pages/FormsPagos/Form_pago_faena';
import Form_Pago_Compra from '../src/Pages/FormsPagos/Form_pago_compra';
import Historial_Faena from '../src/Pages/Faenas/Hitorial_Faena';
import Home from '../src/Pages/Home/Home.jsx';
import Caja from '../src/Pages/Caja/caja.jsx';
import FormExtraccion from './Pages/Caja/form_extraccion.jsx';
import Reestablecer_Login from '../src/Pages/Login/Reestablecer_Login.jsx';
import Login from '../src/Pages/Login/Login.jsx';
import Detalle_Proveedor from '../src/Pages/Proveedores/Detalle_Proveedor';
import Form_Proveedor from '../src/Pages/Proveedores/Form_Proveedor.jsx';
import Historial_Compras_Proveedor from '../src/Pages/Proveedores/Historial_Compra_Prov.jsx';
import Proveedores from '../src/Pages/Proveedores/Proveedores.jsx';
import Detalle_Stock_Tropa from '../src/Pages/Stock/Detalle_Stock_Tropa.jsx';
import Stock from '../src/Pages/Stock/Stock.jsx';
import Ventas from '../src/Pages/Venta/Ventas.jsx';
import Historial_Ventas from './Pages/Venta/Historial_Ventas.jsx';
import Historial_Ventas_Achuras from './Pages/Venta/Historial_Ventas_Achuras.jsx';
import Detalle_Reses_Venta from '../src/Pages/Venta/Detalle_Reses_Venta.jsx';
import Detalle_Venta from '../src/Pages/Venta/Detalle_venta';
import Detalle_Venta_Achuras from '../src/Pages/Venta/Detalle_venta_achuras';
import Form_Pago_Venta from '../src/Pages/FormsPagos/Form_pago_venta';
import Form_Pago_Venta_Achuras from './Pages/FormsPagos/Form_Pago_Venta_Achuras.jsx';
import NoAccess from '../src/Pages/NoAcces/NoAcces'
import LogOut from './Pages/LogOut/LogOut.jsx';
import Form_Venta from '../src/Pages/Venta/Form_Venta.jsx';
import FormIngresoExtra from '../src/Pages/Caja/form_ingreso_extra.jsx'
import Form_Venta_Achuras from './Pages/Venta/Form_Venta_Achuras.jsx';
import Nueva_Venta from './Pages/Venta/Nueva_Venta.jsx';
import Detalle_Pagos_Clientes from './Pages/Clientes/Detalle_Pagos_Cliente.jsx';
import Detalle_Pagos_Clientes_Personalizado from './Pages/Clientes/Detalle_Pagos_Cliente_Personalizado.jsx'
import Detalle_Pagos_Proveedor from './Pages/Proveedores/Detalle_Pagos_Proveedor.jsx';
import Detalle_Pagos_Frigorifico from './Pages/Faenas/Detalle_Pagos_Frigorifico.jsx';
import DetalleGrupos from './Pages/Compra/DetalleGrupos.jsx';
import Detalle_Pagos_Extras from './Pages/Caja/Detalle_Pagos_Extras.jsx';
import Detalle_Ingresos_Extras from './Pages/Caja/Detalle_Ingresos_Extras.jsx';
import Form_Editar_Res from './Pages/Faenas/Editar_Res.jsx';
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import {login_state} from './Redux/Actions/Actions.js'
import PdfDetallePagosClientes from './Pages/Clientes/pdfDetallePagos.jsx';
import PdfDetallePagosProveedores from './Pages/Proveedores/pdfDetallePagos.jsx';
import PdfDetallePagosFrigorifico from './Pages/Faenas/pdfDetallePagos.jsx';
import PdfDetallePagoPorIdFrigorifico from './Pages/Faenas/pdfDetallePagoPorIdFrigorifico.jsx';
import PdfDetallePagoPorIdCliente from './Pages/Clientes/pdfDetallePagoPorId.jsx';
import PdfDetallePagoAchurasPorIdCliente from './Pages/Clientes/pdfDetallePagoAchurasPorId.jsx';
import PdfDetallePagoPorIdProveedor from './Pages/Proveedores/pdfDetallePagoPorId.jsx';
import PdfDetallePagosClientesPersonalizado from './Pages/Clientes/pdfDetallePagosPersonalizados'
import PdfDetalleVenta from './Pages/Venta/pdfDetalleVenta.jsx';
import PdfDetalleVentaAch from './Pages/Venta/pdfDetalleVentaAch.jsx';
import PdfDetalleCompra from './Pages/Compra/pdfDetalleCompra.jsx';
import Alertas from './Pages/Alertas/Alertas.jsx'
import styles from './App.module.css'
import DRFullCode from './Pages/DR-FullCode/DR-FullCode.jsx';


function App() {
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(login_state())
  }, [])
  
  let state_login = useSelector((state)=>state.login_State)


  return (
    <div className={styles.bigContainer}>
    <Routes>
    
    <Route exact path="/" element={state_login?<LogOut/>:<Login/>} />

    <Route exact path="/Home" element={state_login?<Home />:<NoAccess/>} />
    
    <Route exact path="/Faenas" element={state_login?<Faenas />:<NoAccess/>} />
      <Route exact path="/Faenas/:id" element={state_login?<Detalle_Faena />:<NoAccess/>} />
      <Route exact path="/Faenas/Historial" element={state_login?<Historial_Faena />:<NoAccess/>} />
      <Route exact path="/Faenas/FormPagos/:id" element={state_login?<Form_Pago_Faena />:<NoAccess/>} />
      <Route exact path="/Faenas/DetallePagos/:nombre" element={state_login?<Detalle_Pagos_Frigorifico />:<NoAccess/>} />
      <Route exact path="/Faenas/editarRes/:tropa" element={state_login?<Form_Editar_Res />:<NoAccess/>} />
      <Route exact path="/FormFaena" element={state_login?<Form_Faena />:<NoAccess/>} />
      <Route exact path="/Faenas/DetallePagos/:nombre/pdf" element={state_login?<PdfDetallePagosFrigorifico/>:<NoAccess/>}/>
      <Route exact path="/Faenas/DetallePagos/:nombre/:id/pdf" element=<PdfDetallePagoPorIdFrigorifico/>/>

    <Route exact path="/Compras" element={state_login?<Compras />:<NoAccess/>} />
      <Route exact path="/Compras/:id" element={state_login?<Detalle_Compra />:<NoAccess/>} />
      <Route exact path="/Compras/DetalleGrupos/:id" element={state_login?<DetalleGrupos />:<NoAccess/>} />
      <Route exact path="/Compras/DetalleGrupos/pdf/:id" element=<PdfDetalleCompra />/>
      <Route exact path="/Compras/Historial" element={state_login?<Historial_Compras />:<NoAccess/>} />
      <Route exact path="/FormCompra" element={state_login?<Form_Compra />:<NoAccess/>} />

    <Route exact path="/Ventas" element={state_login?<Ventas />:<NoAccess/>} />
      <Route exact path="/Ventas/:id" element={state_login?<Detalle_Venta />:<NoAccess/>} />
      <Route exact path="/Ventas/DetalleReses/:id" element={state_login?<Detalle_Reses_Venta />:<NoAccess/>} />
      <Route exact path="/Ventas/DetalleReses/pdf/:id" element=<PdfDetalleVenta />/>
      <Route exact path="/Ventas/Historial" element={state_login?<Historial_Ventas />:<NoAccess/>} />
      <Route exact path="/Ventas/Achuras/:id" element={state_login?<Detalle_Venta_Achuras />:<NoAccess/>} />
      <Route exact path="/Ventas/Achuras/pdf/:id" element=<PdfDetalleVentaAch />/>
      <Route exact path="/Ventas/HistorialAchuras" element={state_login?<Historial_Ventas_Achuras />:<NoAccess/>} />
      <Route exact path="/NuevaVenta" element={state_login?<Nueva_Venta />:<NoAccess/>} />
      <Route exact path="/NuevaVenta/FormCarne" element={state_login?<Form_Venta />:<NoAccess/> }/>
      <Route exact path="/NuevaVenta/FormAchuras" element={state_login?<Form_Venta_Achuras />:<NoAccess/> }/>

    <Route exact path="/Clientes" element={state_login?<Clientes />:<NoAccess/>} />
      <Route exact path="/Clientes/:id" element={state_login?<Detalle_Cliente />:<NoAccess/>} />
      <Route exact path="/Clientes/Form/:id" element={state_login?<Form_Cliente />:<NoAccess/>} />
      <Route exact path="/Clientes/HistorialVentas/:id" element={state_login?<Historial_Ventas_Cliente />:<NoAccess/>} />
      <Route exact path="/Clientes/FormPagoVC/:id" element={state_login?<Form_Pago_Venta />:<NoAccess/>} />
      <Route exact path="/Clientes/FormPagoVAch/:id" element={state_login?<Form_Pago_Venta_Achuras />:<NoAccess/>} />
      <Route exact path="/Clientes/DetallePagos/:nombre" element={state_login?<Detalle_Pagos_Clientes />:<NoAccess/>} />
      <Route exact path="/Clientes/DetallePagos/PersonalizarDetalle/:nombre" element={state_login?<Detalle_Pagos_Clientes_Personalizado />:<NoAccess/>} />
      <Route exact path="/Clientes/DetallePagos/PdfDetallePagosClientesPersonalizado" element={state_login?<PdfDetallePagosClientesPersonalizado />:<NoAccess/>} />
      
      <Route exact path="/Clientes/DetallePagos/pdf/:nombre" element={state_login?<PdfDetallePagosClientes />:<NoAccess/>} />
      <Route exact path="/Clientes/DetallePagos/pdf/:nombre/:id" element=<PdfDetallePagoPorIdCliente/>/>
      <Route exact path="/Clientes/DetallePagosAchuras/pdf/:nombre/:id" element=<PdfDetallePagoAchurasPorIdCliente/>/>
      

    <Route exact path="/Proveedores" element={state_login?<Proveedores />:<NoAccess/>} />
      <Route exact path="/Proveedores/:id" element={state_login?<Detalle_Proveedor />:<NoAccess/>} />
      <Route exact path="/Proveedores/Form/:id" element={state_login?<Form_Proveedor />:<NoAccess/>} />
      <Route exact path="/Proveedores/DetallePagos/:nombre" element={state_login?<Detalle_Pagos_Proveedor />:<NoAccess/>} />
      <Route exact path="/Proveedores/HistorialCompras/:name" element={state_login?<Historial_Compras_Proveedor />:<NoAccess/>} />
      <Route exact path="/Proveedores/FormPago/:id" element={state_login?<Form_Pago_Compra />:<NoAccess/>} />      
      <Route exact path="/Proveedores/DetallePagos/:nombre/pdf" element={state_login?<PdfDetallePagosProveedores />:<NoAccess/>} />
      <Route exact path="/Proveedores/DetallePagos/:nombre/:id/pdf" element={state_login?<PdfDetallePagoPorIdProveedor />:<NoAccess/>} />

    <Route exact path="/Stock" element={state_login?<Stock />:<NoAccess/>} />
      <Route exact path="/Stock/DetalleTropa/:tropa" element={state_login?<Detalle_Stock_Tropa />:<NoAccess/>} />

    <Route exact path="/Caja" element={state_login?<Caja />:<NoAccess/>} />
      <Route exact path="/Caja/DetalleExtracciones" element={state_login?<Detalle_Pagos_Extras />:<NoAccess/>} />
      <Route exact path="/Caja/DetalleIngresos" element={state_login?<Detalle_Ingresos_Extras />:<NoAccess/>} />
      <Route exact path="/Caja/FormExtraccion" element={state_login?<FormExtraccion />:<NoAccess/>} />
      <Route exact path="/Caja/FormIngresoExtra" element={state_login?<FormIngresoExtra />:<NoAccess/>} />
    
    <Route exact path="/Balance" element={state_login?<Balance/>:<NoAccess/>} />

    <Route exact path="/DR-FullCode" element={state_login?<DRFullCode/>:<NoAccess/>} />

    <Route exact path="/Alertas" element={state_login?<Alertas/>:<NoAccess/>} />

    <Route exact path="/Reestablecer_Login" element={<Reestablecer_Login />} />

    <Route exact path="/pdf1" element={<PdfDetallePagosClientes />} />

    

    </Routes>
    </div>
    
  
  );
}

export default App;
