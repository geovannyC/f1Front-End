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
      console.log(number);
    },
    count < 9 ? 1500 : null
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
    }else if(count===6){
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
        }, 1500);
    }
    else if(count===8){
        setBackWall("container-btn-cp-closed")
    }
  };
  const LoadingPage = () => {
    return (
      <>
        <div className={`general-container  loading ${backWall} index-2`}>
          <h1 className={`secondary-color ${lights[1]} circle`}></h1>
          <h1 className={`secondary-color ${lights[2]} circle`}></h1>
          <h1 className={`secondary-color ${lights[3]} circle`}></h1>
          <h1 className={`secondary-color ${lights[4]} circle`}></h1>
          <h1 className={`secondary-color ${lights[5]} circle`}></h1>
        </div>
      </>
    );
  };
  return LoadingPage();
});
