import { type HybridView, type HybridViewProps, type HybridViewMethods } from 'react-native-nitro-modules'

export interface LoadingIndicatorProps extends HybridViewProps {
  /**
   * The color of the loading indicator (hex string).
   */
  color?: string
  /**
   * Optional: Pass a list of vertex counts to customize the morphing sequence.
   * Default uses Material 3 standard polygons.
   * Each number represents the number of vertices for a shape in the sequence.
   */
  polygonVertices?: number[]
}

export interface LoadingIndicatorMethods extends HybridViewMethods {}

export type LoadingIndicatorView = HybridView<LoadingIndicatorProps, LoadingIndicatorMethods>
