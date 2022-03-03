import React, { useEffect, useState, useRef } from "react";
import Menu from "../menu/menu";
import { Table } from "../table/table";
import "../../css/style.css";
import { PodiumV2 } from "../podiumv2/podiumv2";
import useForceUpdate from "use-force-update";
import { DriverRegister } from "../driver-register/driverRegister";
import { RegisterTrack } from "../register-track/registerTrack";
import { PointsRegister } from "../points-register/pointsRegister";
import { ScuderiaRegister } from "../scuderia-register/scuderiaRegister";
import { Championship } from "../championships/championships";
import { Loading } from "../loading/loading";
import { LoadingF } from "../loading/loadingFetch";
// import { LoadingAwait } from "../loading/loadingAwait";
import formula1 from "../images/formula.svg";
import { FaultFormat } from "../fault-register/faultRegister";
import { ScuderiaEditor } from "../scuderia-editor/scuderiaEditor";
import { getData, sendData } from "../../until/fetch";
import { MotorSearch2 } from "../motor-search2.0/motorSearch";
import { Loadingv2 } from "../loading/loadingv2";
import { Login } from "../login/login";
import "./home.css";
import { OndaWordRegister } from "../ondaWordRegister/ondaWordRegister";
import { PointsRegister2 } from "../points-register/pointsRegisterV2";
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
function useInterval2(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
export default function Home() {
  const [wallBackground, setWallBackground] = useState(false),
    [data, setData] = useState({
      allTracks: false,
      trackCh: false, 
      allScuderias: false,
      allChampionships: false,
      dataCurrentChampionship: false,
      dataDrivers: false,
      currentTrack: false,
    }),
    [step, setStep] = useState(false),
    [isLoged, setIsLoged] = useState(false),
    [loading, setLoading] = useState({
      state: true,
      message: "",
    }),
    [listmenu, setListMenu] = useState(false),
    [dataToFetch, setDataToFetch] = useState(false),
    [currentWallpaper, setCurrentWallpaper] = useState(false),
    [previousChangeWall, setPreviousChangeWall] = useState(true),
    [tracks, setTracks] = useState(false),
    [drivers, setDrivers] = useState(false),
    [scuderias, setScuderias] = useState(false),
    [driversCh, setDriversCh] = useState(false),
    [tracksCh, setTracksCh] = useState(false),
    [driversVitaeCh, setDriversVitaeCh] = useState(false),
    [currentTrack, setCurrentTrack] = useState(false),
    [intervalRPoints, setIntervalRPoints] = useState(false),
    [scuderiasCh, setScuderiasCh] = useState(false),
    [championships, setChampionships] = useState(false),
    [count, setCount] = useState({
      timeWallpaper: 0,
      timeLoading: 0,
      timeRPintsv2: 0,
    }),
    [folders, setFolders] = useState(false);
  useEffect(() => {
    loginStatus();
    firstWall();
    // eslint-disable-next-line
  }, []);
  useInterval(
    () => {
      sendDataPointsDriver();
      setCount({ ...count, timeRPintsv2: count.timeRPintsv2 + 1 });
    },
    intervalRPoints ? 350 : null
  );
  function importAll(r) {
    return r.keys().map(r);
  }
  useInterval2(
    () => {
      changeWall();
    },
    !loading.state ? 35000 : null
  );
  // useInterval2(
  //   () => {
  //     upsetCount();
  //   },
  //   loading.state ? 1000 : null
  // );
  const sendDataPointsDriver = async () => {
    const dataDrivers = dataToFetch.data.newSchemma.info;
    const dataFL = dataToFetch.data.newSchemmaTrack;
    const lengthDataDrivers = dataDrivers.length;
    let counter = count.timeRPintsv2;
    switch (true) {
      case counter < lengthDataDrivers:
        return switchAction(
          "points",
          `#${dataDrivers[count.timeRPintsv2].posicion + 1} ${
            dataDrivers[count.timeRPintsv2].prev_driver.nombre
          }`
        );
      case counter >= lengthDataDrivers:
        switchAction(
          "points",
          `Record de vuelta: ${dataFL.record.minuto}:${dataFL.record.segundo}:${dataFL.record.decima}`
        );
        setIntervalRPoints(false);
        return setTimeout(() => {
          childRefLF.current.callFnHandleClose();
          // window.location.reload()
        }, 1500);
      default:
        setCount({ ...count, timeRPintsv2: 0 });
        break;
    }
  };
  const forceUpdate = useForceUpdate();
  // const upsetCount = () => {
  //   let newNum = count.timeLoading + 1;
  //   setCount({ ...count, timeLoading: newNum });
  //   forceUpdate();
  // };
  const childRefRT = useRef();
  const childRefRD = useRef();
  const childRefPR = useRef();
  const childRefPR2 = useRef();
  const childRefTB = useRef();
  const childrenP2 = useRef();
  const childrenSR = useRef();
  const childrenCH = useRef();
  const childRefLF = useRef();
  const childRefLA = useRef();
  const childRefFF = useRef();
  const childRefLL = useRef();
  const childRefSE = useRef();
  const childRefOW = useRef();
  const loginStatus = () => {
    const url = "/get-autorization";
    const idUsr = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (idUsr && token) {
      getData(url).then((response) => {
        if (response) {
          setIsLoged(true);
          onLoadPage();
        } else {
          setIsLoged(false);
        }
      });
    } else {
      setIsLoged(false);
    }
  };
  const switchAction = (value, state) => {
    if (value === 1) {
      childRefOW.current.callFnHandleOpen();
    } else if (value === 9) {
      if (state) {
        childrenP2.current.callFnHandleOpen(tracksCh, driversVitaeCh);
      } else {
        childrenP2.current.callFnHandleClose();
      }
    } else if (value === 11) {
      childRefTB.current.callFnHandleOpenTable(
        data.dataCurrentChampionship.pistas,
        data.trackCh,
        data.dataCurrentChampionship.pilotos,
        data.dataCurrentChampionship.escuderias,
        data.dataDrivers
      );
    } else if (value === 8) {
      if (state) {
        childRefPR2.current.callFnHandleOpen(
          data.dataCurrentChampionship.escuderias,
          data.dataDrivers,
          data.currentTrack,
          data.dataCurrentChampionship._id,
          data.dataCurrentChampionship.pilotos,
          data.allScuderias,
          // currentTrack
        );
      } else {
        childRefPR2.current.callFnHandleClose();
      }
    } else if (value === 3) {
      childRefRT.current.callFnHandleOpen();
    } else if (value === 4) {
      childRefRD.current.callFnHandleRDOpen(folders);
    } else if (value === 5) {
      childrenSR.current.callFnHandleOpen(drivers, folders);
    } else if (value === 10) {
      childRefFF.current.callFnHandleOpen(driversCh, drivers);
    } else if (value === 6) {
      childRefSE.current.callFnHandleOpen(scuderias, drivers, folders);
    } else if (value === 7) {
      if (state) {
        childrenCH.current.callFnHandleOpen(
          data.allTracks,
          data.allScuderias,
          data.allChampionships,
          data.dataDrivers,
          {
            id: data.dataCurrentChampionship._id,
            state: data.dataCurrentChampionship.playing,
          }
        );
      } else {
        childrenCH.current.callFnHandleClose();
      }
    } else if (value === "loading" || value === "points") {
      childRefLF.current.callFnHandleOpen(!state ? "cargando" : state);
    } else if (value === "Registrado!") {
      childRefLF.current.callFnHandleFinished(state);
    } else if (value === "error") {
      // childRefLF.current.callFnHandleClose(state);
    }
  };
  const handleSetWallBackground = () => {
    return new Promise((resolve) => {
      const images = importAll(
        require.context("../images/f1logos/", false, /\.(png|jpe?g|svg)$/)
      );
      // let arrImages = [];

      resolve(
        images.map((element) => {
          return element.default;
        })
      );
      // setWallBackground(arrImages);
    });
  };
  const firstWall = async () => {
    await handleSetWallBackground().then(async (response) => {
      await choseRndImage(response);
    });
  };
  const choseRndImage = (image) => {
    let arrImgs = image ? image : wallBackground;
    return new Promise((resolve) => {
      let item = arrImgs[Math.floor(Math.random() * arrImgs.length)];
      setCurrentWallpaper(item);
      resolve(item);
    });
  };
  const changeWall = () => {
    setPreviousChangeWall(false);
    setTimeout(async () => {
      await choseRndImage();
      setPreviousChangeWall(true);
    }, 4000);
  };
  const findPlayingCh = async (arr) => {
    return new Promise((resolve) => {
      const result = arr.find((element) => element.playing === true);
      resolve(result);
    });
  };
  const findCurrentTrack = async (tracks) => {
    return new Promise((resolve) => {
      let trackFinded;
      tracks.every((track) => {
        if (!track.estado) {
          trackFinded = track;
          return false;
        } else {
          return true;
        }
      });
      resolve(trackFinded);
    });
  };
  const CapWall = () => {
    return (
      <div
        className={previousChangeWall ? "cap-wall" : "cap-wall cap-wall-closed"}
      ></div>
    );
  };
  const optionMenu = (value, state) => {
    switchAction(value, state);
  };
  const prevData = async (data, url, type) => {
    setDataToFetch({
      data: data,
      url: url,
      type: type,
    });
    switchAction("loading");
  };
  const fnSendData = async (data, url) => {
    return await sendData(JSON.stringify(data), url);
  };
  const goData = async () => {
    if (dataToFetch.type === "post") {
      switchAction("loading", "Cagando");
      await fnSendData(dataToFetch.data, dataToFetch.url).then((response) => {
        if (response) {
          switchAction("Registrado!", "Registrado!");
          onLoadPage();
        } else {
          switchAction("error", "error");
          setIntervalRPoints(false);
          onLoadPage();
        }
      });
    } else if (dataToFetch.type === "changueChampionship") {
      switchAction("loading", "Cagando");
      await fnSendData(dataToFetch.data.formatCurrnChange, dataToFetch.url);
      await fnSendData(dataToFetch.data.formatNewChChangue, dataToFetch.url);
      switchAction("Registrado!", "Registrado!");
    } else if (dataToFetch.type === "postPoints") {
      switchAction("points", "Registrando Pilotos");
      await fnSendData(
        dataToFetch.data.newSchemma,
        dataToFetch.url.urlTrackVitae
      );
      await fnSendData(
        dataToFetch.data.newSchemmaTrack,
        dataToFetch.url.urlInsertRecord
      );
      await fnSendData(
        dataToFetch.data.newSchemmaUpdateVictoryDriver,
        dataToFetch.url.urlUpdateVictoryDriver
      );
      await fnSendData(
        dataToFetch.data.newSchemmaUpdateStateTrack,
        dataToFetch.url.urlUpdateStateCH
      );
      await fnSendData(
        dataToFetch.data.newSchemmaUpdateVictoryScuderia,
        dataToFetch.url.urlUpdateVictoryScuderia
      );
      if(dataToFetch.url.schemmaUpdateDobleteScuderia.state){
        await fnSendData(
          dataToFetch.data.newSchemmaDoubleteScuderia,
          dataToFetch.url.schemmaUpdateDobleteScuderia.url
        );
      }
      await fnSendData(dataToFetch.data.newSchemmaTotalPoints, dataToFetch.url.urlUpdateCurrentChampionship)
      setTimeout(() => {
        setIntervalRPoints(true);
      }, 1500);
    }
  };
  const findStatusFalseTrack = (arr) => {
    return new Promise((resolve) => {
      resolve(arr.find((element) => !element.estado));
    });
  };
  const onLoadPage = async () => {
    let schemmaMenu = [];
    let newData = { ...data };
    const urlgetAllCh = "/findChampionship";
    const urlgetAllDrivers = "/find-driver";
    const urlgetAllTracks = "/find-track";
    const urlgetAllScuderias = "/find-scuderia";
    if (loading.state) {
      newData.allTracks = await getData(urlgetAllTracks);
      newData.allScuderias = await getData(urlgetAllScuderias);
      newData.dataDrivers = await getData(urlgetAllDrivers);
      newData.allChampionships = await getData(urlgetAllCh);
      newData.allTracks &&
        newData.dataDrivers &&
        schemmaMenu.push({ title: "Registrar Palabras Ondas", value: 1 });
      schemmaMenu.push(
        { title: "Registrar Pista", value: 3 },
        { title: "Registrar Piloto", value: 4 }
      );
      newData.dataDrivers &&
        schemmaMenu.push({ title: "Registrar Scuderia", value: 5 });
      newData.allScuderias &&
        schemmaMenu.push(
          { title: "Campeonatos", value: 7 },
          { title: "Editar Escuderia", value: 6 }
        );
      if (newData.allChampionships) {
        let stateCh = await MotorSearch2(
          true,
          newData.allChampionships,
          "playing"
        );
        if (stateCh) {
          let urlgetFindCh = `/find-by-id-championship?id=${stateCh._id}`;
          let urlgetTrackCh = `/get-track-vitae-by-ch?idChampionship=${stateCh._id}`
          newData.dataCurrentChampionship = await getData(urlgetFindCh);
          newData.trackCh = await getData(urlgetTrackCh)
          newData.currentTrack = await findStatusFalseTrack(
            newData.dataCurrentChampionship.pistas
          );
          switch (true) {
            case newData.currentTrack &&
              newData.dataCurrentChampionship.pistas[0].estado:
              schemmaMenu.push(
                { title: "Registrar Puntuaciones", value: 8 },
                { title: "Ver Podium", value: 9 },
                { title: "Registrar Sanción", value: 10 },
                { title: "Tabla de Puntuaciones", value: 11 }
              );
              break;
            case !newData.dataCurrentChampionship.pistas[0].estado:
              schemmaMenu.push({ title: "Registrar Puntuaciones", value: 8 });
              break;
            case !newData.currentTrack:
              schemmaMenu.push(
                { title: "Ver Podium", value: 9 },
                { title: "Registrar Sanción", value: 10 },
                { title: "Tabla de Puntuaciones", value: 11 }
              );
              break;

            default:
              break;
          }
        }
      }
      console.log(newData);
      setListMenu(schemmaMenu);
      setLoading({ ...loading, state: false });
    } else {
      setLoading({ ...loading, state: false, message: "error" });
    }
    setData(newData);
    // if (loading.state) {
    //   await getData(urlgetAllCh).then(async (response) => {
    //     if (response) {
    //       let arrTracks = await getData(urlgetAllTracks);
    //       let arrDrivers = await getData(urlgetAllDrivers);
    //       let arrScuderias = await getData(urlgetAllScuderias);
    //       let stateCh = await MotorSearch2(true, response, "playing");
    //       if (stateCh) {
    //         let urlgetFindCh = `/find-by-id-championship?id=${stateCh._id}`;
    //         await getData(urlgetFindCh).then(async (response2) => {
    //           if (response2) {
    //             let stateTracksCh = await findStatusFalseTrack(
    //               response2.pistas
    //             );
    //             setData({
    //               ...data,
    //               allTracks: arrTracks,
    //               allScuderias: arrScuderias,
    //               dataCurrentChampionship: response2,
    //               allChampionships: response,
    //               dataDrivers: arrDrivers,
    //               currentTrack: stateTracksCh,
    //             });
    //             if (stateTracksCh) {
    //               let compare = stateTracksCh === response2.pistas[0];
    //               if (compare) {
    //                 setStep(5);
    //                 setLoading({ ...loading, state: false });
    //               } else {
    //                 setStep(6);
    //                 setLoading({ ...loading, state: false });
    //               }
    //             } else {
    //               let urlGetTrackVitae = `/get-track-vitae/`;
    //               setStep(10);
    //               setLoading({ ...loading, state: false });
    //             }
    //           } else {
    //             setData({
    //               ...data,
    //               allChampionships: response,
    //               dataDrivers: arrDrivers,
    //             });
    //             setLoading({ ...loading, state: false, message: "error" });
    //           }
    //         });
    //       } else {
    //         setStep(4);
    //         setLoading({ ...loading, state: false });
    //       }
    //     } else {
    //       setLoading({ ...loading, state: false, message: "error" });
    //     }
    //   });
    // }
  };
  const SchemmaSwitchComponents = () => {
    return (
      <div className="containerHome">
        {CapWall()}
        <img alt="" src={currentWallpaper} className="image-wall" />
        <Menu listmenu={listmenu} optionMenu={optionMenu} step={step} />
        {/* <FLap/> */}
        {/* <div className="temcontainer"> */}
        {/* <Rdrivers/> */}
        {/* <AutoComplete/> */}
        {/* </div> */}
        {/* <DataDriver ref={childRefDD}/> */}
        {/* <CardsPodium ref={childrenP2} /> */}
        <LoadingF ref={childRefLF} callFetch={() => goData()} />
        {/* <Loading ref={childRefLL} /> */}
        <Championship ref={childrenCH} callLoading={prevData} />
        <PointsRegister2 ref={childRefPR2} callLoading={prevData} />
        <ScuderiaEditor ref={childRefSE} callLoading={prevData} />
        <FaultFormat ref={childRefFF} callLoading={prevData} />
        <ScuderiaRegister ref={childrenSR} callLoading={prevData} />
        <PodiumV2 ref={childrenP2} />
        <Table ref={childRefTB} />
        {/* <PointsRegister ref={childRefPR} callLoading={prevData} /> */}
        <RegisterTrack ref={childRefRT} callLoading={prevData} />
        <DriverRegister ref={childRefRD} callLoading={prevData} />
        {/* <LoadingAwait ref={childRefLA} /> */}
        <OndaWordRegister ref={childRefOW} callLoading={prevData} />
      </div>
    );
  };
  // const SchemmaLoading = () => {
  //   return (
  //     <div className="general-container">
  //       <img
  //         src={formula1}
  //         alt=""
  //         className={
  //           count.timeLoading % 2
  //             ? "filter-loading"
  //             : "filter-loading filter-off"
  //         }
  //       />
  //     </div>
  //   );
  // };
  const SchemmaLogin = () => {
    return (
      <div className="containerHome">
        <Login />
      </div>
    );
  };
  const SwicthLoginHome = () => {
    if (isLoged) {
      if (loading.state) {
        return <Loadingv2 />;
      } else {
        return SchemmaSwitchComponents();
      }
    } else {
      return SchemmaLogin();
    }
  };
  return SwicthLoginHome();
}
