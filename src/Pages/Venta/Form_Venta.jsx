import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import CardReses from "../../Components/Cards/CardReses/CardReses";
import ShortButton from "../../Components/Buttons/Button_Short/Button_Short";
import ButtonNew from "../../Components/Buttons/ButtonNew/ButtonNew";
import NavBar from "../../Components/Navbar/Navbar";
import style from "./Ventas.module.scss";
import {
  getAllClientes,
  getAllVentas,
  getClienteByName,
  getFaenasUltimosVeinteDias,
  postNewVentaCarne,
  putStockReses,
  setAlert,
} from "../../Redux/Actions/Actions";
//calendario-----------------------------------
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import esLocale from "date-fns/locale/es";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

//Form Venta
var formV = {
  id: 0,
  cliente: "",
  fecha: new Date().toLocaleDateString('en'),
  detalle: [],
  costo: 0,
  saldo: 0,
  total: 0,
  kg: 0,
  cant: 0,
};
//Form para cargar el detalle de la venta
var formComV = {
  correlativo: "",
  categoria: "",
  total_media: 0,
  kg: 0,
  kg_total: 0,
  costo_kg: 0,
  precio_kg: 0,
};

// Arrays para los selects
const categorias = [
  "Vaquillona",
  "Novillito",
  "Vaca",
  "Toro",
  "Novillo Pesado",
];
const res = ["total", "1/4T", "1/4D"];

//validaciones form Venta
export const validate = (venta) => {
  let error = {};
  if (!venta.fecha) error.fecha = "Falta fecha";
  if (!venta.cliente) error.cliente = "Falta cliente";
  if (venta.detalle.length < 1) error.detalle = "Falta detalle";
  return error;
};

//Validacion del detalle
export const validate2 = (res) => {
  let error2 = {};
  if (!res.categoria) error2.categoria = "Falta categoría";
  if (!res.total_media) error2.total_media = "Falta res";
  if (!res.correlativo) error2.correlativo = "Falta correlativo";
  if (!res.kg) error2.kg = "Falta kg";
  if (!/^\d*(\.\d{1})?\d{0,1}$/.test(res.kg))
    error2.kg = "kg debe ser un número";
  if (!/^\d*(\.\d{1})?\d{0,1}$/.test(res.costo_kg))
    error2.costo_kg = "Costo/kg debe ser un número";
  return error2;
};

const Form_Venta = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Estados locales
  const [form, setForm] = useState(formV);
  const [formCV, setFormCV] = useState(formComV);
  const [error, setError] = useState({});
  const [error2, setError2] = useState({});
  const [resSelect, setresSelect] = useState({});
  const [margen, setMargen] = useState(0);
  const [arrResesTotales, setArrResesTotales] = useState([]);

  useEffect(() => {
    dispatch(getAllClientes());
    dispatch(getFaenasUltimosVeinteDias());
    dispatch(getAllVentas()); //Trae las faenas de los ultimos 30 dias solamente
  }, [dispatch]);

  //estados globales
  const alert_msj = useSelector((state) => state.alert_msj);
  const clientes = useSelector((state) => state.AllClientes);
  const AllFaenas = useSelector((state) => state.ultimasFaenas);

  let resesStockTrue = AllFaenas.reduce((allReses, a) => {
    return [...allReses, ...a.detalle.filter((s) => s.stock == true)];
  }, []);

  let stockByCat = resesStockTrue.filter(
    (a) => a.categoria == formCV.categoria && a.costo_kg
  ); //reses con stock true filtrados por categoria

  useEffect(() => {
    if (formCV.correlativo !== "")
      setresSelect(
        resesStockTrue.find((a) => a.correlativo == formCV.correlativo)
      );
    if (formCV.precio_kg !== 0)
      setMargen(
        (
          ((formCV.precio_kg - resSelect.costo_kg * 1) /
            (resSelect.costo_kg * 1)) *
          100
        ).toFixed(2)
      );
    if (formCV.total_media === "total") formCV.kg = resSelect.kg;
  }, [formCV]);

  useEffect(() => {
    if (alert_msj !== "") {
      swal({
        title: alert_msj,
        icon: alert_msj === "Venta creada con éxito" ? "success" : "warning",
        button: "ok",
      });
    }
    dispatch(setAlert());
    form.detalle = [];
  }, [alert_msj]);

  useEffect(() => {
    if (form.cliente) {
      dispatch(getClienteByName(form.cliente));
    }
  }, [form]);

  const cliente = useSelector((state) => state.clienteByNombre);

  //handleChange del detalle
  const handleChangeCV = (e) => {
    e.preventDefault();
    setError2(
      validate2({
        ...formCV,
        [e.target.name]: e.target.value,
      })
    );
    setFormCV({
      ...formCV,
      [e.target.name]: e.target.value,
    });
  };

  //handleSubmit del detalle
  const handleSubmitRes = (e) => {
    e.preventDefault();
    if (
      !error2.categoria &&
      formCV.categoria &&
      !error2.total_media &&
      formCV.total_media &&
      !error2.correlativo &&
      formCV.correlativo &&
      !error2.precio_kg &&
      formCV.precio_kg
    ) {
      formCV.costo_kg = resSelect.costo_kg;
      formCV.kg_total = resSelect.kg;
      formCV.CuartoD = resSelect.CuartoD;
      formCV.CuartoT = resSelect.CuartoT;
      if (formCV.CuartoT > 0) formCV.kg = resSelect.CuartoT;
      if (formCV.CuartoD > 0) formCV.kg = resSelect.CuartoD;
      form.detalle.unshift(formCV);
      if (
        formCV.total_media == "total" ||
        formCV.CuartoT !== 0 ||
        formCV.CuartoD !== 0
      )
        arrResesTotales.push(formCV.correlativo);
      document.getElementById("categoria").selectedIndex = 0;
      document.getElementById("res").selectedIndex = 0;

      setFormCV(formComV);
    } else {
      swal({
        title: "Datos incorrectos, por favor intente nuevamente",
        icon: "warning",
        button: "ok",
      });
    }
  };

  //handleSubmit de la Venta completa
  const handleSubmit = (e) => {
    e.preventDefault();
    let detallesPut = [];
    if (
      !error.fecha &&
      form.fecha &&
      !error.cliente &&
      form.cliente &&
      !error.detalle &&
      form.detalle
    ) {
      form.fecha = form.fecha.getTime();
      form.id =
        "V" + form.detalle[0].correlativo + Math.floor(Math.random() * 10000);
      if (form.detalle.length > 0) {
        form.detalle.map((a) => {
          if (a.kg < 10) {
            swal({
              titleForm: "Alerta",
              text: "Faltan kg",
              icon: "warning",
              button: "ok",
            });
            return;
          }
          form.total += a.kg * 1 * a.precio_kg;
          form.costo += a.kg * 1 * a.costo_kg;
          form.kg += a.kg * 1;
          if (a.total_media == "total") form.cant++;
          if (a.total_media !== "total") form.cant += 0.5;
          if (a.CuartoT == 0 && a.CuartoD == 0) {
            if (a.total_media == "1/4T") {
              AllFaenas.map((g) => {
                if (g.detalle.some((f) => f.correlativo == a.correlativo)) {
                  let current = {};
                  g.detalle.map((f, i) => {
                    if (f.correlativo == a.correlativo)
                      current = {
                        res: f,
                        pos: i,
                        tropa: g.tropa,
                        detalle: g.detalle,
                      };
                  });
                  current.res.CuartoD = a.kg_total * 1 - a.kg * 1;
                  current.res.ventaID =
                    current.res.ventaID == null
                      ? form.id
                      : current.res.ventaID + "-" + form.id;
                  detallesPut.push({
                    detalle: current.detalle,
                    id: current.tropa,
                  });
                }
              });
            } else if (a.total_media == "1/4D") {
              AllFaenas.map((g) => {
                if (g.detalle.some((f) => f.correlativo == a.correlativo)) {
                  let current = {};
                  g.detalle.map((f, i) => {
                    if (f.correlativo == a.correlativo)
                      current = {
                        res: f,
                        pos: i,
                        tropa: g.tropa,
                        detalle: g.detalle,
                      };
                  });
                  current.res.CuartoT = a.kg_total * 1 - a.kg * 1;
                  current.res.ventaID =
                    current.res.ventaID == null
                      ? form.id
                      : current.res.ventaID + "-" + form.id;
                  detallesPut.push({
                    detalle: current.detalle,
                    id: current.tropa,
                  });
                }
              });
            }
          }
        });
      }
      form.saldo = form.total;
      arrResesTotales.map((a) =>
        AllFaenas.map((g) => {
          if (g.detalle.some((f) => f.correlativo == a)) {
            let current = {};
            g.detalle.map((f, i) => {
              if (f.correlativo == a)
                current = {
                  res: f,
                  pos: i,
                  tropa: g.tropa,
                  detalle: g.detalle,
                };
            });
            current.res.stock = false;
            current.res.ventaID = form.id;
            detallesPut.push({ detalle: current.detalle, id: current.tropa });
          }
        })
      );
      dispatch(putStockReses(detallesPut));
      dispatch(postNewVentaCarne(form));
      document.getElementById("categoria").selectedIndex = 0;
      document.getElementById("res").selectedIndex = 0;
      document.getElementById("Cliente").selectedIndex = 0;
      setForm(formV);
    } else {
      swal({
        titleForm: "Alerta",
        text: "Datos incorrectos, por favor intente nuevamente",
        icon: "warning",
        button: "ok",
      });
    }
  };

  //carga de calendario
  const handleChangeDate = (date) => {
    setForm({
      ...form,
      fecha: date,
    });
  };

  //Select de Cliente
  function handleSelectCl(e) {
    setForm({
      ...form,
      cliente: e.target.value,
    });
  }

  //Select de Correlativo
  function handleSelectCorr(e) {
    setFormCV({
      ...formCV,
      correlativo: e.target.value,
    });
  }

  //Select de las reses
  function handleSelectRes(e) {
    setFormCV({
      ...formCV,
      total_media: e.target.value,
    });
  }

  //Select de las categorias
  function handleSelectCat(e) {
    setFormCV({
      ...formCV,
      categoria: e.target.value,
    });
  }

  //ir a ventas para ver el detalle
  const handleDet = () => {
    navigate("/Ventas");
  };

  //funcion para eliminar reses del detalle
  const handleDelete = (e) => {
    setForm({
      ...form,
      detalle: form.detalle.filter((d) => d !== e),
    });
  };
  //tema del calendario
  const outerTheme = createTheme({
    palette: {
      primary: {
        main: "#00585C",
      },
    },
  });

  return (
    <div className={style.ConteinerVenta}>
      <NavBar title={"Nueva Venta"} />
      <div className={style.formContainer}>
        <form className={style.form}>
          <div className={style.formItem}>
            <h5 className={style.titleForm}>Cliente: </h5>
            <select
              id="Cliente"
              className="selectform"
              onChange={(e) => handleSelectCl(e)}
            >
              <option defaultValue>-</option>
              {clientes.length > 0 &&
                clientes.map((c, i) => (
                  <option key={i} value={c.nombre}>
                    {c.nombre.length < 20 ? c.nombre : c.nombre.slice(0, 17)}
                  </option>
                ))}
            </select>
          </div>
          <div className={style.formItemDate}>
            <h5 className={style.titleForm}>Fecha: </h5>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
              <ThemeProvider theme={outerTheme}>
                <KeyboardDatePicker
                  format="dd-MM-yyyy"
                  value={form.fecha}
                  disableFuture
                  onChange={handleChangeDate}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </div>
          <p
            className={
              form.fecha !== new Date().toLocaleDateString()
                ? style.pass
                : style.danger
            }
          >
            Debe ingresar la fecha
          </p>

          {/*----------------Carga del detalle---------------------*/}
          <div className={style.formItem2}>
            <div className={style.item}>
              <select
                id="categoria"
                className="selectform"
                onChange={(e) => handleSelectCat(e)}
              >
                <option defaultValue>Categoría</option>
                {categorias.length > 0 &&
                  categorias.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <select
                id="res"
                className="selectform"
                onChange={(e) => handleSelectRes(e)}
              >
                <option defaultValue>res</option>
                {res.length > 0 &&
                  res.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
            <div className={style.formItem}>
              <h5 className={style.titleForm}>Correlativo: </h5>
              <select
                className="selectform"
                onChange={(e) => handleSelectCorr(e)}
              >
                <option defaultValue>-</option>
                {stockByCat.length > 0 &&
                  stockByCat.map((c, i) => (
                    <option key={i} value={c.correlativo}>
                      {c.CuartoT > 0
                        ? c.correlativo + "T-" + c.kg
                        : c.CuartoD > 0
                        ? c.correlativo + "D-" + c.kg
                        : c.correlativo + "-" + c.kg}
                    </option>
                  ))}
              </select>
            </div>

            {formCV.total_media === "total" ||
            resSelect.CuartoT > 0 ||
            resSelect.CuartoD > 0 ? (
              <div>
                <div className={style.item}>
                  <h5 className={style.titleForm}>kg </h5>
                  <h5 className={style.titleForm}>
                    {resSelect.CuartoT !== 0
                      ? resSelect.CuartoT
                      : resSelect.CuartoD !== 0
                      ? resSelect.CuartoD
                      : resSelect.kg}
                  </h5>
                </div>
                <div className={style.item}>
                  <h5 className={style.titleForm}>Costo/kg </h5>
                  <h5 className={style.titleForm}>
                    {typeof resSelect.costo_kg !== "number"
                      ? null
                      : (resSelect.costo_kg * 1).toFixed(2)}
                  </h5>
                </div>
              </div>
            ) : (
              <div>
                <div className={style.item}>
                  <h5 className={style.titleForm}>kg total </h5>
                  <h5 className={style.titleForm}>{resSelect.kg}</h5>
                </div>
                <div className={style.item}>
                  <h5 className={style.titleForm}>Costo/kg </h5>
                  <h5 className={style.titleForm}>
                    {typeof resSelect.costo_kg !== "number"
                      ? null
                      : (resSelect.costo_kg * 1).toFixed(2)}
                  </h5>
                </div>
                <div className={style.item}>
                  <h5 className={style.titleForm}>kg </h5>
                  <input
                    type="number"
                    step="any"
                    value={formCV.kg ? formCV.kg : ""}
                    id="kg"
                    name="kg"
                    onChange={handleChangeCV}
                    placeholder="000"
                    className={style.size2}
                  />
                </div>
              </div>
            )}
            <div className={style.item}>
              <h5 className={style.titleForm}>$/kg </h5>
              <input
                type="number"
                step="any"
                value={formCV.precio_kg ? formCV.precio_kg : ""}
                id="precio_kg"
                name="precio_kg"
                onChange={handleChangeCV}
                placeholder="0.00"
                className={style.size2}
              />
            </div>
            <div className={style.item}>
              <h5 className={style.titleForm}>Margen(%) </h5>
              <h5 className={style.titleForm}>{margen}</h5>
            </div>
          </div>
          <div className={style.button}>
            <ButtonNew
              style={"right"}
              icon={"right"}
              onClick={handleSubmitRes}
            />
          </div>
          {/*-----------------------------------------------------------*/}

          {form.detalle.length
            ? form.detalle.map((e, i) => {
                return (
                  <CardReses
                    key={i}
                    correlativo={e.correlativo}
                    categoria={e.categoria}
                    kg={e.kg}
                    res={e.res}
                    costo_kg={e.costo_kg}
                    margen={e.margen}
                    precio_kg={e.precio_kg}
                    onClick={() => handleDelete(e)}
                  />
                );
              })
            : null}
          <div className={style.buttons} id={style.buttonOk}>
            <ShortButton
              title="✔ Confirmar"
              onClick={handleSubmit}
              color="green"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form_Venta;