import React, { useState, forwardRef, useImperativeHandle } from "react";
import useForceUpdate from "use-force-update";
import { handleChangeValueInput } from "../find-text/findText";
import { handleReduceSearch } from "../motor-search/motorSearch";
import { pilotos } from "../record.json";
export const FastLap = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [data, setData] = useState(false),
    [handleChangeInput, setHandleChangeInput] = useState({
      driver: false,
      minute: false,
      seconds: false,
      miliseconds: false,
    }),
    [loading, setLoading] = useState(true),
    [dataInput, setDataInput] = useState({
      name: false,
      alias: false,
      drivers: false,
    }),
    [dataFinded, setDataFinded] = useState(false);
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(nameR, aliasR, driversR) {
      handleOpen(nameR, aliasR, driversR);
    },
  }));

  const forceUpdate = useForceUpdate();
  const handleOpen = (nameR, aliasR, driversR) => {
    if (loading) {
      setData({
        name: nameR,
        alias: aliasR,
        drivers: driversR,
      });
      setOpen(true);
      setLoading(false);
    }
  };
  const formatWords = (text) => {
    return new Promise((resolve) => {
      resolve(text.replace(/[^a-zA-Z ]/g, "").toLowerCase());
    });
  };
  const handleChangeValueInput = async (event) => {
    let prevData = handleChangeInput;
    if (event) {
      let txt = event.target.value;
      if (event.target.id === "name") {
        let textFormat = await formatWords(txt);
        let resultSearch = await handleReduceSearch(
          textFormat,
          data.name,
          data.alias,
          data.drivers
        );
        if (resultSearch) {
          prevData.driver = resultSearch;
        }
      } else if (event.target.id === "minute") {
        prevData.minute = txt;
      } else if (event.target.id === "seconds") {
        prevData.seconds = txt;
      } else if (event.target.id === "miliseconds") {
        prevData.miliseconds = txt;
      }
    } else {
      prevData.driver = false;
    }
    setHandleChangeInput(prevData);
    forceUpdate();
  };
  const sendData = () => {
    props.addPoints(handleChangeInput);
  };
  const FormFl = () => {
    return (
      <div
        className={
          open
            ? "container-r-drivers animation-right-to-leftt-open"
            : "container-r-drivers animation-right-to-left"
        }
      >
        <div className="fasLapContainer">
          <div className="driver-text secondary-color">Vuelta Rápida</div>
          <div className="general-card container-r-drivers ">
            <div className="grid-four-rows-25">
              <div className="container-r-drivers">
                <small className="secondary-color">
                  {handleChangeInput.driver.nombre}
                </small>
              </div>
              <div className="container-r-drivers">
                <input
                  type="text"
                  className="input-autocomplete"
                  id="name"
                  onChange={handleChangeValueInput}
                />
              </div>
              <div className="timer-container ">
                <div className="time ">
                  <input
                    className="input-autocomplete"
                    id="minute"
                    onChange={handleChangeValueInput}
                    type="number"
                  />
                  <h1 className="secondary-color">:</h1>
                </div>
                <div className="time ">
                  <input
                    className="input-autocomplete"
                    id="seconds"
                    onChange={handleChangeValueInput}
                    type="number"
                  />
                  <h1 className="secondary-color">:</h1>
                </div>
                <div className="time ">
                  <input
                    className="input-autocomplete"
                    id="miliseconds"
                    onChange={handleChangeValueInput}
                    type="number"
                  />
                  <h1 className="secondary-color">:</h1>
                </div>
              </div>
              {handleChangeInput.seconds &&
              handleChangeInput.miliseconds &&
              handleChangeInput.minute &&
              handleChangeInput.driver ? (
                <div className="container-r-drivers">
                  <a className="input-autocomplete" onClick={() => sendData()}>
                    Registrar Vuelta Rápida
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const BtnOpenForm = () => {
    return (
      <div
        className={
          !open
            ? "container-r-drivers  animation-right-to-leftt-open"
            : "container-r-drivers animation-right-to-left"
        }
      ></div>
    );
  };
  return (
    <div className="container-fl">
      {FormFl()}
      {BtnOpenForm()}
    </div>
  );
});
