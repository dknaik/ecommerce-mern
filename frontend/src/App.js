import "./App.css";
import { react, useEffect, useState } from "react";
 function App() {
  const [redCl, setRedCl] = useState(false);
  const [yellowCl, setYellowCl] = useState(false);
  const [greenCl, setGreenCl] = useState(false);

  useEffect(() => {
    const IntervalID =setInterval(() => {
      setRedCl(true);
       setGreenCl(false)
    }, 3000);
    return ()=>{
      clearInterval(IntervalID)
    }
  }, [redCl]);

  useEffect(() => {
    const IntervalID =setInterval(() => {
      setRedCl(false)
      setYellowCl(true); 
     setGreenCl(false)
    
    }, 6000);
      return () => {
        clearInterval(IntervalID);
      };
  }, [yellowCl]);
  useEffect(() => {
   const IntervalID= setInterval(() => {
    setGreenCl(true);
     setRedCl(false);
    setYellowCl(false);
    
      

    }, 9000);
      return () => {
        clearInterval(IntervalID);
      };
  }, [greenCl]);
    useEffect(() => {
      const IntervalID = setInterval(() => {
        setGreenCl(false);
        setYellowCl(false);
        setRedCl(false)
      }, 10000);
      return () => {
        clearInterval(IntervalID);
      };
    }, []);
  
console.log(redCl,yellowCl,greenCl)
  return (
    <div className="App">
      <strong>Hii... Traffic Light is not working can u repair ?</strong>
      <div className="outer-box">
        <div className="blackbox">
          <div className="row">
            <div
              className="circle"
              style={{ backgroundColor: redCl && "red" }}
            ></div>
          </div>
          <div className="row">
            <div
              className="circle"
              style={{ backgroundColor: yellowCl && "Yellow" }}
            ></div>
          </div>
          <div className="row">
            <div
              className="circle"
              style={{ backgroundColor: greenCl && "green" }}
            ></div>
          </div>
        </div>
      </div>
      
      {redCl ? (
        <span style={{ fontSize: "20px" }}>stop</span>
      ) : greenCl ? (
        <span style={{ fontSize: "20px" }}>ready</span>
      ) : (
        <span style={{ fontSize: "20px" }}>Go</span>
      )}
      <div style={{ textAlign: "start" }}>
        <ul>
          <li>You can use inline styling</li>
          <li>You can use conditional rendering</li>
        </ul>
      </div>
    </div>
  );
}
export default App