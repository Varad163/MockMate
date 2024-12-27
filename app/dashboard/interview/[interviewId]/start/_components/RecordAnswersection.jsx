import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam';
import { WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chatSession } from '@/utils/GeminiAIModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { uuid } from 'drizzle-orm/pg-core';
import { db } from '@/utils/db';
import moment from 'moment';

function RecordAnswerSection(mockInterviewQuestion, activeQuestionIndex, interviewData) {
  const [micPermission, setMicPermission] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answer, setAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    isRecording,
    interimResult,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    googleApiKey: process.env.YOUR_GOOGLE_API_KEY, // Replace with your API key
    useLegacyResults: false,
  });

  useEffect(() => {
    const checkMicPermissions = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        setMicPermission(permissionStatus.state === 'granted');
        permissionStatus.onchange = () => {
          setMicPermission(permissionStatus.state === 'granted');
        };
      } catch {
        console.warn('Microphone permissions could not be checked.');
      }
    };

    checkMicPermissions();
  }, []);

  const renderError = () => {
    if (error) {
      switch (error) {
        case 'microphone-permission-denied':
          return <p>Microphone access was denied. Please allow microphone permissions.</p>;
        case 'browser-not-supported':
          return <p>Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge.</p>;
        default:
          return <p>There was an error: {error}</p>;
      }
    }
    return null;
  };

  const SaveUserAnswer = async () => {
    setLoading(true);

    try {
      if (!answer || answer.length < 10) {
        throw new Error('Answer is too short. Please provide a valid answer.');
      }

      const feedbackPrompt =
        `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, ` +
        `UserAnswer: ${answer}. Please provide a rating and feedback in JSON format in 3 to 5 line. `;
      const result = await chatSession.sendMessage(feedbackPrompt);

      const jsonResponse = JSON.parse(
        result.response.text().replace('```json', '').replace('```', '')

      );
      console.log(jsonResponse);
      const dbResponse = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: answer,
        feedback: jsonResponse?.feedback,
        rating: jsonResponse?.rating,
        userEmail: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format('YYYY-MM-DD'),
      });

      console.log('Saved to DB:', dbResponse);
      alert('Answer saved successfully!');
    } catch (error) {
      console.error('Error saving answer:', error);
      alert('Failed to save the answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid place-items-center mx-auto my-10 rounded-lg h-auto p-0 relative">
        <div className="relative w-96 h-48">
          <WebcamIcon width={400} height={300} className="absolute inset-0 text-gray-400" />
          <Webcam mirrored style={{ position: 'absolute' }} />
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <Button
          className="mt-20 mx-auto"
          onClick={isRecording ? stopSpeechToText : startSpeechToText}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      {renderError()}

      {isRecording && micPermission && (
        <div style={{ marginTop: '20px' }}>
          <h3>Transcriptions:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result.transcript}</li>
            ))}
            {interimResult && (
              <li style={{ fontStyle: 'italic', color: 'gray' }}>{interimResult}</li>
            )}
          </ul>
        </div>
      )}

      {!isRecording && results.length > 0 && (
        <div className="flex justify-center mt-5">
          <Button
            onClick={() => {
              setShowAnswer((prev) => !prev);
              setAnswer(results.map((res) => res.transcript).join(' '));
            }}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </Button>
        </div>
      )}

      {showAnswer && (
        <div className="mt-5 text-center">
          <h3>Final Answer:</h3>
          <p>{answer}</p>
          <Button onClick={SaveUserAnswer} disabled={loading}>
            {loading ? 'Saving...' : 'Save Answer'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;
