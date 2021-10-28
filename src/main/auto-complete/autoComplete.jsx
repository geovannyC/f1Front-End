import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { handleReduceSearch } from "../motor-search/motorSearch";
export const AutoComplete = forwardRef((props, ref) => {
  const [handleChangeInput, setHandleChangeInput] = useState(""),
    [driversSeleted, setDriversSelectet] = useState(false),
    [loading, setLoading] = useState(true),
    [data, setData] = useState({
      name: false,
      alias: false,
      drivers: false,
    }),
    [barLoading, setBarLoading] = useState(false),
    [dataFinded, setDataFinded] = useState(false);
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(nameR, aliasR, driversR) {
      handleOpen(nameR, aliasR, driversR);
    },
  }));
  const handleOpen = (nameR, aliasR, driversR) => {
    if (loading) {
      setData({
        name: nameR,
        alias: aliasR,
        drivers: driversR,
      });
      setLoading(false);
    }
  };
  const addProgress = (event) => {
    if (dataFinded) {
      if (event.charCode === 13) {
        props.driverSelected(dataFinded);
      }
    }
  };
  const handleChangeValueInput = async (event) => {
    if (event) {
      let textFormat = await formatWords(event.target.value);
      let resultSearch = await handleReduceSearch(
        textFormat,
        data.name,
        data.alias,
        data.drivers
      );
      if (resultSearch) {
        setDataFinded(resultSearch);
      }
      setHandleChangeInput(textFormat);
    } else {
      setDataFinded(false);
    }
  };
  const formatWords = (text) => {
    return new Promise((resolve) => {
      resolve(text.replace(/[^a-zA-Z ]/g, "").toLowerCase());
    });
  };
  const resultSearch = () => {
    if (dataFinded) {
      return dataFinded.nombre;
    } else {
      return "Piloto";
    }
  };
  const FormatAutocomplete = () => {
    return (
      <div>
        <div className="general-card">
          <div className="grid-card-autocomplete">
            <div className="row1-autocomplete">
              <div className="drivers-finded">{resultSearch()}</div>
            </div>
            <div className="row2-autocomplete">
              <input
                className="input-autocomplete"
                value={handleChangeInput}
                onChange={handleChangeValueInput}
                type="text"
                onKeyPress={(e) => {
                  addProgress(e);
                }}
              />
              <div
                class={
                  barLoading
                    ? barLoading === "100%"
                      ? "meter color-complete"
                      : "meter color"
                    : null
                }
              >
                <span style={{ width: barLoading ? barLoading : "0%" }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return FormatAutocomplete();
});
