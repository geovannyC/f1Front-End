import React from "react";
import { ACTIONS } from "../points-register/pointsRegisterV2";
export function DataFaults({ data, dispatch, pos }) {
  const SchemmaInfoFault = ({ element }) => {
    return (
      <div className="container-faults" onClick={()=>deleteFault(element)}>
        <div className="container-card-fault">
          <div className="info-fault">{`Pts:${element.puntos}`}</div>
          <div className="info-fault">{`Ad:${element.advertencia}`}</div>
          <p className="info-fault">{`${element.razon}`}</p>
        </div>
      </div>
    );
  };
  const deleteFault = (element)=>{
    dispatch({type: ACTIONS.DELETE_FAULT, payload: {pos: pos, id: element._id}})
  }
  const SchemmaFaults = () => {
    if (data.length > 0) {
      return data.map((element) => {
        return <SchemmaInfoFault element={element} />;
      });
    } else {
      return null;
    }
  };

  return SchemmaFaults();
}
