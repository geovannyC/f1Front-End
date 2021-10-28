import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import alonso from "../images/alonso.jpg";
import VanillaTilt from "vanilla-tilt";
import { Rdrivers } from "../rulete-drivers/rulete-drivers";
import { getData } from "../../until/fetch";
import { DataDriver } from "../data-driver/dataDriver";
import useForceUpdate from "use-force-update";
import { LoadingAwait } from "../loading/loadingAwait";
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
function Tilt(props) {
  const { options, ...rest } = props;
  const tilt = useRef(null);
  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}
export const CardsPodium = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [loading, setLoading] = useState(true),
    [loadingA, setLoadingA] = useState(true),
    [previousChangeWall, setPreviousChangeWall] = useState(false),
    [drivers, setDrivers] = useState(false),
    [lastDrivers, setLastDrivers] = useState(false),
    [images, setImages] = useState(false),
    [openRdrivers, setOpenRdrivers] = useState(false);
  const options = {
    reverse: true,
    scale: 1.2,
    speed: 1200,
    max: 40,
    transition: true,
  };
  const forceUpdate = useForceUpdate();
  useInterval(
    () => {
      changeImageDrivers();
      forceUpdate();
    },
    !loading ? 10000 : null
  );
  const childRefDR = useRef();
  const childRef = useRef();
  const childRefLA = useRef();
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(drivers) {
      handleOpen(drivers);
    },
    callFnCloseOpen() {
      handleClose();
      handleChangecloseRdrivers();
      // switchAction(false);
    },
  }));
  const changeImageDrivers = () => {
    setLoading(true);
    // setPreviousChangeWall(true);
    setTimeout(async () => {
      setPreviousChangeWall(false);
      await getWinners(drivers).then((response) => {
        if (response) {
          setPreviousChangeWall(false);
          setImages(response);
          setLoading(false);
        }
      });
    }, 4000);
  };
  const handleForceClose = () => {
    setOpen(false);
    setOpenRdrivers(false);
    handleChangecloseRdrivers();
  };
  const handleChangeOpenRdrivers = (value, type) => {
    setOpenRdrivers(true);
    handleOpenRD(value, type);
  };
  const handleChangecloseRdrivers = () => {
    setOpenRdrivers(false);
  };
  const handleOpenRD = (value, type) => {
    childRefDR.current.callFnOpenRuleteType(value, type);
  };
  const handleOpen = async (drivers) => {
    childRefLA.current.callFnHandleOpen("loading");
    let lstDrivers = [];
    await drivers.map((driver) => {
      if (drivers.indexOf(driver) > 2) {
        lstDrivers.push(driver);
      }
    });
    await getWinners(drivers).then((response) => {
      if (response) {
        setImages(response);
        setDrivers(drivers);
        setTimeout(() => {
          setOpen(true);
        }, 200);
      }
    });
    if (lstDrivers.length > 0) {
      setLastDrivers(lstDrivers);
    }
  };
  const getWinners = async (arr) => {
    let images = new Object();
    await arr.map(async (result) => {
      let url = `/getImagesPilots/${result.piloto.carpetaPiloto}`;
      await getData(url).then((response) => {
        if (response) {
          images[arr.indexOf(result)] = {
            image: response,
          };
          if (arr.indexOf(result) === arr.length - 1) {
            childRefLA.current.callFnHandleClose();
            setLoadingA(false);
          }
        } else {
          childRefLA.current.callFnHandleOpen("error");
        }
      });
    });
    return images;
  };
  const handleClose = () => {
    setOpen(false);
  };
  const switchAction = (value, color) => {
    if (value) {
      childRef.current.callFnHandleOpenDialog(value, color);
    } else {
      childRef.current.handleCloseRD();
    }
  };
  const ContainerCards = () => {
    if (drivers) {
      return (
        <div
          className={
            open ? "general-container index-2" : "general-container index-0"
          }
        >
          <div className="grid-three-rows-60-5-35">
            <div
              className={
                open
                  ? "column2-schemma animation-up-to-down-open"
                  : "column2-schemma animation-up-to-down"
              }
            >
              <div className="grid-three-columns-33">
                <Tilt options={options}>
                  <div className="column2-schemma ">
                    <div
                      onClick={() =>
                        switchAction(drivers[1].piloto, "gray-shadow")
                      }
                      className="general-card card2-podium "
                    >
                      <div className="text-hover-card-driver text-card-podium">
                        <small>#2</small>
                        <small>{drivers[1].piloto.nombre}</small>
                      </div>
                      <div
                        className={
                          previousChangeWall
                            ? "cap-wall index-2 cap-wall-closed"
                            : "cap-wall index-2 "
                        }
                      ></div>
                      {loadingA ? (
                        <LoadingAwait ref={childRefLA} />
                      ) : (
                        <img
                          src={images[1] ? images[1].image : false}
                          className="img-driver-fl"
                        />
                      )}
                    </div>
                  </div>
                </Tilt>
                <Tilt options={options}>
                  <div className="column2-schemma ">
                    <div
                      className="general-card card1-podium"
                      onClick={() =>
                        switchAction(drivers[0].piloto, "dorade-shadow")
                      }
                    >
                      <div className="text-hover-card-driver text-card-podium">
                        <small>#1</small>
                        <small>{drivers[0].piloto.nombre}</small>
                      </div>
                      <div
                        className={
                          previousChangeWall
                            ? "cap-wall cap-wall-closed index-2"
                            : "cap-wall index-2"
                        }
                      ></div>
                      {loadingA ? (
                        <LoadingAwait ref={childRefLA} />
                      ) : (
                        <img
                          src={images[0] ? images[0].image : false}
                          className="img-driver-fl"
                        />
                      )}
                    </div>
                  </div>
                </Tilt>
                <Tilt options={options}>
                  <div className="column2-schemma ">
                    <div
                      className="general-card card3-podium"
                      onClick={() =>
                        switchAction(drivers[2].piloto, "brounce-shadow")
                      }
                    >
                      <div className="text-hover-card-driver text-card-podium">
                        <small>#3</small>
                        <small>{drivers[2].piloto.nombre}</small>
                      </div>
                      <div
                        className={
                          previousChangeWall
                            ? "cap-wall cap-wall-closed index-2"
                            : "cap-wall index-2"
                        }
                      ></div>
                      {loadingA ? (
                        <LoadingAwait ref={childRefLA} />
                      ) : (
                        <img
                          src={images[2] ? images[2].image : false}
                          className="img-driver-fl"
                        />
                      )}
                    </div>
                  </div>
                </Tilt>
              </div>
            </div>
            {open ? (
              <div className="column2-schemma index-3">
                <a
                  onClick={
                    openRdrivers
                      ? () => handleChangecloseRdrivers()
                      : () => handleChangeOpenRdrivers(lastDrivers, "review")
                  }
                  className="input-autocomplete "
                >
                  {openRdrivers ? "Cerrar Ruleta de Pilotos" : "#4-#10"}
                </a>
              </div>
            ) : null}

            <div
              className={
                openRdrivers
                  ? "column2-schemma animation-left-to-right-open"
                  : "column2-schemma animation-left-to-right"
              }
            >
              <div className="general-container">
                {/* <h1>Hi</h1> */}
                <Rdrivers ref={childRefDR} openData={switchAction} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const SwitchLoading = () => {
    if (loadingA) {
      return <LoadingAwait ref={childRefLA} />;
    } else {
      return (
        <>
          <LoadingAwait ref={childRefLA} />
          {ContainerCards()}
        </>
      );
    }
  };
  return (
    <>
      <DataDriver ref={childRef} />
      {SwitchLoading()}
    </>
  );
});
