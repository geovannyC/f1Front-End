import {
  React,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import alonso from "../images/alonso.jpg";
import { CardsPodium } from "./cardsPodium";
import { getData } from "../../until/fetch";
import { LoadingAwait } from "../loading/loadingAwait";
export const PodiumV2 = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [tracksCh, setTracksCh] = useState(false),
    [loading, setLoading] = useState(true),
    [drivers, setDrivers] = useState(false),
    [allWinners, setAllWinners] = useState(false),
    [openCP, setOpenCP] = useState(false);

  useImperativeHandle(ref, () => ({
    callFnHandleOpen(paramtracksCh, paramdriversVitaeCh) {
      handleChangeOpen(paramtracksCh, paramdriversVitaeCh);
    },
    callFnHandleClose() {
      handleClose();
    },
  }));
  const handleChangeOpen = (paramtracksCh, paramdriversVitaeCh) => {
    childRefLA.current.callFnHandleOpen("loading");
    setTracksCh(paramtracksCh);
    setDrivers(paramdriversVitaeCh);
    getWinners(paramdriversVitaeCh);
    setTimeout(() => {
      setOpen(true);
    }, 200);
    setOpenCP(false);
    handleCloseCP();
  };
  const handleClose = () => {
    setOpen(false);
    setOpenCP(false);
    handleCloseCP();
    handleCloseCP();
  };
  const childRefCP = useRef();
  const childRefLA = useRef();
  const handleOpenCP = (response) => {
    childRefCP.current.callFnHandleOpen(response);
  };
  const handleCloseCP = () => {
    childRefCP.current.callFnCloseOpen();
  };
  const handleOpenCp = (value) => {
    getData10Drivers(value).then((response) => {
      if (response) {
        setOpen(false);
        setOpenCP(true);
        handleOpenCP(response);
      }
    });
  };
  const handleClosenCp = () => {
    setOpen(true);
    setOpenCP(false);
    handleCloseCP();
  };
  const getData10Drivers = (track) => {
    return new Promise((resolve) => {
      let filterWinners = drivers.filter((result) => {
        return result.pistaCampeonato._id === track;
      });
      resolve(filterWinners);
    });
  };
  const getWinners = async (arr) => {
    let images = new Object();
    let filterWinners = arr.filter((result) => {
      return result.puntos > 24;
    });
    filterWinners.map(async (result) => {
      let url = `/getImagesPilots/${result.piloto.carpetaPiloto}`;
      await getData(url).then((response) => {
        if (response) {
          images[filterWinners.indexOf(result)] = {
            image: response,
          };
          if (filterWinners.indexOf(result) === filterWinners.length - 1) {
            childRefLA.current.callFnHandleClose();
            setLoading(false);
          }
        } else {
          childRefLA.current.callFnHandleOpen("error");
        }
      });
    });
    setAllWinners(images);
  };

  const choseAnimation = (pos) => {
    if (pos % 2 === 0) {
      if (open) {
        return "container-podium animation-up-to-down-open animation-right-left-20-open";
      } else {
        return "container-podium animation-up-to-down animation-right-left-20";
      }
    } else {
      if (open) {
        return "container-podium animation-down-to-up-open animation-left-20-to-right-open";
      } else {
        return "container-podium animation-down-to-up animation-left-20-to-right";
      }
    }
  };
  const principal = () => {
    if (tracksCh && typeof allWinners === "object") {
      return (
        <>
          <div
            className={
              open ? "general-container index-2" : "general-container index-0"
            }
          >
            {tracksCh.map((result) => {
              let i = tracksCh.indexOf(result);
              if (result.estado) {
                return (
                  <div className={choseAnimation(result.posicion)}>
                    <img
                      className="img-container-podium"
                      src={allWinners[i] ? allWinners[i].image : false}
                      alt=""
                    />
                    <small
                      onClick={() => handleOpenCp(result.pista._id)}
                      className="text-podium secondary-color"
                    >
                      {result.pista.nombre}
                    </small>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </>
      );
    } else {
      return null;
    }
  };
  const buttonCloseCP = () => {
    return (
      <div
        onClick={handleClosenCp}
        className={openCP ? "container-btn-cp" : "container-btn-cp-closed"}
      >
        <div className="button-close-track-prev ">
          <div
            className={
              openCP ? "line-cross-1 open-line-cross-1" : "line-cross-1"
            }
          ></div>
          <div
            className={
              openCP ? "line-cross-1 open-line-cross-2" : "line-cross-1"
            }
          ></div>
        </div>
      </div>
    );
  };
  const SwitchLoading = () => {
    if (loading) {
      return <LoadingAwait ref={childRefLA} />;
    } else {
      return (
        <>
          <div className="container-btn-cp-closed">
            <LoadingAwait ref={childRefLA} />
          </div>
          {principal()}
          {buttonCloseCP()}
        </>
      );
    }
  };
  return (
    <>
      {SwitchLoading()}
      <CardsPodium ref={childRefCP} />
    </>
  );
});
