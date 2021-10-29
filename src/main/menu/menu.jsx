import React, { useState, useEffect } from "react";
export default function Menu(props) {
  const [open, setOpen] = useState(false),
    [loading, setLoading] = useState(true),
    [currentOption, setCurrentOption] = useState(false);
  useEffect(() => {
    setLoading(false);
  }, !loading);

  const handleChangeMenuOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      if (currentOption || currentOption === 0) {
        props.optionMenu(currentOption, false);
        setCurrentOption(false);
      }
      setOpen(true);
    }
  };
  const Button = () => {
    return (
      <div
        className={open ? "menu-toggle close-button" : "menu-toggle"}
        onClick={handleChangeMenuOpen}
      >
        <div className={open ? "line-open line-cross1" : "line line--1"}></div>
        <div class={open ? "line-open line-cross2" : "line line--2"}></div>
        <div class={open ? "line-open line-cross3" : "line line--3"}></div>
      </div>
    );
  };
  const optionMenu = (event) => {
    props.optionMenu(event.target.value);
    setCurrentOption(event.target.value);
    handleChangeMenuOpen();
  };
  const SchemmaMenu = () => {
    return (
      <div className={open ? "menu-wrapper menu-open" : "menu-wrapper"}>
        <div
          className={
            open ? "links-wrapper" : "links-wrapper links-wrapper-closed"
          }
        >
          <ul className="link-list">
            {props.step > 5 ? (
              <li onClick={optionMenu} value={0} class="link">
                Ver Podium
              </li>
            ) : null}
            {props.step > 5 ? (
              <li onClick={optionMenu} value={1} class="link">
                Tabla de Puntuaciones
              </li>
            ) : null}
            {props.step > 4 &&props.step!==10? (
              <li onClick={optionMenu} value={2} class="link">
                Registrar Puntuaciones
              </li>
            ) : null}
            {props.step > 5 ? (
              <li onClick={optionMenu} value={7} class="link">
                Registrar Sanción
              </li>
            ) : null}
            <li onClick={optionMenu} value={3}>
              Registrar Pista
            </li>
            {props.step > 1 ? (
              <li onClick={optionMenu} value={4} href="" class="link">
                Registrar Piloto
              </li>
            ) : null}
            {props.step > 2 ? (
              <li onClick={optionMenu} value={5} href="" class="link">
                Registrar Scuderia
              </li>
            ) : null}
            {props.step > 3 ? (
              <li onClick={optionMenu} value={6} href="" class="link">
                Campeonatos
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    );
  };
  if (loading) {
    return <h1>Cargando</h1>;
  } else {
    return (
      <div className={open ? "open-menu container-menu" : "container-menu"}>
        {Button()}
        {SchemmaMenu()}
      </div>
    );
  }
}
