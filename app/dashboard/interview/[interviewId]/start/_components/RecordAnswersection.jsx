import Webcam from 'react-webcam';
import { WebcamIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

function RecordAnswerSection() {
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
        <Button className="mt-20">Start Recording</Button>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
