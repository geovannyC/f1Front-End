import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import useForceUpdate from "use-force-update";
import { choseRandomItem } from "../chose-random-Intem/choseRandomItem";

export const Championship = forwardRef(({callLoading}, ref) => {
  const [open, setOpen] = useState(false),
    [rivalChoosed, setRivalChoosed] = useState({
      driver: false,
      scuderia: false,
    }),
    [name, setName] = useState(false),
    [data, setData] = useState({
      AllTracks: false,
      AllScuderias: false,
      AllChampionships: false,
      AllDrivers: false,
      currentCh: false,
    }),
    [openFormNC, setOpenFormNC] = useState(false),
    [dataSelected, setDataSelected] = useState({
      tracksSelected: [],
      scuderiasSelected: [],
      driversSelected: []
    });
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(paramTracks, paramScuderias, paramChampionships, paramDrivers, paramCurrentCh) {
      handleOpen(paramTracks, paramScuderias, paramChampionships, paramDrivers,paramCurrentCh);
    },
    callFnHandleClose() {
      handleClose();
    },
  }));
  const forceUpdate = useForceUpdate();
  const handleOpenFormNC = () => {
    openFormNC ? setOpenFormNC(false) : setOpenFormNC(true);
  };
  const handleOpen = (paramTracks, paramScuderias, paramChampionships, paramDrivers,paramCurrentCh) => {
    setData({
      AllScuderias: paramScuderias,
      AllDrivers: paramDrivers,
      AllTracks: paramTracks,
      AllChampionships: paramChampionships,
      currentCh: paramCurrentCh,
    })
    setTimeout(() => {
      setOpen(true);
    }, 200);
  };
  const handleClose = () => {
    setData({
      AllTracks: false,
      AllScuderias: false,
      AllChampionships: false,
      AllDrivers: false
    })
    setOpen(false);
    setName(false);
    setOpenFormNC(false);
    setDataSelected({
      tracksSelected: [],
      scuderiasSelected: [],
      driversSelected: []
    })
  };

  const findTrack = (arrValues,value) => {
    let arr = arrValues
    if (arr) {
      let result = arr.every((element) => {
        if (element === value) {
          return false;
        } else {
          return true;
        }
      });
      return result;
    } else {
      return false;
    }
  };
  const fnTrackSelected = async (event) => {
    let newArr = [...dataSelected.tracksSelected];
    if (newArr.length === 0) {
      newArr.push(event);
    } else {
      if (!findTrack( newArr,event)) {
        newArr.splice(newArr.indexOf(event), 1);
      } else {
        newArr.push(event);
      }
    }
    setDataSelected({...dataSelected, tracksSelected: newArr})
    forceUpdate();
  };
  const fnScuderiaSelected = (event) => {
    let newArrScuderias = [...dataSelected.scuderiasSelected];
    let newArrDrivers = [...dataSelected.driversSelected];
    if (newArrScuderias.length === 0) {
      newArrScuderias.push(event);
      newArrDrivers.push(event.piloto1,event.piloto2)
    } else {
      if (!findTrack(newArrScuderias, event)) {
        newArrScuderias.splice(newArrScuderias.indexOf(event), 1);
        newArrDrivers.splice(newArrScuderias.indexOf(event.piloto1),1)
        newArrDrivers.splice(newArrScuderias.indexOf(event.piloto2),1)
      } else {
        newArrScuderias.push(event);
        newArrDrivers.push(event.piloto1,event.piloto2)
      }
    }
    setDataSelected({...dataSelected, scuderiasSelected: newArrScuderias, driversSelected: newArrDrivers})
    forceUpdate();
  };
  const shuffle = (array) => {
    const mix = array.sort(() => Math.random() - 0.5);
    return mix;
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const findByState = () => {
    return new Promise((resolve) => {
      const result = data.AllChampionships.find((element) => element.playing === true);
      resolve(result);
    });
  };
  const handleChangeCurrentChampionship = async (value) => {
    let urlCh = "/update-champuonship";
    let formatNewChChangue = {
      id: value._id,
      data: {
        playing: value.playing?false:true,
      }
    };
    if(value._id===data.currentCh.id){
      callLoading(formatNewChChangue, urlCh, "post");
      handleOpen();
    }else{
      let formatCurrnChange = {
        _id: data.currentCh.id,
        playing: data.currentCh.state?false:true,
      };
      let schemma = {
        formatCurrnChange,
        formatNewChChangue
      }
      callLoading(schemma, urlCh, "changueChampionship");
    }
  };
  let shuffleTracks = async () => {
    let newArr = [...dataSelected.tracksSelected]
    await shuffle(newArr);
    setDataSelected({...dataSelected, tracksSelected: newArr})
    
    forceUpdate();
  };
  const buildSchemmaTracks = (tracks) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line array-callback-return
      resolve(
        tracks.map((item) => {
          return {
            posicion: tracks.indexOf(item),
            estado: false,
            pista: item._id,
          };
        })
      );
    });
  };
  const buildSchemmaScuderias = (scuderias) => {
    return new Promise((resolve) => {
      resolve(
        scuderias.map((item) => {
          return {
            puntos: 0,
            escuderia: item._id,
            sanciones: 0,
            advertencias: 0,
          };
        })
      );
    });
  };
  const buildSchemmaDrivers = (drivers) => {
    return new Promise((resolve) => {
      resolve(
        drivers.map((item) => {
          return {
            piloto: item._id,
            puntos: 0,
            sanciones: 0,
            advertencias: 0,
          };
        })
      );
    });
  };
  const buildShemma = async () => {
    let shemmaTracks = await buildSchemmaTracks([...dataSelected.tracksSelected]);
    let shemmaScuderias = await buildSchemmaScuderias([...dataSelected.scuderiasSelected]);
    let shemmaDrivers = await buildSchemmaDrivers([...dataSelected.driversSelected]);
    const shemmaChampionship = {
      nombre: name,
      playing: false,
      pistas: shemmaTracks,
      escuderias: shemmaScuderias,
      pilotos: shemmaDrivers
    }
    const urlCh = "/create-championship";
    callLoading(shemmaChampionship, urlCh, "post")
  };
  const drawTracksSelected = () => {
    let arrTrackSelected = dataSelected.tracksSelected
    if (arrTrackSelected) {
      return arrTrackSelected.map((result) => {
        if (result) {
          return (
            <div className="container-tracks-selected">
              <small>{`${arrTrackSelected.indexOf(result) + 1}`}</small>
              <small>{`${result.nombre}`}</small>
            </div>
          );
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  };
  const drawScuderiasSelected = () => {
    let arrScuderiasSelected = dataSelected.scuderiasSelected
    if (arrScuderiasSelected) {
      return arrScuderiasSelected.map((result) => {
        if (result) {
          return (
            <div
              className={
                rivalChoosed.scuderia === result.nombreEscuderia
                  ? "container-tracks-selected red-txt"
                  : "container-tracks-selected"
              }
            >
              <small>{`${arrScuderiasSelected.indexOf(result) + 1}`}</small>
              <small>{`${result.nombreEscuderia}-${
                rivalChoosed.driver ? rivalChoosed.driver : ""
              }`}</small>
            </div>
          );
        } else {
          return null;
        }
      });
    } else {
      return null;
    }
  };
  const selectRandomScuderia = async () => {
    let arrScuderiasSelected = [...dataSelected.scuderiasSelected]
    let itm = await choseRandomItem(arrScuderiasSelected);
    return itm;
  };
  const selectRandomDriver = async () => {
    let scuderiaChosed = await selectRandomScuderia();
    let driver = await choseRandomItem([
      scuderiaChosed.piloto1,
      scuderiaChosed.piloto2,
    ]);
    setRivalChoosed({
      scuderia: scuderiaChosed.nombreEscuderia,
      driver: driver.nombre,
    });
    forceUpdate();
  };
  const ContainerChampionship = () => {
    if (open) {
      return (
        <div className="general-container">
          <div className="grid-five-rows-25">
            <div
              className={
                open
                  ? "column1-schemma animation-up-to-down-open"
                  : " column1-schemma animation-up-to-down"
              }
            >
              <small className="secondary-color">Crear Campeonato</small>
              <input
                className="input-autocomplete"
                type="text"
                onChange={handleChangeName}
              />
              {dataSelected.tracksSelected.length > 1 && openFormNC ? (
                <button
                  type="Button"
                  className="input-autocomplete"
                  onClick={shuffleTracks}
                >
                  Mezclar Pistas
                </button>
              ) : null}
              {dataSelected.scuderiasSelected.length > 1 && openFormNC ? (
                <button
                  type="Button"
                  className="input-autocomplete"
                  onClick={selectRandomDriver}
                >
                  Seleccionar Piloto
                </button>
              ) : null}
              <button
                type="Button"
                className="input-autocomplete"
                onClick={openFormNC ? buildShemma : handleOpenFormNC}
              >
                Crear nuevo Campeonato
              </button>
              {openFormNC ? (
                <>
                  <button
                    type="Button"
                    className="input-autocomplete"
                    onClick={handleOpenFormNC}
                  >
                    Cancelar
                  </button>
                  <button
                    type="Button"
                    className="input-autocomplete"
                    onClick={()=>console.log(dataSelected.driversSelected)}
                  >
                    test
                  </button>
                </>
              ) : null}
            </div>
            {openFormNC ? (
              <div className="column1-shemma-normal white-color-container container-scroll-tracks-selected">
                {drawTracksSelected()}
              </div>
            ) : null}
            {openFormNC ? (
              <div className="column1-shemma-normal white-color-container container-scroll-tracks-selected">
                {drawScuderiasSelected()}
              </div>
            ) : null}
            {!openFormNC ? (
              <div
                className={
                  !openFormNC
                    ? "column1-schemma animation-left-to-right-open"
                    : " column1-schemma animation-left-to-right"
                }
              >
                {data.AllChampionships
                  ? data.AllChampionships.map((result) => {
                      return (
                        <button
                          className={
                            result.playing
                              ? "input-autocomplete  btn-selected"
                              : "input-autocomplete"
                          }
                          onClick={() =>
                            handleChangeCurrentChampionship(result)
                          }
                        >
                          {result.nombre}
                        </button>
                      );
                    })
                  : null}
              </div>
            ) : null}

            <div
              className={
                openFormNC
                  ? "column1-schemma animation-left-to-right-open"
                  : " column1-schemma animation-left-to-right"
              }
            >
              {data.AllTracks.map((result) => {
                return (
                  <div className="track-chose-ch">
                    <div className="container-track-chos">
                      <button
                        className={
                          !findTrack(dataSelected.tracksSelected,result)
                            ? "input-autocomplete w-input-tracks btn-selected"
                            : "input-autocomplete w-input-tracks "
                        }
                        onClick={() => fnTrackSelected(result)}
                      >{`Pista ${result.nombre}`}</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={
                openFormNC
                  ? "column1-schemma animation-right-to-leftt-open"
                  : " column1-schemma animation-right-to-left"
              }
            >
              {data.AllScuderias.length > 0
                ? data.AllScuderias.map((result) => {
                    return (
                      <div className="track-chose-ch">
                        <div className="container-track-chos">
                          <button
                            className={
                              !findTrack(dataSelected.scuderiasSelected, result)
                                ? "input-autocomplete w-input-tracks btn-selected "
                                : "input-autocomplete w-input-tracks"
                            }
                            onClick={() => fnScuderiaSelected(result)}
                          >{`Scuderia ${result.nombreEscuderia}`}</button>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const HandleChangueLoading = () => {
    if (data.AllScuderias && data.AllDrivers  && data.AllTracks) {
      return ContainerChampionship();
    } else {
      return null;
    }
  };
  return HandleChangueLoading();
});
