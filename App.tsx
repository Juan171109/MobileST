import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { stopSensorData, startSensorData, getLatestEvent, isWithin5Seconds } from './app/simulator';

export default function App() {
  const [isSendingData, setIsSendingData] = useState(false);
  
  const toggleSendingData = () => {
    if (isSendingData) {
      stopSensorData();
    } else {
      startSensorData();
    }
    setIsSendingData(!isSendingData);
  };

  const { eventData } = getLatestEvent();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Simulator</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleSendingData}>
          <Text style={styles.buttonText}>{isSendingData ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventPanel}>
      <Text style={styles.panelTitle}>Temperature High Alert!</Text>
        {eventData ? (
          <View style={styles.eventItem}>
            {isWithin5Seconds(eventData.timestamp) ? (
              <>
                <Text>Sensor Type: {eventData.sensorType}</Text>
                <Text style= {styles.eventValue}>Sensor Value: {eventData.sensorValue}</Text>
                <Text>Timestamp: {eventData.timestamp}</Text>
              </>
            ) : (
              <Text>No recent events available</Text>
            )}
          </View>
        ) : (
          <Text>No recent events available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    top: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'blue',
    padding: 12,
    width: 80,
    borderRadius: 8,
    alignContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  eventPanel: {
    marginTop: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 80,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'flex-start'
  },
  eventItem: {
    marginBottom: 10,
    fontSize: 15
  },
  eventValue:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red'
  }
});