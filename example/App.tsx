import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { WavyProgressIndicator, WavySlider, callback } from 'react-native-m3';

function App() {
  const [progress, setProgress] = useState(0.1);
  const [sliderVal, setSliderVal] = useState(0.5);
  const [sliderVal2, setSliderVal2] = useState(30);

  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isAuto) {
      interval = setInterval(() => {
        setProgress((p) => (p >= 1 ? 0 : p + 0.1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuto]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>M3 Wavy Progress</Text>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Default</Text>
          <WavyProgressIndicator
            style={styles.indicator}
            progress={progress}
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Custom Color</Text>
          <WavyProgressIndicator
            style={styles.indicator}
            progress={progress}
            color="#FF5722"
            trackColor="#FFCCBC"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Thick Stroke</Text>
          <WavyProgressIndicator
            style={styles.indicatorLarge}
            progress={progress}
            strokeWidth={10}
            trackStrokeWidth={10}
            amplitude={0.8}
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Fast Wave</Text>
          <WavyProgressIndicator
            style={styles.indicator}
            progress={0.5}
            waveSpeed={40}
            wavelength={10}
          />
        </View>
      </View>

      <View style={styles.sliderSection}>
        <Text style={styles.label}>Sync with Progress: {progress.toFixed(2)}</Text>
        <WavySlider
          style={styles.slider}
          value={progress}
          onValueChange={callback((v: number) => {
            setIsAuto(false);
            setProgress(v);
          })}
        />
      </View>

      <View style={styles.sliderSection}>
        <Text style={styles.label}>Custom Slider (High/Discrete): {sliderVal2.toFixed(0)}</Text>
        <WavySlider
          style={styles.slider}
          value={sliderVal2}
          valueRangeMin={0}
          valueRangeMax={100}
          steps={10}
          waveHeight={12}
          waveLength={25}
          activeTrackColor="#6200EE"
          thumbColor="#6200EE"
          onValueChange={callback((v: number) => setSliderVal2(v))}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsAuto(!isAuto);
          if (!isAuto) setProgress(0);
        }}
      >
        <Text style={styles.buttonText}>{isAuto ? 'Stop Auto' : 'Start Auto & Reset'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  indicator: {
    width: 48,
    height: 48,
  },
  indicatorLarge: {
    width: 64,
    height: 64,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6200EE',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sliderSection: {
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 48,
  },
});

export default App;