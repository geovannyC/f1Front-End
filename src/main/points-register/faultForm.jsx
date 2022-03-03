import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useForceUpdate from "use-force-update";
import { ACTIONS } from "./pointsRegisterV2";
export function FaultForm({dispatch, pos, faults}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      detail: "",
      points: 0,
      warning: 0,
    },
  });
  const forceUpdate = useForceUpdate();
  const onSubmit = async (data) => {
      let newSchemma = {
        id: Date.now(),
        advertencia: data.warning,
        puntos: parseInt(data.points?data.points:0),
        razon: data.detail
      }
    dispatch({ type: ACTIONS.ADD_FAULT, payload: { dataFault: newSchemma, pos: pos } });
    setOpen(false)
  };
  const addWarning = () => {
    let currentValue = getValues("warning");
    let newValue = currentValue >= 5 ? 5 : currentValue + 1;
    setValue("warning", newValue);
    forceUpdate();
  };
  const deleteWarning = () => {
    let currentValue = getValues("warning");
    let newValue = currentValue === 0 ? 0 : currentValue - 1;
    setValue("warning", newValue);
    forceUpdate();
  };
  const handleOpenForm = () => {
    setOpen(open ? false : true);
  };
  const SwitchHandleOpenForm = () => {
    let txt = !open ? "Añadir Sanción" : "Cancelar";
    if(faults.length<5){

      return <small onClick={() => handleOpenForm()}>{txt}</small>;
    }else{
      return null
    }
  };
  const SchemmaForm = () => {
    if (open) {
      return (
          
        <div className="container-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="number"
              {...register("points", { validate: Number, max:10, min:0 })}
            />
            <br />
            {errors.points && <small id="warning">0-10pts</small>}
            <br />
            <textarea
              type="text"
              {...register("detail", { required: true, maxLength: 70, minLength: 5 })}
            />
            <br />
            {errors.detail && <small id="warning">sin detalle</small>}
            <br />
            {/* <inputa
                {...register("detail", {
                    required: "Ingresa el detalle de la sanción.",
                })} // custom message
            /> */}
            <small id="warning">Advertencias</small>
            <div className="container-warnings">
              <div className="item" onClick={deleteWarning}>
                -
              </div>
              <div className="item-indicator">{getValues("warning")}</div>
              <div className="item" onClick={addWarning}>
                +
              </div>
            </div>
            <button className="input-autocomplete" type="submit">
              Submit
            </button>
          </form>
        </div>
      );
    } else {
      return null;
    }
  };
  return (
    <>
      <div className="container-info-driver-tile">
        {SwitchHandleOpenForm()}
        {SchemmaForm()}
      </div>
    </>
  );
}
