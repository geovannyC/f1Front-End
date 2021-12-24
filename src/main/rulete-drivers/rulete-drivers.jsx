import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { DataDriver } from "../data-driver/dataDriver";
export const Rdrivers = forwardRef((props, ref) => {
  const [data, setData] = useState({
    open: false,
    type: false,
    value: false,
  });
  const childRef = useRef();
  useImperativeHandle(ref, () => ({
    callFnCloseDataDriver() {
      switchAction(false);
    },
    callFnOpenRuleteType(value, type) {
      handleOpen(value, type);
    },
    callFnCloseRuleteType() {
      handleClose();
    },
  }));
  const switchAction = (value) => {
    if (value) {
      childRef.current.callFnHandleOpenDialog(value, "ordinary-shadow");
    } else {
      childRef.current.callFnHandleForceClose();
    }
  };
  const openDD = (value, color) => {
    props.openData(value, color);
  };
  const handleOpen = (dat, type) => {
    setData({
      open: true,
      type: type,
      value: dat,
    });
  };
  const handleClose = () => {
    setData({
      open: true,
      type: false,
      value: false,
    });
  };
  const colorShadowPosition = (result) => {
    if ((result && data.type === "register") || result === 0) {
      if (checkTO(result, "object")) {
        if (result.posicion === 0) {
          return "general-card open-scale-animation dorade-shadow";
        }
        if (result.posicion === 1) {
          return "general-card open-scale-animation gray-shadow";
        }
        if (result.posicion === 2) {
          return "general-card open-scale-animation brounce-shadow";
        } else {
          return "general-card open-scale-animation ordinary-shadow ";
        }
      } else {
        return "general-card close-scale-animation ordinary-shadow ";
      }
    } else if (result && data.type === "review") {
      return "general-card ordinary-shadow open-scale-animation";
    } else {
      return "general-card ordinary-shadow close-scale-animation";
    }
  };
  const checkTO = (value, type) => {
    if (typeof value === type) {
      return true;
    } else {
      return false;
    }
  };
  const deletePositionD = (driver) => {
    let i = driver.posicion;
    props.deletePosition(i);
  };
  const SchemmaRegister = (result) => {
    if (result) {
      return (
        <div className="grid-two-rows">
          {checkTO(result, "object") ? (
            <div
              className={
                data.type !== "register"
                  ? "cancel-btn close-scale-animation"
                  : "cancel-btn open-scale-animation"
              }
              onClick={() => deletePositionD(result)}
            >
              <div className="line-cross-1 open-line-cross-1"></div>
              <div className="line-cross-1 open-line-cross-2"></div>
            </div>
          ) : null}

          <div className={colorShadowPosition(result)}>
            <div
              onClick={
                checkTO(result, "object") ? () => openDD(result.driver) : null
              }
              className="text-hover-card-driver"
            >
              <small>{`#${
                checkTO(result, "object") ? result.posicion + 1 : result + 1
              }`}</small>
              {checkTO(result, "object") ? (
                <small>{result.driver.nombre}</small>
              ) : null}
              {checkTO(result, "object") ? (
                <small>{`${result.puntos} pts`}</small>
              ) : null}
            </div>
            {checkTO(result, "object") ? (
              <img
                src={result.imageDriver}
                className="img-card-driver-fl"
                alt=""
              />
            ) : null}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const SchemmaReview = (result) => {
    if (result) {
      return (
        <div className="grid-two-rows">
          {checkTO(result, "object") ? (
            <div
              className={
                data.type !== "register"
                  ? "cancel-btn close-scale-animation"
                  : "cancel-btn open-scale-animation"
              }
              onClick={() => deletePositionD(result)}
            >
              <div className="line-cross-1 open-line-cross-1"></div>
              <div className="line-cross-1 open-line-cross-2"></div>
            </div>
          ) : null}

          <div className={colorShadowPosition(result)}>
            <div
              onClick={
                checkTO(result, "object") ? () => openDD(result.piloto) : null
              }
              className="text-hover-card-driver"
            >
              <small>{`#${
                checkTO(result, "object") ? result.posicion + 1 : result + 1
              }`}</small>
              {checkTO(result, "object") ? (
                <small>{result.piloto.nombre}</small>
              ) : null}
              {checkTO(result, "object") ? (
                <small>{`${result.puntos} pts`}</small>
              ) : null}
            </div>
            {checkTO(result, "object") ? (
              <img src={false} className="img-card-driver-fl" alt="" />
            ) : null}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const ChoseFormat = () => {
    if (data.value) {
      if (data.type === "review") {
        return FormatRuleteReview();
      } else {
        return FormatRuleteRegister();
      }
    } else {
      return null;
    }
  };
  const FormatRuleteRegister = () => {
    if (data.value) {
      return (
        <div className="container-r-drivers">
          <div className="grid-r-drivers">
            {data.value.map((result) => {
              return SchemmaRegister(result);
            })}
          </div>
          <DataDriver ref={childRef} />
        </div>
      );
    } else {
      return <h1>Loading</h1>;
    }
  };
  const ContentSchemmaReview = (data) => {
    if (data.value.length === 1) {
      return SchemmaReview(data.value[0]);
    } else {
      return data.value.map((result) => {
        return SchemmaReview(result);
      });
    }
  };
  const FormatRuleteReview = () => {
    if (data.value) {
      return (
        <>
          <div className="container-r-drivers">
            <div className="grid-r-drivers grid-r-drivers-review">
              {ContentSchemmaReview(data)}
            </div>
          </div>
          <DataDriver ref={childRef} />
        </>
      );
    } else {
      return <h1>Loading</h1>;
    }
  };
  return ChoseFormat();
});
