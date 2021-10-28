import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { getData } from "../../until/fetch";

import useForceUpdate from "use-force-update";
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
export const DataDriver = forwardRef((props, ref) => {
  const [open, setOpen] = useState({
      open: false,
      data: false,
      color: false,
    }),
    [loading, setLoading] = useState(true),
    [previousChangeWall, setPreviousChangeWall] = useState(false),
    [image, setImage] = useState(false);
  const forceUpdate = useForceUpdate();
  useInterval(
    () => {
      switchImage(open.data.carpetaPiloto);
      forceUpdate();
    },
    !loading ? 15000 : null
  );
  useImperativeHandle(ref, () => ({
    callFnHandleOpenDialog(element, element2) {
      handleOpenDataDriver(element, element2);
    },
    callFnHandleForceClose() {
      setOpen({
        open: false,
        data: false,
        color: false,
      });
      setImage(false);
      setTimeout(() => {
        setLoading(true);
        forceUpdate();
      }, 200);
    },
  }));
  const switchImage = (folder) => {
    setPreviousChangeWall(true);
    setTimeout(async () => {
      getImage(folder);
    }, 4000);
  };
  const getImage = async (folder) => {
    let url = `/getImagesPilots/${folder}`;

    await getData(url).then((response) => {
      if (response) {
        setImage(response);
        setPreviousChangeWall(false);
      }
    });
  };
  const handleOpenDataDriver = (parentData, color) => {
    setLoading(false);
    if (!open.open) {
      setTimeout(() => {
        setOpen({
          open: true,
          data: parentData,
          color: color,
        });
        getImage(parentData.carpetaPiloto);
      }, 200);
    } else {
      setOpen({
        open: false,
        data: false,
        color: false,
      });
      setImage(false);
      setTimeout(() => {
        setLoading(true);
      }, 200);
    }
  };
  const CardDataDriver = () => {
    return (
      <div
        className={open.open ? " card-driver" : "card-driver close-card-driver"}
      >
        <div
          className="button-close-track-prev"
          onClick={() => handleOpenDataDriver()}
        >
          <div className="line-cross-1 open-line-cross-1"></div>
          <div className="line-cross-1 open-line-cross-2"></div>
        </div>
        <div className="grid-card-data-driver">
          <div className={`general-card ${open.color}`}>
            <div
              className={
                previousChangeWall
                  ? "cap-wall index-1 cap-wall-closed"
                  : "cap-wall index-1 "
              }
            ></div>
            <img
              src={image}
              className={
                // secondImage
                //   ? "img-card-driver-fl close-img-card-fl"
                "img-card-driver-fl"
              }
            />
          </div>
          <div className="column2-card-content">
            <div
              className={
                true ? "champion driver-text" : "driver-text title-driver"
              }
            >
              {open.open ? (
                <h1 className="title" data-text={open.data.nombre}>
                  {open.data.nombre}
                </h1>
              ) : null}
            </div>
            <div className="card-content-grid">
              <div className="card-content-column secondary-color">
                <small>Nombre</small>
                <small>{open.data.alias ? "Alias" : null}</small>
                <small>Victorias</small>
              </div>
              <div className="card-content-column">
                <small>{open.data.nombre}</small>
                <small>{open.data.alias ? open.data.alias : null}</small>
                <small>{open.data.victorias ? open.data.victorias : 0}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (!loading) {
    return (
      <div className="container-data-driver ">{CardDataDriver()}</div>
    );
  } else {
    return null;
  }
});
