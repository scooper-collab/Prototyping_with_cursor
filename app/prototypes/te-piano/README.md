# TE Digital Piano

A digital piano prototype inspired by the minimalist industrial design aesthetic of Teenage Engineering's OP-1 synthesizer.

## Features

🎹 **Interactive Piano Keyboard**
- 24 keys spanning 2 octaves (C4 to B5)
- Real-time audio synthesis using Web Audio API
- Touch and mouse support

🎛️ **Teenage Engineering-Inspired Interface**
- Clean, minimalist design with muted color palette
- Circular control knobs with visual indicators
- Digital display showing current preset and parameters
- Streamlined interface focused on essential controls

🎵 **Sound Synthesis**
- 4 preset waveforms: Classic (sine), Warm (triangle), Bright (sawtooth), Ambient (square)
- Attack and Release envelope controls
- Volume control
- Real-time parameter visualization

🎨 **Visual Design Elements**
- Status indicators with orange accent colors
- Retro-modern LCD-style display
- Gradient backgrounds and subtle shadows
- Responsive design for mobile and desktop

## How to Use

1. **Play Notes**: Click or tap the piano keys to play notes, or use your computer keyboard
2. **Change Presets**: Click the PRESET knob to cycle through different sound types
3. **Adjust Parameters**: 
   - Volume: Controls overall output level
   - Attack: How quickly notes reach full volume
   - Release: How long notes take to fade out
4. **Visual Feedback**: The display shows current preset and volume level
5. **Computer Keyboard**: Use ASDF... keys for white keys and WETY... keys for black keys

## Technical Details

### Audio Implementation
- Uses Web Audio API for real-time synthesis
- Oscillator-based sound generation
- Gain envelope shaping for natural-sounding notes
- Polyphonic playback (multiple notes simultaneously)

### Browser Compatibility
- Modern browsers with Web Audio API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported

### Key Features
- No external audio libraries required
- Pure JavaScript/React implementation
- CSS Grid and Flexbox for responsive layout
- Optimized for both desktop and mobile interactions

## Design Inspiration

This prototype draws inspiration from Teenage Engineering's iconic OP-1 portable synthesizer, known for:
- Minimalist, geometric design language
- High-contrast displays with retro typography
- Tactile knobs and buttons with clear visual hierarchy
- Muted color palette with strategic accent colors
- Industrial design that balances form and function

## Development Notes

- Built with Next.js and React
- CSS Modules for component-scoped styling
- TypeScript for type safety
- Follows the project's prototype structure guidelines
- Beginner-friendly with clear code comments

## Future Enhancements

Potential improvements could include:
- Recording and playback functionality
- Additional waveform types and filters
- MIDI input support
- Preset saving and loading
- Effects processing (reverb, delay, chorus)
- Polyphonic aftertouch support
