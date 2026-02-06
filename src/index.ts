import { NitroModules, getHostComponent } from 'react-native-nitro-modules'
import type { M3 as M3Spec } from './specs/m3.nitro'
import type { WavyProgressIndicatorProps, WavyProgressIndicatorMethods } from './specs/WavyProgressIndicator.nitro'
import type { WavySliderProps, WavySliderMethods } from './specs/WavySlider.nitro'
import type { LyricsViewProps, LyricsViewMethods } from './specs/LyricsView.nitro'
import type { LoadingIndicatorProps, LoadingIndicatorMethods } from './specs/LoadingIndicator.nitro'
import WavyProgressIndicatorViewConfig from './generated/WavyProgressIndicatorViewConfig.json'
import WavySliderViewConfig from './generated/WavySliderViewConfig.json'
import LyricsViewViewConfig from './generated/LyricsViewViewConfig.json'
import LoadingIndicatorViewConfig from './generated/LoadingIndicatorViewConfig.json'

export const M3 = NitroModules.createHybridObject<M3Spec>('M3')

export const WavyProgressIndicator = getHostComponent<WavyProgressIndicatorProps, WavyProgressIndicatorMethods>(
  'WavyProgressIndicatorView',
  () => WavyProgressIndicatorViewConfig
)

export const WavySlider = getHostComponent<WavySliderProps, WavySliderMethods>(
  'WavySliderView',
  () => WavySliderViewConfig
)

export const LyricsView = getHostComponent<LyricsViewProps, LyricsViewMethods>(
  'LyricsViewView',
  () => LyricsViewViewConfig
)

export const LoadingIndicator = getHostComponent<LoadingIndicatorProps, LoadingIndicatorMethods>(
  'LoadingIndicatorView',
  () => LoadingIndicatorViewConfig
)

export * from './specs/WavyProgressIndicator.nitro'
export * from './specs/WavySlider.nitro'
export * from './specs/LyricsView.nitro'
export * from './specs/LoadingIndicator.nitro'

/**
 * Wrap the given function in a Nitro callback.
 * This is required for HostComponents because React Native converts functions to booleans.
 */
export function callback<T>(func: T): T extends (...args: any[]) => any ? { f: T } : T {
  if (typeof func === 'function') {
    return { f: func } as any
  }
  return func as any
}

export { getHostComponent } from 'react-native-nitro-modules'