import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";

import { AutoComplete } from "../auto-complete/autoComplete";

import useForceUpdate from "use-force-update";
export const FaultFormat = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [dDriverSelected, setDDriverSelected] = useState(false),
    [dataDriver, setDataDriver] = useState(false),
    [dataInput, setDataInput] = useState({
      fault: 0,
      warning: 0,
    }),
    [driversCh, setDriversCh] = useState(false);
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(driversVitaeCh, paramdrivrs) {
      handleOpen(driversVitaeCh, paramdrivrs);
    },
  }));
  const childRefAU = useRef();
  const handleOpenAU = (x, y, z) => {
    childRefAU.current.callFnHandleOpen(x, y, z);
  };
  const forceUpdate = useForceUpdate();
  const handleOpen = (driversVitaeCh, paramdrivrs) => {
    if (!open) {
      if (paramdrivrs) {
        inyectData(paramdrivrs);
      }
      setDriversCh(driversVitaeCh);
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const arrFilter = (arr) => {
    return new Promise((resolve) => {
      let find = arr.map((element) => {
        if (element.nombre === undefined) {
          return false;
        } else {
          return element.nombre;
        }
      });
      resolve(find);
    });
  };
  const arrFilterAlias = (arr) => {
    return new Promise((resolve) => {
      let find = arr.map((element) => {
        if (element.alias === undefined) {
          return false;
        } else {
          return element.alias;
        }
      });
      resolve(find);
    });
  };
  const findDriverArrCH = async (driver, arr) => {
    return new Promise((resolve) => {
      const result = arr.find((element) => {
        if (typeof element == "object") {
          return element.piloto._id === driver._id;
        }else{
          return false
        }
      });
      resolve(result);
    });
  };
  const driverSelected = async (res) => {
    setDataDriver(res);
    let findDriver1 = await findDriverArrCH(res, driversCh);
    if (findDriver1) {
      setDDriverSelected(findDriver1);
      forceUpdate();
    }
  };
  const inyectData = async (x) => {
    let arr = await arrFilter(x);
    let arr2 = await arrFilterAlias(x);
    handleOpenAU(arr, arr2, x);
  };
  const handleChangeDataInput = (event) => {
    let val = event.target.value;
    let idT = event.target.id;
    let newSchemmaValueInput = dataInput;
    if (val >= 0 && val <= 30) {
      if (idT === "fault") {
        newSchemmaValueInput.fault = val;
      } else if (idT === "warning" && val <= 10) {
        newSchemmaValueInput.warning = val;
      }
    }
    setDataInput(newSchemmaValueInput);
    forceUpdate();
  };
  const sendData = () => {
      let url = '/update-championship-driver'
    let faults = parseInt(
      dDriverSelected.sanciones ? dDriverSelected.sanciones : 0
    );
    const warnings = parseInt(
      dDriverSelected.advertencias ? dDriverSelected.advertencias : 0
    );
    const newFault = parseInt(dataInput.fault ? dataInput.fault : 0);
    const newWarning = parseInt(dataInput.warning ? dataInput.warning : 0);
    let newSchemma = {
      _id: dDriverSelected._id,
      sanciones: faults + newFault,
      advertencias: warnings + newWarning,
    };
    props.callLoading(newSchemma,url,"post")
  };
  const verifyEmptyForm = () => {
    const newFault = parseInt(dataInput.fault ? dataInput.fault : 0);
    const newWarning = parseInt(dataInput.warning ? dataInput.warning : 0);
    if (newFault > 0 || newWarning > 0) {
      return true;
    } else {
      return false;
    }
  };
  const ShemmaTxtCardFF = () => {
    if (dDriverSelected && dataDriver) {
      let points = parseInt(dDriverSelected.puntos);
      let faults = parseInt(dDriverSelected.sanciones);
      const warnings = parseInt(dDriverSelected.advertencias);
      let newFault = parseInt(dataInput.fault);
      const newWarning = parseInt(dataInput.warning);
      let warningforCalc = warnings;
      let newWarningforCalc = newWarning;
      let calcWarnings =
        warningforCalc >= 3 ? parseInt((warningforCalc /= 3)) * 5 : 0;
      let calcNewWarnings =
        newWarningforCalc >= 3 ? parseInt((newWarningforCalc /= 3)) * 5 : 0;
      let totalPoints =
        (points ? points : 0) -
        (faults ? faults : 0) -
        calcNewWarnings -
        calcWarnings -
        (newFault ? newFault : 0);
      let totalFaults = (faults ? faults : 0) + (newFault ? newFault : 0);
      let totalWarnings =
        (warnings ? warnings : 0) + (newWarning ? newWarning : 0);

      return (
        <>
          <small className="secondary-color">{`Nombre: ${dataDriver.nombre}`}</small>
          {dataDriver.alias && dataDriver.alias !== "false" ? (
            <small className="secondary-color">{`Alias: ${dataDriver.alias}`}</small>
          ) : null}
          <small className="secondary-color">{`Puntos: ${totalPoints}`}</small>
          <small className="secondary-color">{`Sanciones: ${totalFaults} Pts`}</small>
          <small className="secondary-color">{`Advertencias: ${totalWarnings}`}</small>
        </>
      );
    } else {
      return null;
    }
  };
  const ShemmaInptCardFF = () => {
    if (dDriverSelected && dataDriver) {
      return (
        <>
          <small className="secondary-color">Sancion max 30Pts</small>
          <input
            type="Number"
            min="1"
            max="30"
            id="fault"
            className="input-autocomplete correct-margins"
            onChange={handleChangeDataInput}
          />
          <small className="secondary-color">Advertencias max 10</small>
          <input
            type="Number"
            min="1"
            max="10"
            id="warning"
            className="input-autocomplete correct-margins"
            onChange={handleChangeDataInput}
          />
          {verifyEmptyForm() ? (
            <button type="button" className="button" onClick={sendData}>
              Crear
            </button>
          ) : null}
        </>
      );
    } else {
      return null;
    }
  };
  const SchemmaFault = () => {
    if (open) {
      return (
        <div className="general-container">
          <div className="grid-two-rows-50">
            <div className="column1-schemma">
              <AutoComplete ref={childRefAU} driverSelected={driverSelected} />
            </div>
            <div>
              <div className="grid-two-columns-50">
                <div className="column1-schemma">
                  <div className="general-card dimentions-card-info-fault">
                    {ShemmaTxtCardFF()}
                  </div>
                </div>
                <div className="column1-schemma">
                  <div className="general-card dimentions-card-info-fault">
                    {ShemmaInptCardFF()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  return SchemmaFault();
});
