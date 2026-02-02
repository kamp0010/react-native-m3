# react-native-m3

A premium, high-performance React Native Material 3 Expressive component library built with [Nitro Modules](https://nitro.margelo.com/).

Bring stunning Material 3 animations to your app with native performance and smooth 60 FPS waves.

## 🚀 Features

- **Built with Nitro**: Blazing fast native bridge for ultra-low latency.
- **WavyProgressIndicator**: The new Material 3 Expressive wavy circular progress indicator.
- **WavySlider**: Fully customizable wavy slider with smooth animations, velocity control, and incremental wave effects.
- **Fully Customizable**: Control colors, strokes, amplitude, wavelength, and more.
- **Lightweight**: Zero-overhead views powered by Jetpack Compose (Android).

## 📦 Installation

```bash
npm install react-native-m3 react-native-nitro-modules
```

> [!IMPORTANT]
> This library requires **React Native 0.78.0** or higher to support Nitro Views.

## 🛠️ Components

### 1. WavyProgressIndicator

A circular progress indicator that features an expressive wavy animation on the track.

```tsx
import { WavyProgressIndicator } from 'react-native-m3';

// ...
<WavyProgressIndicator
  progress={0.5}
  color="#6200EE"
  trackColor="#E1D5FF"
  strokeWidth={6}
  amplitude={0.7}
/>
```

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `progress` | `number` | **Required** | The progress (0.0 to 1.0). |
| `color` | `string` | Material Default | Hex color of the indicator. |
| `trackColor` | `string` | Material Default | Hex color of the track. |
| `strokeWidth` | `number` | 4 | Stroke width in DP. |
| `trackStrokeWidth`| `number` | 4 | Track stroke width in DP. |
| `gapSize` | `number` | 4 | Gap between track and progress in DP. |
| `amplitude` | `number` | 0.2 | Wave amplitude (0.0 to 1.0). |
| `wavelength` | `number` | 20 | Length of a single wave cycle in DP. |
| `waveSpeed` | `number` | 10 | Speed of wave movement in DP/s. |

---

### 2. WavySlider

A highly expressive slider that transforms the track into a dynamic wave.

```tsx
import { WavySlider, callback } from 'react-native-m3';

// ...
<WavySlider
  value={sliderValue}
  onValueChange={callback((v: number) => setSliderValue(v))}
  waveHeight={10}
  waveLength={30}
  waveDirection="TAIL"
/>
```

> [!NOTE]  
> Due to Nitro's high-performance bridge architecture, callbacks passed to custom views must be wrapped in the `callback()` helper.

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number` | **Required** | The current value of the slider. |
| `onValueChange` | `(v: number) => void` | - | Invoked during dragging. |
| `onValueChangeFinished` | `() => void` | - | Invoked when dragging ends. |
| `valueRangeMin` | `number` | 0 | Minimum range value. |
| `valueRangeMax` | `number` | 1 | Maximum range value. |
| `steps` | `number` | 0 | Number of discrete steps (0 for continuous). |
| `waveLength` | `number` | 20 | Wave cycle length in DP. |
| `waveHeight` | `number` | 6 | Wave amplitude in DP. |
| `waveVelocity` | `number` | 10 | Speed of animation in DP/s. |
| `waveDirection` | `'HEAD' \| 'TAIL' \| 'LEFT' \| 'RIGHT'` | `'TAIL'` | Direction of wave travel. |
| `waveThickness` | `number` | 4 | Thickness of the active wavy track. |
| `trackThickness` | `number` | 4 | Thickness of the inactive track. |
| `incremental` | `boolean` | `false` | If wave increases height towards thumb. |
| `enabled` | `boolean` | `true` | Interaction toggle. |
| `activeTrackColor`| `string` | - | Active track hex color. |
| `thumbColor` | `string` | - | Thumb hex color. |

## 🏗️ Requirements

- **Android**: SDK 24+
- **iOS**: *Coming Soon*
- **React Native**: 0.78.0+

## 📄 License

MIT

---
Built with ❤️ by [Kamp0010](https://github.com/kamp0010) using [Nitro Modules](https://nitro.margelo.com/).
