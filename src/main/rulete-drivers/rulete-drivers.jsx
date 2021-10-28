import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import alonso from "../images/alonso.jpg";
import { DataDriver } from "../data-driver/dataDriver";
import { getData } from "../../until/fetch";
export const Rdrivers = forwardRef((props, ref) => {
  const [numberCancel, setNumberCancel] = useState(false),
    [data, setData] = useState({
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
  const findImage =async (value) => {

      let image;
      const url = `/getImagesPilots/${value}`;
      await getData(url).then((response) => {
        if (response) {
          image = response;
        }
      });
      return image
  };
  const switchAction = (value) => {
    if (value) {
      childRef.current.callFnHandleOpenDialog(value, "ordinary-shadow");
    } else {
      childRef.current.callFnHandleForceClose();
    }
  };
  const openDD = (value, color)=>{
    props.openData(value, color)
  }
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
  const handleChangeNumberCancel = (value) => {
    if (!numberCancel) {
      console.log(value);
      setNumberCancel(value);
    }
  };
  const handleCloseNumberCancel = () => {
    if (numberCancel) {
      setNumberCancel(false);
    }
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
              <div
                className={
                  numberCancel === result
                    ? "line-cross-1 open-line-cross-1"
                    : "line-cross-1"
                }
              ></div>
              <div
                className={
                  numberCancel === result
                    ? "line-cross-1 open-line-cross-2"
                    : "line-cross-1"
                }
              ></div>
            </div>
          ) : null}

          <div className={colorShadowPosition(result)}>
            <div
              onClick={
                checkTO(result, "object") ? () => openDD(result.driver): null
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
              <img src={result.imageDriver} className="img-card-driver-fl" />
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
              <div
                className={
                  numberCancel === result
                    ? "line-cross-1 open-line-cross-1"
                    : "line-cross-1"
                }
              ></div>
              <div
                className={
                  numberCancel === result
                    ? "line-cross-1 open-line-cross-2"
                    : "line-cross-1"
                }
              ></div>
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
              <img src={false} className="img-card-driver-fl" />
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
        return FormatRuleteReview()
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
  const FormatRuleteReview = () => {
    if (data.value) {
      return (
        <>
        <div className="container-r-drivers">
          <div className="grid-r-drivers">
            {data.value.length === 1
              ? SchemmaReview(data.value[0])
              : data.value.map((result) => {
                  return SchemmaReview(result);
                })}
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
