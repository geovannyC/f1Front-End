import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { useState } from "react/cjs/react.development";
import { Rdrivers } from "../rulete-drivers/rulete-drivers";
import { AutoComplete } from "../auto-complete/autoComplete";
import { FastLap } from "../fast-lap/fastLap";
import { getData, sendData } from "../../until/fetch";
import { DataDriver } from "../data-driver/dataDriver";
const puntos = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const PointsRegister = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [drivers, setDrivers] = useState(false),
    [currentTrack, setCurrentTrack] = useState(false),
    [scuderiasCh, setScuderiasCh] = useState(false),
    [arrSelected, setArrSelected] = useState([]),
    [data, setData] = useState(false),
    [dataAlias, setDataAlias] = useState(false),
    [isReady, setIsReady] = useState(false),
    [fLap, setFlap] = useState(false);

  const childRefDR = useRef();
  const childRefAU = useRef();
  const childRefFL = useRef();
  const handleCloseRD = () => {
    childRefDR.current.callFnCloseDataDriver();
  };
  const handleOpenAU = (x, y, z) => {
    childRefAU.current.callFnHandleOpen(x, y, z);
  };
  const handleOpenFL = (x, y, z) => {
    childRefFL.current.callFnHandleOpen(x, y, z);
  };
  useImperativeHandle(ref, () => ({
    callFnRpHandleOpen(scuderias, drivrs, currentTrackParam) {
      handleOpen(scuderias, drivrs, currentTrackParam);
    },
  }));
  const handleOpenRD = (value, type) => {
    childRefDR.current.callFnOpenRuleteType(value, type);
  };
  const handleCloseRDType = () => {
    childRefDR.current.callFnCloseRuleteType();
  };
  const flsArr = (arr) => {
    console.log(arr)
    return new Promise((resolve) => {
      let width = (arr.length * 2)>10?10:arr.length * 2
      let nextArr = [];
      for (let index = 0; index < width; index++) {
        nextArr.push(index);
      }
      resolve(nextArr);
    });
  };
  const childRef = useRef();
  const switchAction = (value, color) => {

      childRef.current.callFnHandleOpenDialog(value, color);


    
  };
  const handleOpen = async (scuderias, drivrs, currentTrackParam) => {
    if (open) {
      setOpen(false);
      handleCloseRD();
      handleCloseRDType();
    } else {
      let newArr = await flsArr(scuderias);
      inyectData(drivrs);
      setArrSelected(newArr);
      setCurrentTrack(currentTrackParam);
      setOpen(true);
      setScuderiasCh(scuderias);
      setDrivers(drivrs);
      handleOpenRD(newArr, "register");
    }
  };
  const arrFilter = (arr) => {
    return new Promise((resolve) => {
      let find = arr.map((element) => {
        if (element.nombre === undefined) {
          return;
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
          return;
        } else {
          return element.alias;
        }
      });
      resolve(find);
    });
  };
  const inyectData = async (x) => {
    let arr = await arrFilter(x);
    let arr2 = await arrFilterAlias(x);
    handleOpenAU(arr, arr2, x);
    handleOpenFL(arr, arr2, x);
    setData(arr);
    setDataAlias(arr2);
  };
  const findImage = (value) => {
    return new Promise(async (resolve) => {
      let image;
      const url = `/getImagesPilots/${value}`;
      await getData(url).then((response) => {
        if (response) {
          image = response;
        }
      });
      resolve(image);
    });
  };
  const findByIdDriver = async (id, arr) => {
    return new Promise((resolve) => {
      const result = arr.find((element) => {
        if (typeof element == "object") {
          return element.driver._id === id;
        }
      });
      resolve(result);
    });
  };
  const findFalseDriver = async (arr) => {
    console.log(arr)
    return new Promise((resolve) => {
      const result = arr.every((element) => {
        if (typeof element == "number") {
          console.log('element')
          return false;
        }else{
          console.log('no element')
          return true
        }
      });
      resolve(result);
    });
  };
  const deletePosition = (index) => {
    let newArr = arrSelected;
    newArr[index] = index;
    setArrSelected(newArr);
    handleOpenRD(newArr, "register");
  };
  const findEmptyBox = async (event) => {
    let flsBox = await findFalseDriver(arrSelected).then((result) => {
      if (!result || !fLap && !event) {
        return false;
      } else {
        return true;
      }
    });
    return flsBox;
  };
  const sendDataToPost = ()=>{
    let formatData = {
      dataRulete: arrSelected,
      dataFasLap: fLap,
      
    }
    let url = {
      urlDriverVitae: "/create-driver-vitae-championship",
      urlFlapDriver: "/create-fas-lap-driver-championship",
      urlUpdateTrack: "/update-track",
    }
    props.callLoading(formatData, url, "postPoints")
  }
  let addPoints = async (value) => {
    let driver = value.driver;
    let newArr = arrSelected;
    let recordTrack = !currentTrack?false:currentTrack.pista.vuelta;
    let prevFind = await findByIdDriver(driver._id, newArr);
    let newFormatLap = fLap
      ? fLap
      : {
          championship: false,
          track: false,
          driver: false,
          minute: false,
          isRecord: false,
          seconds: false,
          miliseconds: false,
          posicion: false,
        };

    if (typeof fLap === "object") {
      if (newFormatLap.posicion < 10) {
        newArr[newFormatLap.posicion].puntos = puntos[newFormatLap.posicion];
      }
      if (prevFind) {
        newArr[prevFind.posicion].puntos = puntos[prevFind.posicion] + 1;
        newFormatLap.posicion = prevFind.posicion;
      } else {
        newFormatLap.posicion = 10;
      }
    } else {
      if (prevFind) {
        newArr[prevFind.posicion].puntos = puntos[prevFind.posicion] + 1;
        newFormatLap.posicion = prevFind.posicion;
      } else {
        newFormatLap.posicion = 10;
      }
    }
    newFormatLap.championship = currentTrack.championship;
    newFormatLap.track = currentTrack.pista;
    newFormatLap.driver = driver;
    newFormatLap.minute =  parseInt(value.minute) ;
    newFormatLap.seconds = parseInt(value.seconds);
    newFormatLap.miliseconds = parseInt(value.miliseconds);
    if (recordTrack.length === 0) {
      recordTrack = [
        newFormatLap.minute,
        newFormatLap.seconds,
        newFormatLap.miliseconds,
      ];
      let schemmaNewDriverFasLap = {
        idTrack: currentTrack.pista._id,
        driverFl: driver._id,
        newFasLap: recordTrack,
      };
      newFormatLap.isRecord = schemmaNewDriverFasLap;
    } else {
      let calcMinute = recordTrack[0] * 600;
      let calcSeconds = recordTrack[1] * 10;
      let miliseconds = recordTrack[2];
      let calcMinuteCurrent = newFormatLap.minute * 600;
      let calcSecondsCurrent = newFormatLap.seconds * 10;
      let milisecondsCurrent = newFormatLap.miliseconds;
      let currentRecordTrack = calcMinute + calcSeconds + miliseconds;
      let newRTrack =
        calcMinuteCurrent + calcSecondsCurrent + milisecondsCurrent;
      if(newFormatLap)
      if (currentRecordTrack > newRTrack && currentRecordTrack !== newRTrack) {
        recordTrack = [
          newFormatLap.minute,
          newFormatLap.seconds,
          newFormatLap.miliseconds,
        ];
        let schemmaNewDriverFasLap = {
          idTrack: currentTrack.pista._id,
          driverFl: driver._id,
          newFasLap: recordTrack,
        };
        newFormatLap.isRecord = schemmaNewDriverFasLap;
        
      } else {
        newFormatLap.isRecord = false;
      }
    }
    let fnEmpty = await findEmptyBox(true)
    if (fnEmpty) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
    handleOpenRD(newArr, "register");
    setArrSelected(newArr);
    setFlap(newFormatLap);
  };
  const findDriver1Scuderia = async (driver, arr) => {
    return new Promise((resolve) => {
      const result = arr.find((element) => {
        if (typeof element == "object") {
          return element.escuderia.piloto1 === driver._id;
        }
      });
      resolve(result);
    });
  };
  const findDriver2Scuderia = async (driver, arr) => {
    return new Promise((resolve) => {
      const result = arr.find((element) => {
        if (typeof element == "object") {
          return element.escuderia.piloto2 === driver._id;
        }
      });
      resolve(result);
    });
  };
  const driverSelected = async (res) => {
    let newArr = arrSelected;
    let prevFind = await findByIdDriver(res._id, newArr);
    if (!prevFind) {
      let findDriver1 = await findDriver1Scuderia(res, scuderiasCh);
      let imageDriver = await findImage(res.carpetaPiloto);
      if (!findDriver1) {
        let findDriver2 = await findDriver2Scuderia(res, scuderiasCh);
        if (!findDriver2) {
          alert("piloto no registrado en ninguna escuderia");
        } else {
          newArr.every((result) => {
            if (typeof result === "number") {
              let dat = {
                posicion: result,
                puntos: puntos[result],
                imageDriver: imageDriver,
                driver: res,
                escuderia: findDriver2
              };
              newArr[result] = dat;
              setArrSelected(newArr);
              handleOpenRD(newArr, "register");
              return false;
            } else {
              return true;
            }
          });
        }
      } else {
        newArr.every((result) => {
          if (typeof result === "number") {
            let dat = {
              posicion: result,
              puntos: puntos[result],
              imageDriver: imageDriver,
              driver: res,
              escuderia: findDriver1
            };
            newArr[result] = dat;
            setArrSelected(newArr);
            handleOpenRD(newArr, "register");
            return false;
          } else {
            return true;
          }
        });
      }
      let fnEmpty = await findEmptyBox()
      console.log(fnEmpty)
      if (fnEmpty) {
        setIsReady(true);
      } else {
        setIsReady(false);
      }
    } else {
      alert("piloto ya seleccionado");
    }
  };
  const HandleCloseIsReady = ()=>{
    setIsReady(false)
  }
  return (
    <div
      className={
        open ? "general-container index-2" : "general-container index-0"
      }
    >
        {<DataDriver ref={childRef} />}
      <div
        className={
          isReady
            ? "img-card-driver-fl row2-autocomplete index-2 animation-right-to-leftt-open"
            : "img-card-driver-fl row2-autocomplete index-0 animation-right-to-left"
        }
      >
        <a className="input-autocomplete" onClick={sendDataToPost}>Registrar Puntuaciones</a>
        <a className="input-autocomplete" onClick={HandleCloseIsReady}>Cancelar</a>
      </div>
      <div
        className={
          open
            ? " text-points-register  animation-right-to-leftt-open"
            : " text-points-register animation-right-to-left"
        }
      >
        {currentTrack ? <small>{currentTrack.pista.nombre}</small> : null}
      </div>
      <div className="grid-two-rows-50">
        <div className="grid-two-columns-50">
          <div
            className={
              open
                ? "container-r-drivers animation-left-to-right-open "
                : "container-r-drivers animation-left-to-right"
            }
          >
            <AutoComplete ref={childRefAU} driverSelected={driverSelected} />
          </div>
          <div
            className={
              open
                ? "column1-schemma animation-right-to-leftt-open"
                : "column1-schemma animation-right-to-left"
            }
          >
            <FastLap ref={childRefFL} addPoints={addPoints} />
          </div>
        </div>

        <div
          className={
            open
              ? "column1-schemma animation-right-to-leftt-open"
              : "column1-schemma animation-right-to-left"
          }
        >
          <Rdrivers ref={childRefDR} deletePosition={deletePosition}  openData={switchAction}/>
        </div>
      </div>
    </div>
  );
});
