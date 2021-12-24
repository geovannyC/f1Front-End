import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import useForceUpdate from "use-force-update";
import { ChromePicker } from "react-color";
import logo from "../images/logo.jpg";
import { InputAutocomplete } from "../input-autocomplete/inputAutoplete";
import { getData } from "../../until/fetch";
import { handleChangeValueInput } from "../find-text/findText";
export const ScuderiaEditor = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [selectScuderia, setSelectScuderia] = useState(false),
    [image, setImage] = useState(false),
    [folders, setFolders] = useState(false),
    [drivers, setDrivers] = useState(false),
    [wordFinded, setWordFinded] = useState("escuderia"),
    [switchData, setSwitchData] = useState({
      openPColor: false,
      openSColor: false,
      openD1Editor: false,
      openD2Editor: false,
      openNEEditor: false,
    }),
    [dataColor, setDataColor] = useState({
      pColor: false,
      sColor: false,
    }),
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
  const chilrefIA = useRef();
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(scuderiasCh, paramDrivers, paramFolders) {
      handleOpen(scuderiasCh, paramDrivers, paramFolders);
    },
  }));
  const forceUpdate = useForceUpdate();
  const handleOpen = (scuderiasCh, paramDrivers, paramFolders) => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
      setDrivers(paramDrivers);
      setFolders(paramFolders);
      if (switchData.openD1Editor || switchData.openD2Editor) {
      } else if (!selectScuderia) {
        chilrefIA.current.callFnHandleOpen(scuderiasCh, "nombreEscuderia");
      }
    }
    open ? setOpen(false) : setOpen(true);
  };
  const handleOpenIA = () => {
    chilrefIA.current.callFnHandleOpen(drivers, "nombre", "alias");
  };
  const handleChanguePColor = (paramcolor) => {
    let stateColor = dataColor;
    stateColor.pColor = paramcolor.hex;
    setPColorStyle(paramcolor.hex);
    setDataColor(stateColor);
    forceUpdate();
  };
  const handleChangueSColor = (paramcolor) => {
    let stateColor = dataColor;
    stateColor.sColor = paramcolor.hex;
    setSColorStyle(paramcolor.hex);
    setDataColor(stateColor);
    forceUpdate();
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
      setDataColor({
        pColor: false,
        sColor: false,
      });
      setSwitchData({
        openPColor: false,
        openSColor: false,
        openD1Editor: false,
        openD2Editor: false,
      });
      setDataInput({
        driver1: false,
        driver2: false,
        scuderiaName: false,
        folderScuderia: false,
      });
      setPColorStyle(getWhiteColor());
      setSColorStyle(getBlackColor());
    } else {
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
    if (wordFinded && !selectScuderia) {
      handleOpenSelectScuderia();
    } else if (selectScuderia) {
      let newWordFinded = wordFinded;
      let newStatehSwitchData = switchData;
      if (typeof switchData.openD1Editor === "object") {
        newWordFinded.piloto1 = switchData.openD1Editor;
        newStatehSwitchData.openD1Editor = false;
      } else if (typeof switchData.openD2Editor === "object") {
        newWordFinded.piloto2 = switchData.openD2Editor;
        newStatehSwitchData.openD2Editor = false;
      }
      setSwitchData(newStatehSwitchData);
      setWordFinded(newWordFinded);
      forceUpdate();
    }
  };
  const handleOpenColorPicker = (event) => {
    let stateColor = switchData;
    let id = event.target.id;
    if (id === "primary") {
      if (switchData.openPP) {
        stateColor.openPColor = false;
      } else {
        stateColor.openPColor = true;
      }
    } else {
      if (switchData.openSP) {
        stateColor.openSColor = false;
      } else {
        stateColor.openSColor = true;
      }
    }
    setSwitchData(stateColor);
    forceUpdate();
  };
  const handleOpenChangeDriver = (event) => {
    let stateSwitch = switchData;
    let id = event.target.id;
    if (id === "driver1") {
      if (switchData.openD1Editor) {
        stateSwitch.openD1Editor = false;
      } else {
        stateSwitch.openD1Editor = true;
        stateSwitch.openD2Editor = false;
        handleOpenIA();
      }
    } else {
      if (switchData.openD2Editor) {
        stateSwitch.openD2Editor = false;
      } else {
        stateSwitch.openD2Editor = true;
        stateSwitch.openD1Editor = false;
        handleOpenIA();
      }
    }
    setSwitchData(stateSwitch);
    forceUpdate();
  };
  const handleOpenChangeNameScuderia = () => {
    let stateSwitch = switchData;
    if (stateSwitch.openNEEditor) {
      stateSwitch.openNEEditor = false;
    } else {
      stateSwitch.openNEEditor = true;
    }
    setSwitchData(stateSwitch);
    forceUpdate();
  };
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
  const handleChangueInput = async (event) => {
    let newValue = await formatWords(event.target.value);
    let stateDataInput = dataInput;
    let id = event.target.id;
    let newWordFinded = wordFinded;
    if (id === "scuderia-name") {
      stateDataInput.scuderiaName = newValue;
      wordFinded.nombreEscuderia = newValue;
      setWordFinded(newWordFinded);
    } else if (id === "driver1") {
      stateDataInput.driver1 = newValue;
    } else if (id === "driver2") {
      stateDataInput.driver2 = newValue;
    } else if (id === "folder-name") {
      handleChangeValueInput(newValue, folders).then(async (folderFinded) => {
        if (folderFinded) {
          if (folderFinded.length === 1) {
            if (folderFinded[0] !== image) {
              await findLogo(folderFinded[0]).then((result) => {
                if (result) {
                  setImage(result);
                }
              });
            }
            newWordFinded.carpetaEscuderia = folderFinded[0];
          }
        }
      });
      stateDataInput.folderScuderia = newValue;
      setWordFinded(newWordFinded);
    }
    setDataInput(stateDataInput);
    forceUpdate();
  };
  const formatWords = (text) => {
    return new Promise((resolve) => {
      resolve(text.replace(/[^a-zA-Z ]/g, "").toLowerCase());
    });
  };
  const fnCancel = async (event) => {
    let stateDataInput = dataInput;
    let id = event.target.id;
    if (id === "scuderia-name") {
      stateDataInput.scuderiaName = "";
    } else if (id === "driver1") {
      stateDataInput.driver1 = "";
    } else if (id === "driver2") {
      stateDataInput.driver2 = "";
    } else if (id === "forlder-name") {
      stateDataInput.folderScuderia = "";
    }
    setDataInput(stateDataInput);
    handleOpenChangeDriver(event);
    forceUpdate();
  };
  const resultSearch = async (result) => {
    let stateSwitch = switchData;
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
      if (result) {
        if (switchData.openD1Editor) {
          stateSwitch.openD1Editor = result;
        } else {
          switchData.openD2Editor = result;
        }
        setSwitchData(stateSwitch);
        forceUpdate();
      }
    }
  };
  const PrimaryColorPicker = () => {
    if (!switchData.openD2Editor) {
      if (switchData.openPColor) {
        return (
          <div className="container-color-picker">
            <ChromePicker
              color={dataColor.pColor}
              onChangeComplete={handleChanguePColor}
            />
          </div>
        );
      } else {
        return (
          <button
            className="input-autocomplete"
            id="primary"
            onClick={handleOpenColorPicker}
            value="Color Primario"
          />
        );
      }
    } else {
      return null;
    }
  };
  const SecondaryColorPicker = () => {
    if (!switchData.openD1Editor) {
      if (switchData.openSColor) {
        return (
          <div className="container-color-picker">
            <ChromePicker
              color={dataColor.sColor}
              onChangeComplete={handleChangueSColor}
            />
          </div>
        );
      } else {
        return (
          <button
            className="input-autocomplete"
            id="secondary"
            onClick={handleOpenColorPicker}
            value="Color Secundario"
          />
        );
      }
    } else {
      return null;
    }
  };
  const FnInputAutocomplete = () => {
    return (
      <div
        className={
          !selectScuderia && open
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
          selectScuderia && open
            ? "general-container index--1  animation-up-to-down-open animation-right-left-20-open"
            : "general-container index--1 animation-up-to-down animation-right-left-20"
        }
      >
        <div
          className={
            selectScuderia && open
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
            selectScuderia && open
              ? "animation-left-to-right-open container-r-drivers"
              : "animation-left-to-right container-r-drivers"
          }
        >
          <div className=" grid-two-columns-70-30">
            <div className="container-ed-driver1 linear-grandient-right-pcolor-transparent">
              <div
                className={
                  switchData.openD1Editor
                    ? "animation-left-to-right-open general-container-2"
                    : "animation-left-to-right general-container-2"
                }
              >
                <div className="content-column container-back-content">
                  <small className="text-ed">
                    {typeof switchData.openD1Editor === "object"
                      ? switchData.openD1Editor.nombre
                      : null}
                  </small>
                  <InputAutocomplete
                    ref={chilrefIA}
                    // resultSearch={resultSearch}
                    // onPressEnter={onPressEnter}
                  />
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
                  <button
                    className="input-autocomplete "
                    id="driver1"
                    onClick={fnCancel}
                    value="cancelar"
                  />
                </div>
              </div>

              <div
                className={
                  !switchData.openD1Editor
                    ? "animation-left-to-right-open general-container-2"
                    : "animation-left-to-right general-container-2"
                }
              >
                <small
                  className="text-ed"
                  id="driver1"
                  // onClick={handleOpenChangeDriver}
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
            selectScuderia && open
              ? "animation-right-to-leftt-open container-r-drivers"
              : "animation-right-to-left container-r-drivers"
          }
        >
          <div className=" grid-two-columns-30-70">
            <div className="container-r-drivers ">{SecondaryColorPicker()}</div>
            <div className="container-driver2">
              <div className=" container-ed-driver2 linear-grandient-left-pcolor-transparent">
                <div
                  className={
                    switchData.openD2Editor
                      ? "animation-right-to-leftt-open general-container-2"
                      : "animation-right-to-left general-container-2"
                  }
                >
                  <div className="content-column container-back-content">
                    <small className="text-ed">
                      {typeof switchData.openD2Editor === "object"
                        ? switchData.openD2Editor.nombre
                        : null}
                    </small>
                    <InputAutocomplete
                      ref={chilrefIA}
                      // resultSearch={resultSearch}
                      // onPressEnter={onPressEnter}
                    />
                    <button
                      type="text"
                      className="input-autocomplete "
                      id="driver2"
                      onClick={fnCancel}
                      value="Cancelar"
                    />
                  </div>
                </div>

                <div
                  className={
                    !switchData.openD2Editor
                      ? "animation-right-to-leftt-open "
                      : "animation-right-to-left "
                  }
                >
                  <small
                    className="text-ed"
                    id="driver2"
                    // onClick={handleOpenChangeDriver}
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
            open && selectScuderia && switchData.openNEEditor
              ? "animation-left-to-right-open container-fixed"
              : "animation-left-to-right container-fixed "
          }
        >
          <div className="container-back-content">
            <div className="timer-container">
              <div className="container-back-content">
                <input
                  className="input-autocomplete "
                  id="scuderia-name"
                  value={!dataInput.scuderiaName ? "" : dataInput.scuderiaName}
                  onChange={handleChangueInput}
                  type="text"
                  onKeyPress={(e) => {
                    addProgress(e);
                  }}
                />
                <p class="helper helper1">{wordFinded.nombreEscuderia}</p>
              </div>
              <div className="container-back-content">
                <input
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
                />
                <p class="helper helper1">{wordFinded.carpetaEscuderia}</p>
              </div>
              <div className="container-back-content">
                <button
                  type="submit"
                  className="input-autocomplete "
                  onClick={handleOpenChangeNameScuderia}
                  value="Cancelar"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            open && selectScuderia && !switchData.openNEEditor
              ? "animation-left-to-right-open container-fixed"
              : "animation-left-to-right container-fixed "
          }
        >
          <div className="aling-items-row">
            <button
              type="submit"
              className="input-autocomplete"
              onClick={handleOpenSelectScuderia}
              value="Cancelar"
            />
          </div>
        </div>
        <div>{ContentBackLetters()}</div>
      </>
    );
  };
  const SchemmaEditorForm = () => {
    return (
      <div
        className={
          selectScuderia && open
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
            open
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
              // onClick={handleOpenChangeNameScuderia}
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
          open && !selectScuderia
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
          open ? "general-container index-1" : "general-container index-0"
        }
      >
        <div
          className={
            open
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
