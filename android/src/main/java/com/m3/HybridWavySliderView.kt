package com.m3

import android.view.View
import android.view.ViewGroup
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.SliderDefaults
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.m3.HybridWavySliderViewSpec
import com.margelo.nitro.m3.WaveDirection as NitroWaveDirection
import ir.mahozad.multiplatform.wavyslider.WaveDirection as LibraryWaveDirection
import ir.mahozad.multiplatform.wavyslider.material3.WavySlider

class HybridWavySliderView(val context: ThemedReactContext) : HybridWavySliderViewSpec() {
    private var valueState by mutableStateOf(0f)
    private var valueRangeMinState by mutableStateOf(0f)
    private var valueRangeMaxState by mutableStateOf(1f)
    private var stepsState by mutableStateOf(0)
    private var waveLengthState by mutableStateOf<Float?>(null)
    private var waveHeightState by mutableStateOf<Float?>(null)
    private var waveVelocityState by mutableStateOf<Float?>(null)
    private var waveDirectionState by mutableStateOf(NitroWaveDirection.TAIL)
    private var waveThicknessState by mutableStateOf<Float?>(null)
    private var trackThicknessState by mutableStateOf<Float?>(null)
    private var incrementalState by mutableStateOf(false)
    private var enabledState by mutableStateOf(true)
    private var activeTrackColorState by mutableStateOf<Color?>(null)
    private var inactiveTrackColorState by mutableStateOf<Color?>(null)
    private var thumbColorState by mutableStateOf<Color?>(null)
    private var disabledActiveTrackColorState by mutableStateOf<Color?>(null)
    private var disabledInactiveTrackColorState by mutableStateOf<Color?>(null)
    private var disabledThumbColorState by mutableStateOf<Color?>(null)

    override var value: Double
        get() = valueState.toDouble()
        set(newValue) {
            valueState = newValue.toFloat()
        }

    override var onValueChange: ((value: Double) -> Unit)? = null
    override var onValueChangeFinished: (() -> Unit)? = null

    override var valueRangeMin: Double?
        get() = valueRangeMinState.toDouble()
        set(newValue) {
            valueRangeMinState = newValue?.toFloat() ?: 0f
        }

    override var valueRangeMax: Double?
        get() = valueRangeMaxState.toDouble()
        set(newValue) {
            valueRangeMaxState = newValue?.toFloat() ?: 1f
        }

    override var steps: Double?
        get() = stepsState.toDouble()
        set(newValue) {
            stepsState = newValue?.toInt() ?: 0
        }

    override var waveLength: Double?
        get() = waveLengthState?.toDouble()
        set(newValue) {
            waveLengthState = newValue?.toFloat()
        }

    override var waveHeight: Double?
        get() = waveHeightState?.toDouble()
        set(newValue) {
            waveHeightState = newValue?.toFloat()
        }

    override var waveVelocity: Double?
        get() = waveVelocityState?.toDouble()
        set(newValue) {
            waveVelocityState = newValue?.toFloat()
        }

    override var waveDirection: com.margelo.nitro.m3.WaveDirection?
        get() = waveDirectionState
        set(newValue) {
            waveDirectionState = newValue ?: NitroWaveDirection.TAIL
        }

    override var waveThickness: Double?
        get() = waveThicknessState?.toDouble()
        set(newValue) {
            waveThicknessState = newValue?.toFloat()
        }

    override var trackThickness: Double?
        get() = trackThicknessState?.toDouble()
        set(newValue) {
            trackThicknessState = newValue?.toFloat()
        }

    override var incremental: Boolean?
        get() = incrementalState
        set(newValue) {
            incrementalState = newValue ?: false
        }

    override var enabled: Boolean?
        get() = enabledState
        set(newValue) {
            enabledState = newValue ?: true
        }

    override var activeTrackColor: String?
        get() = null
        set(newValue) {
            activeTrackColorState = newValue?.let { parseHexColor(it) }
        }

    override var inactiveTrackColor: String?
        get() = null
        set(newValue) {
            inactiveTrackColorState = newValue?.let { parseHexColor(it) }
        }

    override var thumbColor: String?
        get() = null
        set(newValue) {
            thumbColorState = newValue?.let { parseHexColor(it) }
        }

    override var disabledActiveTrackColor: String?
        get() = null
        set(newValue) {
            disabledActiveTrackColorState = newValue?.let { parseHexColor(it) }
        }

    override var disabledInactiveTrackColor: String?
        get() = null
        set(newValue) {
            disabledInactiveTrackColorState = newValue?.let { parseHexColor(it) }
        }

    override var disabledThumbColor: String?
        get() = null
        set(newValue) {
            disabledThumbColorState = newValue?.let { parseHexColor(it) }
        }

    override val view: View by lazy {
        ComposeView(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setContent {
                val colors = SliderDefaults.colors(
                    activeTrackColor = activeTrackColorState ?: SliderDefaults.colors().activeTrackColor,
                    inactiveTrackColor = inactiveTrackColorState ?: SliderDefaults.colors().inactiveTrackColor,
                    thumbColor = thumbColorState ?: SliderDefaults.colors().thumbColor,
                    disabledActiveTrackColor = disabledActiveTrackColorState ?: SliderDefaults.colors().disabledActiveTrackColor,
                    disabledInactiveTrackColor = disabledInactiveTrackColorState ?: SliderDefaults.colors().disabledInactiveTrackColor,
                    disabledThumbColor = disabledThumbColorState ?: SliderDefaults.colors().disabledThumbColor
                )

                val libraryDirection = when (waveDirectionState) {
                    NitroWaveDirection.HEAD -> LibraryWaveDirection.HEAD
                    NitroWaveDirection.TAIL -> LibraryWaveDirection.TAIL
                    NitroWaveDirection.LEFT -> LibraryWaveDirection.LEFT
                    NitroWaveDirection.RIGHT -> LibraryWaveDirection.RIGHT
                }

                val range: ClosedFloatingPointRange<Float> = valueRangeMinState..valueRangeMaxState
                val velocity: Pair<Dp, LibraryWaveDirection> = (waveVelocityState?.dp ?: 10.dp) to libraryDirection

                WavySlider(
                    value = valueState,
                    onValueChange = { newValue: Float ->
                        valueState = newValue
                        onValueChange?.invoke(newValue.toDouble())
                    },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = enabledState,
                    onValueChangeFinished = {
                        onValueChangeFinished?.invoke()
                    },
                    colors = colors,
                    valueRange = range,
                    waveLength = waveLengthState?.dp ?: 20.dp,
                    waveHeight = waveHeightState?.dp ?: 6.dp,
                    waveVelocity = velocity,
                    waveThickness = waveThicknessState?.dp ?: 4.dp,
                    trackThickness = trackThicknessState?.dp ?: 4.dp,
                    incremental = incrementalState
                )
            }
        }
    }

    private fun parseHexColor(hex: String): Color {
        return try {
            Color(android.graphics.Color.parseColor(hex))
        } catch (e: Exception) {
            Color.Unspecified
        }
    }
}
