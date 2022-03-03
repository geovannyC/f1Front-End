import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useReducer,
} from "react";
import useForceUpdate from "use-force-update";
import { ChromePicker } from "react-color";
import logo from "../images/logo.jpg";
import { InputAutocomplete } from "../input-autocomplete/inputAutoplete";
import { getData } from "../../until/fetch";
import { handleChangeValueInput } from "../find-text/findText";
export const ACTIONS = {
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE:
      let newState = [...state];
      newState[action.payload.pos] = action.payload.data;
      return newState;
    case ACTIONS.DELETE:
      let newStateDeleted = [...state];
      newStateDeleted = initialStateSwitchColor;
      return newStateDeleted;
    default:
      return state;
  }
}
const initialStateSwitchColor = [false, false];
export const ScuderiaEditor = forwardRef(({ callLoading }, ref) => {
  const [open, setOpen] = useState({
      open: false,
      openD1Editor: false,
      openD2Editor: false,
    }),
    [selectScuderia, setSelectScuderia] = useState(false),
    [image, setImage] = useState(false),
    [folders, setFolders] = useState(false),
    [drivers, setDrivers] = useState(false),
    [wordFinded, setWordFinded] = useState("escuderia"),
    [switchData, dispatchSwitchData] = useReducer(
      reducer,
      initialStateSwitchColor
    ),
    [dataInput, setDataInput] = useState({
      driver1: "",
      driver2: "",
      scuderiaName: false,
      folderScuderia: false,
    });
  const findImage = (value) => {
    return new Promise(async (resolve) => {
      let image;
      const url = `/getImagesPilots/${value}`;
      await getData(url).then((response) => {
        if (response) {
          image = response;
        }
      });
      resolve(image);
    });
  };
  const sendData = () => {
    let url = "/update-scuderia";

    let data = {
      _id: wordFinded._id,
      colors: {
        pColor: switchData[0],
        sColor: switchData[1],
      },
    };
    console.log(data);
    callLoading(data, url, "post");
  };
  const chilrefIA = useRef();
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(scuderiasCh, paramDrivers, paramFolders) {
      handleOpen(scuderiasCh, paramDrivers, paramFolders);
    },
  }));
  const forceUpdate = useForceUpdate();
  const handleOpen = (scuderiasCh, paramDrivers, paramFolders) => {
    if (open.open) {
      setOpen({ ...open, open: false });
      dispatchSwitchData({ type: ACTIONS.DELETE });
    } else {
      setOpen({ ...open, open: true });
      setDrivers(paramDrivers);
      setFolders(paramFolders);
      if (!selectScuderia) {
        chilrefIA.current.callFnHandleOpen(scuderiasCh, "nombreEscuderia");
      }
    }
    // const handleOpenIA = () => {
    //   chilrefIA.current.callFnHandleOpen(drivers, "nombre", "alias");
  };
  const handleChangueColor = (paramcolor, pos) => {
    if (pos === 0) {
      setPColorStyle(paramcolor.hex);
    } else {
      setSColorStyle(paramcolor.hex);
    }
    dispatchSwitchData({
      type: ACTIONS.UPDATE,
      payload: { data: paramcolor.hex, pos: pos },
    });
  };
  const setPColorStyle = (newColor) => {
    document.documentElement.style.setProperty(
      "--primary-bg-color-scuderia",
      newColor
    );
  };
  const setSColorStyle = (newColor) => {
    document.documentElement.style.setProperty(
      "--secondary-bg-color-scuderia",
      newColor
    );
  };
  const getWhiteColor = () => {
    const color1 = getComputedStyle(document.documentElement).getPropertyValue(
      "--main-bg-color-white"
    );
    return color1;
  };
  const getBlackColor = () => {
    const color1 = getComputedStyle(document.documentElement).getPropertyValue(
      "--main-bg-color-black"
    );
    return color1;
  };
  const handleOpenSelectScuderia = () => {
    if (selectScuderia) {
      setSelectScuderia(false);
      setDataInput({
        driver1: false,
        driver2: false,
        scuderiaName: false,
        folderScuderia: false,
      });

      setWordFinded(false);
      dispatchSwitchData({ type: ACTIONS.DELETE });
    } else {
      let pColor = wordFinded.colors
        ? wordFinded.colors.pColor
        : getWhiteColor();
      let sColor = wordFinded.colors
        ? wordFinded.colors.sColor
        : getBlackColor();
      setPColorStyle(pColor);
      setSColorStyle(sColor);
      dispatchSwitchData({
        type: ACTIONS.UPDATE,
        payload: { data: pColor ? pColor : getWhiteColor(), pos: [0] },
      });
      dispatchSwitchData({
        type: ACTIONS.UPDATE,
        payload: { data: sColor ? sColor : getBlackColor(), pos: [1] },
      });
      setSelectScuderia(true);
    }
  };
  const addProgress = (event) => {
    let id = event.target.id;
    if (event.charCode === 13) {
      if (id === "scuderia-name") {
        handleOpenSelectScuderia(event);
      } else if (id === "driver1" || id === "driver2") {
        handleOpenChangeDriver(event);
      }
    }
  };
  const onPressEnter = () => {
    if (!selectScuderia) {
      setWordFinded(wordFinded);
      handleOpenSelectScuderia();
    } else if (selectScuderia) {
      return null;
      // let newWordFinded = wordFinded;
      // let newStatehSwitchData = switchData;
      // if (typeof switchData.pColor === "string") {
      //   newWordFinded.piloto1 = switchData.openD1Editor;
      //   newStatehSwitchData.openD1Editor = false;
      // } else if (typeof switchData.sColor === "string") {
      //   newWordFinded.piloto2 = switchData.openD2Editor;
      //   newStatehSwitchData.openD2Editor = false;
      // }
      // setSwitchData(newStatehSwitchData);
      // setWordFinded(newWordFinded);
      // forceUpdate();
    }
  };
  // const handleOpenColorPicker = (event) => {
  //   let stateColor = switchData;
  //   let id = event.target.id;
  //   if (id === "primary") {
  //     if (switchData.openPP) {
  //       stateColor.openPColor = false;
  //     } else {
  //       stateColor.openPColor = true;
  //     }
  //   } else {
  //     if (switchData.openSP) {
  //       stateColor.openSColor = false;
  //     } else {
  //       stateColor.openSColor = true;
  //     }
  //   }
  //   setSwitchData(stateColor);
  //   forceUpdate();
  // };
  const handleOpenChangeDriver = (event) => {
    let id = event.target.id;
    if (id === "driver1") {
      if (open.openD1Editor) {
        setOpen({ ...open, openD1Editor: false });
      } else {
        setOpen({ ...open, openD1Editor: true, openD2Editor: false });

        // handleOpenIA();
      }
    } else {
      if (open.openD2Editor) {
        setOpen({ ...open, openD2Editor: false });
      } else {
        setOpen({ ...open, openD2Editor: true, openD1Editor: false });
        // handleOpenIA();
      }
    }
    forceUpdate();
  };
  // const handleOpenChangeNameScuderia = () => {
  //   let stateSwitch = switchData;
  //   if (stateSwitch.openNEEditor) {
  //     stateSwitch.openNEEditor = false;
  //   } else {
  //     stateSwitch.openNEEditor = true;
  //   }
  //   setSwitchData(stateSwitch);
  //   forceUpdate();
  // };
  const findLogo = async (txt) => {
    return new Promise(async (resolve) => {
      let image;
      const url = `/find-logo-scuderia/${txt}`;
      await getData(url).then((response) => {
        if (response) {
          image = response;
        } else {
          image = false;
        }
      });
      resolve(image);
    });
  };
  // const handleChangueInput = async (event) => {
  //   let newValue = await formatWords(event.target.value);
  //   let stateDataInput = dataInput;
  //   let id = event.target.id;
  //   let newWordFinded = wordFinded;
  //   if (id === "scuderia-name") {
  //     stateDataInput.scuderiaName = newValue;
  //     wordFinded.nombreEscuderia = newValue;
  //     setWordFinded(newWordFinded);
  //   } else if (id === "driver1") {
  //     stateDataInput.driver1 = newValue;
  //   } else if (id === "driver2") {
  //     stateDataInput.driver2 = newValue;
  //   } else if (id === "folder-name") {
  //     handleChangeValueInput(newValue, folders).then(async (folderFinded) => {
  //       if (folderFinded) {
  //         if (folderFinded.length === 1) {
  //           if (folderFinded[0] !== image) {
  //             await findLogo(folderFinded[0]).then((result) => {
  //               if (result) {
  //                 setImage(result);
  //               }
  //             });
  //           }
  //           newWordFinded.carpetaEscuderia = folderFinded[0];
  //         }
  //       }
  //     });
  //     stateDataInput.folderScuderia = newValue;
  //     setWordFinded(newWordFinded);
  //   }
  //   setDataInput(stateDataInput);
  //   forceUpdate();
  // };
  // const formatWords = (text) => {
  //   return new Promise((resolve) => {
  //     resolve(text.replace(/[^a-zA-Z ]/g, "").toLowerCase());
  //   });
  // };
  // const fnCancel = async (event) => {
  //   let stateDataInput = dataInput;
  //   let id = event.target.id;
  //   if (id === "scuderia-name") {
  //     stateDataInput.scuderiaName = "";
  //   } else if (id === "driver1") {
  //     stateDataInput.driver1 = "";
  //   } else if (id === "driver2") {
  //     stateDataInput.driver2 = "";
  //   } else if (id === "forlder-name") {
  //     stateDataInput.folderScuderia = "";
  //   }
  //   setDataInput(stateDataInput);
  //   handleOpenChangeDriver(event);
  //   forceUpdate();
  // };
  const resultSearch = async (result) => {
    // let stateSwitch = switchData;
    if (!selectScuderia) {
      if (result) {
        await findImage(result.carpetaEscuderia).then((resultImg) => {
          if (resultImg) {
            setImage(resultImg);
          }
        });
        setWordFinded(result);
      } else {
        setWordFinded(false);
      }
    } else {
      return null;
      // if (result) {
      //   if (switchData.openD1Editor) {
      //     stateSwitch.openD1Editor = result;
      //   } else {
      //     switchData.openD2Editor = result;
      //   }
      //   setSwitchData(stateSwitch);
      //   forceUpdate();
      // }
    }
  };
  const PrimaryColorPicker = () => {
    if (open.openD1Editor) {
      // if (switchData.openPColor) {
      return (
        <div className="container-color-picker">
          <ChromePicker
            color={switchData[0]}
            onChangeComplete={(e) => {
              handleChangueColor(e, 0);
            }}
          />
        </div>
      );
      // }
      // else {
      //   return (
      //     <button
      //       className="input-autocomplete"
      //       id="primary"
      //       onClick={handleOpenColorPicker}
      //       value="Color Primario"
      //     />
      //   );
      // }
    } else {
      return null;
    }
  };
  const SecondaryColorPicker = () => {
    // if (!switchData.openD1Editor) {
    if (open.openD2Editor) {
      return (
        <div className="container-color-picker">
          <ChromePicker
            color={switchData[1]}
            onChangeComplete={(e) => {
              handleChangueColor(e, 1);
            }}
          />
        </div>
      );
      // } else {
      //   return (
      //     <button
      //       className="input-autocomplete"
      //       id="secondary"
      //       onClick={handleOpenColorPicker}
      //       value="Color Secundario"
      //     />
      //   );
      // }
    } else {
      return null;
    }
  };
  const checkChangesColor = () => {
    if (
      switchData[0] !== getWhiteColor() ||
      switchData[1] !== getBlackColor()
    ) {
      return true;
    } else {
      return false;
    }
  };
  const FnInputAutocomplete = () => {
    return (
      <div
        className={
          !selectScuderia && open.open
            ? "animation-left-to-right-open container-r-drivers"
            : "animation-left-to-right container-r-drivers"
        }
      >
        <InputAutocomplete
          ref={chilrefIA}
          resultSearch={resultSearch}
          onPressEnter={onPressEnter}
        />
        {/* <input
          className="input-autocomplete"
          type="text"
          id="scuderia-name"
          onKeyPress={(e) => {
            addProgress(e);
          }}
        /> */}
        <p class="helper helper1">Nombre escuderia</p>
      </div>
    );
  };
  const LogoBack = () => {
    return (
      <div
        className={
          selectScuderia && open.open
            ? "general-container index--1  animation-up-to-down-open animation-right-left-20-open"
            : "general-container index--1 animation-up-to-down animation-right-left-20"
        }
      >
        <div
          className={
            selectScuderia && open.open
              ? "container-back-logo  animation-up-to-down-open animation-right-left-20-open"
              : "container-back-logo animation-up-to-down animation-right-left-20"
          }
        >
          <div className="container-image-logo ">
            <img
              className="data-image-hidden"
              src={image ? image : logo}
              alt=""
            />
          </div>
        </div>
      </div>
    );
  };

  const TopContainer = () => {
    if (wordFinded && typeof wordFinded === "object") {
      return (
        <div
          className={
            selectScuderia && open.open
              ? "animation-left-to-right-open container-r-drivers"
              : "animation-left-to-right container-r-drivers"
          }
        >
          <div className=" grid-two-columns-70-30">
            <div className="container-ed-driver1 linear-grandient-right-pcolor-transparent">
              <div
                className={
                  open.openD1Editor
                    ? "animation-left-to-right-open general-container-2"
                    : "animation-left-to-right general-container-2"
                }
              >
                {/* <div className="content-column container-back-content">
                  <small className="text-ed">
                    {typeof switchData.openD1Editor === "object"
                      ? switchData.openD1Editor.nombre
                      : null}
                  </small> */}
                {/* <InputAutocomplete
                    ref={chilrefIA}
                    resultSearch={resultSearch}
                    onPressEnter={onPressEnter}
                  /> */}
                {/* <input
                    className="input-autocomplete"
                    type="text"
                    value={!dataInput.driver1 ? "" : dataInput.driver1}
                    id="driver1"
                    onChange={handleChangueInput}
                    onKeyPress={(e) => {
                      addProgress(e);
                    }}
                  /> */}
                {/* <button
                    className="input-autocomplete "
                    id="driver1"
                    onClick={fnCancel}
                    value="cancelar"
                  /> */}
                {/* </div> */}
              </div>

              <div
                className={
                  !open.openD1Editor
                    ? "animation-left-to-right-open general-container-2"
                    : "animation-left-to-right general-container-2"
                }
              >
                <small
                  className="text-ed"
                  id="driver1"
                  onClick={handleOpenChangeDriver}
                >
                  {!dataInput.driver1 || dataInput.driver1.lenght === 0
                    ? wordFinded.piloto1.nombre
                    : dataInput.driver1}
                </small>
              </div>
            </div>

            <div className="container-r-drivers">{PrimaryColorPicker()}</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const BottomContainer = () => {
    if (wordFinded && typeof wordFinded === "object") {
      return (
        <div
          className={
            selectScuderia && open.open
              ? "animation-right-to-leftt-open container-r-drivers"
              : "animation-right-to-left container-r-drivers"
          }
        >
          <div className=" grid-two-columns-30-70">
            <div className="container-r-drivers ">{SecondaryColorPicker()}</div>
            <div className="container-driver2 ">
              <div className=" container-ed-driver2 linear-grandient-left-pcolor-transparent">
                <div
                  className={
                    open.openD2Editor
                      ? "animation-right-to-leftt-open general-container-2"
                      : "animation-right-to-left general-container-2"
                  }
                >
                  {/* <div className="content-column container-back-content">
                    <small className="text-ed">
                      {typeof switchData.openD2Editor === "object"
                        ? switchData.openD2Editor.nombre
                        : null}
                    </small> */}
                  {/* <InputAutocomplete
                      ref={chilrefIA}
                      resultSearch={resultSearch}
                      onPressEnter={onPressEnter}
                    /> */}
                  {/* <button
                      type="text"
                      className="input-autocomplete "
                      id="driver2"
                      onClick={fnCancel}
                      value="Cancelar"
                    /> */}
                  {/* </div> */}
                </div>

                <div
                  className={
                    !open.openD2Editor
                      ? "animation-right-to-leftt-open "
                      : "animation-right-to-left "
                  }
                >
                  <small
                    className="text-ed"
                    id="driver2"
                    onClick={handleOpenChangeDriver}
                  >
                    {!dataInput.driver2 || dataInput.driver2.lenght === 0
                      ? wordFinded.piloto2.nombre
                      : dataInput.driver2}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const SchemmaChangueScuderiaName = () => {
    return (
      <>
        <div
          className={
            open.open && selectScuderia && switchData.openNEEditor
              ? "animation-left-to-right-open container-fixed"
              : "animation-left-to-right container-fixed "
          }
        >
          <div className="container-back-content">
            <div className="timer-container">
              <div className="container-back-content">
                {/* <input
                  className="input-autocomplete "
                  id="scuderia-name"
                  value={!dataInput.scuderiaName ? "" : dataInput.scuderiaName}
                  onChange={handleChangueInput}
                  type="text"
                  onKeyPress={(e) => {
                    addProgress(e);
                  }}
                /> */}
                <p class="helper helper1">{wordFinded.nombreEscuderia}</p>
              </div>
              {/* <div className="container-back-content"> */}
              {/* <input
                  className="input-autocomplete "
                  type="text"
                  id="folder-name"
                  value={
                    !dataInput.folderScuderia ? "" : dataInput.folderScuderia
                  }
                  onChange={handleChangueInput}
                  onKeyPress={(e) => {
                    addProgress(e);
                  }}
                /> */}
              {/* <p class="helper helper1">{wordFinded.carpetaEscuderia}</p> */}
              {/* </div> */}
              {/* <div className="container-back-content">
                <button
                  type="submit"
                  className="input-autocomplete "
                  value="Aceptar"
                >
                  ACEPTAR
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div
          className={
            open.open && switchData[0] && switchData[1]
              ? "animation-left-to-right-open container-fixed"
              : "animation-left-to-right container-fixed "
          }
        >
          {checkChangesColor() ? (
            <div className="aling-items-row">
              <button
                type="submit"
                className="input-autocomplete"
                onClick={sendData}
              >
                ACEPTAR
              </button>
            </div>
          ) : null}
        </div>
        <div>{ContentBackLetters()}</div>
      </>
    );
  };
  const SchemmaEditorForm = () => {
    return (
      <div
        className={
          selectScuderia && open.open
            ? "animation-left-to-right-open container-r-drivers"
            : "animation-left-to-right container-r-drivers"
        }
      >
        <div className="container-rows3-33">
          {TopContainer()}
          {SchemmaChangueScuderiaName()}
          {BottomContainer()}
        </div>
      </div>
    );
  };
  const ContentBackLetters = () => {
    if (wordFinded && typeof wordFinded === "object") {
      return (
        <div
          className={
            open.open
              ? "container-back-content animation-right-to-leftt-open"
              : "animation-right-to-left container-back-content"
          }
        >
          <div
            className={
              selectScuderia
                ? "container-back-letters big-letters big-letters-selected"
                : "big-letters container-back-letters"
            }
          >
            <small
              onClick={handleOpenSelectScuderia}
              value={dataInput.scuderiaName}
            >
              {wordFinded.nombreEscuderia}
            </small>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const ContentBackLetters2 = () => {
    return (
      <div
        className={
          open.open && !selectScuderia
            ? "container-back-content animation-right-to-leftt-open index--1"
            : "animation-right-to-left container-back-content index--1"
        }
      >
        <div
          className={
            selectScuderia
              ? "container-back-letters big-letters big-letters-selected"
              : " big-letters container-back-letters"
          }
        >
          <small>
            {wordFinded && typeof wordFinded === "object"
              ? wordFinded.nombreEscuderia
              : "Escuderia"}
          </small>
        </div>
      </div>
    );
  };
  const SchemmaSE = () => {
    return (
      <div
        className={
          open.open ? "general-container index-1" : "general-container index-0"
        }
      >
        <div
          className={
            open.open
              ? "animation-right-to-leftt-open container-r-drivers"
              : "animation-right-to-left container-r-drivers"
          }
        ></div>
        {FnInputAutocomplete()}
        {LogoBack()}
        {SchemmaEditorForm()}
        {ContentBackLetters2()}
      </div>
    );
  };
  return SchemmaSE();
});
