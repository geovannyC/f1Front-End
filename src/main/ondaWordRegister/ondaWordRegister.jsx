import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { getData } from "../../until/fetch";
export const OndaWordRegister = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [alreadyRegister, setAlreadyRegister] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  useImperativeHandle(ref, () => ({
    callFnHandleOpen() {
      handleChangeOpen();
    },
  }));
  const handleChangeOpen = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const onSubmit = (data) => {
    const url = `/get-word/${data.word}`;
    const urlpost = '/onda-word-register';
    getData(url).then((response) => {
      if (response) {
        setAlreadyRegister(true);
      } else {
          let dataToFetch = {
              word: data.word,
              onda: data.onda
          }
        props.callLoading(dataToFetch, urlpost, 'post')
      }
    });
  };
  const ContentBackLetters = () => {
    if (open) {
      return (
        <div className="container-absolute">
          <div
            className={
              open
                ? "container-back-content animation-right-to-leftt-open"
                : "animation-right-to-left container-back-content"
            }
          >
            <div className="container-back-letters big-letters">
              <small>{`${watch("word")}${watch("onda")}`}</small>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const SchemmaOndaWord = () => {
    return (
      <div
        className={
          open ? "general-container index-2" : "general-container index-0"
        }
      >
        {ContentBackLetters()}
        <div className="grid-three-columns-33-100">
          <div
            className={
              open
                ? "column1-schemma aling-items-column animation-left-to-right-open"
                : "column1-schemma aling-items-column animation-left-to-right"
            }
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="input-autocomplete"
                placeholder="edi"
                {...register("word", { required: true, maxLength: 20 })}
              />
            </form>
            {errors.word && <small className="color-white">Éste es requerido</small>}
          </div>
          <div
            className={
              open
                ? "column2-schemma aling-items-column animation-right-to-leftt-open"
                : "column2-schemma aling-items-column animation-right-to-left"
            }
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="input-autocomplete"
                placeholder="onda"
                {...register("onda", { required: true, maxLength: 20 })}
              />
            </form>
            {errors.onda && <small className="color-white">Éste es requerido</small>}
          </div>
          <div
            className={
              open
                ? "column2-schemma aling-items-column animation-right-to-leftt-open"
                : "column2-schemma aling-items-column animation-right-to-left"
            }
          >
            <input
              type="submit"
              onClick={handleSubmit(onSubmit)}
              value="Registrar Palabra"
            />
            <small className="color-white">{alreadyRegister ? "Palabra ya registrada" : null}</small>
          </div>
        </div>
      </div>
    );
  };
  return SchemmaOndaWord();
});
