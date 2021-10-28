import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import useForceUpdate from "use-force-update";
import { sendData } from "../../until/fetch";
export const Championship = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [dataScuderia, setDataScuderia] = useState(false),
    [name, setName] = useState(false),
    [dataTracks, setDataTracks] = useState(false),
    [openFormNC, setOpenFormNC] = useState(false),
    [championships, setChampionships] = useState(false),
    [tracksSelected, setTracksSelected] = useState([]),
    [scuderiasSelected, setScuderiasSelected] = useState([]);
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(tracks, scuderias, championships) {
      handleOpen(tracks, scuderias, championships);
    },
  }));
  const forceUpdate = useForceUpdate();
  const handleOpenFormNC = () => {
    openFormNC ? setOpenFormNC(false) : setOpenFormNC(true);
  };
  const handleOpen = (tracks, scuderias, championships) => {
    console.log(championships);
    if (open) {
      setOpen(false);
      setDataScuderia(false);
      setName(false);
      setDataTracks(false);
      setOpenFormNC(false);
      setChampionships(false);
      setTracksSelected(false);
    } else {
      setDataScuderia(scuderias);
      setDataTracks(tracks);
      setChampionships(championships);
      setOpen(true);
    }
  };
  const findTrack = (arr, value) => {
    let result = arr.every((element) => {
      if (element === value) {
        return false;
      } else {
        return true;
      }
    });
    return result;
  };
  const fnTrackSelected = async (event) => {
    let arr = tracksSelected;
    if (arr.length === 0) {
      arr.push(event);
    } else {
      if (!findTrack(arr, event)) {
        console.log(arr.indexOf(event));
        arr.splice(arr.indexOf(event), 1);
      } else {
        arr.push(event);
      }
    }
    console.log(arr);
    setTracksSelected(arr);
    // if (!arr[event] && arr[event] !== 0) {
    //   arr[event] = event;
    // } else {
    //   arr[event] = false;
    // }
    // setTracksSelected(arr);
    // console.log(arr);
    forceUpdate();
  };
  const fnScuderiaSelected = (event) => {
    let arr = scuderiasSelected;
    if (arr.length === 0) {
      arr.push(event);
    } else {
      if (!findTrack(arr, event)) {
        arr.splice(arr.indexOf(event), 1);
      } else {
        arr.push(event);
      }
    }
    console.log(arr);
    setScuderiasSelected(arr);
    // if (!arr[event] && arr[event] !== 0) {
    //   arr[event] = event;
    // } else {
    //   arr[event] = false;
    // }
    // setTracksSelected(arr);
    // console.log(arr);
    forceUpdate();
  };
  const constructorArrs = (arr, arrI) => {
    return new Promise((resolve) => {
      let newArr = [];
      arrI.forEach((element) => {
        if (element || element === 0) {
          newArr.push(arr[element]);
        }
      });
      resolve(newArr);
      return newArr;
    });
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
      const result = championships.find((element) => element.playing === true);
      resolve(result);
    });
  };
  const handleChangeCurrentChampionship = async (value) => {
    let urlCh = "/update-champuonship";
    let currntCh = await findByState();
    if (currntCh) {
      let formatCurrnChange = {
        _id: currntCh._id,
        playing: false,
      };
      props.callLoading2(formatCurrnChange, urlCh, "post");
      handleOpen();
    } else {
      let formatChange = {
        _id: value._id,
        playing: true,
      };
      props.callLoading2(formatChange, urlCh, "post");
      handleOpen();
    }
  };
  let shuffleTracks = async () => {
    let arr = await shuffle(tracksSelected);
    setTracksSelected(arr);
    forceUpdate();
  };
  const buildShemma = async () => {
    const urlCh = "/create-championship";
    const urlTcks = "/create-tracks-champuonship";
    const urlScu = "/create-championship-scuderia";
    let formatChampionship = {
      nombre: name,
      playing: false,
    };
    if (tracksSelected.length > 1 && scuderiasSelected.length > 1) {
      await sendData(JSON.stringify(formatChampionship), urlCh).then(
        (resultCh) => {
          if (resultCh) {
            tracksSelected.map(async (result) => {
              let formatTracks = {
                championship: resultCh._id,
                pista: result._id,
                posicion: tracksSelected.indexOf(result),
                estado: false,
              };
              await sendData(JSON.stringify(formatTracks), urlTcks);
            });

            scuderiasSelected.map(async (result) => {
              let formatScuderias = {
                championship: resultCh._id,
                escuderia: result._id,
                doblete: 0,
                victorias: 0,
                puntos: 0,
                sanciones: 0,
              };
              console.log(formatScuderias);
              await sendData(JSON.stringify(formatScuderias), urlScu).then(
                (resultSC) => {
                  if (resultSC) {
                    props.callLoading();
                    handleOpen();
                  }
                }
              );
            });
          }
        }
      );
    }
  };
  const drawTracksSelected = () => {
    if (tracksSelected) {
      return tracksSelected.map((result) => {
        if (result) {
          return (
            <div className="container-tracks-selected">
              <small>{`${tracksSelected.indexOf(result) + 1}`}</small>
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
    if (scuderiasSelected) {
      return scuderiasSelected.map((result) => {
        if (result) {
          return (
            <div className="container-tracks-selected">
              <small>{`${scuderiasSelected.indexOf(result) + 1}`}</small>
              <small>{`${result.nombreEscuderia}`}</small>
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

  const ContainerChampionship = () => {
    if (dataTracks) {
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
              {tracksSelected.length > 1 && openFormNC ? (
                <a
                  type="Button"
                  className="input-autocomplete"
                  onClick={shuffleTracks}
                >
                  Mezclar Pistas
                </a>
              ) : null}
              <a
                type="Button"
                className="input-autocomplete"
                onClick={openFormNC ? buildShemma : handleOpenFormNC}
              >
                Crear nuevo Campeonato
              </a>
              {openFormNC ? (
                <a
                  type="Button"
                  className="input-autocomplete"
                  onClick={handleOpenFormNC}
                >
                  Cancelar
                </a>
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
                {championships
                  ? championships.map((result) => {
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
              {dataTracks.map((result) => {
                return (
                  <div className="track-chose-ch">
                    <div className="container-track-chos">
                      <button
                        className={
                          !findTrack(tracksSelected, result)
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
              {dataScuderia.length > 0
                ? dataScuderia.map((result) => {
                    return (
                      <div className="track-chose-ch">
                        <div className="container-track-chos">
                          <button
                            className={
                              !findTrack(scuderiasSelected, result)
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
  return ContainerChampionship();
});
