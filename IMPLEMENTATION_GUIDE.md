# Wavy Components Implementation Guide

This document explains the technical implementation of the `WavyProgressIndicator` and `WavySlider` components in `react-native-m3` for future developers and AI agents.

## Architecture Overview

The library follows a **Hybrid Native Module** approach using the **Nitro** framework. This allows seamless integration of modern Android UI technology (Jetpack Compose) into React Native.

### Key Technologies
- **Nitro Modules**: Bridge layer for low-latency communication between JS and Native.
- **Jetpack Compose**: Used for the actual UI rendering on Android.
- **Material 3 Expressive API**: Powers the wavy progress indicator.
- **WavySlider Multiplatform Library**: Powers the wavy slider rendering.

---

## Component Implementations

### 1. Wavy Progress Indicator
- **File**: `android/src/main/java/com/m3/HybridWavyProgressIndicatorView.kt`
- **Core Component**: Uses `androidx.compose.material3.CircularWavyProgressIndicator` (Experimental Material 3 Expressive API).
- **Bridge Logic**:
    - Extends `HybridWavyProgressIndicatorViewSpec`.
    - Uses Kotlin `mutableStateOf` for reactive state management. When a prop is updated via the Nitro bridge (e.g., `progress`), it triggers a recomposition of the Compose view.

### 2. Wavy Slider
- **File**: `android/src/main/java/com/m3/HybridWavySliderView.kt`
- **Core Component**: Uses `ir.mahozad.multiplatform.wavyslider.material3.WavySlider`.
- **Bridge Logic**:
    - Extends `HybridWavySliderViewSpec`.
    - Proxies user interactions using `onValueChange` and `onValueChangeFinished` callbacks back to the React Native layer.

### 3. Lyrics View
- **File**: `android/src/main/java/com/m3/HybridLyricsView.kt`
- **Core Component**: Custom Compose implementation with `LazyColumn` for scrollable lyrics.
- **Sync Modes**:
    - `LINE_SYNCED`: Highlights entire lines with auto-scroll to center.
    - `RICH_SYNCED`: Word-by-word highlighting with timing animations.
    - `UNSYNCED`: Static display without timing.
- **Bridge Logic**:
    - Extends `HybridLyricsViewViewSpec`.
    - Uses `mutableStateOf` for reactive prop updates.
    - Supports `onLineClick` callback for seek functionality.

---

## 🚀 Workflow for Adding New M3 Components

To add a new component (e.g., `M3Button`), follow these steps:

### 1. Define the Nitro Spec
Update the `nitro.json` or your TypeScript definitions to include the new `HybridView`.
```typescript
interface M3Button {
  label: string
  onPress: () => void
}
```

### 2. Run Code Generation
Run the following command to generate the C++ bridge and Kotlin Specs:
```bash
npm run codegen
```
*This command runs `nitrogen`, copies configs, builds the project, and runs post-scripts.*

### 3. Implement the Kotlin View
Create a new file `android/src/main/java/com/m3/HybridM3ButtonView.kt`:
- Extend the generated `HybridM3ButtonViewSpec`.
- Use `ComposeView` and `setContent { ... }` to wrap the M3 Compose component.
- Use `mutableStateOf` for any props that need to trigger re-renders.

### 4. Register the View Manager
Open `android/src/main/java/com/m3/M3Package.kt` and add the generated ViewManager to the list:
```kotlin
override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(
        HybridWavyProgressIndicatorViewManager(),
        HybridWavySliderViewManager(),
        HybridM3ButtonViewManager() // Add new manager here
    )
}
```

### 5. Export to React Native
Create a wrapper in `src/` that uses `requireNativeComponent` or the generated Nitro view hooks to expose the component to JS.

---

## State & Reactivity

Both components utilize `ComposeView` as the root native view. Reactivity is achieved by updating `mutableStateOf` variables in the Kotlin setters, which triggers Compose recomposition automatically.

## Maintenance Tips
- **Experimental APIs**: Always check `@ExperimentalMaterial3ExpressiveApi` requirements.
- **Color Handling**: Use the `parseHexColor` helper in the Kotlin classes to convert JS hex strings to Compose `Color`.
