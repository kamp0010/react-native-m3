import { type HybridView, type HybridViewProps, type HybridViewMethods } from 'react-native-nitro-modules'

export interface WavyProgressIndicatorProps extends HybridViewProps {
  /**
   * The progress of this progress indicator, where 0.0 represents no progress and 1.0 represents full progress.
   */
  progress: number
  /**
   * The progress indicator color (hex string)
   */
  color?: string
  /**
   * The indicator's track color (hex string)
   */
  trackColor?: string
  /**
   * The width of the indicator stroke (in DP)
   */
  strokeWidth?: number
  /**
   * The width of the track stroke (in DP)
   */
  trackStrokeWidth?: number
  /**
   * The gap between the track and the progress parts of the indicator (in DP)
   */
  gapSize?: number
  /**
   * The amplitude for the wave path. 0.0 represents no amplitude, and 1.0 represents a max amplitude.
   */
  amplitude?: number
  /**
   * The length of a wave in this circular indicator (in DP).
   */
  wavelength?: number
  /**
   * The speed in which the wave will move (in DP per second).
   */
  waveSpeed?: number
}

export interface WavyProgressIndicatorMethods extends HybridViewMethods {
  // Add any methods if needed later
}

export type WavyProgressIndicatorView = HybridView<WavyProgressIndicatorProps, WavyProgressIndicatorMethods>
