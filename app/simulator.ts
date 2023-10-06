import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast, DataSnapshot, off, set} from "firebase/database";

import { firebaseConfig } from "../firebaseConfig";
import EventModel from "./EventModel";
import { useEffect, useState } from "react";

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

export function getLatestEvent() {
  const [eventData, setEventData] = useState<EventModel[]>([]);
  useEffect(() => {
    // Define the path to the data you want to read
    const eventRef = ref(db, 'events');
    const eventQuery = query(eventRef, orderByChild('timestamp'), limitToLast(1));

    onValue(eventQuery, (snapshot) =>{
      if(snapshot.exists()){
        const latestData = snapshot.val();
        const eventData = latestData[Object.keys(latestData)[0]];
        console.log('Event:', eventData);

        setEventData(eventData);
      }
      else{
        console.log('No event available');
      }
    }, (error)=>{
      console.error('Error reading event:', error);
    });
  },[]);

  return {eventData};
};

export function isWithin5Seconds(timestamp: string | number | Date) {
  const eventTime = new Date(timestamp).getTime();
  const currentTime = new Date().getTime();
  const timeDifferenceInSeconds = (currentTime - eventTime) / 1000;
  return timeDifferenceInSeconds <= 5;
}

function getRandomValue(min: number, max: number) {
  return (Math.random() * (max - min) + min).toFixed(3);
}

