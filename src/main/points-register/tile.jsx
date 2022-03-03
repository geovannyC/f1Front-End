import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import useForceUpdate from "use-force-update";
import { ACTIONS } from "./pointsRegisterV2";
import { FaultForm } from "./faultForm";
import { DataFaults } from "./dataFaults";
import "./pointsRegisterv2.css";

export const Tile = forwardRef(({ driversData, dispatch, status }, ref) => {
  const [open, setOpen] = useState({
    open: false,
    openForm: false,
  });
  useImperativeHandle(ref, () => ({
    callFnHandleOpen() {
      console.log(driversData)
      handleOpen();
    },
    callFnHandleClose() {
      console.log(driversData)
      handleClose();
    },
  }));

  const forceUpdate = useForceUpdate();
  const handleOpen = () => {
    setOpen({ ...open, open: true });
  };

  const handleClose = () => {
    setOpen({ ...open, open: false });
  };

  const deleteDriver = (i) => {
    dispatch({ type: ACTIONS.DELETE, payload: { pos: i } });
    forceUpdate();
  };

  const BackTileRegister = ({ color, data, pos }) => {
    return (
      <div
        style={{ backgroundColor: color, opacity: 0.8 }}
        className="flip-card-back"
        // onMouseLeave={() => handleCloseForm()}
      >
        <div
          className="menu-toggle top-15"
          onClick={() => deleteDriver(data.posicion)}
        >
          <div
            className={
              open.open
                ? "line-back-card-open line-back-card-cross1"
                : "line-back-card line-back-card--1"
            }
          ></div>
          <div
            class={
              open.open
                ? "line-back-card-open line-back-card-cross3"
                : "line-back-card line-back-card--3"
            }
          ></div>
        </div>

        <div>

          <FaultForm dispatch={dispatch} pos={pos} faults={data.sanciones} />
              <DataFaults data={data.sanciones} dispatch={dispatch} pos={pos}/>
   
        </div>
      </div>
    );
  };
  const BackTileReview = ({ color, data }) => {
    return (
      <div
        style={{ backgroundColor: color, opacity: 0.8 }}
        className="flip-card-back"
      >
        <div className="container-info-driver-tile">
          <small>{data.prev_driver.nombre}</small>
          <small>
            {data.prev_driver.alias !== "false"
              ? `"${data.prev_driver.alias}"`
              : null}
          </small>
          <small>{`Victorias: ${data.prev_driver.victorias.length}`}</small>
        </div>
      </div>
    );
  };
  const SwitchBackTile = ({ color, data, pos }) => {
    if (status === "review") {
      let objVerify = typeof data !== "number";
      if (objVerify) {
        return <BackTileReview color={color} data={data} />;
      } else {
        return null;
      }
    } else {
      let objVerify = typeof data !== "number";
      if (objVerify) {
        return <BackTileRegister color={color} data={data} pos={pos} />;
      } else {
        return null;
      }
    }
  };
  const SchemmaTile = () => {
    return (
      <div id="content" className="container-back-tiles">
        {typeof driversData === "object"
          ? driversData.map((data) => {
              let objVerify = typeof data === "object";
              let color =
              objVerify
                  ? data.colors.pColor
                  : "rgba(0, 0, 0, 0.363)";
              return (
                <div
                  className={
                    objVerify && open.open
                      ? "animation-up-to-down-open tile"
                      : "animation-up-to-down tile "
                  }
                >
                  <div class="flip-card ">
                    <div class="flip-card-inner ">
                      <div class="flip-card-front">
                        <img
                          className={
                            typeof driver === "number"
                              ? " img-container-tile-podium"
                              : "upset-scale img-container-tile-podium"
                          }
                          src={objVerify ? data.image : null}
                          alt="avatar"
                        />

                        <small
                          style={{ background: color }}
                          className="text-podium correct-rotations-txt-podium secondary-color"
                        >
                          {`#${objVerify ? data.posicion + 1 : null} ${
                            objVerify ? data.prev_driver.nombre : null
                          } ${data.puntos}PTS`}
                        </small>
                      </div>
                      <SwitchBackTile
                        color={color}
                        data={data}
                        pos={data.posicion}
                      />
                    </div>
                    {/* <img
                      className={
                        typeof driver === "number"
                          ? " img-container-tile-podium"
                          : "upset-scale img-container-tile-podium"
                      }
                      src={driver.image}
                      alt=""
                    />
                    <small
                      style={{ background: color }}
                      className="text-podium correct-rotations-txt-podium secondary-color"
                    >
                      {`#${driversData.indexOf(driver) + 1} ${driver.nombre}`}
                    </small> */}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    );
  };

  return SchemmaTile();
});
