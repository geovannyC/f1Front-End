import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import useForceUpdate from "use-force-update";
import { DataDriver } from "../data-driver/dataDriver";
import { getData } from "../../until/fetch";
export const Table = forwardRef((props, ref) => {
  const [openC, setOpenC] = useState(false),
    [open, setOpen] = useState(false),
    [data, setData] = useState({
      tracksCh: false,
      pointsPerTrack: false,
      totalPointsDrivers: false,
      scuderiasVitae: false,
      totalPointsScuderias: false,
      allDrivers: false,
    }),
    [onMouseHoverTrack, setOnMouseHoverTrack] = useState({
      openWatchTB: false,
      openTrackSelected: false,
      nameT: false,
      wallpaper: false,
      fastLap: false,
      driver: false,
      wallDriver: false,
      records: false,
    }),
    [openScroll, setOpenScroll] = useState(false),
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
      paramTracksCh,
      paramPointsPerTrack,
      paramTotalPointsDriversCh,
      paramTotalPointsScuderias,
      paramAllDrivers
      // paramScuderiasCh,
      // paramDriversCh,
      // paramAllDrivers
    ) {
      handleOpen(
        paramTracksCh,
        paramPointsPerTrack,
        paramTotalPointsDriversCh,
        paramTotalPointsScuderias,
        paramAllDrivers
        // paramScuderiasCh,
        // paramDriversCh,
        // paramDriversVitaeCh,
      );
    },
  }));
  const handleOpen = async (
    paramTracksCh,
    paramPointsPerTrack,
    paramTotalPointsDriversCh,
    paramTotalPointsScuderias,
    paramAllDrivers
  ) => {
    if (open) {
      setOpen(false);
      setOpenC(false);
      // setOnMouseHoverTrack({
      //   openWatchTB: false,
      //   openTrackSelected: false,
      //   nameT: false,
      //   wallpaper: false,
      //   fastLap: false,
      //   driver: false,
      // });
      switchAction(false);
    } else {
      console.log(
        paramPointsPerTrack[0].info,
        paramPointsPerTrack[1].info,
        paramPointsPerTrack[2].info
      );
      setData({
        tracksCh: paramTracksCh,
        pointsPerTrack: paramPointsPerTrack,
        totalPointsDrivers: paramTotalPointsDriversCh,
        totalPointsScuderias: paramTotalPointsScuderias,
        allDrivers: paramAllDrivers,
      });
      setOpen(true);
    }
  };
  const sortChampionShip = () => {
    let newData = [...data.totalPointsDrivers];
    newData = newData.sort((a, b) => {
      const pointsA = b.puntos;
      const pointsB = a.puntos;
      return pointsA - pointsB;
    });

    setData({ ...data, totalPointsDrivers: newData });
    forceUpdate();
  };
  const sortChampionShipScuderias = () => {
    let newData = [...data.totalPointsScuderias];
    newData = newData.sort((a, b) => {
      const pointsA = b.puntos;
      const pointsB = a.puntos;
      return pointsA - pointsB;
    });

    setData({ ...data, totalPointsScuderias: newData });
    forceUpdate();
  };
  const forceUpdate = useForceUpdate();
  const handleChangeStateOpenC = () => {
    if (openC) {
      setOpenC(false);
      handleChangeCloseHoverTrack();
      handleCloseTrackSelected();
    } else {
      setOpenC(true);
      handleChangeCloseHoverTrack();
      handleCloseTrackSelected();
    }
    forceUpdate();
  };
  const setDataWallBackground = async (result) => {
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
        wallDriver: false,
        records: result.pista.records,
        // driver: driver ? driver : false,
      });
    }
    forceUpdate();
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
        records: false,
      });
      forceUpdate();
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
  const selectTrack = async (result) => {
    let thereAreDriver =
      result.pista.records.length < 1 ? false : result.pista.records[0].piloto;
    let findWall = false;
    let driver = thereAreDriver
      ? data.allDrivers.find((driverFinded) => {
          return driverFinded._id === thereAreDriver;
        })
      : false;
    if (driver) {
      let url = `/getImagesPilots/${driver.carpetaPiloto}`;
      await getData(url).then((response) => {
        if (response) {
          findWall = response;
        }
      });
    }
    if (onMouseHoverTrack.openWatchTB && !onMouseHoverTrack.openTrackSelected) {
      setOnMouseHoverTrack({
        ...onMouseHoverTrack,
        openWatchTB: true,
        openTrackSelected: true,
        driver: driver ? driver : false,
        wallDriver: findWall,
      });
    }
  };
  const SchemmaDFL = () => {
    let driver = onMouseHoverTrack.driver;
    let wall = onMouseHoverTrack.wallDriver;
    if (onMouseHoverTrack.openTrackSelected) {
      return (
        <div className="data-track-column2">
          <div className="aling-content-driver-fl">
            <div
              className="card-driver-fl"
              onClick={() => switchAction(driver)}
            >
              <img src={wall} className="img-driver-fl" alt="" />
            </div>
          </div>
          <div className="content-driver-fl">
            <div className="content-column">
              <small>
                {driver.alias !== "false" ? driver.alias : driver.nombre}
              </small>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const DataTrackSelected = () => {
    let recordsTrack;
    if (onMouseHoverTrack.openWatchTB) {
      recordsTrack =
        onMouseHoverTrack.records.length > 5
          ? onMouseHoverTrack.records.splice(0, 5)
          : onMouseHoverTrack.records;
    }
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
            <div>Vueltas Rápidas</div>
            {recordsTrack
              ? recordsTrack.map((recordDriver) => {
                  let i = recordsTrack.indexOf(recordDriver);
                  let forc = 1 / i;
                  return (
                    <>
                      <div
                        style={{ opacity: forc }}
                      >{`${recordDriver.minuto}:${recordDriver.segundo}:${recordDriver.decima}`}</div>
                    </>
                  );
                })
              : null}
          </div>
          {SchemmaDFL()}
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
  const filterPintes = ()=>{
    return 
  }
  const Points = ({ idDriver, i, status }) => {
    const pointsPT = data.pointsPerTrack;
    if (open && data.pointsPerTrack) {
      if (status && pointsPT[i].info) {
        const result = pointsPT[i].info.filter((e) => {
          if (!e.piloto) {
            return 0;
          } else {
            return e.piloto._id === idDriver;
          }
        })[0];
        if (result) {
          return (
            <td style={{ color: result.sanciones.length > 0 ? "red" : null }}>
              {result.puntos}
            </td>
          );
        } else {
          return <td>-</td>;
        }
      } else {
        return <td>-</td>;
      }
    } else {
      return null;
    }
  };
  const FindDriverScuderia = ({ idDriver }) => {
    let result = data.totalPointsDrivers.find((res) => {
      return res.piloto._id === idDriver;
    });
    let faults = result.sanciones;
    let warnings = result.advertencias;
    let buildPointsWarnings = parseInt(warnings / 3) * 5;
    let totalPointsFaults = faults + buildPointsWarnings;
    if (result) {
      return (
        <>
          <td>{result.piloto.nombre}</td>
          <td style={{ color: faults > 0 ? "red" : null }}>{faults}</td>
          <td style={{ color: warnings > 0 ? "red" : null }}>{warnings}</td>
          {/* puntos totales sanciones */}
          <td style={{ color: totalPointsFaults > 0 ? "red" : null }}>
            {totalPointsFaults}
          </td>
          <td>{result.puntos}</td>
          {/* <td>{result.puntos ? result.puntos : 0}</td> */}
        </>
      );
    } else {
      return null;
    }
  };
  const PointsChampionship = ({ tpoints }) => {
    if (open) {
      return <td>{tpoints}</td>;
    } else {
      return null;
    }
  };
  const PointsFaults = (props) => {
    const faults = props.tfaults;
    if (open) {
      if (faults) {
        return <td style={{ color: "red" }}>{faults}</td>;
      } else {
        return <td>-</td>;
      }
    } else {
      return null;
    }
  };
  const PointsWarnings = (props) => {
    const warnings = parseInt(props.twarnings);
    if (open) {
      if (warnings) {
        return <td style={{ color: "red" }}>{warnings}</td>;
      } else {
        return <td>-</td>;
      }
    } else {
      return null;
    }
  };
  const TPointsFaults = ({ tfaults, twarnings }) => {
    if (open) {
      return <td style={{ color: "red" }}>{tfaults + twarnings}</td>;
    } else {
      return null;
    }
  };
  const RowsScuderia = ({ scuderia }) => {
    return (
      <tr>
        <td className="drivers">{scuderia.escuderia.nombreEscuderia}</td>
        <FindDriverScuderia idDriver={scuderia.escuderia.piloto1} />
        <FindDriverScuderia idDriver={scuderia.escuderia.piloto2} />
        <td>
          {/* victorias escuderia */}
          {0}
        </td>
        {/* doblete escuderia */}
        <td>{0}</td>
        <td>{scuderia.puntos}</td>
        {/* <td>{scuderia}</td> */}
      </tr>
    );
  };
  const ChampionShipTable = () => {
    return (
      <div
        className={openC ? "championship-table-closed" : "championship-table"}
      >
        <div className="grid-table-scroll">
          <div className="listen-event-auto-scroll-table">
            {/* <div class="arrow-up" onMouseOver={scrollUp}></div> */}
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
                  {data.tracksCh
                    ? data.tracksCh.map((result) => {
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

                  <th>Sanc</th>
                  <th>Adve</th>
                  <th>T.San.PTS</th>
                  <th onClick={sortChampionShip}>Campeonato</th>
                </tr>
              </thead>
              <tbody>
                {data.totalPointsDrivers
                  ? data.totalPointsDrivers.map((result) => {
                      return (
                        <tr>
                          <td className="drivers" ref={result}>
                            {result.piloto.nombre}
                          </td>
                          {data.tracksCh
                            ? data.tracksCh.map((response) => {
                                let statusTrack =
                                  typeof data.pointsPerTrack[
                                    response.posicion
                                  ] === "object";
                                return (
                                  <>
                                    <Points
                                      i={response.posicion}
                                      idDriver={result.piloto._id}
                                      status={statusTrack}
                                    />
                                  </>
                                );
                              })
                            : null}

                          <PointsFaults tfaults={result.sanciones} />
                          <PointsWarnings twarnings={result.advertencias} />
                          <TPointsFaults
                            tfaults={result.sanciones}
                            twarnings={result.advertencias}
                          />
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
            {/* <div class="arrow-down" onMouseOver={scrollDown}></div> */}
          </div>
        </div>
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
                <th>San</th>
                <th>Adv</th>
                <th>T</th>
                <th>Puntos P1</th>
                <th>Piloto 2</th>
                <th>San</th>
                <th>Adv</th>
                <th>T</th>
                <th>Puntos P2</th>
                <th>Total Victorias</th>
                <th>Dobletes</th>
                <th onClick={sortChampionShipScuderias}>C. Constructores</th>
              </tr>
            </thead>
            <tbody>
              {data.totalPointsScuderias
                ? data.totalPointsScuderias.map((result) => {
                    return <RowsScuderia scuderia={result} />;
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
          <button type="button" onClick={handleChangeStateOpenC}>
            {openC ? "Mundial Pilotos" : "Mundial Constructores"}
          </button>
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
      {ChampionShipTable()}
      {CchampionshipTable()}
      {BtnTbleChamp()}
      {WallBackground()}
      {<DataDriver ref={childRef} />}
    </div>
  );
});
