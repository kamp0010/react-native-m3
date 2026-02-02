import { type HybridView, type HybridViewProps, type HybridViewMethods } from 'react-native-nitro-modules'

/**
 * Wave direction for the WavySlider animation.
 */
export type WaveDirection = 'HEAD' | 'TAIL' | 'LEFT' | 'RIGHT'

export interface WavySliderProps extends HybridViewProps {
    /**
     * The current value of the slider.
     * Must be within the range specified by valueRangeMin and valueRangeMax.
     */
    value: number
    /**
     * Callback function invoked whenever the slider value changes during dragging.
     */
    onValueChange?: (value: number) => void
    /**
     * Callback invoked when the user finishes dragging the slider.
     */
    onValueChangeFinished?: () => void
    /**
     * Minimum value of the slider range. Default: 0
     */
    valueRangeMin?: number
    /**
     * Maximum value of the slider range. Default: 1
     */
    valueRangeMax?: number
    /**
     * Number of discrete steps. 0 = continuous slider. Default: 0
     */
    steps?: number
    /**
     * The horizontal distance over which one complete wave cycle repeats (in dp).
     * Set to 0 to disable wave animation. Default: 20
     */
    waveLength?: number
    /**
     * The vertical amplitude of the wave (in dp).
     * Set to 0 to disable wave animation. Default: 6
     */
    waveHeight?: number
    /**
     * The speed of wave animation movement (in dp/s). Default: 10
     */
    waveVelocity?: number
    /**
     * Direction of wave animation: 'HEAD', 'TAIL', 'LEFT', 'RIGHT'. Default: 'TAIL'
     */
    waveDirection?: WaveDirection
    /**
     * The stroke thickness of the wavy active track (in dp). Default: 4
     */
    waveThickness?: number
    /**
     * The stroke thickness of the inactive track (in dp). Default: 4
     */
    trackThickness?: number
    /**
     * Whether the wave height gradually increases toward the thumb. Default: false
     */
    incremental?: boolean
    /**
     * Whether the slider is interactive. Default: true
     */
    enabled?: boolean
    /**
     * Color of the active (filled) track (hex string).
     */
    activeTrackColor?: string
    /**
     * Color of the inactive (unfilled) track (hex string).
     */
    inactiveTrackColor?: string
    /**
     * Color of the draggable thumb (hex string).
     */
    thumbColor?: string
    /**
     * Color of the active track when disabled (hex string).
     */
    disabledActiveTrackColor?: string
    /**
     * Color of the inactive track when disabled (hex string).
     */
    disabledInactiveTrackColor?: string
    /**
     * Color of the thumb when disabled (hex string).
     */
    disabledThumbColor?: string
}

export interface WavySliderMethods extends HybridViewMethods {
    // Add any methods if needed later
}

export type WavySliderView = HybridView<WavySliderProps, WavySliderMethods>
