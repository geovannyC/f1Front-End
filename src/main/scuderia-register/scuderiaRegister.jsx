import React, { useState, forwardRef, useImperativeHandle } from "react";
import useForceUpdate from "use-force-update";
import { handleChangeValueInput } from "../find-text/findText";
import { ChromePicker } from "react-color";
import { getData } from "../../until/fetch";
export const ScuderiaRegister = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [data, setData] = useState(false),
    [color, setColor] = useState({
      openPP: false,
      openSP: false,
      primaryColor: "#fff",
      secondaryColor: "#0000",
    }),
    [dataAlias, setDataAlias] = useState(false),
    [drivers, setDrivers] = useState(false),
    [folders, setFolders] = useState(false),
    [images, setImages] = useState({
      driver1: false,
      driver2: false,
      scuderia: false,
    }),
    [dataInput, setDataInput] = useState({
      name: false,
      fScuderia: false,
      driver1: false,
      driver2: false,
    });
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(arr, fol) {
      handleOpen(arr, fol);
    },
  }));
  const postData = () => {
    const url = "/create-scuderia";
    const formatData = {
      piloto1: dataInput.driver1._id,
      piloto2: dataInput.driver2._id,
      nombreEscuderia: dataInput.name,
      carpetaEscuderia: dataInput.fScuderia,
      logo: images.scuderia,
    };
    props.callLoading(formatData, url, "post");
  };
  const forceUpdate = useForceUpdate();
  const arrFilter = (arr) => {
    return new Promise((resolve) => {
      let find = arr.map((element) => {
        if (element.nombre === undefined) {
          return false;
        } else {
          return element.nombre;
        }
      });
      resolve(find);
    });
  };
  const arrFilterAlias = (arr) => {
    return new Promise((resolve) => {
      let find = arr.map((element) => {
        if (element.alias === undefined) {
          return false;
        } else {
          return element.alias;
        }
      });
      resolve(find);
    });
  };
  const inyectData = async (x) => {
    if (!data) {
      let arr = await arrFilter(x);
      let arr2 = await arrFilterAlias(x);
      setData(arr);
      setDataAlias(arr2);
    }
  };
  const handleOpen = (arr, fol) => {
    if (!open) {
      setOpen(true);
      setDrivers(arr);
      inyectData(arr);
      setFolders(fol);
    } else {
      setOpen(false);
      setDataInput({
        name: false,
        fScuderia: false,
        driver1: false,
        driver2: false,
      });
    }
  };
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
  const findByNameDriver = async (driver) => {
    return new Promise((resolve) => {
      const result = drivers.find((element) => element.nombre === driver[0]);
      resolve(result);
    });
  };
  const findByAliasDriver = async (driver) => {
    return new Promise((resolve) => {
      const result = drivers.find((element) => element.alias === driver[0]);
      resolve(result);
    });
  };
  const handleReduceSearch = async (txt) => {
    return new Promise(async (resolve) => {
      let result;
      await handleChangeValueInput(txt, data).then(async (driverFinded) => {
        if (driverFinded && driverFinded.length > 0) {
          if (driverFinded.length === 1 && driverFinded !== "false") {
            await findByNameDriver(driverFinded).then(async (result2) => {
              result = result2;
            });
          } else {
            result = false;
          }
        } else {
          await handleChangeValueInput(txt, dataAlias).then(
            async (driverFinded2) => {
              if (driverFinded2 && driverFinded2.length > 0) {
                if (driverFinded2.length === 1 && driverFinded2 !== "false") {
                  await findByAliasDriver(driverFinded2).then(
                    async (result2) => {
                      result = result2;
                    }
                  );
                } else {
                  result = false;
                }
              } else {
                result = false;
              }
            }
          );
        }
      });
      resolve(result);
    });
  };
  const handleChangeInput = async (event) => {
    let txt = event.target.value;
    let prevData = dataInput;
    let newImages = images;
    if (event.target.id === "name") {
      prevData.name = txt;
    } else if (event.target.id === "driver1") {
      await handleReduceSearch(txt).then(async (result) => {
        if (result) {
          if (!images.driver1 || result !== prevData.driver1) {
            await findImage(result.carpetaPiloto).then((result) => {
              if (result) {
                newImages.driver1 = result;
              }
            });
          }
          prevData.driver1 = result;
        } else {
          prevData.driver1 = false;
          newImages.driver1 = false;
        }
      });
    } else if (event.target.id === "driver2") {
      await handleReduceSearch(txt).then(async (result) => {
        if (result) {
          if (!images.driver2 || result !== prevData.driver2) {
            await findImage(result.carpetaPiloto).then((result) => {
              if (result) {
                newImages.driver2 = result;
              }
            });
          }
          prevData.driver2 = result;
        } else {
          prevData.driver2 = false;
          newImages.driver2 = false;
        }
      });
    } else if (event.target.id === "fScuderia") {
      handleChangeValueInput(txt, folders).then(async (folderFinded) => {
        if (folderFinded) {
          if (folderFinded.length === 1) {
            if (!images.scuderia || folderFinded[0] !== dataInput.fScuderia) {
              await findLogo(folderFinded[0]).then((result) => {
                if (result) {
                  newImages.scuderia = result;
                }
              });
            }
            prevData.fScuderia = folderFinded[0];
          } else {
            prevData.fScuderia = false;
            newImages.scuderia = false;
          }
        } else {
          prevData.fScuderia = false;
        }
      });
    }
    setDataInput(prevData);
    setImages(newImages);
    forceUpdate();
  };
  const handleChanguePColor = (paramcolor) => {
    let stateColor = color;
    stateColor.primaryColor = paramcolor.hex;
    setPColorStyle(paramcolor.hex);
    setColor(stateColor);
    forceUpdate();
  };
  const handleChangueSColor = (paramcolor) => {
    let stateColor = color;
    stateColor.secondaryColor = paramcolor.hex;
    console.log(paramcolor);
    setSColorStyle(paramcolor.hex);
    setColor(stateColor);
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
  const PrimaryColorPicker = () => {
    if (color.openPP && !color.openSP) {
      return (
        <div className="container-color-picker">
          <ChromePicker
            color={color.primaryColor}
            onChangeComplete={handleChanguePColor}
          />
        </div>
      );
    } else {
      return null;
    }
  };
  const SecondaryColorPicker = () => {
    if (color.openSP && !color.openPP) {
      return (
        <div className="container-color-picker">
          <ChromePicker
            color={color.secondaryColor}
            onChangeComplete={handleChangueSColor}
          />
        </div>
      );
    } else {
      return null;
    }
  };
  const handleOpenColorPicker = (event) => {
    let stateColor = color;
    let id = event.target.id;
    console.log(id);
    if (id === "primary") {
      if (color.openPP) {
        stateColor.openPP = false;
      } else {
        stateColor.openPP = true;
      }
    } else {
      if (color.openSP) {
        stateColor.openSP = false;
      } else {
        stateColor.openSP = true;
      }
    }
    setColor(stateColor);
    forceUpdate();
  };
  const ContainerSR = () => {
    return (
      <div
        className={
          open ? "general-container index-1" : "general-container index-0"
        }
      >
        <div className="grid-three-columns-1fr-15-1fr">
          <div
            className={
              open
                ? "column1-schemma animation-up-to-down-open"
                : "column1-schemma animation-up-to-down"
            }
          >
            <div className="aling-items-column text-card-scuderia">
              <small className="secondary-color">Piloto 1</small>
              <input
                type="text"
                className="input-autocomplete"
                id="driver1"
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div
            className={
              open
                ? "column1-schemma  animation-down-to-up-open"
                : "column1-schemma  animation-down-to-up"
            }
          >
            <div className="aling-items-column text-card-scuderia">
              <small className="secondary-color">Nombre Escuderia</small>
              <input
                type="text"
                className="input-autocomplete"
                id="name"
                onChange={handleChangeInput}
              />
              <small className="secondary-color">Carpeta Escuderia</small>
              <small className="secondary-color">{dataInput.fScuderia}</small>
              <input
                type="text"
                className="input-autocomplete"
                id="fScuderia"
                onChange={handleChangeInput}
              />
              {color.openSP || color.openPP ? null : (
                <>
                  <button
                    className="input-autocomplete"
                    onClick={handleOpenColorPicker}
                    id="primary"
                  >
                    Seleccionar color primario
                  </button>
                  <button
                    className="input-autocomplete"
                    onClick={handleOpenColorPicker}
                    id="secondary"
                  >
                    Seleccionar color secondario
                  </button>
                </>
              )}

              {PrimaryColorPicker()}
              {SecondaryColorPicker()}
              {color.openPP || color.openSP ? (
                <button
                  className="input-autocomplete"
                  onClick={handleOpenColorPicker}
                  id={color.openSP ? "secondary" : "primary"}
                >
                  aceptar
                </button>
              ) : null}
              {dataInput.name &&
              dataInput.fScuderia &&
              dataInput.driver1 &&
              dataInput.driver2 ? (
                <button className="input-autocomplete" onClick={postData}>
                  Crear Scuderia
                </button>
              ) : null}
            </div>
          </div>
          <div
            className={
              open
                ? "column1-schemma  index-1 animation-down-to-up-open"
                : "column1-schemma  index-1 animation-down-to-up"
            }
          >
            <div className="aling-items-column text-card-scuderia">
              <small className="secondary-color">Piloto 2</small>
              <input
                type="text"
                className="input-autocomplete"
                id="driver2"
                onChange={handleChangeInput}
              />
            </div>
            <div
              className={
                images.driver2
                  ? "container-r-drivers animation-down-to-up-open"
                  : "container-r-drivers animation-down-to-up"
              }
            ></div>
          </div>
        </div>
      </div>
    );
  };
  const ContainerImagesSR = () => {
    return (
      <div
        className={
          open ? "general-container index-1" : "general-container index-0"
        }
      >
        <div className="grid-three-columns-1fr-15-1fr">
          <div
            className={
              open
                ? "column1-schemma animation-up-to-down-open"
                : "column1-schemma animation-up-to-down"
            }
          >
            <div
              className={
                images.driver1
                  ? "container-r-drivers animation-up-to-down-open"
                  : "container-r-drivers animation-up-to-down"
              }
            >
              <img
                className={
                  images.driver1
                    ? "img-container-driver-scuderia scaleImage"
                    : "img-container-driver-scuderia"
                }
                src={images.driver1}
                alt=""
              />
              <small className="text-podium text-image-driver-scuderia">
                {dataInput.driver1.nombre}
              </small>
            </div>
          </div>
          <div
            className={
              open
                ? "column1-schemma  animation-down-to-up-open"
                : "column1-schemma  animation-down-to-up"
            }
          >
            <div
              className={
                images.scuderia
                  ? "container-r-drivers animation-down-to-up-open"
                  : "container-r-drivers animation-down-to-up"
              }
            >
              <img
                className="img-container-driver-scuderia"
                src={images.scuderia}
                alt=""
              />
            </div>
          </div>
          <div
            className={
              open
                ? "column1-schemma  index-1 animation-down-to-up-open"
                : "column1-schemma  index-1 animation-down-to-up"
            }
          >
            <div
              className={
                images.driver2
                  ? "container-r-drivers animation-down-to-up-open"
                  : "container-r-drivers animation-down-to-up"
              }
            >
              <img
                className={
                  images.driver2
                    ? "img-container-driver-scuderia scaleImage"
                    : "img-container-driver-scuderia"
                }
                src={images.driver2}
                alt=""
              />
              <small className="text-podium text-image-driver-scuderia">
                {dataInput.driver2.nombre}
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {ContainerImagesSR()}
      {ContainerSR()}
    </>
  );
});
