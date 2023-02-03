import axios from "axios";
//filter
//GET_ALL_VENTAS_BY_CLIENTE
// estado de login
export const login_state = () => {
    const e = localStorage.getItem("login")
    return ({ type: "LOGIN_STATE", payload: e  });
};
//GET_CAJA

export const pagosPDF = (pagos, saldoPagos, cliente) =>{
  let response= pagos.filter((a)=>a.check==true)
  return ({ type: "PAGOS_PDF", payload: [response,saldoPagos,cliente]  });
}
export const filtrarClientes = (filtro,AllClientes) => {
  let filtrados = AllClientes.filter(a=>a.nombre.toLowerCase().includes(filtro.toLowerCase()))
  return ({ type: "FILTRAR_CLIENTES", payload: filtrados  });
};
export const filtrarVentas = (filtro,AllVentas) => {
  let filtrados = AllVentas.filter(a=>a.cliente.toLowerCase().includes(filtro.toLowerCase()))
  return ({ type: "FILTRAR_VENTAS", payload: filtrados  });
};
export const filtrarVentasAchuras = (filtro,AllVentasAchuras) => {
  let filtrados = AllVentasAchuras.filter(a=>a.clien.toLowerCase().includes(filtro.toLowerCase()))
  return ({ type: "FILTRAR_VENTAS_ACHURAS", payload: filtrados  });
};

//getPagosComprasByProveedor
export const URLimag = (url) => {

  return ({ type: "URL_IMG", payload: url  });
};

export const setimgurl = () => {

  return ({ type: "URL_IMG", payload: ''  });
};

//setear estado de login
export const setlogin_state = (value) => {
    return ({ type: "LOGIN_STATE", payload: value  });
};

//SETIAR ALERTAS
export const setAlert = () => {
  return ({ type: "ALERT_MSJ", payload: ""  });
};

export const pagosPersonalizados = (e) => {
  return ({ type: "GET_ALL_PAGOS_VENTAS_BY_CLIENTE", payload: e  });
};

export function postLogin(jsonUser){
  return async function (dispatch){
      try{
          const json = await axios.post(`/user/login`, jsonUser);
          if(json.data.status==="ok")localStorage.setItem("AuthLogin",json.data.data)   
          return dispatch({
            type: "LOGIN_STATUS",
            payload: json.data.status})
        }
      catch(err){
        return dispatch({
          type: "LOGIN_STATUS",
          payload: "error"})
      }
      
  }
};

//getAllComrpasByProveedor
export function setStatus(value){
  return async function (dispatch){
      try{
          return dispatch({
            type: "LOGIN_STATUS",
            payload: value})
        }
      catch(err){
        console.log(err)
      }
      
  }
};

//Traer Token de localstorage
const token = localStorage.getItem("AuthLogin")

//Traer todas las compras
export const getAllComrpas = () => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/compras/all`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            
            return dispatch({
            type: "GET_ALL_COMPRAS",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
};

//Calcula el saldo total de todas las compras
export const getSaldoAllComrpas = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/compras/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          let saldo=0
          json.data.data.map((a)=>saldo+=a.saldo*1)
          return dispatch({
          type: "GET_SALDO_ALL_COMPRAS",
          payload: saldo})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer todas las ventas de achuras
export const getAllVentasAchuras = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventaAchuras/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_VENTAS_ACHURAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer todas las ventas de achuras con saldo
export const getAllVentasAchurasConSaldo = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventaAchuras/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_VENTAS_ACHURAS_SALDO",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};
//Traer todas las compras de un proveedor
export const getAllComrpasByProveedor = (proveedor) => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/compras/all/${proveedor}`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            return dispatch({
            type: "GET_COMPRAS_BY_PROVEEDOR",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
};

//Traer todas las compras con saldo > 0
export const getAllComrpasConSaldo = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/compras/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_COMPRAS_SALDO",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer compra por ID
export const getComrpaByID = (id) => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/compras/${id}`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            let response = json.data.data
            response.costo_veps_total= response.costo_veps_unit*response.cant_total
            return dispatch({
            type: "GET_COMPRA_BY_ID",
            payload: response})
        }
        catch (error) {
            console.log(error);
          }
        };
};

//Traer saldo de un proveedor por nombre del proveedor
export const getSaldoByProveedor = (proveedor) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/proveedores/saldo/${proveedor}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          console.log(json)
          return dispatch({
          type: "GET_SALDO_BY_PROVEEDOR",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer saldo de un cliente por nombre del cliente
export const getSaldoByCliente = (cliente) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/clientes/saldo/${cliente}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          console.log(json)
          return dispatch({
          type: "GET_SALDO_BY_CLIENTE",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};
//ULTIMAS_FAENAS
//Traer todas las faenas
export const getAllFaenas = () => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/faenas/all`,{
              headers: {
                'auth-token': `${token}`
              }
            })
          let faenasPendientes = []
          let unicas = json.data.data 
          unicas.map(e=> {if(e.saldo!==null && e.saldo>0)faenasPendientes.push(e)})
          const response = [unicas,faenasPendientes]
            return dispatch({
            type: "GET_ALL_FAENAS",
            payload: response},{
            } )
        }
        catch (error) {
            console.log(error);
          }
        };
};

//Traer todas las faenas
export const getAllFaenasConSaldo = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/faenas/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          })
          console.log(json.data.data)
          return dispatch({
          type: "GET_ALL_FAENAS_CON_SALDO",
          payload: json.data.data},{
          } )
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer todas las faenas
export const getFaenasUltimosVeinteDias = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/faenas/all/ultimas`,{
            headers: {
              'auth-token': `${token}`
            }
          })
          return dispatch({
          type: "ULTIMAS_FAENAS",
          payload: json.data.data },{
          } )
      }
      catch (error) {
          console.log(error);
        }
      };
};


//Traer todas las faenas
export const getFaenaById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/faenas/${id}`,{
            headers: {
              'auth-token': `${token}`
            }
          })
          let response= json.data.data
          return dispatch({
          type: "GET_FAENA_BY_ID",
          payload: response},{
          } )
      }
      catch (error) {
          console.log(error);
        }
      };
};
//postNewVentaAchuras
//Traer faena por numero de tropa
export const getFaenasByTropa = (tropa) => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/faenas/${tropa}`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            return dispatch({
            type: "GET_FAENA_BY_TROPA",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
};
export const getGruposByTropa = (tropa) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/faenas/${tropa}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
    let kgVaca=0;
    let nvaca=0
    let kgToro=0;
    let ntoro=0
    let kgNovillito=0;
    let nnovillito=0
    let kgVaquillona=0;
    let nvaquillona=0
    let kgNovPes=0;
    let nnovpes=0

    json.data.data.detalle.map(a=>{
        if(a.categoria==="Vaca"){
            kgVaca+=a.kg
            nvaca++
        }
        if(a.categoria==="Vaquillona"){
            kgVaquillona+=a.kg
            nvaquillona++
        }
        if(a.categoria==="Novillito"){
            kgNovillito+=a.kg
            nnovillito++
        }
        if(a.categoria==="Toro"){
            kgToro+=a.kg
            ntoro++
        }
        if(a.categoria==="Novillo Pesado"){
            kgNovPes+=a.kg
            nnovpes++
        }
    })
          return dispatch({
          type: "GET_GRUPOS_BY_TROPA",
          payload: [{
            categoria:'Vaca',
            kg: kgVaca,
            cant:nvaca*0.5
           },
           {
            categoria:'Vaquillona',
            kg: kgVaquillona,
            cant:nvaquillona*0.5
           },
           {
            categoria:'Novillito',
            kg: kgNovillito,
            cant:nnovillito*0.5
           },
           {
            categoria:'Toro',
            kg: kgToro,
            cant:ntoro*0.5
           },
           {
            categoria:'Novillo Pesado',
            kg: kgNovPes,
            cant:nnovpes*0.5
           },
          ]})
      }
      catch (error) {
          console.log(error);
        }
      };
};


//Traer todas las ventas
export const getAllVentas = () => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/ventas/all`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            let response = json.data.data.sort(function(a,b){
              if(a.fecha>b.fecha){return -1}
              if(a.fecha<b.fecha){return 1}
              return 0})

            return dispatch({
            type: "GET_ALL_VENTAS",
            payload: response})
        }
        catch (error) {
            console.log(error);
          }
        };
}; 

export const getAllVentasConSaldo = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventas/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_VENTAS_SALDO",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

//Traer las ventas de los ultimos 30 dias a partir de la fecha actual
export const getAllVentasultimos30dias = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventas/ultimos30dias/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          console.log(json.data.data)
          return dispatch({
          type: "GET_ALL_VENTAS_ULTIMOS_30_DIAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

//Calcula el saldo total de todas las ventas
export const getSaldoAllVentas = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventas/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          const json2 = await axios.get(`/ventaAchuras/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          let saldo=0
          json.data.data.map((a)=>saldo+=a.saldo*1)
          let saldo2=0
          json2.data.data.map((a)=>saldo2+=a.saldo*1)
          let saldoTotal = saldo + saldo2
          return dispatch({
          type: "GET_SALDO_ALL_VENTAS",
          payload: saldoTotal})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Calcula el saldo total de todas las faenas
export const getSaldoAllFaenas = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/faenas/all/saldo`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          let saldo=0
          json.data.data.map((a)=>saldo+=a.saldo*1)
          return dispatch({
          type: "GET_SALDO_ALL_FAENAS",
          payload: saldo})
      }
      catch (error) {
          console.log(error);
        }
      };
};


//Ventas por nombre de cliente
export const getVentasByCliente = (clientName) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventas/all/name/${clientName}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_VENTAS_BY_CLIENTE",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

    //Ventas de achuras por cliente
export const getVentasAchurasByCliente = (clientName) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventaAchuras/all/name/${clientName}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_VENTAS_ACHURAS_BY_CLIENTE",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

//Traer venta por ID
export const getVentaByID = (id) => {
    let cost=0
    return async (dispatch) => {
        try {
            
            const json = await axios.get(`/ventas/${id}`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            const venta = json.data.data
            venta.detalle.map(a=>{
              cost+=a.costo_kg*a.kg
            })
            venta.precio_kg_prom=venta.total/venta.kg
            venta.margen=venta.total-cost
            venta.margen_porc=(venta.margen/venta.total)*100
            return dispatch({
            type: "GET_VENTA_BY_ID",
            payload: venta})
        }
        catch (error) {
            console.log(error);
          }
        };
};

      //Traer venta por ID
export const getVentaAchurasByID = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ventaAchuras/${id}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_VENTA_ACHURA_BY_ID",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer todo el stock
export const getAllStock = () => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/stock`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            return dispatch({
            type: "GET_ALL_STOCK",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
};  

//Traer todos los clientes
export const getAllClientes = () => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/clientes/all`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            return dispatch({
            type: "GET_ALL_CLIENTES",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
};   

//Traer cliente por ID
export const getClienteByID = (id) => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/clientes/${id}`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            return dispatch({
            type: "GET_CLIENTE_BY_ID",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
};

//Traer cliente por nombre
export const getClienteByName = (nombre) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/clientes/all`,{
          headers: {
            'auth-token': `${token}`
          }
          })
          let response = json.data.data
          let clienteByNombre= response.find(a=>a.nombre==nombre)
          return dispatch({
          type: "GET_CLIENTE_BY_NAME",
          payload: clienteByNombre
        })
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

//Traer todos los proveedores
export const getAllProveedores = () => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/proveedores/all/`,{
            headers: {
              'auth-token': `${token}`
            }
            })
            return dispatch({
            type: "GET_PROVEEDORES",
            payload: json.data.data })
        }
        catch (error) {
            console.log(error);
          }
        };
}; 

export const getProveedorByName = (nombre) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/proveedores/all`,{
          headers: {
            'auth-token': `${token}`
          }
          })
          let response = json.data.data
          let provByNombre= response.find(a=>a.nombre==nombre)
          return dispatch({
          type: "GET_PROVEEDOR_BY_NAME",
          payload: provByNombre
        })
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

//Traer Proveedor por ID
export const getProveedorByID = (id) => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/proveedores/${id}`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            return dispatch({
            type: "GET_PROVEEDOR_BY_ID",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
};
//putGrupoReses
//Get todas las reses
export const getAllGruposReses = () => {
    return async (dispatch) => {
        try {
          
            const json = await axios.get(`/gruposRes/all`,{
              headers: {
                'auth-token': `${token}`
              }
            });

            return dispatch({
            type: "GET_GRUPOS_RES",
            payload: json.data.data
            })
        }
        catch (error) {
            console.log(error);
          }
        };
}; 

//Get res por correlativo
export const getResByCorrelativo = (correlativo) => {
    return async (dispatch) => {
        try {
            const json = await axios.get(`/reses/${correlativo}`,{
              headers: {
                'auth-token': `${token}`
              }
            });
            return dispatch({
            type: "GET_RES_BY_CORRELATIVO",
            payload: json.data.data})
        }
        catch (error) {
            console.log(error);
          }
        };
}; 


//Traer pagos por clientes
export const getPagosVentasByCliente = (nombre) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoVentas/all/${nombre}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_VENTAS_BY_CLIENTE",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};
//---------------------------------------------------------------///////////////////////////////////////////////////////////////////////////////
//Traer pagos por clientes
export const getSaldoVentasByCliente = (nombre) => {
  return async (dispatch) => {
      try {
          const json1 = await axios.get(`/ventas/all/name/${nombre}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          const json2 = await axios.get(`/ventaAchuras/all/name/${nombre}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          let saldoVentaTotal = 0
         
          json1.data.data.map((a)=>saldoVentaTotal+=a.saldo)
          json2.data.data.map((a)=>saldoVentaTotal+=a.saldo)
          return dispatch({
          type: "SALDO_VENTA_TOTAL",
          payload: saldoVentaTotal})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer pagos por clientes
export const getPagosVentaAchurasByCliente = (nombre) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoVentaAchuras/all/${nombre}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_VENTAS_ACHURAS_BY_CLIENTE",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
    };

    export const getAllPagosVentasByCliente = (nombre) => {
      return async (dispatch) => {
          try {
              const json1 = await axios.get(`/pagoVentaAchuras/all/${nombre}`,{
                headers: {
                  'auth-token': `${token}`
                }
              });
              const json2 = await axios.get(`/pagoVentas/all/${nombre}`,{
                headers: {
                  'auth-token': `${token}`
                }
              });
              let json = [...json1.data.data, ...json2.data.data]
              let saldoTotal = 0;
              json.map((a)=>{
                a.check=false
              })

              return dispatch({
              type: "GET_ALL_PAGOS_VENTAS_BY_CLIENTE",
              payload: json})
          }
          catch (error) {
              console.log(error);
            }
          };
        };

//Traer pagos por Proveedor
export const getPagosComprasByProveedor = (nombre) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoCompras/all/${nombre}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_COMPRAS_BY_PROVEEDOR",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
    };

//Traer pagos por ID de compra
export const getPagosComprasByID = (compraID) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoCompras/${compraID}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_COMPRAS_BY_ID",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
    };

//Traer pagos por ID de compra
export const getAlertRes = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/faenas/all/ultimas`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          let alerts = [];
          let dias=9//dias de vencimiento
          let fechaMax = Date.now()-(3600*1000*24*dias)
          json.data.data.map(a=>a.detalle.map(r=>{if(fechaMax>a.fecha && r.stock==true)alerts.push({res:r,fecha:a.fecha,tropa:a.tropa, frigorifico:a.frigorifico})}))
          return dispatch({
          type: "GET_RESES_ALERT",
          payload: alerts
        })
      }
      catch (error) {
          console.log(error);
        }
      };
    };


//Traer pagos por ID de faena
export const getPagosFaenaByID = (faenaID) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoFaenas/${faenaID}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_FAENAS_BY_ID",
          payload: json.data.data})     
      }
      catch (error) {
          console.log(error);
        }
      };
    };


//Traer pagos por ID de venta
export const getPagosVentaByID = (ventaID) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoVentas/${ventaID}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_VENTAS_BY_ID",
          payload: json.data.data})     
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer pagos por ID de venta
export const getPagosVentaAchurasByID = (ventaID) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoVentaAchuras/${ventaID}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_VENTA_ACHURAS_BY_ID",
          payload: json.data.data})     
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer pagos por Frigorifico
export const getPagosFaenasByFrigorifico = (nombre) => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoFaenas/all/${nombre}`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_PAGOS_FAENAS_BY_FRIGORIFICO",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer caja
export const getCaja = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/caja`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          console.log(json.data.data)
          return dispatch({
          type: "GET_CAJA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer todos los los pagos de VENTAS
export const getAllPagosVentas = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoVentas/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_PAGOS_VENTAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer todos los los pagos de VENTAS
export const getAllPagosVentasAchuras = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoVentaAchuras/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_PAGOS_VENTAS_ACHURAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Traer todos los los pagos de VENTAS
export const getAllPagosCompras = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoCompras/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_PAGOS_COMPRAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

//Traer todos los los pagos de VENTAS
export const getAllPagosFaenas = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoFaenas/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_PAGOS_FAENAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
}; 

//Traer todos las extracciones de dinero
export const getAllPagosExtras = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/pagoExtras/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          return dispatch({
          type: "GET_ALL_PAGOS_EXTRAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
}; 
//"GET_ALL_INGRESOS_EXTRAS":

//Traer todos las extracciones de dinero
export const getAllIngresosExtras = () => {
  return async (dispatch) => {
      try {
          const json = await axios.get(`/ingresoExtras/all`,{
            headers: {
              'auth-token': `${token}`
            }
          });
          let response= json.data.data
          response.map((a,i)=>{a.ventaID=5000+i})
          return dispatch({
          type: "GET_ALL_INGRESOS_EXTRAS",
          payload: response})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//postNewPagoExtra
    
//Post porveedores
export const postNewProveedor = (proveedor_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/proveedores`, proveedor_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};


//Post clientes
export const postNewCliente = (cliente_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/clientes`, cliente_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post compra

export const postNewCompra = (compra_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/compras`, compra_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post venta carne
export const postNewVentaCarne = (venta_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/ventas`, venta_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};
//putGrupoDetalle
//Post venta achura
export const postNewVentaAchura = (venta_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/ventaAchuras`, venta_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post faena
export const postNewFaena = (faena_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/faenas`, faena_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post res
export const postNewGrupoReses = (res_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/gruposRes`, res_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post pagoCompras
export const postNewPagoCompra = (pago_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/pagoCompras`, pago_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post pagoVenta
export const postNewPagoVenta = (pago_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/pagoVentas`, pago_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post pagoVentaAchuras
export const postNewPagoVentaAchuras = (pago_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/pagoVentaAchuras`, pago_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post pagoFaena
export const postNewPagoFaena = (pago_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/pagoFaenas`, pago_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
    };


//Post pagosExtra
export const postNewPagoExtra = (pago_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/pagoExtras`, pago_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//Post pagosExtra
export const postNewIngresoExtra = (pago_json) => {
  return async (dispatch) => {
      try {
          const json = await axios.post(`/ingresoExtras`, pago_json,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "ALERT_MSJ",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//eliminar faena
export const deleteFaenaById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/faenas`,{
          headers: {
            'auth-token': `${token}`
          },
          data: {
            faena_id: id
          }
          })
          return dispatch({
          type: "DELETE_FAENA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
    };

// elimina las reses cuando se elimina una faena
export const deleteResById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/res`,{
          headers: {
            'auth-token': `${token}`
          },
          data: {
            res_id: id
          }
          })
          return dispatch({
          type: "DELETE_RES",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//eliminar compra
export const deleteCompraById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/compras`,{
          headers: {
            'auth-token': `${token}`
          },
          data: {
            compra_id: id
          }
          })
          return dispatch({
          type: "DELETE_COMPRA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
    };
//eliminar cliente
export const deleteClienteById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/clientes`,{
          headers: {
            'auth-token': `${token}`
          },
          data: {
            cliente_id: id
          }
          })
          return dispatch({
          type: "DELETE_CLIENTE",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
    };
//eliminar proveedor
export const deleteProveedorById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/proveedores`,{
          headers: {
            'auth-token': `${token}`
          },
          data: {
            proveedor_id: id
          }
          })
          return dispatch({
          type: "DELETE_PROVEEDOR",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};
//eliminar venta
export const deleteVentaById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/ventas/${id}`,{
          headers: {
            'auth-token': `${token}`
          }})
          return dispatch({
          type: "DELETE_VENTA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};
//eliminar venta de Achuras
export const deleteVentaAchurasById = (id) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/ventaAchuras/${id}`,{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "DELETE_VENTA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//eliminar pago faena por id

export const deletePagoFaenaById = (pago) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/pagoFaenas`,{
          headers: {
            'auth-token': `${token}`
          },
          data: pago
          })
          return dispatch({
          type: "DELETE_PAGO_FAENA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

//eliminar pago venta por id

export const deletePagoVentaById = (pago) => {
  return async (dispatch) => {
    try {
        const json = await axios.delete(`/pagoVentas`,{
        headers: {
          'auth-token': `${token}`
        },
        data: pago
        })
        return dispatch({
        type: "DELETE_PAGO_VENTA",
        payload: json.data.data})
    }
    catch (error) {
        console.log(error);
      }
    };
};

export const setDeletePagos = () => {

  return ({ type: "DELETE_PAGO_VENTA", payload: ''  });
};

//eliminar pago venta achuras por id

export const deletePagoVentaAchurasById = (pago) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/pagoVentaAchuras`,{
          headers: {
            'auth-token': `${token}`
          },
          data: pago
          })
          return dispatch({
          type: "DELETE_PAGO_VENTA_ACHURAS",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

export const setDeletePagosAchuras = () => {

  return ({ type: "DELETE_PAGO_VENTA_ACHURAS", payload: ''  });
};
    
//eliminar pago compra por id

export const deletePagoCompraById = (pago) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/pagoCompras`,{
          headers: {
            'auth-token': `${token}`
          },
          data: pago
          })
          return dispatch({
          type: "DELETE_PAGO_COMPRA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

export const deletePagoExtra = (pago) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/pagoExtras`,{
          headers: {
            'auth-token': `${token}`
          },
          data: pago
          })
          return dispatch({
          type: "DELETE_PAGO_EXTRA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};

export const deleteIngresoExtra = (pago) => {
  return async (dispatch) => {
      try {
          const json = await axios.delete(`/ingresoExtras`,{
          headers: {
            'auth-token': `${token}`
          },
          data: pago
          })
          return dispatch({
          type: "DELETE_PAGO_EXTRA",
          payload: json.data.data})
      }
      catch (error) {
          console.log(error);
        }
      };
};


//actualizar costo por kg de las reses
export const putGrupoResesCostoKg = (newDetalles)=>{
  return async (dispatch)=>{
    if(newDetalles.length==1){
    try{
      const json = await axios.put(`/faenas/detalle`,newDetalles[0],{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_GRUPO_RESES",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
  else {
        try{
        const json1 = await axios.put(`/faenas/detalle`,newDetalles[0],{
          headers: {
            'auth-token': `${token}`
          }
          })
        const json2 = await axios.put(`/faenas/detalle`,newDetalles[1],{
          headers: {
            'auth-token': `${token}`
          }
          })
          return dispatch({
          type: "PUT_GRUPO_RESES",
          payload: json2.data.data})
      }
      catch(err){
        console.log(err)
      }
    
  }
  }
};
//getAlertRes
//actualizar detalle de grupos
export const putStockReses = (detallesPut)=>{
  
  return async ()=>{
    try{
      detallesPut.map(async (a)=>{
      await axios.put(`/faenas/detalle`,a,{
        headers: {
          'auth-token': `${token}`
        }
        })
      })
    }
    catch(err){
      console.log(err)
    }
  }
  
}
//getAllVentasultimos30dias
//pasa el estado de stock a false
export const putkgRes = (data_json)=>{
  return async (dispatch)=>{
    try{
      const json = await axios.put(`/res/kg`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_KG_RESES",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
};


//resta cuarto de res vendida
export const putCuartoRes = (id, kg, correlativo)=>{
  return async (dispatch)=>{
    let data_json= {
      id: id,
      kg: kg,
      correlativo: correlativo
    }
    try{
      const json = await axios.put(`/res/cuartoRes`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_CUARTO_RESES",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
}; 

//actualiza saldo Cliente
export const putSaldoCliente = (id, saldo)=>{
  return async (dispatch)=>{
    let data_json= {
      id: id,
      saldo: saldo,
    }
    try{
      const json = await axios.put(`/clientes/saldo`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_CUARTO_RESES",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
}; 
//actualiza saldo Compra
export const putSaldoCompra = (id, saldo)=>{
  return async (dispatch)=>{
    let data_json= {
      id: id,
      saldo: saldo,
    }
    try{
      const json = await axios.put(`/compras/saldo`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_CUARTO_RESES",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
}; 

//actualiza saldo Venta
export const putSaldoVenta = (id, saldo)=>{
  return async (dispatch)=>{
    let data_json= {
      id: id,
      saldo: saldo,
    }
    try{
      const json = await axios.put(`/ventas/saldo`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_SALDO",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
}; 

//actualiza saldo Venta Achuras
export const putSaldoVentaAchuras = (id, saldo)=>{
  return async (dispatch)=>{
    let data_json= {
      id: id,
      saldo: saldo,
    }
    try{
      const json = await axios.put(`/ventaAchuras/saldo`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_CUARTO_RESES",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
}; 

//actualiza saldo Faenas
export const putSaldoFaena = (id, saldo)=>{
  return async (dispatch)=>{
    let data_json= {
      id: id,
      saldo: saldo,
    }
    try{
      const json = await axios.put(`/faenas/saldo`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_CUARTO_RESES",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
}; 

//actualiza saldo Faenas
export const putEstadoCompraFaena = (arr)=>{
  return async ()=>{
    try{
      arr.map(async (a)=>{
        await axios.put(`/faenas/estadoCompra`,a,{
        headers: {
          'auth-token': `${token}`
        }
        })
      })
    }
    catch(err){
      console.log(err)
    }
  }
};
//putGrupoResesCostoKg
//actualiza saldo Faenas
export const putEstadoCompraFaenaFalse = (tropa)=>{
  return async (dispatch)=>{
    let data_json= {
      tropa: tropa,
      estado_compra: "false",
    }
    try{
      const json = await axios.put(`/faenas/estadoCompra`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_ESTADO_COMPRA_FAENA",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
};

//resta cuarto de res vendida
export const putEditarCliente = (data_json)=>{
  return async (dispatch)=>{
    try{
      const json = await axios.put(`/clientes`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_EDITAR_CLIENTE",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
}; 

//resta cuarto de res vendida
export const putEditarProveedor = (data_json)=>{
  return async (dispatch)=>{
    try{
      console.log(data_json)
      const json = await axios.put(`/proveedores`,data_json,{
        headers: {
          'auth-token': `${token}`
        }
        })
        return dispatch({
        type: "PUT_EDITAR_PROVEEDOR",
        payload: json.data.data})
    }
    catch(err){
      console.log(err)
    }
  }
};
