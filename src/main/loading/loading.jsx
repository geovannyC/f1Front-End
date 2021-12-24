import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
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
export const Loading = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false),
    [count, setCount] = useState(1),
    [lights, setLights] = useState({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    }),
    [backWall, setBackWall] = useState("white")
  useInterval(
    () => {
      let number = count;
      countDown();
      setCount(number + 1);
    },
    typeof count === "number" ? 1000 : null
  );
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useImperativeHandle(ref, () => ({
    callFnHandleOpen() {
      handleOpen();
    },
    callFnHandleClose() {
      handleClose();
    },
  }));
  const countDown = () => {
    if (count<6) {
      let arr = lights;
      arr[count] = "light-on red";
      setLights(arr)
    }else if(count>=6){
      if(!open){
        setLights({
          1: "light-on green",
          2: "light-on green",
          3: "light-on green",
          4: "light-on green",
          5: "light-on green",
      })
      setBackWall("close-card-driver")
      setTimeout(() => {
         setBackWall(" scale-maximun ")
         setCount(false)
      }, 1500);
      setTimeout(() => {
        setBackWall("container-btn-cp-closed")
      }, 2000);
      }else{
      }
    }
  };
  const LoadingPage = () => {
    return (
      <>
        <div className={`general-container  loading ${backWall} index-3`}>
          <span className={`secondary-color ${lights[1]} circle`}></span>
          <span className={`secondary-color ${lights[2]} circle`}></span>
          <span className={`secondary-color ${lights[3]} circle`}></span>
          <span className={`secondary-color ${lights[4]} circle`}></span>
          <span className={`secondary-color ${lights[5]} circle`}></span>
        </div>
      </>
    );
  };
  return LoadingPage();
});
