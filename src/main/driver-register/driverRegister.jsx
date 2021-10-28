import React, { useState, forwardRef, useImperativeHandle } from "react";
import useForceUpdate from "use-force-update";
import alonso from "../images/alonso.jpg";
import caralonso from "../images/caralonso.jpg";
import { handleChangeValueInput } from "../find-text/findText";
import { getData } from "../../until/fetch";
export const DriverRegister = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [data, setData] = useState(false),
    [images, setImages] = useState({
      cardImage: false,
      cardProfile: false,
    }),
    [dataInput, setDataInput] = useState({
      name: false,
      alias: false,
      folderDriver: false,
      f1CarFolder: false,
    });
  useImperativeHandle(ref, () => ({
    callFnHandleRDOpen(folders) {
      handleChangeOpen(folders);
    },
  }));
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
  const handleChangeOpen = (folders) => {
    if (!open) {
      setOpen(true);
      setData(folders);
    } else {
      setOpen(false);
    }
  };
  const postData = () => {
    const formatData = {
      nombre: dataInput.name,
      alias: dataInput.alias,
      carpetaPiloto: dataInput.folderDriver,
      carpetaCoche: dataInput.f1CarFolder,
      victorias: 0,
      vueltasRapidas: 0
    };
    const url = "/create-driver";
    props.callLoading(formatData, url, "post");
  };
  const forceUpdate = useForceUpdate();
  const handleChangeInput = (event) => {
    let txt = event.target.value;
    let prevData = dataInput;
    let newImages = images;
    if (event.target.id === "name") {
      prevData.name = txt;
    } else if (event.target.id === "alias") {
      prevData.alias = txt;
    } else if (event.target.id === "fd") {
      handleChangeValueInput(txt, data).then(async(driverFinded) => {
        if (driverFinded) {
          if (driverFinded.length === 2 || driverFinded.length === 1) {
            console.log(driverFinded[0])
            if (!images.cardProfile || driverFinded[0] !== dataInput.folderDriver) {
              await findImage(driverFinded[0]).then((result) => {
                if (result) {
                  newImages.cardProfile= result;
                }
              });
            }
            prevData.folderDriver = driverFinded[0];
          }
        }
      });
    } else if (event.target.id === "cf") {
      handleChangeValueInput(txt, data).then(async(carFinded) => {
        if (carFinded) {
          if (carFinded.length === 1 || carFinded.length === 2) {
            if (!images.cardImage || carFinded[0] !== dataInput.f1CarFolder) {
              await findImage(carFinded[0]).then((result) => {
                if (result) {
                  newImages.cardImage= result;
                }
              });
            }
            prevData.f1CarFolder = carFinded[0];
          }
        }
      });
    }
    setDataInput(prevData);
    setImages(newImages)
    forceUpdate();
  };
  const checkInputs = ()=>{
    if(dataInput.name && dataInput.folderDriver && dataInput.f1CarFolder && (dataInput.name!==dataInput.alias) &&( dataInput.f1CarFolder!==dataInput.folderDriver)){
      return true
    }else{
      return false
    }
  }
  return (
    <div
      className={
        open ? "general-container index-2" : "general-container index-0"
      }
    >
      <div className="grid-two-columns-50">
        <div
          className={
            open
              ? "column1-schemma aling-items-column animation-left-to-right-open"
              : "column1-schemma aling-items-column animation-left-to-right"
          }
        >
          <small className="secondary-color">Nombre</small>
          <input
            type="text"
            className="input-autocomplete"
            id="name"
            onChange={handleChangeInput}
          />
          <small className="secondary-color">Alias</small>
          <input
            type="text"
            className="input-autocomplete"
            id="alias"
            onChange={handleChangeInput}
          />
          <small className="secondary-color">Carpeta del Piloto</small>
          <input
            type="text"
            className="input-autocomplete"
            id="fd"
            onChange={handleChangeInput}
          />
          <small className="secondary-color">Carpeta del Coche</small>
          <input
            type="text"
            className="input-autocomplete"
            id="cf"
            onChange={handleChangeInput}
          />
          {checkInputs()? (
            <a type="Button" className="input-autocomplete" onClick={postData}>
              Crear Piloto
            </a>
          ) : null}
        </div>
        <div
          className={
            open
              ? "column2-schemma aling-items-column animation-right-to-leftt-open"
              : "column2-schemma aling-items-column animation-right-to-left"
          }
        >
          <div className="card-track-previwew-image">
            <div className="general-card ordinary-shadow">
              <div className="text-hover-card-driver gray-dark-transparent-color index-0"></div>
              <img
                src={images.cardImage}
                className="img-card-driver-fl img-driver-fl index--1"
              />
              <div className="grid-two-colums-70-30">
                <div className="container-r-drivers initial-text">
                  <small className="secondary-color">{dataInput.name}</small>
                  <small className="secondary-color">{dataInput.alias}</small>
                  <small className="secondary-color">
                    {dataInput.folderDriver}
                  </small>
                  <small className="secondary-color">
                    {dataInput.f1CarFolder}
                  </small>
                </div>
                <div className="container-r-drivers index-2">
                  <div className="card-image-driver">
                    <div className="general-card">
                      <img src={images.cardProfile} className="img-card-driver-fl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
