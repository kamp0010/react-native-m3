package com.m3

import android.view.View
import android.view.ViewGroup
import androidx.compose.material3.CircularWavyProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.WavyProgressIndicatorDefaults
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.m3.HybridWavyProgressIndicatorViewSpec

class HybridWavyProgressIndicatorView(val context: ThemedReactContext) : HybridWavyProgressIndicatorViewSpec() {
    private var progressState by mutableStateOf(0f)
    private var colorState by mutableStateOf<Color?>(null)
    private var trackColorState by mutableStateOf<Color?>(null)
    private var strokeWidthState by mutableStateOf<Float?>(null)
    private var trackStrokeWidthState by mutableStateOf<Float?>(null)
    private var gapSizeState by mutableStateOf<Float?>(null)
    private var amplitudeState by mutableStateOf<Float?>(null)
    private var wavelengthState by mutableStateOf<Float?>(null)
    private var waveSpeedState by mutableStateOf<Float?>(null)

    override var progress: Double
        get() = progressState.toDouble()
        set(value) {
            progressState = value.toFloat()
        }

    override var color: String?
        get() = null
        set(value) {
            colorState = value?.let { parseHexColor(it) }
        }

    override var trackColor: String?
        get() = null
        set(value) {
            trackColorState = value?.let { parseHexColor(it) }
        }

    override var strokeWidth: Double?
        get() = strokeWidthState?.toDouble()
        set(value) {
            strokeWidthState = value?.toFloat()
        }

    override var trackStrokeWidth: Double?
        get() = trackStrokeWidthState?.toDouble()
        set(value) {
            trackStrokeWidthState = value?.toFloat()
        }

    override var gapSize: Double?
        get() = gapSizeState?.toDouble()
        set(value) {
            gapSizeState = value?.toFloat()
        }

    override var amplitude: Double?
        get() = amplitudeState?.toDouble()
        set(value) {
            amplitudeState = value?.toFloat()
        }

    override var wavelength: Double?
        get() = wavelengthState?.toDouble()
        set(value) {
            wavelengthState = value?.toFloat()
        }

    override var waveSpeed: Double?
        get() = waveSpeedState?.toDouble()
        set(value) {
            waveSpeedState = value?.toFloat()
        }

    @OptIn(ExperimentalMaterial3ExpressiveApi::class)
    override val view: View by lazy {
        ComposeView(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setContent {
                val density = LocalDensity.current
                MaterialTheme {
                    CircularWavyProgressIndicator(
                        progress = { progressState },
                        color = colorState ?: WavyProgressIndicatorDefaults.indicatorColor,
                        trackColor = trackColorState ?: WavyProgressIndicatorDefaults.trackColor,
                        stroke = strokeWidthState?.let { 
                            with(density) { Stroke(width = it.dp.toPx(), cap = StrokeCap.Round) } 
                        } ?: WavyProgressIndicatorDefaults.circularIndicatorStroke,
                        trackStroke = trackStrokeWidthState?.let { 
                            with(density) { Stroke(width = it.dp.toPx(), cap = StrokeCap.Round) } 
                        } ?: WavyProgressIndicatorDefaults.circularTrackStroke,
                        gapSize = gapSizeState?.dp ?: WavyProgressIndicatorDefaults.CircularIndicatorTrackGapSize,
                        amplitude = { p: Float -> 
                            amplitudeState ?: WavyProgressIndicatorDefaults.indicatorAmplitude(p)
                        },
                        wavelength = wavelengthState?.dp ?: WavyProgressIndicatorDefaults.CircularWavelength,
                        waveSpeed = waveSpeedState?.dp ?: wavelengthState?.dp ?: WavyProgressIndicatorDefaults.CircularWavelength
                    )
                }
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
