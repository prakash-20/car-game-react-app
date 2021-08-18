import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import Car_img from "./Images/car.png";
import Wheel_img from "./Images/wheel.png";
import Petrol_img from "./Images/petrol.png";
import { BsFillPlayFill } from "react-icons/bs";
import { CleanConsole } from "@eaboy/clean-console";

const Messages = ({ list }) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [list]);
  return (
    <>
      {list.map((item) => (
        <div key={uuidv4}>{item}</div>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};
CleanConsole.init();
function App() {
  const [list, setList] = useState([]);
  const [btn, setBtn] = useState("Start Game");
  const [moves, setMoves] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [Game, setGame] = useState("WON");
  const [info, setInfo] = useState("STATUS");
  const time = 3000;
  let result = [];
  console.log(list);

  const Startgame = async () => {
    Endanimation("petrolpump");
    setList([]);
    Startanimation();

    document.getElementById("startbutton").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("info").style.display = "";
    document.getElementById("console").style.display = "";

    const consumptionPerKm = 1 / 2;
    const minStep = 1;
    const maxStep = 6;
    const initialPetrol = 50;
    const pumpsCount = 6;
    const refillAmount = 30;
    const startLocation = 0;
    const endLocation = 100;
    const petrolPumpLocations = getRandomIntegers(
      pumpsCount,
      startLocation,
      endLocation
    ).sort();

    let position = startLocation;
    let petrol = initialPetrol;

    setFuel(petrol);
    setMoves(position);
    setInfo("Game Starting...");
    await new Promise((resolve) => setTimeout(resolve, time));
    Startanimation();
    logStr(
      `You will find petrol pumps at these positions:\n${petrolPumpLocations}\nGood luck!\n`
    );
    await new Promise((resolve) => setTimeout(resolve, time));
    if (isAtPump()) {
      petrol += refillAmount;
    }
    logState();
    await new Promise((resolve) => setTimeout(resolve, time));

    while (position < endLocation && petrol > 0) {
      const autonomy = petrol / consumptionPerKm;
      const remainingDistance = endLocation - position;
      const maxDistance = Math.min(autonomy, remainingDistance, maxStep);
      const stepDistance = getRandomInteger(minStep, maxDistance);
      const stepConsumption = stepDistance * consumptionPerKm;

      position += stepDistance;
      petrol -= stepConsumption;

      if (isAtPump()) {
        petrol += refillAmount;
        setInfo("Found Petrol Pump! - Refilling");
        Endanimation("petrolpump");
        document.getElementById("petrol_img").style.display = "";
        document.getElementById("pumpfound").style.display = "";
        await new Promise((resolve) => setTimeout(resolve, 7000));
        document.getElementById("petrol_img").style.display = "none";
        document.getElementById("pumpfound").style.display = "none";
        Startanimation();
      }
      logState();
      await new Promise((resolve) => setTimeout(resolve, time));
    }

    if (position === endLocation) {
      logStr("You've reached your destination! -> YOU WON");
      Endanimation("won");
      setGame("WON");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      document.getElementById("result").style.display = "";
      document.getElementById("info").style.display = "none";
    } else {
      logStr("Oops!,Out of petrol! -> GAME OVER");
      setGame("LOST");
      Endanimation("lost");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      document.getElementById("result").style.display = "";
      document.getElementById("info").style.display = "none";
    }

    function isAtPump() {
      return petrolPumpLocations.includes(position);
    }

    async function logState() {
      setMoves(position);
      setFuel(petrol);
      let str = `Car at: ${position}km\tPetrol: ${petrol}L`;
      if (isAtPump()) {
        str += `\nFound a Petrol Pump! Refilled ${refillAmount}L`;
      }
      logStr(str);
      await new Promise((resolve) => setTimeout(resolve, time));
    }

    function logStr(str) {
      setInfo(str);
      result = [...result, str];
      setList(result);
    }
  };

  function getRandomInteger(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function getRandomIntegers(n, min, max) {
    const res = [];
    while (res.length !== n) {
      const value = getRandomInteger(min, max);
      if (!res.includes(value)) {
        res.push(value);
      }
    }
    return res;
  }

  const Endanimation = async (msg) => {
    document.getElementById("caranimation").style.animationDuration = "unset";
    document.getElementById("frontwheelimg").style.animationDuration = "unset";
    document.getElementById("backwheelimg").style.animationDuration = "unset";
    document.getElementById("cityanimation").style.animationDuration = "unset";
    document.getElementById("highway").style.animationDuration = "unset";
    if (msg !== "petrolpump") {
      setBtn("Play Again");
      await new Promise((resolve) => setTimeout(resolve, time));
      document.getElementById("startbutton").style.display = "";
    }
  };

  const Startanimation = () => {
    document.getElementById("caranimation").style.animationDuration = "1s";
    document.getElementById("frontwheelimg").style.animationDuration = "1s";
    document.getElementById("backwheelimg").style.animationDuration = "1s";
    document.getElementById("cityanimation").style.animationDuration = "20s";
    document.getElementById("highway").style.animationDuration = "5s";
  };

  return (
    <div className="App">
      <div className="result" id="result" style={{ display: "none" }}>
        <span>YOU&nbsp;{Game}</span>
      </div>
      <div className="Startbtn">
        <button id="startbutton" onClick={Startgame}>
          <BsFillPlayFill />
          {btn}
        </button>
        <div className="info" id="info" style={{ display: "none" }}>
          <h3>&lt;STATUS/&gt;</h3>
          <h3>{info}</h3>
        </div>
        <div className="console" id="console" style={{ display: "none" }}>
          <div style={{ textAlign: "center" }}>&lt;LOG/&gt;</div>
          <Messages list={list} />
        </div>
      </div>
      <div className="highway" id="highway"></div>
      <div className="city" id="cityanimation"></div>
      <div className="petrolpump">
        <div className="pumpfound" id="pumpfound" style={{ display: "none" }}>
          <div>Found a Pump!</div>
          <div>Refilling 30L</div>
        </div>
        <img
          id="petrol_img"
          style={{ display: "none" }}
          src={Petrol_img}
          alt="pump"
        />
      </div>
      <div className="car">
        <img src={Car_img} id="caranimation" alt="car" />
      </div>
      <div className="wheel">
        <img
          src={Wheel_img}
          alt="wheel"
          className="back-wheel"
          id="backwheelimg"
        />
        <img
          src={Wheel_img}
          alt="wheel"
          className="front-wheel"
          id="frontwheelimg"
        />
      </div>
      <div className="fuelinfo">
        <div>Car Position= &ensp; {moves}Km</div>
        <div>Petrol Remaining= &ensp; {fuel}L</div>
      </div>
    </div>
  );
}

export default App;
