package com.m3

import android.view.View
import android.view.ViewGroup
import androidx.compose.animation.Crossfade
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.animateScrollBy
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.facebook.react.uimanager.ThemedReactContext
import com.margelo.nitro.m3.HybridLyricsViewViewSpec
import com.margelo.nitro.m3.LyricLine
import com.margelo.nitro.m3.LyricsSyncType
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

class HybridLyricsView(val context: ThemedReactContext) : HybridLyricsViewViewSpec() {
    
    // State variables for reactive updates
    private var linesState by mutableStateOf<Array<LyricLine>>(emptyArray())
    private var syncTypeState by mutableStateOf(LyricsSyncType.UNSYNCED)
    private var currentTimeMsState by mutableLongStateOf(0L)
    private var translatedLinesState by mutableStateOf<Array<LyricLine>?>(null)
    private var activeTextColorState by mutableStateOf(Color.White)
    private var inactiveTextColorState by mutableStateOf(Color(0xFF595959))
    private var translationColorState by mutableStateOf(Color.Yellow)
    private var fontSizeState by mutableStateOf(24f)
    private var showScrollShadowsState by mutableStateOf(true)
    private var backgroundColorState by mutableStateOf(Color(0xFF242424))
    
    // Props implementation
    override var lines: Array<LyricLine>
        get() = linesState
        set(value) { linesState = value }
    
    override var syncType: LyricsSyncType
        get() = syncTypeState
        set(value) { syncTypeState = value }
    
    override var currentTimeMs: Double
        get() = currentTimeMsState.toDouble()
        set(value) { currentTimeMsState = value.toLong() }
    
    override var translatedLines: Array<LyricLine>?
        get() = translatedLinesState
        set(value) { translatedLinesState = value }
    
    override var activeTextColor: String?
        get() = null
        set(value) { value?.let { activeTextColorState = parseHexColor(it) } }
    
    override var inactiveTextColor: String?
        get() = null
        set(value) { value?.let { inactiveTextColorState = parseHexColor(it) } }
    
    override var translationColor: String?
        get() = null
        set(value) { value?.let { translationColorState = parseHexColor(it) } }
    
    override var fontSize: Double?
        get() = fontSizeState.toDouble()
        set(value) { value?.let { fontSizeState = it.toFloat() } }
    
    override var showScrollShadows: Boolean?
        get() = showScrollShadowsState
        set(value) { value?.let { showScrollShadowsState = it } }
    
    override var backgroundColor: String?
        get() = null
        set(value) { value?.let { backgroundColorState = parseHexColor(it) } }
    
    override var onLineClick: ((startTimeMs: Double) -> Unit)? = null
    
    override fun scrollToLine(index: Double) {
        // Targeted line index handled via state updates if needed, 
        // but primarily driven by currentTimeMs
    }
    
    override val view: View by lazy {
        ComposeView(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setContent {
                LyricsViewContent(
                    lines = linesState,
                    syncType = syncTypeState,
                    currentTimeMs = currentTimeMsState,
                    translatedLines = translatedLinesState,
                    activeTextColor = activeTextColorState,
                    inactiveTextColor = inactiveTextColorState,
                    translationColor = translationColorState,
                    fontSize = fontSizeState,
                    showScrollShadows = showScrollShadowsState,
                    backgroundColor = backgroundColorState,
                    onLineClick = { startTimeMs -> onLineClick?.invoke(startTimeMs) }
                )
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

// Data class for parsed rich sync words
data class WordTiming(
    val text: String,
    val startTimeMs: Long,
    val endTimeMs: Long
)

data class ParsedRichSyncLine(
    val words: List<WordTiming>
)

// Parse rich sync format: "word<startMs,endMs> word<startMs,endMs>"
fun parseRichSyncWords(wordsString: String, lineStartMs: String, lineEndMs: String?): ParsedRichSyncLine? {
    return try {
        val regex = Regex("""(\S+?)<(\d+),(\d+)>""")
        val matches = regex.findAll(wordsString)
        val wordTimings = matches.map { match ->
            WordTiming(
                text = match.groupValues[1],
                startTimeMs = match.groupValues[2].toLong(),
                endTimeMs = match.groupValues[3].toLong()
            )
        }.toList()
        
        if (wordTimings.isEmpty()) {
            // Fallback: treat as plain text
            val plainWords = wordsString.split(" ").filter { it.isNotBlank() }
            val lineStart = lineStartMs.toLongOrNull() ?: 0L
            val lineEnd = lineEndMs?.toLongOrNull() ?: (lineStart + 5000L)
            val duration = lineEnd - lineStart
            val wordDuration = if (plainWords.isNotEmpty()) duration / plainWords.size else duration
            
            ParsedRichSyncLine(
                words = plainWords.mapIndexed { index, word ->
                    WordTiming(
                        text = word,
                        startTimeMs = lineStart + (index * wordDuration),
                        endTimeMs = lineStart + ((index + 1) * wordDuration)
                    )
                }
            )
        } else {
            ParsedRichSyncLine(words = wordTimings)
        }
    } catch (e: Exception) {
        null
    }
}

// Extension for smooth auto-scroll to center
fun LazyListState.animateScrollAndCentralizeItem(
    index: Int,
    scope: CoroutineScope,
) {
    val itemInfo = this.layoutInfo.visibleItemsInfo.firstOrNull { it.index == index }
    scope.launch {
        if (itemInfo != null) {
            val center = this@animateScrollAndCentralizeItem.layoutInfo.viewportEndOffset / 2
            val childCenter = itemInfo.offset + itemInfo.size / 2
            this@animateScrollAndCentralizeItem.animateScrollBy((childCenter - center).toFloat(), tween(300))
        } else {
            this@animateScrollAndCentralizeItem.animateScrollToItem(index)
        }
    }
}

@Composable
fun LyricsViewContent(
    lines: Array<LyricLine>,
    syncType: LyricsSyncType,
    currentTimeMs: Long,
    translatedLines: Array<LyricLine>?,
    activeTextColor: Color,
    inactiveTextColor: Color,
    translationColor: Color,
    fontSize: Float,
    showScrollShadows: Boolean,
    backgroundColor: Color,
    onLineClick: (Double) -> Unit
) {
    var currentLineHeight by remember { mutableIntStateOf(0) }
    val listState = rememberLazyListState()
    var currentLineIndex by rememberSaveable { mutableIntStateOf(-1) }
    val scope = rememberCoroutineScope()
    
    val showTopShadow by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex > 0 || listState.firstVisibleItemScrollOffset > 0
        }
    }
    val showBottomShadow by remember {
        derivedStateOf {
            val layoutInfo = listState.layoutInfo
            val lastVisibleItem = layoutInfo.visibleItemsInfo.lastOrNull()
            lastVisibleItem != null && (
                lastVisibleItem.index < layoutInfo.totalItemsCount - 1 ||
                lastVisibleItem.offset + lastVisibleItem.size > layoutInfo.viewportEndOffset
            )
        }
    }
    
    // Find current line based on time
    LaunchedEffect(key1 = currentTimeMs) {
        if (currentTimeMs > 0L && lines.isNotEmpty()) {
            lines.indices.forEach { i ->
                val startTimeMs = lines[i].startTimeMs.toLong()
                val endTimeMs = if (i < lines.size - 1) {
                    lines[i + 1].startTimeMs.toLong()
                } else {
                    startTimeMs + 60000
                }
                if (currentTimeMs in startTimeMs..endTimeMs) {
                    currentLineIndex = i
                }
            }
            if (currentTimeMs < (lines.getOrNull(0)?.startTimeMs?.toLong() ?: 0L)) {
                currentLineIndex = -1
            }
        } else {
            currentLineIndex = -1
        }
    }
    
    // Auto-scroll to current line with centralization
    LaunchedEffect(key1 = currentLineIndex, key2 = currentLineHeight) {
        if (currentLineIndex > -1 && currentLineHeight > 0 &&
            (syncType == LyricsSyncType.LINE_SYNCED || syncType == LyricsSyncType.RICH_SYNCED)) {
            listState.animateScrollAndCentralizeItem(currentLineIndex, scope)
        }
    }
    
    // Find matching translated line
    fun findTranslatedLine(originalTime: Long): String? {
        return translatedLines?.minByOrNull { 
            kotlin.math.abs(it.startTimeMs.toLong() - originalTime) 
        }?.let {
            if (kotlin.math.abs(it.startTimeMs.toLong() - originalTime) < 1000L) it.words else null
        }
    }
    
    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            state = listState,
            modifier = Modifier
                .fillMaxSize()
                .drawWithContent {
                    drawContent()
                    
                    if (showScrollShadows) {
                        if (showTopShadow) {
                            drawRect(
                                brush = Brush.verticalGradient(
                                    colors = listOf(
                                        backgroundColor,
                                        backgroundColor.copy(alpha = 0.8f),
                                        backgroundColor.copy(alpha = 0.4f),
                                        Color.Transparent
                                    ),
                                    startY = 0f,
                                    endY = 80.dp.toPx()
                                ),
                                topLeft = Offset(0f, 0f),
                                size = Size(size.width, 80.dp.toPx())
                            )
                        }
                        if (showBottomShadow) {
                            drawRect(
                                brush = Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        backgroundColor.copy(alpha = 0.4f),
                                        backgroundColor.copy(alpha = 0.8f),
                                        backgroundColor
                                    ),
                                    startY = size.height - 80.dp.toPx(),
                                    endY = size.height
                                ),
                                topLeft = Offset(0f, size.height - 80.dp.toPx()),
                                size = Size(size.width, 80.dp.toPx())
                            )
                        }
                    }
                }
        ) {
            items(lines.size) { index ->
                val line = lines[index]
                val isCurrent = index == currentLineIndex
                val translatedWords = when (syncType) {
                    LyricsSyncType.LINE_SYNCED, LyricsSyncType.RICH_SYNCED -> 
                        findTranslatedLine(line.startTimeMs.toLong())
                    else -> translatedLines?.getOrNull(index)?.words
                }
                
                val itemModifier = Modifier
                    .clickable { onLineClick(line.startTimeMs) }
                    .onGloballyPositioned { coordinates ->
                        if (isCurrent) {
                            currentLineHeight = coordinates.size.height
                        }
                    }

                when (syncType) {
                    LyricsSyncType.RICH_SYNCED -> {
                        val parsedLine = remember(line.words, line.startTimeMs, line.endTimeMs) {
                            parseRichSyncWords(
                                line.words, 
                                line.startTimeMs.toLong().toString(), 
                                line.endTimeMs?.toLong()?.toString()
                            )
                        }
                        
                        if (parsedLine != null) {
                            RichSyncLyricsLineItem(
                                parsedLine = parsedLine,
                                translatedWords = translatedWords,
                                currentTimeMs = currentTimeMs,
                                isCurrent = isCurrent,
                                activeTextColor = activeTextColor,
                                inactiveTextColor = inactiveTextColor,
                                translationColor = translationColor,
                                fontSize = fontSize,
                                modifier = itemModifier
                            )
                        } else {
                            LyricsLineItem(
                                originalWords = line.words,
                                translatedWords = translatedWords,
                                isBold = index <= currentLineIndex,
                                isCurrent = isCurrent,
                                activeTextColor = activeTextColor,
                                inactiveTextColor = inactiveTextColor,
                                translationColor = translationColor,
                                fontSize = fontSize,
                                modifier = itemModifier
                            )
                        }
                    }
                    LyricsSyncType.LINE_SYNCED -> {
                        LyricsLineItem(
                            originalWords = line.words,
                            translatedWords = translatedWords,
                            isBold = index <= currentLineIndex,
                            isCurrent = isCurrent,
                            activeTextColor = activeTextColor,
                            inactiveTextColor = inactiveTextColor,
                            translationColor = translationColor,
                            fontSize = fontSize,
                            modifier = itemModifier
                        )
                    }
                    LyricsSyncType.UNSYNCED -> {
                        LyricsLineItem(
                            originalWords = line.words,
                            translatedWords = translatedWords,
                            isBold = true,
                            isCurrent = true,
                            activeTextColor = activeTextColor,
                            inactiveTextColor = inactiveTextColor,
                            translationColor = translationColor,
                            fontSize = fontSize,
                            modifier = Modifier // Unsynced doesn't need click/centering typically
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun LyricsLineItem(
    originalWords: String,
    translatedWords: String?,
    isBold: Boolean,
    isCurrent: Boolean,
    activeTextColor: Color,
    inactiveTextColor: Color,
    translationColor: Color,
    fontSize: Float,
    modifier: Modifier = Modifier
) {
    Crossfade(targetState = isBold, label = "lyrics_crossfade") { bold ->
        Column(modifier = modifier) {
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                modifier = if (isCurrent) Modifier else Modifier.blur(1.dp),
                text = originalWords,
                style = TextStyle(fontSize = fontSize.sp),
                color = if (bold && isCurrent) activeTextColor else inactiveTextColor.copy(alpha = 0.35f)
            )
            if (translatedWords != null) {
                Text(
                    modifier = if (isCurrent) Modifier else Modifier.blur(1.dp),
                    text = translatedWords,
                    style = TextStyle(fontSize = (fontSize * 0.6f).sp),
                    color = if (isCurrent) translationColor else translationColor.copy(alpha = 0.3f)
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun RichSyncLyricsLineItem(
    parsedLine: ParsedRichSyncLine,
    translatedWords: String?,
    currentTimeMs: Long,
    isCurrent: Boolean,
    activeTextColor: Color,
    inactiveTextColor: Color,
    translationColor: Color,
    fontSize: Float,
    modifier: Modifier = Modifier
) {
    val currentWordIndex by remember(currentTimeMs, parsedLine.words) {
        derivedStateOf {
            if (!isCurrent) return@derivedStateOf -1
            parsedLine.words.indexOfLast { it.startTimeMs <= currentTimeMs }
        }
    }
    
    Column(modifier = modifier) {
        Spacer(modifier = Modifier.height(12.dp))
        
        FlowRow(
            modifier = if (isCurrent) Modifier else Modifier.blur(1.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalArrangement = Arrangement.Center
        ) {
            parsedLine.words.forEachIndexed { index, wordTiming ->
                AnimatedWord(
                    word = wordTiming.text,
                    isActive = isCurrent && index == currentWordIndex,
                    isPast = isCurrent && index < currentWordIndex,
                    isCurrent = isCurrent,
                    activeTextColor = activeTextColor,
                    inactiveTextColor = inactiveTextColor,
                    fontSize = fontSize
                )
            }
        }
        
        if (translatedWords != null) {
            Text(
                modifier = if (isCurrent) Modifier else Modifier.blur(1.dp),
                text = translatedWords,
                style = TextStyle(fontSize = (fontSize * 0.6f).sp),
                color = if (isCurrent) translationColor else translationColor.copy(alpha = 0.3f)
            )
        }
        
        Spacer(modifier = Modifier.height(12.dp))
    }
}

@Composable
private fun AnimatedWord(
    word: String,
    isActive: Boolean,
    isPast: Boolean,
    isCurrent: Boolean,
    activeTextColor: Color,
    inactiveTextColor: Color,
    fontSize: Float
) {
    val color by animateColorAsState(
        targetValue = when {
            !isCurrent -> inactiveTextColor.copy(alpha = 0.35f)
            isPast -> activeTextColor.copy(alpha = 0.7f)
            isActive -> activeTextColor
            else -> inactiveTextColor.copy(alpha = 0.5f)
        },
        animationSpec = tween(durationMillis = 200, easing = FastOutSlowInEasing),
        label = "wordColor"
    )
    
    Text(
        text = word,
        style = TextStyle(fontSize = fontSize.sp),
        color = color
    )
}