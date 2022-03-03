import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useReducer,
} from "react";
import { Tile } from "./tile";
import { InputAutocomplete } from "../input-autocomplete/inputAutoplete";
import { MotorSearch2 } from "../motor-search2.0/motorSearch";
import { getData } from "../../until/fetch";
import { createWorker } from "tesseract.js";
import { Loadingv2 } from "../loading/loadingv2";
import { FastLapRegister } from "./fastLapRegister";
import {
  arrFinder,
  formattoArrWords,
  findScuderiaDriver,
  FinderByAliasName,
  buildSchemmaPointsDrivers,
  buildSchemmaPointsScuderias,
  fnArrComposed
} from "./modules";
import "./pointsRegisterv2.css";
export const ACTIONS = {
  ADD_FL: "ADD_FL",
  INCREMENT: "INCREMENT",
  ADD_POINT_FL: "ADD_POINT_FL",
  REMPLACE_ARRAY: "REMPLACE_ARRAY",
  DELETE: "DELETE",
  DELETE_ALL: "DELETE_ALL",
  ADD_FAULT: "ADD_FAULT",
  DELETE_FAULT: "DELETE_FAULT",
};
function reducerFL(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_FL:
      return action.payload.dataFL;
    default:
      return state;
  }
}
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      let newState = [...state];
      newState[action.payload.pos] = action.payload.driver;
      return newState;
    case ACTIONS.DELETE:
      let newState2 = [...state];
      newState2[action.payload.pos] = action.payload.pos;
      return newState2;
    case ACTIONS.REMPLACE_ARRAY:
      return action.payload.data;
    case ACTIONS.ADD_FAULT:
      let newState4 = [...state];
      newState4[action.payload.pos].sanciones.push(action.payload.dataFault);
      return newState4;
    case ACTIONS.DELETE_ALL:
      let newState3 = [...state];
      newState3 = [];
      return newState3;
    case ACTIONS.DELETE_FAULT:
      let newState5 = [...state];
      const arrFaults = newState5[action.payload.pos].sanciones.filter(
        (element) => element.id !== action.payload.id
      );
      newState5[action.payload.pos].sanciones = arrFaults;
      return newState5;
    case ACTIONS.ADD_POINT_FL:
      let newState6 = [...state];
      if (action.payload._idPrev) {
        const oldDriver = newState6.find(
          (element) => element.piloto === action.payload._idPrev
        );
        if (oldDriver) {
          newState6[oldDriver.posicion].puntos = puntos[oldDriver.posicion];
        }
      }
      const newDriver = newState6.find(
        (element) => element.piloto === action.payload.id
      );
      if (newDriver) {
        newState6[newDriver.posicion].puntos = puntos[newDriver.posicion] + 1;
      }
      return newState6;
    default:
      return state;
  }
}
const puntos = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const PointsRegister2 = forwardRef(({ callLoading }, ref) => {
  const [open, setOpen] = useState({
      open: false,
      openForm: false,
      openFL: false,
    }),
    [dataFirstAndSecondPs, setDataFirstAndSecondPs] = useState({
      driverPos1: {
        id: false,
        scuderia: false,
      },
      driverPos2: {
        id: false,
        scuderia: false,
      },
    }),
    [dataSelected, dispatch] = useReducer(reducer, []),
    [fastLap, dispatchFastLap] = useReducer(reducerFL, [
      {
        piloto: false,
        minuto: 0,
        segundo: 0,
        decima: 0,
      },
    ]),
    [loadingDriver, setLoadingDriver] = useState(false),
    [data, setData] = useState({
      pointsScuderias: false,
      track: false,
      drivers: false,
      currentCH: false,
      listNamesDrivers: false,
      pointsDrivers: false,
      allScuderias: false,
    }),
    [imagePreview, setImagePreview] = useState(false),
    [image, setImage] = useState({
      loading: false,
      image: false,
      text: false,
    }),
    [ocr, setOcr] = useState(""),
    [driverFinded, setDriverFinded] = useState(""),
    [statusComplete, setStatusComplete] = useState(false),
    [input, setInput] = useState("");
  const childrenTL = useRef();
  const childrenIA = useRef();
  const childrenFL = useRef();
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(
      paramDataScuderias,
      paramDrivers,
      paramCurrentTrack,
      paramCurrentCH,
      paramPointsDrivers,
      paramAllScuderias
    ) {
      handleOpen(
        paramDataScuderias,
        paramDrivers,
        paramCurrentTrack,
        paramCurrentCH,
        paramPointsDrivers,
        paramAllScuderias
      );
    },
    callFnHandleClose() {
      handleClose();
    },
  }));
  const formatDriversName = (drivers) => {
    return new Promise((resolve) => {
      const result = drivers.map((element) =>
        (element.alias !== "false"
          ? element.alias
          : element.nombre
        ).toLowerCase()
      );
      resolve(result);
    });
  };

  const worker = createWorker();
  const convertImageToText = async (paramImage) => {
    if (!paramImage) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(paramImage);
    let wordFormated = formattoArrWords(text);
    let newArrFormated = await fnArrComposed(dataSelected, wordFormated)
    let arrFindedvar = await arrFinder(data.listNamesDrivers, newArrFormated);
    await FinderByAliasName(
      data.drivers,
      data.pointsScuderias,
      arrFindedvar
    ).then(async (response) => {
      setImagePreview(false);
      dispatch({ type: ACTIONS.REMPLACE_ARRAY, payload: { data: response } });
      openTile();
      const scuderiaPos1 = await findScuderiaDriver(
        data.pointsScuderias,
        response[0].piloto
      );
      const scuderiaPos2 = await findScuderiaDriver(
        data.pointsScuderias,
        response[1].piloto
      );
      setDataFirstAndSecondPs({
        ...dataFirstAndSecondPs,
        driverPos1: { id: response[0].piloto, scuderia: scuderiaPos1._id },
        driverPos2: { id: response[1].piloto, scuderia: scuderiaPos2._id },
      });
    });
    setImage({ ...image, text: wordFormated, loading: false });
    await worker.terminate();
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
  const handleOpen = async (
    paramDataScuderias,
    paramDrivers,
    paramCurrentTrack,
    paramCurrentCH,
    paramPointsDrivers,
    paramAllScuderias
  ) => {
    setImage({ ...image, loading: true });
    let formatDrivers = await formatDriversName(paramDrivers);
    setData({
      ...data,
      pointsScuderias: paramDataScuderias,
      track: paramCurrentTrack,
      drivers: paramDrivers,
      currentCH: paramCurrentCH,
      listNamesDrivers: formatDrivers,
      pointsDrivers: paramPointsDrivers,
      allScuderias: paramAllScuderias,
    });
    setLoadingDriver(paramCurrentTrack.pista.nombre);
    let newArr = await flsArr(paramDataScuderias);
    dispatch({ type: ACTIONS.REMPLACE_ARRAY, payload: { data: newArr } });
    setTimeout(() => {
      setOpen({ ...open, open: true });
    }, 200);
    handleOpenIA(paramDrivers);
    setImage({ ...image, loading: false });
  };
  const handleOpenIA = (drivers) => {
    childrenIA.current.callFnHandleOpen(drivers, "nombre", "alias");
  };
  const handleClose = () => {
    dispatch({ type: ACTIONS.DELETE_ALL });
    setDriverFinded("");
    setOpen({ ...open, open: false, openFL: false, openForm: false });
  };
  const findEmptyBoxOrFalseDriver = async (arr) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line array-callback-return
      resolve(
        arr.find((element) => {
          return typeof element !== "object";
        })
      );
    });
  };
  const handleChangueOpenForm = () => {
    setOpen({ ...open, openForm: open.openForm ? false : true });
  };
  const flsArr = (arr) => {
    return new Promise((resolve) => {
      let width = arr.length * 2 > 10 ? 11 : arr.length * 2;
      let nextArr = [];
      for (let index = 0; index < width; index++) {
        nextArr.push(index);
      }
      resolve(nextArr);
    });
  };
  const openTile = () => {
    childrenTL.current.callFnHandleOpen();
  };
  const closeTile = () => {
    childrenTL.current.callFnHandleClose();
  };
  const resultSearch = (dataFinded) => {
    setDriverFinded(dataFinded);
    if (dataFinded) {
      setLoadingDriver(true);
    } else {
      setLoadingDriver(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      setImage({ ...image, image: file });
      setImagePreview(imageDataUri);
      // convertImageToText(imageDataUri);
    };
    reader.readAsDataURL(file);
    // console.log(reader.readAsDataURL(file))
  };
  const findSameDriver = () => {
    return new Promise((resolve) => {
      const eachArr = dataSelected.find((element) => {
        if (typeof element === "object") {
          if (element.prev_driver._id === driverFinded._id) {
            return true;
          } else {
            return false;
          }
        }
      });
      if (eachArr) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };
  const onPressEnter = async (statusDriver) => {
    if (statusDriversSelected()) setImage({ ...image, loading: true });
    let i = await findEmptyBoxOrFalseDriver(dataSelected);
    const statusArrDriver = await findSameDriver();

    if (i || i === 0) {
      if (statusDriver) {
        let image = await findImage(driverFinded.carpetaPiloto);
        let newdriverFinded = {};
        newdriverFinded.prev_driver = driverFinded;
        newdriverFinded.image = image;
        newdriverFinded.posicion = i;
        newdriverFinded.puntos = puntos[i];
        newdriverFinded.sanciones = [];
        let statusDriverFinded = await MotorSearch2(
          newdriverFinded._id,
          dataSelected.piloto,
          "_id"
        );
        if (!statusDriverFinded && !statusArrDriver) {
          const statusScuderia = await findScuderiaDriver(
            data.pointsScuderias,
            driverFinded._id
          );
          let newSchemma = {
            id: driverFinded._id,
            scuderia: statusScuderia._id,
          };
          i === 0 &&
            setDataFirstAndSecondPs({
              ...dataFirstAndSecondPs,
              driverPos1: newSchemma,
            });
          i === 1 &&
            setDataFirstAndSecondPs({
              ...dataFirstAndSecondPs,
              driverPos2: newSchemma,
            });
          if (statusScuderia) {
            console.log(statusScuderia)
            newdriverFinded.colors = statusScuderia.colors;
            dispatch({
              type: ACTIONS.INCREMENT,
              payload: { driver: newdriverFinded, pos: i },
            });
            openTile();
            setInput("");
            setImage({ ...image, loading: false });
          } else {
            setLoadingDriver(
              "piloto no se encuentra registrado en ninguna escuderia"
            );
            setImage({ ...image, loading: false });
          }
        } else {
          setDriverFinded("");
          setLoadingDriver("Piloto ya registrado");
          setImage({ ...image, loading: false });
        }
      } else {
        setLoadingDriver(
          "piloto no se encuentra registrado en ninguna escuderia"
        );
        setImage({ ...image, loading: false });
      }
    } else {
      setImage({ ...image, loading: false });
      return null;
    }
    setDriverFinded("");
    setImage({ ...image, loading: false });
  };

  const handleChangueOpenFastLap = () => {
    if (open.openFL) {
      setOpen({ ...open, openFL: false });
    } else {
      childrenFL.current.callFnHandleOpen(data.drivers);
      setOpen({ ...open, openFL: true });
    }
  };
  const scrollListener = async (e) => {
    let element = document.getElementById("content");
    // e.preventDefault();
    element.scrollBy({
      left: e.deltaY < 0 ? -80 : 80,
    });
    // startPosition.current.scrollIntoView({ behavior: "smooth" });
  };
  const setGray = async (e) => {
    setImage({ ...image, loading: true });
    var canvas = document.getElementById("image");
    var img = document.getElementById("dataimage");
    var ctx = canvas.getContext("2d");
    ctx.filter = "invert(1) grayscale(100%) saturate(8) brightness(1)";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let imageEncoded = canvas.toDataURL();
    setImagePreview(imageEncoded);
    await convertImageToText(imageEncoded);
  };
  const statusDriversSelected = () => {
    return dataSelected.find((element) => typeof element === "number");
  };
  const getScuderiaByDriver = (IdDriver, arrScuderia) => {
    return new Promise(async (resolve) => {
      const scuderiaFinder1 = await MotorSearch2(
        IdDriver,
        arrScuderia,
        "piloto1"
      );
      const scuderiaFinder2 = await MotorSearch2(
        IdDriver,
        arrScuderia,
        "piloto2"
      );
      let result = scuderiaFinder1 ? scuderiaFinder1 : scuderiaFinder2;
      if (result) {
        resolve(result);
      } else {
        resolve(false);
      }
    });
  };
  const sendData = async () => {
    const fnBuildSchemmaPointsDrivers = await buildSchemmaPointsDrivers(
      data.pointsDrivers,
      dataSelected
    );
    const fnbuildSchemmaPointsScuderias = await buildSchemmaPointsScuderias(
      data.pointsScuderias,
      fnBuildSchemmaPointsDrivers
    );
    const newSchemmaTotalPoints = {
      id: data.currentCH,
      data: {
        pilotos: fnBuildSchemmaPointsDrivers,
        escuderias: fnbuildSchemmaPointsScuderias,
      },
    };
    let newSchemma = {
      pista: data.track.pista._id,
      campeonato: data.currentCH,
      info: dataSelected,
    };
    let newSchemmaTrack = {
      idTrack: data.track.pista._id,
      record: {
        piloto: fastLap.piloto,
        campeonato: data.currentCH,
        minuto: fastLap.minuto,
        segundo: fastLap.segundo,
        decima: fastLap.decima,
      },
    };
    let newSchemmaUpdateVictoryDriver = {
      id: dataSelected[0].piloto,
      data: {
        pista: data.track.pista._id,
        campeonato: data.currentCH,
      },
    };
    let newSchemmaUpdateVictoryScuderia = {
      id: dataFirstAndSecondPs.driverPos1.scuderia,
      data: {
        piloto: dataFirstAndSecondPs.driverPos1.id,
        pista: data.track.pista._id,
        campeonato: data.currentCH,
      },
    };
    let newSchemmaDoubleteScuderia = {
      id: dataFirstAndSecondPs.driverPos1.scuderia,
      data: {
        primer_lugar: dataFirstAndSecondPs.driverPos1.id,
        segundo_lugar: dataFirstAndSecondPs.driverPos2.id,
        pista: data.track.pista._id,
        campeonato: data.currentCH,
      },
    };
    let stateDoubleteScuderia =
      dataFirstAndSecondPs.driverPos1.scuderia ===
      dataFirstAndSecondPs.driverPos2.scuderia
        ? true
        : false;
    const newSchemmaUpdateStateTrack = {
      id: data.currentCH,
      idTrack: data.track.pista._id,
      estado: true,
    };
    const schemmaData = {
      newSchemma,
      newSchemmaTrack,
      newSchemmaUpdateVictoryDriver,
      newSchemmaUpdateStateTrack,
      newSchemmaTotalPoints,
      newSchemmaUpdateVictoryScuderia,
      newSchemmaDoubleteScuderia,
    };
    const schemmaUrl = {
      urlTrackVitae: "/insert-track-vitae",
      urlInsertRecord: "/insert-record",
      urlUpdateVictoryDriver: "/update-victory-driver",
      urlUpdateStateCH: "/update-state-track-championship",
      urlUpdateCurrentChampionship: "/update-champuonship",
      urlUpdateVictoryScuderia: "/update-victory-scuderia",
      schemmaUpdateDobleteScuderia: {
        state: stateDoubleteScuderia,
        url: "/update-doblete-scuderia",
      },
    };
    callLoading(schemmaData, schemmaUrl, "postPoints");
  };
  const ContentBackLetters = () => {
    if (open.open) {
      return (
        <div
          className={
            open.openForm && !open.openFL
              ? "letters animation-right-to-leftt-open"
              : "letters animation-right-to-left"
          }
        >
          <div className="big-letters letters-align">
            <input
              type="file"
              id="file-upload"
              onChange={handleImageChange}
              className="input-autocomplete"
            />
            <label
              for="file-upload"
              className="file-back-letters"
              // onClick={handleOpenChangeNameScuderia}
              // value={dataInput.scuderiaName}
            >
              {typeof driverFinded === "object"
                ? driverFinded.nombre
                : data.track.pista.nombre}
            </label>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const FnInputAutocomplete = () => {
    return (
      <div
        className={
          open.openForm && !open.openFL
            ? "animation-left-to-right-open container-input-drivers index-2"
            : "animation-left-to-right container-input-drivers"
        }
      >
        {!statusComplete ? (
          <InputAutocomplete
            ref={childrenIA}
            resultSearch={resultSearch}
            onPressEnter={onPressEnter}
          />
        ) : null}
        {/* <input
            className="input-autocomplete"
            type="text"
            id="scuderia-name"
            onKeyPress={(e) => {
              addProgress(e);
            }}
          /> */}
        <p class="helper helper1">Piloto</p>
      </div>
    );
  };
  const FastLapComponent = () => {
    return (
      <div
        className={
          open.openFL
            ? "animation-up-to-down-open general-container"
            : "animation-up-to-down general-container"
        }
      >
        <FastLapRegister
          ref={childrenFL}
          dispatch={dispatch}
          dispatchFastLap={dispatchFastLap}
          handleChangueOpenFastLap={handleChangueOpenFastLap}
        />
      </div>
    );
  };
  const SchemmaFormFL = () => {
    return (
      <div
        className="container-switch-btn container-switch-btn-fast-lap"
        // onClick={() => console.log(data.po}intsScuderias)}
        onClick={handleChangueOpenFastLap}
      >
        <small>
          {!open.openFL ? "Abrir Vuelta Rápida" : "Cerrar Vuelta Rápida"}
        </small>
      </div>
    );
  };
  const SchemmaFormRegister = () => {
    if (!open.openFL) {
      return (
        <div className="container-switch-btn " onClick={handleChangueOpenForm}>
          <small>{open.openForm ? "Cerrar Registro" : "Abrir Registro"}</small>
        </div>
      );
    } else {
      return null;
    }
  };
  const SchemmaFormCompleted = () => {
    let fastLapStatus = fastLap.piloto;
    if (fastLapStatus && !statusDriversSelected() && !open.openFL) {
      return (
        <div className="container-switch-btn bottom-20" onClick={sendData}>
          <small>registrar Puntuaciones</small>
        </div>
      );
    } else {
      return null;
    }
  };
  const ContainerImagePreview = () => {
    if (open.openForm) {
      return (
        <div className="container-image-preview">
          <canvas
            id="image"
            width="800px"
            height="1200px"
            style={{ display: "none" }}
          ></canvas>
          <img src={imagePreview} id="dataimage" />
        </div>
      );
    } else {
      return null;
    }
  };
  const SchemmaPR2 = () => {
    return (
      <>
        {image.loading ? <Loadingv2 /> : null}
        <div
          onWheel={scrollListener}
          className={
            open.open
              ? "  general-container-tiles index-1 animation-right-to-leftt-open"
              : "   general-container-tiles-closed index-0 animation-right-to-left"
          }
        >
          {ContainerImagePreview()}
          <div className=" vertical-container">
            {SchemmaFormRegister()}
            {SchemmaFormCompleted()}
            <div className="container-switch-btn bottom15" onClick={setGray}>
              <small>
                {imagePreview && !open.openFL ? "Generar Registro" : null}
              </small>
            </div>
            {SchemmaFormFL()}

            <div className="container-form-podium">{FnInputAutocomplete()}</div>
            <div className="container-back-letters  index--1">
              {ContentBackLetters()}
            </div>
          </div>
          <div
            className={
              !open.openFL
                ? "animation-up-to-down-open general-container"
                : "animation-up-to-down general-container"
            }
          >
            {FastLapComponent()}
            <Tile
              ref={childrenTL}
              dropTile={closeTile}
              dispatch={dispatch}
              driversData={dataSelected}
              status={"register"}
            />
          </div>
        </div>
      </>
    );
  };

  return SchemmaPR2();
});
