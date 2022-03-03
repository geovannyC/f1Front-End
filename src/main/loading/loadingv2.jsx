import React, {useEffect, useState, useRef} from 'react';
import useForceUpdate from "use-force-update";
import "./loading.css"
import formula1 from "../images/formula.svg";
function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
export const  Loadingv2=()=> {
    const [count, setCount] = useState(0);
    useInterval(
        () => {
            upsetCount()
        },
        1000
      );
      const forceUpdate = useForceUpdate()
      const upsetCount = () => {
        let newNum = count + 1;
        setCount(newNum);
        forceUpdate();
      };
    const SchemmaLoading = () => {
        return (
          <div className="container-loading">
            <img
              src={formula1}
              alt=""
              className={
                count % 2
                  ? "filter-loading"
                  : "filter-loading filter-off"
              }
            />
          </div>
        );
      };
      return SchemmaLoading()
}

