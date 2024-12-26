import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam';
import { WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatSession } from '@google/generative-ai';
import { chatSession } from '@/utils/GeminiAIModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { uuid } from 'drizzle-orm/pg-core';
import { db } from '@/utils/db';
import StartInterview from '../page';


function RecordAnswerSection(mockInterviewQuestion, activeQuestionIndex,interviewData) {
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
    googleApiKey: "AIzaSyCFk8LyPHRH53PgJgPkfT7nCnUpEFLT9cg", // Ensure the API key is valid
    useLegacyResults: false,
  });

  // Log out relevant values to debug
  useEffect(() => {
    console.log('Error:', error);
    console.log('Is Recording:', isRecording);
    console.log('Results:', results);
    console.log('Interim Result:', interimResult);


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
  }, [error, isRecording, results, interimResult]);

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
    if (isRecording) {
      setLoading(true);
      stopSpeechToText()
      if (showAnswer?.length < 10) {
        setLoading(false);
        toast('Error while saving your answer,Please record again')
        return;
      }

      const feedbackprompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question + ", UserAnswer:" + showAnswer + ", Depends on Question and user answer for give interview question" +
        "please give us rating for answer and feedback as area of improvement if any" + "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
      const result = await chatSession.sendMessage(feedbackprompt);
      const jsonMockResp = (result.response.text()).replace('```json', '').replace('```', '')
      
      console.log(jsonMockResp);
     return jsonMockResp;
    }
    

    else {
      startSpeechToText();
    }
    JsonFeedbackResp = JSON.parse(jsonMockResp);

    const resp = await db.insert(UserAnswer).values({
      
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: answer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format('DD-MM-YYYY')
    });

    if (resp) {
      toast.success('User Answer recorded successfully');
      console.log(resp);
    }
    else (error)
    console.log(error);


    setLoading(false);

  }


  return (
    <div>
      <div className="grid place-items-center mx-auto my-10 rounded-lg h-auto p-0 relative">
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
        <Button
          className="mt-20 mx-auto"
          onClick={SaveUserAnswer}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      {/* Display any error message */}
      {renderError()}

      {/* Show the transcriptions */}
      {isRecording && micPermission && (
        <div style={{ marginTop: '20px' }}>
          <h3>Transcriptions:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result.transcript}</li>
            ))}
            {/* Display interim result (in-progress transcription) */}
            {interimResult && interimResult.trim() !== '' && (
              <li style={{ fontStyle: 'italic', color: 'gray' }}>
                {interimResult}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Show Answer Button */}
      {!isRecording && results.length > 0 && (
        <div className="flex justify-center mt-5">
          <Button
            onClick={() => {
              setShowAnswer((prev) => !prev);
              setAnswer(results.map((res) => res.transcript).join(' '));
            }}
            className="mx-auto"
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </Button>
        </div>
      )}

      {/* Display the final answer */}
      {showAnswer && (
        <div className="mt-5 text-center">
          <h3>Final Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;
