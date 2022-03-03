import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import "./fastLap.css";
import Slider from "infinite-react-carousel";
import car from "../images/logo.jpg";
import { InputAutocomplete } from "../input-autocomplete/inputAutoplete";
import { useForm } from "react-hook-form";
import { findImage } from "./modules";
import { ACTIONS } from "./pointsRegisterV2";
export const FastLapRegister = forwardRef(
  ({ dispatch, dispatchFastLap, handleChangueOpenFastLap }, ref) => {
    const [driverFinded, setDriverFinded] = useState(false),
      [prevDriver, setPrevDriver] = useState(false),
      [image, setImage] = useState(false);
    const {
      register,
      handleSubmit,
      getValues,
      setValue,
      formState: { errors },
    } = useForm({
      defaultValues: {
        piloto: false,
        minute: 0,
        second1: 1,
        second2: 2,
        milisecond1: 3,
        milisecond2: 4,
        milisecond3: 5,
      },
    });
    const childrenIA = useRef();
    const sendFl = () => {
      const values = getValues();
      const schemma = {
        piloto: values.piloto,
        minuto: values.minute,
        segundo: parseInt(`${values.second1}${values.second2}`),
        decima: parseInt(
          `${values.milisecond1}${values.milisecond2}${values.milisecond3}`
        ),
      };
      // console.log(schemma)
      dispatchFastLap({ type: ACTIONS.ADD_FL, payload: { dataFL: schemma } });
      dispatch({
        type: ACTIONS.ADD_POINT_FL,
        payload: { _idPrev: prevDriver, id: values.piloto },
      });
      handleChangueOpenFastLap();
      // setValue({defaultValues})
    };
    useImperativeHandle(ref, () => ({
      callFnHandleOpen(paramDrivers, data) {
        handleOpenIA(paramDrivers, data);
      },
    }));
    const resultSearch = (driver) => {
      setDriverFinded(driver);
    };
    const onPressEnter = async (e) => {
      if (e) {
        const newImage = await findImage(driverFinded.carpetaCoche);
        const getOldDriver = getValues("piloto");
        if (newImage) {
          setValue("piloto", driverFinded._id);
          setImage(newImage);
          if (getOldDriver) {
            setPrevDriver(getOldDriver);
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    const handleOpenIA = (drivers) => {
      childrenIA.current.callFnHandleOpen(drivers, "nombre", "alias");
    };
    const SchemmaSliderTimer = (currentValue, type, name) => {
      const settings = {
        initialSlide: currentValue,
        duration: 40,
        slidesToShow: 1,
        rows: 1,
        wheel: true,
        arrows: false,
        shift: 20,
      };
      let schemmaTimer = {
        minute: [0, 1, 2, 3],
        seconds1: [0, 1, 2, 3, 4, 5],
        seconds2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        miliseconds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      };
      return (
        <Slider
          className="container-carousel"
          {...settings}
          dots={false}
          // name={type}
          {...register(name, { required: true })}
          afterChange={(e) => setValue(name, e)}
        >
          {schemmaTimer[type].map((element) => (
            <div>
              <li>{element}</li>
            </div>
          ))}
        </Slider>
      );
    };
    const ShemmaBackTimeNumbers = () => {
      return (
        <div className="container-fast-lap">
          <div className="container-front-form-fl">
            <small>{driverFinded ? driverFinded.nombre : null}</small>
          </div>
          <div className="container-cw">
            <div className="container-input-autocomplete">
              <InputAutocomplete
                ref={childrenIA}
                resultSearch={resultSearch}
                onPressEnter={onPressEnter}
              />

              {getValues("piloto") && (
                <button className="input-autocomplete" onClick={sendFl}>
                  Crear Vuelta
                </button>
              )}
            </div>
          </div>
          <div className="container-back-colum-numbers-fl">
            <div className="grid-three-columns-33-100">
              <div className="container-number aling-right">
                <div className="list">
                  {SchemmaSliderTimer(1, "minute", "minute")}
                  <small className="points">:</small>
                </div>
              </div>
              <div className="container-number aling-center">
                <div className="list">
                  {SchemmaSliderTimer(2, "seconds1", "second1")}
                </div>
                <div className="list">
                  {SchemmaSliderTimer(3, "seconds2", "second2")}
                  <small className="points">:</small>
                </div>
              </div>
              <div className="container-number aling-left">
                <div className="list">
                  {SchemmaSliderTimer(4, "miliseconds", "milisecond1")}
                </div>
                <div className="list">
                  {SchemmaSliderTimer(5, "miliseconds", "milisecond2")}
                </div>
                <div className="list">
                  {SchemmaSliderTimer(6, "miliseconds", "milisecond3")}
                </div>
              </div>
            </div>
          </div>
          <div className="container-back-wall-fl">
            <img src={image} className="image-wall-back-fl" />
          </div>
        </div>
      );
    };
    return ShemmaBackTimeNumbers();
  }
);
