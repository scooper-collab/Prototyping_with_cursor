"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './styles.module.css';

// Audio context and oscillator management
let audioContext: AudioContext | null = null;
const activeOscillators = new Map();

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export default function TEPiano() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [attack, setAttack] = useState(0.1);
  const [release, setRelease] = useState(0.3);


  // Piano key frequencies (C4 to B5)
  const keyFrequencies = [
    261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, // C4-B4
    523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77  // C5-B5
  ];

  const keyLabels = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const presets = ['CLASSIC', 'WARM', 'BRIGHT', 'AMBIENT'];

  // Keyboard mapping: computer keyboard keys to piano key indices
  const keyboardMap: { [key: string]: number } = {
    // Bottom row (white keys)
    'a': 0,  // C4
    's': 2,  // D4  
    'd': 4,  // E4
    'f': 5,  // F4
    'g': 7,  // G4
    'h': 9,  // A4
    'j': 11, // B4
    'k': 12, // C5
    'l': 14, // D5
    ';': 16, // E5
    "'": 17, // F5
    'z': 18, // F#5
    'x': 19, // G5
    'c': 21, // A5
    'v': 23, // B5
    // Top row (black keys)
    'w': 1,  // C#4
    'e': 3,  // D#4
    't': 6,  // F#4
    'y': 8,  // G#4
    'u': 10, // A#4
    'o': 13, // C#5
    'p': 15, // D#5
    'i': 18, // F#5
    '[': 20, // G#5
    ']': 22, // A#5
  };

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const playNote = useCallback((frequency: number) => {
    const ctx = initAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = currentPreset === 0 ? 'sine' : 
                     currentPreset === 1 ? 'triangle' :
                     currentPreset === 2 ? 'sawtooth' : 'square';
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
    
    oscillator.start(ctx.currentTime);
    
    activeOscillators.set(frequency, { oscillator, gainNode });
  }, [volume, attack, currentPreset]);

  const stopNote = useCallback((frequency: number) => {
    const oscillatorData = activeOscillators.get(frequency);
    if (oscillatorData && audioContext) {
      const { oscillator, gainNode } = oscillatorData;
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + release);
      oscillator.stop(audioContext.currentTime + release);
      activeOscillators.delete(frequency);
    }
  }, [release]);

  const handleKeyDown = (frequency: number) => {
    if (!activeOscillators.has(frequency)) {
      playNote(frequency);
    }
  };

  const handleKeyUp = (frequency: number) => {
    stopNote(frequency);
  };

  // Computer keyboard event handlers
  const handleKeyboardDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // Prevent default behavior for our mapped keys
    if (keyboardMap.hasOwnProperty(key)) {
      event.preventDefault();
    }
    
    // Don't retrigger if key is already pressed
    if (pressedKeys.has(key)) return;
    
    const noteIndex = keyboardMap[key];
    if (noteIndex !== undefined && noteIndex < keyFrequencies.length) {
      const frequency = keyFrequencies[noteIndex];
      handleKeyDown(frequency);
      setPressedKeys(prev => new Set(prev).add(key));
    }
  }, [pressedKeys, keyFrequencies, handleKeyDown, keyboardMap]);

  const handleKeyboardUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // Prevent default behavior for our mapped keys
    if (keyboardMap.hasOwnProperty(key)) {
      event.preventDefault();
    }
    
    const noteIndex = keyboardMap[key];
    if (noteIndex !== undefined && noteIndex < keyFrequencies.length) {
      const frequency = keyFrequencies[noteIndex];
      handleKeyUp(frequency);
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  }, [keyFrequencies, handleKeyUp, keyboardMap]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardDown);
    window.addEventListener('keyup', handleKeyboardUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyboardDown);
      window.removeEventListener('keyup', handleKeyboardUp);
    };
  }, [handleKeyboardDown, handleKeyboardUp]);

  // Helper function to check if a key is currently pressed via keyboard
  const isKeyPressed = (frequency: number) => {
    const noteIndex = keyFrequencies.indexOf(frequency);
    if (noteIndex === -1) return false;
    
    // Find the keyboard key that maps to this note
    for (const [key, index] of Object.entries(keyboardMap)) {
      if (index === noteIndex && pressedKeys.has(key)) {
        return true;
      }
    }
    return false;
  };



  return (
    <div className={styles.container}>
      <div className={styles.teDevice}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.logo}>TE-1</div>
          <div className={styles.statusIndicators}>
            <div className={`${styles.indicator} ${isPlaying ? styles.active : ''}`}></div>
            <div className={styles.indicator}></div>
            <div className={styles.indicator}></div>
          </div>
        </div>

        {/* Display and Controls Section */}
        <div className={styles.controlSection}>
          <div className={styles.displayArea}>
            <div className={styles.mainDisplay}>
              <div className={styles.displayText}>
                <span className={styles.presetName}>{presets[currentPreset]}</span>
                <span className={styles.paramValue}>VOL {Math.round(volume * 100)}</span>
              </div>
            </div>
            <div className={styles.miniDisplays}>
              <div className={styles.miniDisplay}>ATK</div>
              <div className={styles.miniDisplay}>REL</div>
            </div>
          </div>

          {/* Control Knobs */}
          <div className={styles.knobSection}>
            <div className={styles.knobGroup}>
              <div className={styles.knob} onClick={() => setCurrentPreset((prev) => (prev + 1) % 4)}>
                <div className={styles.knobIndicator} style={{ transform: `rotate(${currentPreset * 90}deg)` }}></div>
              </div>
              <span className={styles.knobLabel}>PRESET</span>
            </div>
            <div className={styles.knobGroup}>
              <div className={styles.knob}>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className={styles.knobSlider}
                />
                <div className={styles.knobIndicator} style={{ transform: `rotate(${volume * 270 - 135}deg)` }}></div>
              </div>
              <span className={styles.knobLabel}>VOLUME</span>
            </div>
            <div className={styles.knobGroup}>
              <div className={styles.knob}>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.5" 
                  step="0.01" 
                  value={attack}
                  onChange={(e) => setAttack(parseFloat(e.target.value))}
                  className={styles.knobSlider}
                />
                <div className={styles.knobIndicator} style={{ transform: `rotate(${(attack / 0.5) * 270 - 135}deg)` }}></div>
              </div>
              <span className={styles.knobLabel}>ATTACK</span>
            </div>
            <div className={styles.knobGroup}>
              <div className={styles.knob}>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2" 
                  step="0.1" 
                  value={release}
                  onChange={(e) => setRelease(parseFloat(e.target.value))}
                  className={styles.knobSlider}
                />
                <div className={styles.knobIndicator} style={{ transform: `rotate(${(release / 2) * 270 - 135}deg)` }}></div>
              </div>
              <span className={styles.knobLabel}>RELEASE</span>
            </div>
          </div>
        </div>





        {/* Keyboard Instructions */}
        <div className={styles.instructions}>
          <span className={styles.instructionText}>
            Use your computer keyboard or click the keys to play • White keys: A S D F G H J K L ; ' Z X C V • Black keys: W E T Y U O P I [ ]
          </span>
        </div>

        {/* Piano Keys */}
        <div className={styles.keyboard}>
          {/* White Keys */}
          <div className={styles.whiteKeysContainer}>
            {keyFrequencies.map((frequency, index) => {
              const isBlackKey = keyLabels[index].includes('#');
              if (isBlackKey) return null; // Skip black keys in this pass
              
              const isPressed = isKeyPressed(frequency);
              const computerKey = Object.entries(keyboardMap).find(([_, noteIndex]) => noteIndex === index)?.[0];
              
              return (
                <button
                  key={frequency}
                  className={`${styles.key} ${styles.whiteKey} ${isPressed ? styles.pressed : ''}`}
                  onMouseDown={() => handleKeyDown(frequency)}
                  onMouseUp={() => handleKeyUp(frequency)}
                  onMouseLeave={() => handleKeyUp(frequency)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleKeyDown(frequency);
                  }}
                  onTouchEnd={() => handleKeyUp(frequency)}
                >
                  <span className={styles.keyLabel}>{keyLabels[index]}</span>
                  {computerKey && (
                    <span className={styles.computerKey}>{computerKey.toUpperCase()}</span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Black Keys */}
          <div className={styles.blackKeysContainer}>
            {(() => {
              // Map black keys to their positions between white keys
              // In our 24-key layout: C4-B5 (2 octaves)
              // White key indices: 0=C, 1=D, 2=E, 3=F, 4=G, 5=A, 6=B, 7=C, 8=D, 9=E, 10=F, 11=G, 12=A, 13=B
              const blackKeyMappings = [
                { noteIndex: 1, betweenWhiteKeys: [0, 1], label: 'C#' }, // C#4 between C4-D4
                { noteIndex: 3, betweenWhiteKeys: [1, 2], label: 'D#' }, // D#4 between D4-E4
                { noteIndex: 6, betweenWhiteKeys: [3, 4], label: 'F#' }, // F#4 between F4-G4
                { noteIndex: 8, betweenWhiteKeys: [4, 5], label: 'G#' }, // G#4 between G4-A4
                { noteIndex: 10, betweenWhiteKeys: [5, 6], label: 'A#' }, // A#4 between A4-B4
                { noteIndex: 13, betweenWhiteKeys: [7, 8], label: 'C#' }, // C#5 between C5-D5
                { noteIndex: 15, betweenWhiteKeys: [8, 9], label: 'D#' }, // D#5 between D5-E5
                { noteIndex: 18, betweenWhiteKeys: [10, 11], label: 'F#' }, // F#5 between F5-G5
                { noteIndex: 20, betweenWhiteKeys: [11, 12], label: 'G#' }, // G#5 between G5-A5
                { noteIndex: 22, betweenWhiteKeys: [12, 13], label: 'A#' }, // A#5 between A5-B5
              ];

              return blackKeyMappings.map(({ noteIndex, betweenWhiteKeys, label }) => {
                const frequency = keyFrequencies[noteIndex];
                const isPressed = isKeyPressed(frequency);
                const computerKey = Object.entries(keyboardMap).find(([_, mappedIndex]) => mappedIndex === noteIndex)?.[0];
                
                // Position between the two white keys (as percentage)
                const leftWhiteKey = betweenWhiteKeys[0];
                const rightWhiteKey = betweenWhiteKeys[1];
                const position = ((leftWhiteKey + rightWhiteKey) / 2) / 14 * 100; // 14 total white keys
                
                return (
                  <button
                    key={frequency}
                    className={`${styles.key} ${styles.blackKey} ${isPressed ? styles.pressed : ''}`}
                    style={{ left: `${position}%` }}
                    onMouseDown={() => handleKeyDown(frequency)}
                    onMouseUp={() => handleKeyUp(frequency)}
                    onMouseLeave={() => handleKeyUp(frequency)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleKeyDown(frequency);
                    }}
                    onTouchEnd={() => handleKeyUp(frequency)}
                  >
                    <span className={styles.keyLabel}>{label}</span>
                    {computerKey && (
                      <span className={styles.computerKey}>{computerKey.toUpperCase()}</span>
                    )}
                  </button>
                );
              });
            })()}
          </div>
        </div>

        {/* Transport Controls */}
        <div className={styles.transportControls}>
          <button className={styles.transportBtn}>◀◀</button>
          <button className={styles.transportBtn}>◀</button>
          <button className={`${styles.transportBtn} ${styles.playBtn}`}>▶</button>
          <button className={styles.transportBtn}>▶▶</button>
          <button className={styles.transportBtn}>■</button>
        </div>
      </div>
    </div>
  );
} 