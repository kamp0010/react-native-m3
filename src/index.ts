import { NitroModules } from 'react-native-nitro-modules'
import type { M3 as M3Spec } from './specs/m3.nitro'

export const M3 =
  NitroModules.createHybridObject<M3Spec>('M3')