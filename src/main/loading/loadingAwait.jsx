import React, { forwardRef, useImperativeHandle, useState } from "react";

export const LoadingAwait = forwardRef((props, ref) => {
  const [data, setData] = useState({
    open: false,
    type: false,
  });
  useImperativeHandle(ref, () => ({
    callFnHandleOpen(type) {
      handleOpen(type);
    },
    callFnHandleClose() {
      handleClose();
    },
  }));
  const handleOpen = (type) => {
    setData({
      open: true,
      type: type,
    });
  };
  const handleClose = () => {
    setData({
      open: false,
      type: false,
    });
  };
  const schemmaLoading = () => {
    if (data.open) {
      if (data.type === "loading") {
        return <div className="general-container-2 test">Cargando...</div>;
      } else if (data.type === "error") {
        return <div className="general-container-2 test">ERROR</div>;
      } else {
        return <div className="container-btn-cp-closed"></div>;
      }
    } else {
      return <div className="container-btn-cp-closed"></div>;
    }
  };
  return schemmaLoading();
});
