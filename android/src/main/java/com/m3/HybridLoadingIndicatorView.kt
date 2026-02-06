package com.m3

import android.view.View
import android.view.ViewGroup
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LoadingIndicator
import androidx.compose.material3.LoadingIndicatorDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.graphics.shapes.RoundedPolygon
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.m3.HybridLoadingIndicatorViewSpec

class HybridLoadingIndicatorView(val context: ThemedReactContext) : HybridLoadingIndicatorViewSpec() {
    private var colorState by mutableStateOf<Color?>(null)
    private var polygonsState by mutableStateOf<List<RoundedPolygon>?>(null)

    override var color: String?
        get() = null
        set(value) {
            colorState = value?.let { parseHexColor(it) }
        }

    override var polygonVertices: DoubleArray?
        get() = null
        set(value) {
            polygonsState = value?.let { vertices ->
                if (vertices.size >= 2) {
                    vertices.map { v ->
                        RoundedPolygon(numVertices = v.toInt())
                    }
                } else null
            }
        }

    @OptIn(ExperimentalMaterial3ExpressiveApi::class)
    override val view: View by lazy {
        ComposeView(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setContent {
                MaterialTheme {
                    LoadingIndicator(
                        color = colorState ?: LoadingIndicatorDefaults.indicatorColor,
                        polygons = polygonsState ?: LoadingIndicatorDefaults.IndeterminateIndicatorPolygons
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
