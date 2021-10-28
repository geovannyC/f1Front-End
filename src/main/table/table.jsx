import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import useForceUpdate from "use-force-update";
import monza from "../images/monza.jpg";
import BrandsHatch from "../images/Brands Hatch .png";
import austin from "../images/austin.jpeg";
import alonso from "../images/alonso.jpg";
import { DataDriver } from "../data-driver/dataDriver";
import { getData } from "../../until/fetch";
export const Table = forwardRef((props, ref) => {
  const [openC, setOpenC] = useState(false),
    [open, setOpen] = useState(false),
    [onMouseHoverTrack, setOnMouseHoverTrack] = useState({
      openWatchTB: false,
      openTrackSelected: false,
      nameT: false,
      wallpaper: false,
      fastLap: false,
      driver: false,
      wallDriver: false,
    }),
    [openScroll, setOpenScroll] = useState(false),
    [allDrivers, setAllDrivers] = useState(false),
    [scuderias, setScuderias] = useState(false),
    [tracks, setTracks] = useState(false),
    [drivers, setDrivers] = useState(false),
    [totalPointsdrivers, setTotalPointsdrivers] = useState(false);
  const childRef = useRef();
  const switchAction = (value) => {
    if (value) {
      childRef.current.callFnHandleOpenDialog(value, "purple-shadow");
    } else {
      childRef.current.callFnHandleForceClose();
    }
  };
  useImperativeHandle(ref, () => ({
    callFnHandleOpenTable(
      paramScuderiasCh,
      paramTracksCh,
      paramDriversCh,
      paramDriversVitaeCh,
      paramAllDrivers
    ) {
      handleOpen(
        paramScuderiasCh,
        paramTracksCh,
        paramDriversCh,
        paramDriversVitaeCh,
        paramAllDrivers
      );
    },
  }));
  const handleOpen = async (
    paramScuderiasCh,
    paramTracksCh,
    paramDriversCh,
    paramDriversVitaeCh,
    paramAllDrivers
  ) => {
    if (open) {
      setOpen(false);
      setOpenC(false);
      setOnMouseHoverTrack({
        openWatchTB: false,
        openTrackSelected: false,
        nameT: false,
        wallpaper: false,
        fastLap: false,
        driver: false,
      });
      switchAction(false);
    } else {
      setTotalPointsdrivers(paramDriversCh);
      setDrivers(paramDriversVitaeCh);
      setAllDrivers(paramAllDrivers);
      setScuderias(paramScuderiasCh);
      setTracks(paramTracksCh);
      setOpen(true);
    }
  };
  const sortChampionShip = ()=>{
    let arrToSort = totalPointsdrivers.sort((a,b)=>{return b.puntos-a.puntos})
    console.log(arrToSort)
    setTotalPointsdrivers(arrToSort)
    forceUpdate()
  }
  const sortChampionShipScuderias = ()=>{
    let arrToSort = scuderias.sort((a,b)=>{return b.puntos-a.puntos})
    setScuderias(arrToSort)
    forceUpdate()
  }
  const forceUpdate = useForceUpdate();
  const handleChangeStateOpenC = () => {
    openC ? setOpenC(false) : setOpenC(true);
    forceUpdate();
  };
  const setDataWallBackground =async (result) => {
    
    let thereAreDriver = !result.pista.piloto
      ? false
      : result.pista.piloto;
    let driver = thereAreDriver
      ? allDrivers.find((result) => {
          return result._id === thereAreDriver;
        })
      : false;
    let findWall= false
    if(driver){
      let url = `/getImagesPilots/${driver.carpetaPiloto}`
      await getData(url).then((response)=>{
        if(response){
          findWall=response
        }
      })
    }
    if (
      !onMouseHoverTrack.openWatchTB &&
      !onMouseHoverTrack.openTrackSelected
    ) {
      setOnMouseHoverTrack({
        openWatchTB: true,
        openTrackSelected: false,
        nameT: result.pista.nombre,
        wallpaper: result.pista.image,
        fastLap: result.pista.vuelta,
        wallDriver: findWall,
        driver: driver?driver:false,
      });
    }
  };
  const handleOpenScrollTbl = () => {
    if (!openScroll) {
      setOpenScroll(true);
    }
  };
  const handleCloseScrollTbl = () => {
    if (openScroll) {
      setOpenScroll(false);
    }
  };
  const handleChangeCloseHoverTrack = () => {
    if (onMouseHoverTrack.openWatchTB && !onMouseHoverTrack.openTrackSelected) {
      setOnMouseHoverTrack({
        openWatchTB: false,
        nameT: false,
        wallpaper: false,
        fastLap: false,
        driver: false,
        openTrackSelected: false,
      });
    }
  };
  const handleCloseTrackSelected = () => {
    if (onMouseHoverTrack.openTrackSelected) {
      setOnMouseHoverTrack({
        openWatchTB: false,
        nameT: false,
        wallpaper: false,
        fastLap: false,
        driver: false,
        wallDriver: false,
        openTrackSelected: false,
      });
    }
  };
  const selectTrack = async(result) => {
    let thereAreDriver = !result.pista.piloto
    ? false
    : result.pista.piloto;
  let driver = thereAreDriver
    ? allDrivers.find((result) => {
        return result._id === thereAreDriver;
      })
    : false;
    let findWall= false
    if(driver){
      let url = `/getImagesPilots/${driver.carpetaPiloto}`
      await getData(url).then((response)=>{
        if(response){
          findWall=response
        }
      })
    }
    if (onMouseHoverTrack.openWatchTB && !onMouseHoverTrack.openTrackSelected) {
      setOnMouseHoverTrack({
        openWatchTB: true,
        openTrackSelected: true,
        nameT: result.pista.nombre,
        wallpaper: result.pista.image,
        fastLap: result.pista.vuelta,
        wallDriver: findWall,
        driver: driver?driver:false,
      });
    }
  };

  const DataTrackSelected = () => {
    let lap = onMouseHoverTrack.fastLap;
    let driver = onMouseHoverTrack.driver
    let wall = onMouseHoverTrack.wallDriver
    return (
      <div
        className={
          onMouseHoverTrack.openTrackSelected || onMouseHoverTrack.openWatchTB
            ? "data-track-selected"
            : "data-track-selected close-data-track-selected"
        }
      >
        <div className="grid-content-data-track">
          <div className="data-track-column1 grid-data-time-fl">
            <div>Vuelta Rápida</div>
            <div>{lap ? `${lap[0]} : ${lap[1]} : ${lap[2]}` : 0}</div>
          </div>
          <div className="data-track-column2 grid-data-driver-fl">
            <div className="aling-content-driver-fl">
              
              <div
                className="card-driver-fl"
                onClick={() => switchAction(driver)}
              >
                <img src={wall}className="img-driver-fl" alt="" />
              </div>
            </div>
            <div>
              <div className="content-driver-fl">
                <div className="content-column content-start">
                  <small>Nombre</small>
                  <small>Alias</small>
                </div>
                <div className="content-column content-end">
                  <small>{driver ? driver.nombre : null}</small>
                  <small>{driver ? driver.alias : null}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const WallBackground = () => {
    return (
      <div
        className={
          onMouseHoverTrack.openTrackSelected || onMouseHoverTrack.openWatchTB
            ? "hover-track hover-track-open"
            : "hover-track"
        }
      >
        <div
          className="button-close-track-prev"
          onClick={handleCloseTrackSelected}
        >
          <div
            className={
              onMouseHoverTrack.openTrackSelected
                ? "line-cross-1 open-line-cross-1"
                : "line-cross-1"
            }
          ></div>
          <div
            className={
              onMouseHoverTrack.openTrackSelected
                ? "line-cross-1 open-line-cross-2"
                : "line-cross-1"
            }
          ></div>
        </div>
        <div className="filter-image">
          <img
            src={onMouseHoverTrack.wallpaper}
            className="wall-background"
            alt=""
          />
          <h1 className="title-track">{onMouseHoverTrack.nameT}</h1>
          <DataTrackSelected />
        </div>
      </div>
    );
  };

  const startPosition = useRef();
  const endPosition = useRef();

  const scrollDown = () => {
    endPosition.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollUp = () => {
    startPosition.current.scrollIntoView({ behavior: "smooth" });
  };
  const findTrackCh = async (arr, idTrack) => {
    return new Promise((resolve) => {
      const result = arr.filter(
        (element) => element.pistaCampeonato._id === idTrack
      );
      resolve(result);
    });
  };
  const findDriverCh = async (arr, idDriver) => {
    return new Promise((resolve) => {
      const result = arr.find((element) => element.piloto._id === idDriver);
      resolve(result);
    });
  };
  const pointsDriver = async (track) => {
    let result = await findTrackCh(drivers, track);
    return result;
  };
  const Points = (props) => {
    const result = drivers.filter(
      (element) => element.pistaCampeonato._id === props.track
    );
    const result2 = result.find(
      (element) => element.piloto._id === props.idDriver
    );
    if (open) {
      if (result && result2) {
        return <td>{result2.puntos}</td>;
      } else {
        return <td>-</td>;
      }
    } else {
      return null;
    }
  };
  const FindDriverScuderia = (props) => {
    let result = totalPointsdrivers.find((res) => {
      return res.piloto._id === props.idDriver;
    });

    if (result) {
      return (
        <>
          <td>{result.piloto.nombre}</td>
          <td>{result.piloto.victorias ? result.piloto.victorias : 0}</td>
          <td>{result.puntos ? result.puntos : 0}</td>
        </>
      );
    } else {
      return null;
    }
  };
  const PointsChampionship = (props) => {
    if (open) {
      if (props.tpoints) {
        return <td>{props.tpoints}</td>;
      } else {
        return <td>-</td>;
      }
    } else {
      return null;
    }
  };
  const ChampionShipTable = () => {
    return (
      <div
        className={openC ? "championship-table-closed" : "championship-table"}
      >
        <div className="grid-table-scroll">
          <div className="listen-event-auto-scroll-table">
            <div class="arrow-up" onMouseOver={scrollUp}></div>
          </div>
          <div
            className={openScroll ? "card-table open-scroll" : "card-table"}
            onMouseOver={handleOpenScrollTbl}
            onMouseLeave={handleCloseScrollTbl}
          >
            <table className="principal-table ">
              <thead ref={startPosition}>
                <tr>
                  <th>Nombre</th>
                  {tracks
                    ? tracks.map((result) => {
                        return (
                          <th
                            onMouseOver={() => setDataWallBackground(result)}
                            onMouseLeave={handleChangeCloseHoverTrack}
                            onClick={() => selectTrack(result)}
                          >
                            {result.pista.alias}
                          </th>
                        );
                      })
                    : null}

                  <th onClick={sortChampionShip}>Campeonato</th>
                </tr>
              </thead>
              <tbody>
                {totalPointsdrivers
                  ? totalPointsdrivers.map((result) => {
                      return (
                        <tr>
                          <td
                            className="drivers"
                            ref={
                              result ===
                              totalPointsdrivers[totalPointsdrivers.length - 1]
                                ? endPosition
                                : null
                            }
                          >
                            {result.piloto.nombre}
                          </td>
                          {tracks
                            ? tracks.map((response) => {
                                return (
                                  <>
                                    <Points
                                      track={response.pista._id}
                                      idDriver={result.piloto._id}
                                    />
                                  </>
                                );
                              })
                            : null}
                          <PointsChampionship tpoints={result.puntos} />
                          {/* {points[totalPointsdrivers.indexOf(result)]
                            ? points[totalPointsdrivers.indexOf(result)].map((points) => {
                                return (
                                  <td >
                                    {points}
                                  </td>
                                );
                              })
                            : null} */}
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
          <div className="listen-event-auto-scroll-table">
            <div class="arrow-down" onMouseOver={scrollDown}></div>
          </div>
        </div>

        {/* <a type="button" onClick={() => scrollDown()}>
            TEST SCROLL Down
          </a>
        <a type="button" onClick={() => scrollUp()}>
            TEST SCROLL Up
          </a> */}
      </div>
    );
  };
  const CchampionshipTable = () => {
    return (
      <div
        className={openC ? "constructors-table" : "constructors-table  close-c"}
      >
        <div className="card-table">
          <table className="principal-table">
            <thead>
              <tr>
                <th>Escuderia</th>
                <th>Piloto 1</th>
                <th>Victorias</th>
                <th>Puntos P1</th>
                <th>Piloto 2</th>
                <th>Victorias</th>
                <th>Puntos P2</th>
                <th>Total Victorias</th>
                <th>Dobletes</th>
                <th onClick={sortChampionShipScuderias}>C. Constructores</th>
              </tr>
            </thead>
            <tbody>
              {scuderias
                ? scuderias.map((result) => {
                    return (
                      <tr>
                        <td className="drivers">
                          {result.escuderia.nombreEscuderia}
                        </td>
                        <FindDriverScuderia
                          idDriver={result.escuderia.piloto1}
                        />
                        <FindDriverScuderia
                          idDriver={result.escuderia.piloto2}
                        />
                        <td>
                          {result.escuderia.victorias
                            ? result.victorias
                            : 0}
                        </td>
                        <td>
                          {result.escuderia.doblete
                            ? result.doblete
                            : 0}
                        </td>
                        <td>{result.puntos}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  const BtnTbleChamp = () => {
    return (
      <div className="table-campionship">
        <div className="container-flex">
          <a type="button" onClick={handleChangeStateOpenC}>
            {openC ? "Mundial Pilotos" : "Mundial Constructores"}
          </a>
        </div>
      </div>
    );
  };
  return (
    <div
      className={
        open
          ? "general-container animation-right-to-leftt-open"
          : "general-container animation-right-to-left"
      }
    >
      {/* {PreviousChampionShip()} */}
      {ChampionShipTable()}
      {CchampionshipTable()}
      {BtnTbleChamp()}
      {WallBackground()}
      {/* {switchOpenDataDriver()} */}
      {<DataDriver ref={childRef} />}
    </div>
  );
});
