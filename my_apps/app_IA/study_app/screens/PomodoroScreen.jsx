import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PomodoroScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <Text style={styles.phase}>{isBreak ? 'Pausa' : 'Foco'}</Text>
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setIsRunning(!isRunning)}
        >
          <MaterialIcons 
            name={isRunning ? 'pause' : 'play-arrow'} 
            size={32} 
            color="white" 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
            setIsBreak(false);
          }}
        >
          <MaterialIcons name="refresh" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  phase: {
    fontSize: 24,
    color: '#666',
    marginTop: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 10,
  },
});