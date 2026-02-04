import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Animated,
    Image,
} from 'react-native';
import { LyricsView, callback } from 'react-native-m3';
import type { LyricLine } from 'react-native-m3';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample lyrics with timing (AI Generated)
const sampleLyrics: LyricLine[] = [
    { words: 'Yeah, yeah', startTimeMs: 11300 },
    { words: 'Why would I play when I know this shit—', startTimeMs: 13400 },
    { words: 'Why would I, why would I play when I know this shit slap?', startTimeMs: 14800 },
    { words: 'Tell the DJ go and run that—', startTimeMs: 16800 },
    { words: 'Tell the, tell the DJ go and run that—', startTimeMs: 18100 },
    { words: 'I got too many issues and I bought me some more missiles', startTimeMs: 20150 },
    { words: 'I\'m sittin\' here by myself, dog, ain\'t nobody givin\' no tissue (Ah)', startTimeMs: 23350 },
    { words: 'Why would I play when I know that shit—', startTimeMs: 26990 },
    { words: 'Why would I, why would I play when I know this shit slap?', startTimeMs: 28240 },
    { words: 'Tell the DJ go and run that—', startTimeMs: 30390 },
    { words: 'Tell the, tell the DJ go and run that back (Back)', startTimeMs: 31550 },
    { words: 'I got the gemstone, I got the, mm', startTimeMs: 33590 },
    { words: 'She got that gushy, that shit really, woah (Ah)', startTimeMs: 35350 },
    { words: 'Hit my lil\' line when you ready to moan', startTimeMs: 37020 },
    { words: 'Hit my lil\' line when you ready to moan (Ah)', startTimeMs: 38720 },
    { words: 'Back in that, back in that, back in that trap', startTimeMs: 40410 },
    { words: 'Back in that, back in that, back in that trap', startTimeMs: 42170 },
    { words: 'Im on the eastside, Im on the northside', startTimeMs: 43910 },
    { words: 'South to the west, baby, where is you at?', startTimeMs: 45520 },
    { words: 'I\'m comin\' clean, goin\' way off the map', startTimeMs: 47120 },
    { words: 'Car to a six-man, turn up my hats', startTimeMs: 48820 },
    { words: 'I\'m on the jet, tryna get dispatched', startTimeMs: 50620 },
    { words: 'Call up for it, ****, said off the meds', startTimeMs: 52320 },
    { words: 'Why would I play when I know this shit—', startTimeMs: 53920 },
    { words: 'Why would I, why would I play when I know this shit slap?', startTimeMs: 55260 },
    { words: 'Tell the DJ go and run that—', startTimeMs: 57260 },
    { words: 'Tell the, tell the DJ go and run that—', startTimeMs: 58600 },
    { words: 'Why would I play when I know this shit—', startTimeMs: 60700 },
    { words: 'Why would I, why would I play when I know this shit—', startTimeMs: 62000 },
    { words: 'Tell the DJ go and run that—', startTimeMs: 64110 },
    { words: 'Tell the, tell the DJ go and run that—', startTimeMs: 65410 },
    { words: 'Why would I play? 400K, bro off a molly and braindead', startTimeMs: 67500 },
    { words: 'Yeah, I\'m insane, bro, I am trippin\'? Did shawty jump on a BangBus?', startTimeMs: 70860 },
    { words: 'Deep and way down, way down in the sea, I done went my anchor', startTimeMs: 74160 },
    { words: 'What is we talkin\' \'bout? No, I don\'t talk a lot \'less it\'s \'bout that paper', startTimeMs: 77600 },
    { words: 'Switchin\' the lane, the Lam\' delirious', startTimeMs: 80980 },
    { words: 'Pull on your block, this Fast and Furious', startTimeMs: 82780 },
    { words: 'Switchin\' the lane, the Lam\' delirious', startTimeMs: 84380 },
    { words: 'Pull on your block, this Fast and Furious', startTimeMs: 86130 },
    { words: '**** be talkin\' that shit, can\'t be serious', startTimeMs: 87830 },
    { words: 'I got the bag, you know that I\'m clearin\' it', startTimeMs: 89430 },
    { words: 'Who in the Lam\'? Who in the Porsche?', startTimeMs: 91160 },
    { words: 'Who in the Audi? Oh, who be steerin\' it?', startTimeMs: 92860 },
];

// Rich sync sample with word-level timing
const richSyncLyrics: LyricLine[] = [
    {
        words: 'The<0,500> night<500,1000> is<1000,1200> young<1200,1800> and<1800,2000> full<2000,2500> of<2500,2700> dreams<2700,3500>',
        startTimeMs: 0,
        endTimeMs: 4000
    },
    {
        words: 'Stars<4000,4500> are<4500,4800> dancing<4800,5500> in<5500,5700> the<5700,5900> sky<5900,7500>',
        startTimeMs: 4000,
        endTimeMs: 8000
    },
    {
        words: 'We<8000,8300> chase<8300,8800> the<8800,9000> moon<9000,9600> through<9600,10000> endless<10000,10700> streams<10700,11500>',
        startTimeMs: 8000,
        endTimeMs: 12000
    },
    {
        words: 'As<12000,12300> time<12300,12900> goes<12900,13400> floating<13400,14200> by<14200,15500>',
        startTimeMs: 12000,
        endTimeMs: 16000
    },
    {
        words: '',
        startTimeMs: 16000,
        endTimeMs: 20000
    },
    {
        words: 'Hold<20000,20400> my<20400,20700> hand<20700,21300> we\'ll<21300,21700> find<21700,22200> our<22200,22600> way<22600,23500>',
        startTimeMs: 20000,
        endTimeMs: 24000
    },
    {
        words: 'Through<24000,24500> shadows<24500,25200> and<25200,25500> the<25500,25800> light<25800,27500>',
        startTimeMs: 24000,
        endTimeMs: 28000
    },
];

// Translated lyrics sample
const translatedLyrics: LyricLine[] = [
    { words: '♪ 器乐前奏 ♪', startTimeMs: 0 },
    { words: '夜还年轻，充满梦想', startTimeMs: 4000 },
    { words: '星星在天空中翩翩起舞', startTimeMs: 8000 },
    { words: '我们追逐月亮穿过无尽的溪流', startTimeMs: 12000 },
    { words: '时光悄然流逝', startTimeMs: 16000 },
];

interface LyricsDemoProps {
    onBack: () => void;
}

type SyncMode = 'LINE_SYNCED' | 'RICH_SYNCED' | 'UNSYNCED';
type ThemeMode = 'dark' | 'spotify' | 'apple' | 'gradient';

interface ThemeConfig {
    name: string;
    bg: string;
    activeText: string;
    inactiveText: string;
    translationColor: string;
    accent: string;
}

const themes: Record<ThemeMode, ThemeConfig> = {
    dark: {
        name: 'Dark',
        bg: '#0a0a0a',
        activeText: '#FFFFFF',
        inactiveText: '#4a4a4a',
        translationColor: '#8b5cf6',
        accent: '#8b5cf6',
    },
    spotify: {
        name: 'Spotify',
        bg: '#121212',
        activeText: '#1DB954',
        inactiveText: '#535353',
        translationColor: '#1ed760',
        accent: '#1DB954',
    },
    apple: {
        name: 'Apple',
        bg: '#1c1c1e',
        activeText: '#ff375f',
        inactiveText: '#48484a',
        translationColor: '#ff6482',
        accent: '#ff375f',
    },
    gradient: {
        name: 'Neon',
        bg: '#0f0f23',
        activeText: '#00d4ff',
        inactiveText: '#2a2a4a',
        translationColor: '#ff00ff',
        accent: '#00d4ff',
    },
};

export default function LyricsDemo({ onBack }: LyricsDemoProps) {
    const [currentTimeMs, setCurrentTimeMs] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [syncMode, setSyncMode] = useState<SyncMode>('LINE_SYNCED');
    const [theme, setTheme] = useState<ThemeMode>('dark');
    const [showTranslation, setShowTranslation] = useState(false);
    const [fontSize, setFontSize] = useState(24);

    const progressAnim = useRef(new Animated.Value(0)).current;

    const currentTheme = themes[theme];
    const totalDuration = 95000;
    const currentLyrics = syncMode === 'RICH_SYNCED' ? richSyncLyrics : sampleLyrics;

    // Playback timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTimeMs((t) => {
                    const newTime = t + 100;
                    return newTime >= totalDuration ? 0 : newTime;
                });
            }, 100);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, totalDuration]);

    // Progress bar animation
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: currentTimeMs / totalDuration,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [currentTimeMs, totalDuration]);



    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (percentage: number) => {
        const newTime = Math.floor(percentage * totalDuration);
        setCurrentTimeMs(newTime);
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
            <StatusBar barStyle="light-content" backgroundColor={currentTheme.bg} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.nowPlaying}>NOW PLAYING</Text>
                    <Text style={styles.songTitle}>Demo Song</Text>
                    <Text style={styles.artistName}>React Native M3</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            {/* Album Art Placeholder */}
            <View style={[styles.albumArt, { borderColor: currentTheme.accent }]}>
                <View style={[styles.albumGradient, { backgroundColor: currentTheme.accent + '20' }]}>
                    <Text style={[styles.musicNote, { color: currentTheme.accent }]}>♪</Text>
                </View>
            </View>

            {/* Lyrics Container */}
            <View style={styles.lyricsWrapper}>
                <LyricsView
                    style={styles.lyrics}
                    lines={currentLyrics}
                    syncType={syncMode}
                    currentTimeMs={currentTimeMs}
                    activeTextColor={currentTheme.activeText}
                    inactiveTextColor={currentTheme.inactiveText}
                    translationColor={currentTheme.translationColor}
                    backgroundColor={currentTheme.bg}
                    fontSize={fontSize}
                    showScrollShadows={true}
                    translatedLines={showTranslation ? translatedLyrics : undefined}
                    onLineClick={callback((ms: number) => {
                        setCurrentTimeMs(ms);
                    })}
                />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
                <TouchableOpacity
                    style={styles.progressTrack}
                    activeOpacity={0.8}
                    onPress={(e) => {
                        const x = e.nativeEvent.locationX;
                        const width = SCREEN_WIDTH - 64;
                        handleSeek(Math.max(0, Math.min(1, x / width)));
                    }}
                >
                    <View style={[styles.progressBg, { backgroundColor: currentTheme.inactiveText + '40' }]} />
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                backgroundColor: currentTheme.accent,
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                            }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.progressThumb,
                            {
                                backgroundColor: currentTheme.accent,
                                left: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, SCREEN_WIDTH - 64 - 12],
                                }),
                            }
                        ]}
                    />
                </TouchableOpacity>
                <View style={styles.timeRow}>
                    <Text style={[styles.timeText, { color: currentTheme.inactiveText }]}>
                        {formatTime(currentTimeMs)}
                    </Text>
                    <Text style={[styles.timeText, { color: currentTheme.inactiveText }]}>
                        {formatTime(totalDuration)}
                    </Text>
                </View>
            </View>

            {/* Playback Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    onPress={() => setCurrentTimeMs(Math.max(0, currentTimeMs - 10000))}
                    style={styles.controlButton}
                >
                    <Text style={[styles.controlIcon, { color: currentTheme.activeText }]}>⏪</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsPlaying(!isPlaying)}
                    style={[styles.playButton, { backgroundColor: currentTheme.accent }]}
                >
                    <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setCurrentTimeMs(Math.min(totalDuration, currentTimeMs + 10000))}
                    style={styles.controlButton}
                >
                    <Text style={[styles.controlIcon, { color: currentTheme.activeText }]}>⏩</Text>
                </TouchableOpacity>
            </View>

            {/* Options Row */}
            <View style={styles.optionsContainer}>
                {/* Sync Mode Selector */}
                <View style={styles.optionGroup}>
                    <Text style={[styles.optionLabel, { color: currentTheme.inactiveText }]}>Sync</Text>
                    <View style={styles.pillGroup}>
                        {(['LINE_SYNCED', 'RICH_SYNCED', 'UNSYNCED'] as SyncMode[]).map((mode) => (
                            <TouchableOpacity
                                key={mode}
                                onPress={() => {
                                    setSyncMode(mode);
                                    setCurrentTimeMs(0);
                                }}
                                style={[
                                    styles.pill,
                                    syncMode === mode && { backgroundColor: currentTheme.accent },
                                ]}
                            >
                                <Text style={[
                                    styles.pillText,
                                    { color: syncMode === mode ? '#fff' : currentTheme.inactiveText }
                                ]}>
                                    {mode === 'LINE_SYNCED' ? 'Line' : mode === 'RICH_SYNCED' ? 'Rich' : 'None'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Theme Selector */}
                <View style={styles.optionGroup}>
                    <Text style={[styles.optionLabel, { color: currentTheme.inactiveText }]}>Theme</Text>
                    <View style={styles.pillGroup}>
                        {(Object.keys(themes) as ThemeMode[]).map((t) => (
                            <TouchableOpacity
                                key={t}
                                onPress={() => setTheme(t)}
                                style={[
                                    styles.themeDot,
                                    { backgroundColor: themes[t].accent },
                                    theme === t && styles.themeDotActive,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Translation Toggle */}
                <TouchableOpacity
                    onPress={() => setShowTranslation(!showTranslation)}
                    style={[
                        styles.toggleButton,
                        showTranslation && { backgroundColor: currentTheme.accent + '30' },
                    ]}
                >
                    <Text style={[styles.toggleText, { color: currentTheme.accent }]}>
                        {showTranslation ? '译' : 'A'}
                    </Text>
                </TouchableOpacity>

                {/* Font Size */}
                <View style={styles.fontSizeGroup}>
                    <TouchableOpacity onPress={() => setFontSize(Math.max(16, fontSize - 2))}>
                        <Text style={[styles.fontButton, { color: currentTheme.inactiveText }]}>A-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFontSize(Math.min(32, fontSize + 2))}>
                        <Text style={[styles.fontButton, { color: currentTheme.activeText }]}>A+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#fff',
    },
    headerCenter: {
        alignItems: 'center',
        flex: 1,
    },
    nowPlaying: {
        fontSize: 10,
        letterSpacing: 2,
        color: '#888',
        marginBottom: 4,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    artistName: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    headerRight: {
        width: 44,
    },
    albumArt: {
        width: 80,
        height: 80,
        borderRadius: 12,
        alignSelf: 'center',
        marginVertical: 16,
        borderWidth: 2,
        overflow: 'hidden',
    },
    albumGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    musicNote: {
        fontSize: 32,
    },
    lyricsWrapper: {
        flex: 1,
        marginHorizontal: 24,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    lyrics: {
        flex: 1,
    },
    progressSection: {
        paddingHorizontal: 32,
        marginBottom: 8,
    },
    progressTrack: {
        height: 24,
        justifyContent: 'center',
    },
    progressBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 4,
        borderRadius: 2,
    },
    progressFill: {
        position: 'absolute',
        left: 0,
        height: 4,
        borderRadius: 2,
    },
    progressThumb: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        top: 6,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    timeText: {
        fontSize: 11,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        marginBottom: 20,
    },
    controlButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlIcon: {
        fontSize: 24,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        fontSize: 24,
        color: '#fff',
    },
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingBottom: 32,
        gap: 8,
    },
    optionGroup: {
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 9,
        marginBottom: 6,
        letterSpacing: 1,
    },
    pillGroup: {
        flexDirection: 'row',
        gap: 4,
    },
    pill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#333',
    },
    pillText: {
        fontSize: 11,
        fontWeight: '500',
    },
    themeDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 2,
    },
    themeDotActive: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    toggleButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
    },
    fontSizeGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    fontButton: {
        fontSize: 14,
        fontWeight: '600',
    },
});
