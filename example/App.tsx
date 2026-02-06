import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { WavyProgressIndicator, WavySlider, LyricsView, LoadingIndicator, callback } from 'react-native-m3';
import type { LyricLine } from 'react-native-m3';
import LyricsDemo from './LyricsDemo';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'lyrics'>('home');
  const [progress, setProgress] = useState(0.1);
  const [sliderVal, setSliderVal] = useState(0.5);
  const [sliderVal2, setSliderVal2] = useState(30);
  const [isAuto, setIsAuto] = useState(true);



  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isAuto && currentScreen === 'home') {
      interval = setInterval(() => {
        setProgress((p) => (p >= 1 ? 0 : p + 0.1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuto, currentScreen]);



  // Show lyrics demo if selected
  if (currentScreen === 'lyrics') {
    return <LyricsDemo onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>M3 Wavy Progress</Text>

        {/* Lyrics Demo Launch Button */}
        <TouchableOpacity
          style={styles.lyricsLaunchButton}
          onPress={() => setCurrentScreen('lyrics')}
          activeOpacity={0.8}
        >
          <Text style={styles.lyricsLaunchIcon}>🎵</Text>
          <View style={styles.lyricsLaunchTextContainer}>
            <Text style={styles.lyricsLaunchTitle}>Lyrics Demo</Text>
            <Text style={styles.lyricsLaunchSubtitle}>Experience the full lyrics component</Text>
          </View>
          <Text style={styles.lyricsLaunchArrow}>→</Text>
        </TouchableOpacity>

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

        <Text style={styles.subtitle}>Material 3 LoadingIndicator (Expressive)</Text>
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.label}>Default</Text>
            <LoadingIndicator style={styles.indicator} />
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Custom Color</Text>
            <LoadingIndicator
              style={styles.indicator}
              color="#4CAF50"
            />
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Custom Shapes</Text>
            <LoadingIndicator
              style={styles.indicatorLarge}
              color="#9C27B0"
              polygonVertices={[3, 5, 8, 12]}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
    color: '#555',
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

  lyricsLaunchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    width: '85%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lyricsLaunchIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  lyricsLaunchTextContainer: {
    flex: 1,
  },
  lyricsLaunchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  lyricsLaunchSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  lyricsLaunchArrow: {
    fontSize: 20,
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

export default App;