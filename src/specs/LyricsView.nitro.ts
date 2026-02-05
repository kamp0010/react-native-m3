import type { HybridView, HybridViewProps, HybridViewMethods } from 'react-native-nitro-modules'

/**
 * Synchronization type for lyrics display.
 * - LINE_SYNCED: Highlights entire lines with timing
 * - RICH_SYNCED: Word-by-word highlighting with timing
 * - UNSYNCED: Static display without timing
 */
export type LyricsSyncType = 'LINE_SYNCED' | 'RICH_SYNCED' | 'UNSYNCED'

/**
 * A single line of lyrics with timing information.
 */
export interface LyricLine {
    /**
     * The text content of this lyric line.
     * For RICH_SYNCED, this can contain word timing data in format: "word<startMs,endMs> word<startMs,endMs>"
     */
    words: string
    /**
     * Start time of this line in milliseconds.
     */
    startTimeMs: number
    /**
     * End time of this line in milliseconds (optional, mainly for RICH_SYNCED).
     */
    endTimeMs?: number
}

export interface LyricsViewProps extends HybridViewProps {
    /**
     * Array of lyric lines to display.
     */
    lines: LyricLine[]
    /**
     * Type of lyrics synchronization.
     */
    syncType: LyricsSyncType
    /**
     * Current playback position in milliseconds.
     * Used to determine which line/word is currently active.
     */
    currentTimeMs: number
    /**
     * Optional translated lyrics lines.
     * Should have the same timing as the original lines.
     */
    translatedLines?: LyricLine[]
    /**
     * Color for active/current lyrics text (hex string). Default: "#FFFFFF"
     */
    activeTextColor?: string
    /**
     * Color for inactive lyrics text (hex string). Default: "#595959"
     */
    inactiveTextColor?: string
    /**
     * Color for translated lyrics text (hex string). Default: "#FFFF00"
     */
    translationColor?: string
    /**
     * Font size in sp for lyrics text. Default: 24
     */
    fontSize?: number
    /**
     * Custom font family name for lyrics text.
     * Pass the font family name as registered in the app.
     */
    fontFamily?: string
    /**
     * Whether to show scroll shadow gradients at top/bottom. Default: true
     */
    showScrollShadows?: boolean
    /**
     * Background color used for scroll shadow gradients (hex string). Default: "#242424"
     */
    backgroundColor?: string
    /**
     * Callback invoked when user taps a lyric line.
     * Receives the startTimeMs of the tapped line for seek functionality.
     */
    onLineClick?: (startTimeMs: number) => void
}

export interface LyricsViewMethods extends HybridViewMethods {
    /**
     * Scroll to a specific line index.
     */
    scrollToLine(index: number): void
}

export type LyricsViewView = HybridView<LyricsViewProps, LyricsViewMethods>
