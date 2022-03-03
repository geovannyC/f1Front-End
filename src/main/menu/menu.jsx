import React, { useState, useEffect } from "react";
export default function Menu({listmenu,optionMenu,step}) {
  const [open, setOpen] = useState(true),
    [loading, setLoading] = useState(true),
    [currentOption, setCurrentOption] = useState(false);
  useEffect(() => {
    setLoading(false);
  }, [loading]);

  const handleChangeMenuOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      if (currentOption || currentOption === 0) {
        optionMenu(currentOption, false);
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
  const fnOptionMenu = (event) => {
    optionMenu(event.target.value,true);
    setCurrentOption(event.target.value);
    handleChangeMenuOpen();
  };
  const SchemmaListMenu = ()=>{
    console.log()
    if(listmenu){
      return listmenu.map(element=>{
        return (
          <li onClick={fnOptionMenu} value={element.value} class="link">
          {element.title}
        </li>
        )
      })
    }else{
      return (
        <li class="link">
                Cargando
              </li>
      )
    }
  }
  const SchemmaMenu = () => {
    return (
      <div className={open ? "menu-wrapper menu-open" : "menu-wrapper"}>
        <div
          className={
            open ? "links-wrapper" : "links-wrapper links-wrapper-closed"
          }
        >
          <ul className="link-list">
            {SchemmaListMenu()}
            {/* {step > 5 ? (
              <li onClick={fnOptionMenu} value={0} class="link">
                Ver Podium
              </li>
            ) : null}
            {step > 5 ? (
              <li onClick={fnOptionMenu} value={1} class="link">
                Tabla de Puntuaciones
              </li>
            ) : null}
            {step > 4 &&step!==10? (
              <li onClick={fnOptionMenu} value={2} class="link">
                Registrar Puntuaciones
              </li>
            ) : null}
            {step > 5 ? (
              <li onClick={fnOptionMenu} value={7} class="link">
                Registrar Sanción
              </li>
            ) : null}
            <li onClick={fnOptionMenu} value={3}>
              Registrar Pista
            </li>
            {step > 1 ? (
              <li onClick={fnOptionMenu} value={4}  class="link">
                Registrar Piloto
              </li>
            ) : null}
            {step > 2 ? (
              <li onClick={fnOptionMenu} value={5}  class="link">
                Registrar Scuderia
              </li>
            ) : null}
            {step > 3 ? (
              <li onClick={fnOptionMenu} value={8}  class="link">
                Editar Scuderia
              </li>
            ) : null}
            {step > 3 ? (
              <li onClick={fnOptionMenu} value={6}  class="link">
                Campeonatos
              </li>
            ) : null}
            {step > 1 ? (
              <li onClick={fnOptionMenu} value={-1}  class="link">
                Registrar Palabras Ondas
              </li>
            ) : null} */}
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
