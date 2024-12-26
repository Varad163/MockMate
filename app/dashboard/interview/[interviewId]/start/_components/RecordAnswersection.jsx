import Webcam from 'react-webcam';
import { WebcamIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';

function RecordAnswerSection() {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });
  
  return (
    <div>
      <div className="grid place-items-center mx-auto my-10 bg-secondary rounded-lg h-auto p-0 relative">
        <div className="relative w-96 h-48">
          <WebcamIcon width={400} height={300} className="absolute inset-0 text-gray-400" />
          <Webcam
            mirrored={true}
            style={{
              position: 'absolute',
              
            }}
          />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Button className="mt-20 mx-auto">Record Answer</Button>
        
      </div>
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

export default RecordAnswerSection;
