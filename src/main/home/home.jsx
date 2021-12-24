import React, { useEffect, useState, useRef } from "react";
import Menu from "../menu/menu";
import { Table } from "../table/table";
import "../../css/style.css";
import { PodiumV2 } from "../podiumv2/podiumv2";
import { DriverRegister } from "../driver-register/driverRegister";
import { RegisterTrack } from "../register-track/registerTrack";
import { PointsRegister } from "../points-register/pointsRegister";
import { ScuderiaRegister } from "../scuderia-register/scuderiaRegister";
import { Championship } from "../championships/championships";
import { Loading } from "../loading/loading";
import { LoadingF } from "../loading/loadingFetch";
import { LoadingAwait } from "../loading/loadingAwait";
import { FaultFormat } from "../fault-register/faultRegister";
import { ScuderiaEditor } from "../scuderia-editor/scuderiaEditor";
import { getData, sendData } from "../../until/fetch";
import { Login } from "../login/login";
import { OndaWordRegister } from "../ondaWordRegister/ondaWordRegister";
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
    [step, setStep] = useState(false),
    [isLoged, setIsLoged] = useState(false),
    [loading, setLoading] = useState(true),
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
    [count, setCount] = useState(0),
    [folders, setFolders] = useState(false);
  useEffect(() => {
    loginStatus();
    // eslint-disable-next-line
  }, []);
  useInterval(
    () => {
      sendDataPointsDriver(count);
      setCount(count + 1);
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
    !loading ? 35000 : null
  );
  const childRefRT = useRef();
  const childRefRD = useRef();
  const childRefPR = useRef();
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
        console.log(response)
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
    if (value === -1) {
      childRefOW.current.callFnHandleOpen();
    } else if (value === 0) {
      if (state === undefined) {
        childrenP2.current.callFnHandleOpen(tracksCh, driversVitaeCh);
      } else {
        childrenP2.current.callFnHandleClose();
      }
    } else if (value === 1) {
      childRefTB.current.callFnHandleOpenTable(
        scuderiasCh,
        tracksCh,
        driversCh,
        driversVitaeCh,
        drivers
      );
    } else if (value === 2) {
      childRefPR.current.callFnRpHandleOpen(scuderiasCh, drivers, currentTrack);
    } else if (value === 3) {
      childRefRT.current.callFnHandleOpen();
    } else if (value === 4) {
      childRefRD.current.callFnHandleRDOpen(folders);
    } else if (value === 5) {
      childrenSR.current.callFnHandleOpen(drivers, folders);
    } else if (value === 7) {
      childRefFF.current.callFnHandleOpen(driversCh, drivers);
    } else if (value === 8) {
      childRefSE.current.callFnHandleOpen(scuderias, drivers, folders);
    } else if (value === 6) {
      childrenCH.current.callFnHandleOpen(tracks, scuderias, championships);
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
      let arrImages = [];
      function fndMapImages() {
        images.forEach((element) => {
          arrImages.push(element.default);
        });
      }
      resolve(fndMapImages());
      setWallBackground(arrImages);
    });
  };
  const choseRndImage = () => {
    return new Promise((resolve) => {
      let item =
        wallBackground[Math.floor(Math.random() * wallBackground.length)];
      resolve(item);
    });
  };
  const changeWall = () => {
    setPreviousChangeWall(false);
    setTimeout(async () => {
      await choseRndImage().then((response) => {
        setPreviousChangeWall(true);
        setCurrentWallpaper(response);
      });
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
  const sendDataPointsDriver = async (index) => {
    let flap = dataToFetch.data.dataFasLap;
    let ruleteD = dataToFetch.data.dataRulete;
    let url = dataToFetch.url;
    let urlCh = "/update-track-championship";
    let urlDriver = "/update-driver";
    let urlUpdateScuderia = "/update-scuderia";
    let urlUpdateChampionshipScuderia = "/update-championship-scuderia";
    let urlUpdateChampionshipDriver = "/update-championship-driver";
    let urlCreateChampionshipScuderia = "/create-championship-scuderia";
    let urlCreateChampionshipDriver = "/create-championship-driver";
    if (ruleteD.length > index) {
      let shemmaToPost = {
        piloto: ruleteD[index].driver._id,
        pistaCampeonato: flap.track._id,
        championship: flap.championship._id,
        posicion: ruleteD[index].posicion,
        puntos: ruleteD[index].puntos,
      };
      setIntervalRPoints(false);
      sendData(JSON.stringify(shemmaToPost), url.urlDriverVitae).then(
        async (response) => {
          if (!response) {
            switchAction("error");
            setIntervalRPoints(false);
          }
          if (response) {
            let urlChampionshipScuderia = `/find-championship-scuderia/${ruleteD[index].escuderia.escuderia._id}/${ruleteD[index].escuderia.championship._id}`;
            let urlDriverChampionship = `/find-championship-driver/${shemmaToPost.piloto}/${shemmaToPost.championship}`;
            let shemmaChampionshipScuderia = {
              escuderia: ruleteD[index].escuderia.escuderia._id,
              championship: ruleteD[index].escuderia.championship._id,
              victorias: 0,
              sanciones: 0,
              puntos: 0,
            };
            let shemaDriverChampionship = {
              piloto: shemmaToPost.piloto,
              championship: shemmaToPost.championship,
              puntos: 0,
            };
            setIntervalRPoints(false);
            await getData(urlChampionshipScuderia).then(async (responseSCH) => {
              if (responseSCH) {
                shemmaChampionshipScuderia._id = responseSCH[0]._id;
                shemmaChampionshipScuderia.puntos =
                  responseSCH[0].puntos + shemmaToPost.puntos;
                setIntervalRPoints(false);
                await sendData(
                  JSON.stringify(shemmaChampionshipScuderia),
                  urlUpdateChampionshipScuderia
                ).then((responseSCH) => {
                  if (!responseSCH) {
                    switchAction("error");
                    setIntervalRPoints(false);
                  }
                });
              } else {
                shemmaChampionshipScuderia.puntos = shemmaToPost.puntos;
                setIntervalRPoints(false);
                await sendData(
                  JSON.stringify(shemmaChampionshipScuderia),
                  urlCreateChampionshipScuderia
                ).then((responseCC) => {
                  if (responseCC) {
                    switchAction("error");
                    setIntervalRPoints(false);
                  }
                });
              }
            });
            setIntervalRPoints(false);
            await getData(urlDriverChampionship).then(async (responceDCH) => {
              if (responceDCH) {
                shemaDriverChampionship._id = responceDCH[0]._id;
                shemaDriverChampionship.puntos =
                  responceDCH[0].puntos + shemmaToPost.puntos;
                setIntervalRPoints(false);
                await sendData(
                  JSON.stringify(shemaDriverChampionship),
                  urlUpdateChampionshipDriver
                ).then((responseUCHD) => {
                  if (!responseUCHD) {
                    switchAction("error");
                    setIntervalRPoints(false);
                  }
                });
              } else {
                shemaDriverChampionship.puntos = shemmaToPost.puntos;
                shemaDriverChampionship.sanciones = 0;
                setIntervalRPoints(false);
                await sendData(
                  JSON.stringify(shemaDriverChampionship),
                  urlCreateChampionshipDriver
                ).then((responseCD) => {
                  if (!responseCD) {
                    switchAction("error");
                    setIntervalRPoints(false);
                  }
                });
              }
            });
            if (index === 0) {
              let shemmaUpdateDriver = {
                _id: ruleteD[0].driver._id,
                victorias: ruleteD[0].driver.victorias + 1,
              };
              setIntervalRPoints(false);
              sendData(JSON.stringify(shemmaUpdateDriver), urlDriver).then(
                (response) => {
                  let driverPosition1 = ruleteD[0].escuderia.escuderia;
                  let driverPosition2 = ruleteD[1].escuderia.escuderia;
                  let dob = driverPosition1._id === driverPosition2._id;
                  let arr = driverPosition1.doblete;
                  let victories = driverPosition1.victorias
                    ? driverPosition1.victorias
                    : 0;
                  if (response) {
                    let schemmaUpdateScuderia = {
                      _id: driverPosition1._id,
                      escuderia: ruleteD[0].escuderia._id,
                      championship: shemmaToPost.championship,
                      victorias: victories + 1,
                      doblete: dob ? arr + 1 : arr,
                    };
                    setIntervalRPoints(false);
                    sendData(
                      JSON.stringify(schemmaUpdateScuderia),
                      urlUpdateScuderia
                    ).then((response) => {
                      if (response) {
                        setIntervalRPoints(false);
                        sendData(
                          JSON.stringify(schemmaUpdateScuderia),
                          urlUpdateChampionshipScuderia
                        ).then((response2) => {
                          if (response2) {
                            setIntervalRPoints(true);
                            switchAction(
                              "points",
                              ruleteD[index].driver.nombre
                            );
                          } else {
                            switchAction("error");
                            setIntervalRPoints(false);
                          }
                        });
                      } else {
                        switchAction("error");
                        setIntervalRPoints(false);
                      }
                    });
                  } else {
                    switchAction("error");
                    setIntervalRPoints(false);
                  }
                }
              );
            } else {
              setIntervalRPoints(true);
              switchAction("points", ruleteD[index].driver.nombre);
            }
          }
        }
      );
    } else if (ruleteD.length === index) {
      let shemmaToPost = {
        piloto: flap.driver._id,
        pistaCampeonato: flap.track._id,
        time: [flap.minute, flap.seconds, flap.miliseconds],
        championship: flap.championship._id,
        posicion: flap.posicion,
      };
      setIntervalRPoints(false);
      sendData(JSON.stringify(shemmaToPost), url.urlFlapDriver).then(
        (response) => {
          if (!response) {
            switchAction("error");
            setIntervalRPoints(false);
          } else {
            switchAction("points", `Vuelta Rápida de ${flap.driver.nombre}`);
            setIntervalRPoints(true);
          }
        }
      );
    } else if (ruleteD.length + 1 === index) {
      if (typeof flap.isRecord === "object") {
        setIntervalRPoints(false);
        sendData(JSON.stringify(flap.isRecord), url.urlUpdateTrack).then(
          (response) => {
            if (!response) {
              switchAction("error");
              setIntervalRPoints(false);
            } else {
              switchAction(
                "points",
                `Nuevo record de pista en ${flap.track.nombre}`
              );
              setIntervalRPoints(true);
            }
          }
        );
      }
    } else {
      setIntervalRPoints(false);
      let shemmaCurrentTracl = {
        idTrackChampionship: currentTrack._id,
        estado: true,
      };
      sendData(JSON.stringify(shemmaCurrentTracl), urlCh).then((response) => {
        if (response) {
          switchAction("points", `Puntos Registrados`);
          onLoadPage();
        } else {
          switchAction("error");
          setIntervalRPoints(false);
          onLoadPage();
        }
      });
    }
  };
  const goData = async () => {
    if (dataToFetch.type === "post") {
      switchAction("loading", "Cagando");
      await sendData(JSON.stringify(dataToFetch.data), dataToFetch.url).then(
        (response) => {
          if (response) {
            switchAction("Registrado!", "Registrado!");
            onLoadPage();
          } else {
            switchAction("error", "error");
            setIntervalRPoints(false);
            onLoadPage();
          }
        }
      );
    } else if (dataToFetch.type === "postPoints") {
      setTimeout(() => {
        switchAction("points", "Cagando");
        setIntervalRPoints(true);
      }, 1500);
    }
  };
  const onLoadPage = async () => {
    if (loading ) {
      childRefLL.current.callFnHandleOpen("loading");
      await handleSetWallBackground();
      await choseRndImage().then((responsewall) => {
        setCurrentWallpaper(responsewall);
      });
      await getData("/find-folders").then((response) => {
        if (response) {
          setFolders(response);
        }
      });
      await getData("/find-track").then(async (response) => {
        if (response) {
          setTracks(response);
          if (response.length > 1) {
            await getData("/find-driver").then(async (response2) => {
              setDrivers(response2);
              if (response2) {
                if (response2.length > 1) {
                  await getData("/find-scuderia").then(async (response3) => {
                    if (response3) {
                      setScuderias(response3);
                      if (response3.length > 1) {
                        await getData("/findChampionship").then(
                          async (response4) => {
                            if (response4) {
                              setChampionships(response4);
                              await findPlayingCh(response4).then(
                                async (findCrrCh) => {
                                  if (findCrrCh) {
                                    await getData(
                                      `/find-track-championship/${findCrrCh._id}`
                                    ).then(async (tracksCham) => {
                                      if (tracksCham) {
                                        let orderTracks = tracksCham.sort(
                                          (a, b) => {
                                            return a.posicion - b.posicion;
                                          }
                                        );

                                        let currentTrack =
                                          await findCurrentTrack(tracksCham);
                                        setTracksCh(orderTracks);
                                        setCurrentTrack(currentTrack);
                                        await getData(
                                          `/find-championship-scuderias/${findCrrCh._id}`
                                        ).then(async (scuderiasCham) => {
                                          setScuderiasCh(scuderiasCham);
                                          if (scuderiasCham) {
                                            await getData(
                                              `/find-all-drivers-championship/${findCrrCh._id}`
                                            ).then(async (response5) => {
                                              if (response5) {
                                                setDriversCh(response5);
                                                await getData(
                                                  `/find-driver-vitae-championship/${findCrrCh._id}`
                                                ).then(async (response7) => {
                                                  if (response7) {
                                                    if (currentTrack) {
                                                      setCurrentTrack(
                                                        currentTrack
                                                      );
                                                      setStep(6);
                                                      setLoading(false);
                                                      childRefLL.current.callFnHandleClose();
                                                    } else {
                                                      setStep(10);
                                                      setLoading(false);
                                                      childRefLL.current.callFnHandleClose();
                                                    }
                                                    setDriversVitaeCh(
                                                      response7
                                                    );
                                                  } else {
                                                    setStep(5);
                                                    setLoading(false);
                                                    childRefLL.current.callFnHandleClose();
                                                  }
                                                });
                                              } else {
                                                setStep(5);
                                                setLoading(false);
                                                childRefLL.current.callFnHandleClose();
                                              }
                                            });
                                          } else {
                                            setStep(4);
                                            setLoading(false);
                                            childRefLL.current.callFnHandleClose();
                                          }
                                        });
                                      } else {
                                        setStep(4);
                                        setLoading(false);
                                        childRefLL.current.callFnHandleClose();
                                      }
                                    });
                                  } else {
                                    setStep(4);
                                    setLoading(false);
                                    childRefLL.current.callFnHandleClose();
                                  }
                                }
                              );
                            } else {
                              setStep(4);
                              setLoading(false);
                              childRefLL.current.callFnHandleClose();
                            }
                          }
                        );
                      } else {
                        setStep(3);
                        setLoading(false);
                        childRefLL.current.callFnHandleClose();
                      }
                    } else {
                      setStep(3);
                      setLoading(false);
                      childRefLL.current.callFnHandleClose();
                    }
                  });
                } else {
                  setStep(2);
                  setLoading(false);
                  childRefLL.current.callFnHandleClose();
                }
              } else {
                setStep(2);
                setLoading(false);
                childRefLL.current.callFnHandleClose();
              }
            });
          }
        } else {
          setStep(1);
          setLoading(false);
          childRefLL.current.callFnHandleClose();
        }
      });
      if (!currentWallpaper) {
        choseRndImage();
        changeWall();
      }
    }
  };
  const SchemmaSwitchComponents = () => {
    return (
      <div className="containerHome">
        {CapWall()}
        <img alt="" src={currentWallpaper} className="image-wall" />
        <Menu optionMenu={optionMenu} step={step} />
        {/* <FLap/> */}
        {/* <div className="temcontainer"> */}
        {/* <Rdrivers/> */}
        {/* <AutoComplete/> */}
        {/* </div> */}
        {/* <DataDriver ref={childRefDD}/> */}
        {/* <CardsPodium ref={childrenP2} /> */}
        <LoadingF ref={childRefLF} callFetch={() => goData()} />
        <Loading ref={childRefLL} />
        <Championship
          ref={childrenCH}
          callLoading={onLoadPage}
          callLoading2={prevData}
        />
        <ScuderiaEditor ref={childRefSE} />
        <FaultFormat ref={childRefFF} callLoading={prevData} />
        <ScuderiaRegister ref={childrenSR} callLoading={prevData} />
        <PodiumV2 ref={childrenP2} />
        <Table ref={childRefTB} />
        <PointsRegister ref={childRefPR} callLoading={prevData} />
        <RegisterTrack ref={childRefRT} callLoading={prevData} />
        <DriverRegister ref={childRefRD} callLoading={prevData} />
        <LoadingAwait ref={childRefLA} />
        <OndaWordRegister ref={childRefOW} callLoading={prevData} />
      </div>
    );
  };
  const SchemmaLogin = () => {
    return (
      <div className="containerHome">
        <Login />
      </div>
    );
  };
  const SwicthLoginHome = () => {
    if (isLoged) {
      return SchemmaSwitchComponents();
    } else {
      return SchemmaLogin();
    }
  };
  return SwicthLoginHome();
}
