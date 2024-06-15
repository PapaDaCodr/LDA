import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Tts from 'react-native-tts';
import Slider from '@react-native-community/slider';

interface TextReaderProps {
  // No props defined for now
}

const TextReader: React.FC<TextReaderProps> = () => {
  const [text, setText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(16);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const speakText = async () => {
    if (isPlaying) {
      return;
    }
  
    const trimmedText = text.trim();
    if (trimmedText === '') {
      setErrorMessage('Please enter some text to read.');
      return;
    }
  
    setErrorMessage('');
    setIsPlaying(true);
  
    try {
      Tts.stop();
      Tts.setDefaultRate(speechRate);
      await Tts.speak(trimmedText);
  
      Tts.addEventListener('tts-finish', () => {
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.textInput, { fontSize }]}
        multiline
        value={text}
        onChangeText={setText}
        placeholder="Enter text to read"
      />
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <View style={styles.controls}>
        <Slider
          style={styles.slider}
          minimumValue={8}
          maximumValue={24}
          value={fontSize}
          onValueChange={setFontSize}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
        />
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2.0}
          value={speechRate}
          onValueChange={setSpeechRate}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
        />
        <Text style={styles.label}>Speech Rate</Text>
      </View>
      <TouchableOpacity onPress={speakText} style={styles.playButton}>
        <Text style={styles.playButtonText}>{isPlaying ? 'Stop' : 'Play'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  textInput: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    marginHorizontal: 8,
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default TextReader;