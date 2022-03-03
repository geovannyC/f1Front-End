import React, { useState, forwardRef, useImperativeHandle } from "react";
export const RegisterTrack = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [information, setInformation] = useState({
      pista: false,
      pais: false,
      alias: false,
    }),
    [image, setImage] = useState(false);
  useImperativeHandle(ref, () => ({
    callFnHandleOpen() {
      handleChangeOpen();
    },
  }));
  const uploadImage = async (file) => {
    try {
      var reader = new FileReader();
      reader.readAsDataURL(file.target.files[0]);
      reader.onload = async () => {
        setImage(reader.result);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    } catch (error) {
      return null;
    }
  };
  const postData = () => {
    const url = "/create-track";
    let data = {
      nombre: information.pista,
      pais: information.pais,
      alias: information.alias,
      image: image
    }
    props.callLoading(data,url,'post')
  };
  const handleChangeInformation = (event) => {
    let newI = information;
    if (event.target.id === "pista") {
      newI.pista = event.target.value;
    }
    if (event.target.id === "pais") {
      newI.pais = event.target.value;
    }
    if (event.target.id === "alias") {
      newI.alias = event.target.value;
    }
    setInformation(newI);
  };
  const handleChangeOpen = () => {
    open ? setOpen(false) : setOpen(true);
  };
  return (
    <div
      className={
        open ? "general-container index-2" : "general-container index-0"
      }
    >
      <div className="grid-two-columns-50 grid-two-columns-30-70">
        <div
          className={
            open
              ? "column1-schemma aling-items-column animation-left-to-right-open"
              : "column1-schemma aling-items-column animation-left-to-right"
          }
        >
          <small className="secondary-color">Pista</small>
          <input
            type="text"
            className="input-autocomplete"
            id="pista"
            onChange={handleChangeInformation}
          />
          <small className="secondary-color">Pais</small>
          <input
            type="text"
            className="input-autocomplete"
            id="pais"
            onChange={handleChangeInformation}
          />
          <small className="secondary-color">Alias</small>
          <input
            type="text"
            className="input-autocomplete"
            id="alias"
            onChange={handleChangeInformation}
          />
          <small className="secondary-color">Imagen</small>
          <label for="file-upload" className="input-autocomplete file">
            Subir Imagen
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={uploadImage}
            className="input-autocomplete"
          />
          {information.pais && information.pais && image ? (
            <button type="Button" className="input-autocomplete" onClick={postData}>
              Crear Pista
            </button>
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
              <img src={image} alt="" className="img-card-driver-fl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
