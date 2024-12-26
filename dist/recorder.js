import React from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

export default function Recorder() {
    // Check browser compatibility
    const isCompatible =
        typeof window !== 'undefined' &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);

    const {
        error,
        interimResult, // Make sure this is destructured
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        crossBrowser: true,
        googleApiKey: "AIzaSyCFk8LyPHRH53PgJgPkfT7nCnUpEFLT9cg", // Ensure you have the correct API key
        useLegacyResults: true,
    });

    // Enhanced error rendering

    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

    return (
        <div>
            <h1>Recording: {isRecording.toString()}</h1>
            <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <ul>
                {results.map((result) => (
                    <li key={result.timestamp}>{result.transcript}</li>
                ))}
                {interimResult && <li>{interimResult}</li>}
            </ul>
        </div>
    );
}