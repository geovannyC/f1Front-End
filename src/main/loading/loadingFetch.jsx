import React, {
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
export const LoadingF = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [loading, setLoading] = useState(false),
    [text, setText] = useState("cagando");
  const handleOpen = (txt) => {
    if(txt === 'Puntos Registrados'){
      handleClose()
      setTimeout(() => {
        window.location.reload()
      }, 200);
    }
    setText(txt)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setLoading(false)
  };
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(txt) {
      handleOpen(txt);
    },
    callFnHandleClose() {
      handleClose();
    },
    callFnHandleFinished(txt) {
      handleFinishedLoading(txt);
    },
  }));
  const handleOpenLoading = () => {
    setLoading(true);
    props.callFetch();
  };
  const handleFinishedLoading = (txt) => {
    setText(txt);
    setTimeout(() => {
      setOpen(false);
      setLoading(false);
      window.location.reload()
    }, 2000);
  };
  const LoadingPage = () => {
    return (
      <div
        className={
          open
            ? `general-container loading solid-white`
            : "general-container index--1 close-card-driver solid-white"
        }
      >
        <small
          className={loading ? "loading-text " : "loading-text line-cross2"}
        >
          {text}
        </small>
        <button
          onClick={handleOpenLoading}
          className={
            loading ? "input-autocomplete line-cross2" : "input-autocomplete"
          }
        >
          Aceptar
        </button>
        <button
          onClick={handleClose}
          className={
            loading ? "input-autocomplete line-cross2" : "input-autocomplete"
          }
        >
          Cancelar
        </button>
      </div>
    );
  };
  return LoadingPage();
});
