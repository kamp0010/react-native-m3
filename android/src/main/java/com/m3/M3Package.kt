package com.m3

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.TurboReactPackage
import com.facebook.react.uimanager.ViewManager
import com.margelo.nitro.m3.M3OnLoad
import com.margelo.nitro.m3.views.HybridWavyProgressIndicatorViewManager
import com.margelo.nitro.m3.views.HybridWavySliderViewManager

class M3Package : TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = null

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider { emptyMap() }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(
            HybridWavyProgressIndicatorViewManager(),
            HybridWavySliderViewManager()
        )
    }

    companion object {
        init {
            M3OnLoad.initializeNative()
        }
    }
}
