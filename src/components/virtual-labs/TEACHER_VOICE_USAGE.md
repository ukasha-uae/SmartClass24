# TeacherVoice Component - Phase 1 Enhancement Guide

## 🎨 Visual Enhancements Implemented

### New Features
1. **Animated SVG Teacher Avatar** - Realistic teacher with blinking eyes, mouth movements, and professional attire
2. **Glass Morphism Design** - Modern frosted glass effect with backdrop blur
3. **Lip-Sync Animation** - Mouth opens and closes naturally when speaking
4. **Theme-Based Colors** - Different gradients for different subjects
5. **Enhanced Controls** - Added "Repeat" button for replaying messages
6. **Sound Wave Indicators** - Visual feedback when teacher is speaking
7. **Sparkle Effects** - Attention-grabbing animations when idle
8. **Improved Typography** - Better readability and spacing

## 📝 Usage Examples

### Basic Usage (Default Theme)
```tsx
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';

<TeacherVoice 
  message="Welcome to the experiment! Let's get started." 
/>
```

### Science Lessons (Blue Theme)
```tsx
<TeacherVoice 
  message="Today we'll explore the properties of oxygen gas."
  theme="science"
  teacherName="Dr. Science"
/>
```

### Accounting Lessons (Green Theme)
```tsx
<TeacherVoice 
  message="Let's learn how to record cash transactions properly."
  theme="accounting"
  teacherName="Ms. Accountant"
/>
```

### Mathematics Lessons (Purple Theme)
```tsx
<TeacherVoice 
  message="Today we'll solve quadratic equations together."
  theme="math"
  teacherName="Prof. Math"
/>
```

### Virtual Lab Usage
```tsx
const [teacherMessage, setTeacherMessage] = useState('');

// Update message based on lab progress
useEffect(() => {
  if (labState === 'setup') {
    setTeacherMessage('First, put on your safety goggles and gloves. Then, gather all the chemicals you need for the experiment. Make sure your workspace is clean and organized.');
  } else if (labState === 'experiment') {
    setTeacherMessage('Now carefully pour the solution into the beaker. Watch the color change as the reaction occurs. Note the temperature change in your observations.');
  }
}, [labState]);

return (
  <TeacherVoice 
    message={teacherMessage}
    theme="science"
    teacherName="Lab Instructor"
    progressiveReveal={true}  // Shows 2 sentences at a time
    linesPerChunk={2}
    onComplete={() => {
      // Handle when speech completes
      console.log('Teacher finished speaking');
    }}
  />
);
```

### Disable Progressive Reveal (Show All Text)
```tsx
<TeacherVoice 
  message="Short message that doesn't need chunking."
  theme="science"
  progressiveReveal={false}  // Shows all text at once
/>
```

## 🎯 Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | *required* | The text the teacher will speak |
| `autoPlay` | `boolean` | `true` | Auto-play speech when message changes |
| `onComplete` | `() => void` | `undefined` | Callback when speech finishes |
| `theme` | `'science' \| 'accounting' \| 'math' \| 'default'` | `'default'` | Color theme for the teacher UI |
| `teacherName` | `string` | `'Teacher'` | Display name for the teacher |
| `progressiveReveal` | `boolean` | `true` | Show text progressively as teacher speaks |
| `linesPerChunk` | `number` | `2` | Number of sentences to show at once |

## 🎨 Theme Colors

### Science Theme (Blue)
- Primary: `#3B82F6` (Blue 500)
- Perfect for: Physics, Chemistry, Biology lessons

### Accounting Theme (Green)
- Primary: `#10B981` (Emerald 500)
- Perfect for: Financial Accounting, Business Studies

### Math Theme (Purple)
- Primary: `#8B5CF6` (Violet 500)
- Perfect for: Mathematics, Statistics lessons

### Default Theme (Purple-Indigo)
- Primary: `#A855F7` (Purple 500)
- Perfect for: General lessons, mixed content
Semi-Transparent Background
- 70% opacity allows students to see content behind
- Maintains readability with gradient overlay
- Perfect for virtual labs and complex lessons

### 4. Progressive Text Reveal ⭐ NEW
- Shows 2 sentences at a time by default
- Automatically advances as teacher narrates
- Smooth fade transitions between chunks
- Progress indicator dots show position in message
- Keeps students focused on current narration

### 5. Audio Controls
- **Volume button**: Mute/unmute teacher voice
- **Repeat button**: Replay from the beginning
- **Minimize button**: Collapse to bubble

### 6ition persists during drag session

### 2. Minimizable
- Click minimize button to collapse to floating bubble
- Click bubble to expand back to full view

### 3. Audio Controls
- **Volume button**: Mute/unmute teacher voice
- **Repeat button**: Replay the current message
- **Minimize button**: Collapse to bubble

### 4. Visual Feedback
- Sound waves appear when speaking
- Avatar mouth moves with speech
- Eyes blink periodically
- Sparkle effects when idle

## 🚀 Migration Guide

**Existing code will work without changes!** The new props are optional.

### Before (still works)
```tsx
<TeacherVoice message="Hello students!" />
```

### After (enhanced)
```tsx
<TeacherVoice 
  message="Hello students!"
  theme="science"
  teacherName="Dr. Smith"
/>
```

## 🎓 Best Practices

1. **Match theme to subject**: Use appropriate theme colors for better context
2. **Keep messages concise**: 1-3 sentences work best for audio
3. **Use teacherName**: Personalize with subject-specific names
4. **Test on mobile**: Audio prompt requires user interaction on mobile devices
5. **Provide context**: Mention what students should focus on

## 🔧 Technical Details

### Avatar Animation States
- **Idle**: Gentle breathing animation, eyes blink every 3-4 seconds
- **Speaking**: Mouth opens/closes, sound waves emit, eyes blink occasionally
- **Minimized**: Pulsing animation, sound wave indicators

### Performance
- Lightweight SVG avatar (< 5KB)
- Smooth 60fps animations using Framer Motion
- Debounced speech synthesis for mobile optimization
- No external dependencies beyond existing packages

### Browser Compatibility
- Works in all modern browsers
- Falls back gracefully if Speech Synthesis API not available
- Touch-friendly on mobile devices

## 📱 Mobile Considerations

- First-time users see onboarding modal (explains features)
- Audio requires user interaction (browser security)
- Dragging works with touch gestures
- Minimized state is optimized for small screens

## 🐛 Troubleshooting

**Audio not playing?**
- Ensure user has interacted with page (click/tap)
- Check if mute button is active
- Verify Speech Synthesis API is supported

**Avatar not animating?**
- Check browser console for errors
- Ensure Framer Motion is properly installed
- Try clearing cache and reloading

**Theme not changing?**
- Verify theme prop value matches allowed types
- Check Tailwind CSS configuration includes all color classes
- Ensure gradient classes are not purged in production

