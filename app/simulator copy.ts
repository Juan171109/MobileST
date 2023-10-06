import { initializeApp } from "firebase/app";
import { getDatabase, ref, push} from "firebase/database";

import { firebaseConfig } from "../firebaseConfig";

let intervalId: any = null;

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export function startSensorData() {
  if (!intervalId) {
    intervalId = setInterval(writeSensorData, 2000); 
  }
}

export function stopSensorData() {
  if (intervalId) {
    clearInterval(intervalId); // stop Interval
    intervalId = null; // reset intervalId
  }
}

export function writeSensorData() {
  const sensorsRef = ref(db, 'sensors'); 
  const timestamp = new Date().toISOString();

  const sensorData = {
    temperature: getRandomValue(20, 30),
    pressure: getRandomValue(800, 1200),
    humidity: getRandomValue(30, 100),
    light: getRandomValue(8000, 10000),
    co2: getRandomValue(300, 1000),
    timestamp: timestamp, 
  };

  push(sensorsRef, sensorData)
    .then(() => {
      console.log('Sensor data added to Firebase:', sensorData);
    })
    .catch((error) => {
      console.error('Error adding sensor data:', error);
    });
}

function getRandomValue(min: number, max: number) {
  return (Math.random() * (max - min) + min).toFixed(3);
}

