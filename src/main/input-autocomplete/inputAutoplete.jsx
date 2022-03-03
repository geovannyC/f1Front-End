import React, { useState, useImperativeHandle, forwardRef } from "react";
import { handleChangeValueInput } from "../find-text/findText";
import { MotorSearch2 } from "../motor-search2.0/motorSearch";
import useForceUpdate from "use-force-update";
export const InputAutocomplete = forwardRef((props, ref) => {
  const [data, setData] = useState({
      dataArr: false,
      paramSearch: false,
      paramSearch2: false,
    }),
    [arrs, setArrs] = useState({
      arr1: false,
      arr2: false,
    }),
    [loading, setLoading] = useState(true),
    [ValueInput, setValueInput] = useState("");
  const forceUpdate = useForceUpdate();
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(paramData, paramSearch, paramSearch2) {
      handleOpen(paramData, paramSearch, paramSearch2);
    },
    callFnHandleClose() {
      handleClose();
    },
  }));
  const handleOpen = (paramData, paramSearch, paramSearch2) => {
    fnSetArrs(paramData, paramSearch, paramSearch2);
    setData({
      dataArr: paramData,
      paramSearch: paramSearch,
      paramSearch2: paramSearch2,
    });
    setLoading(false);
    forceUpdate();
  };
  const handleClose = () => {
    setData({
      dataArr: false,
      paramSearch: false,
      paramSearch2: false,
    });
    setArrs({
      arr1: false,
      arr2: false,
    });
    setLoading(true);
    setValueInput("");
  };
  const formatWords = (text) => {
    return new Promise((resolve) => {
      resolve(text.replace(/[^a-zA-Z ]/g, "").toLowerCase());
    });
  };
  const fnHandleChangeValueInput = async (event) => {
    let newValue = await formatWords(event.target.value);
    let stateInput = ValueInput;
    stateInput = newValue;
    findTxt(stateInput);
    setValueInput(stateInput);
  };
  const fnSetArrs = async (paramArr, param1, param2) => {
    let arr = await arrFilterByParam(paramArr, param1);
    let arr2 = false;
    if (param2) {
      arr2 = await arrFilterByParam(paramArr, param2);
    }
    setArrs({
      arr1: arr,
      arr2: arr2,
    });
    forceUpdate();
  };
  const arrFilterByParam = (arr, paramS) => {
    return new Promise((resolve) => {
      let find = arr.map((element) => {
        if (
          element[paramS] !== undefined &&
          (element[paramS] !== false) & (element[paramS] !== "false")
        ) {
          return element[paramS];
        } else {
          return false;
        }
      });
      let result = find.filter((item) => item !== undefined && item !== "");
      resolve(result);
    });
  };
  const findTxt = async (word) => {
    let dataToSend;
    if (word.length > 0) {
      let resultSearch = await handleChangeValueInput(word, arrs.arr1);
      if (resultSearch.length === 0 && data.paramSearch2) {
        let arrWithOutFalte = arrs.arr2.filter((result) => result !== false);
        let resultSearch2 = await handleChangeValueInput(word, arrWithOutFalte);
        if (resultSearch2.length === 1) {
          dataToSend = await MotorSearch2(
            resultSearch2[0],
            data.dataArr,
            data.paramSearch2
          );
        } else {
          dataToSend = false;
        }
      } else if (resultSearch.length === 1) {
        dataToSend = await MotorSearch2(
          resultSearch[0],
          data.dataArr,
          data.paramSearch
        );
      }
      props.resultSearch(dataToSend);
    } else {
      props.resultSearch(false);
    }
  };
  const addProgress = (e) => {
    e.preventDefault()
    setValueInput("")
    props.onPressEnter(true);
  };
  const ShemmaInput = () => {
    if ( data.dataArr) {
      return (
        <form onSubmit={addProgress}>
          <input
            className="input-autocomplete"
            type="text"
            id="scuderia-name"
            value={ValueInput}
            onChange={fnHandleChangeValueInput}
            // onKeyPress={(e) => {
            //   addProgress(e);
            // }}
          />
        </form>
      );
    } else {
      return <div>cargando</div>;
    }
  };

  return ShemmaInput();
});
