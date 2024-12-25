import { Lightbulb } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
    return (
        mockInterviewQuestion && (
            <div className="p-5 border rounded-lg w-full md:w-3/4 lg:w-1/2 justify-start my-10 mx-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-5">
                    {mockInterviewQuestion.map((_, index) => (
                        <h2
                            key={index}
                            className={`p-2 bg-secondary rounded-full text-sm mid:text-sm text-center cursor-pointer ${activeQuestionIndex === index ? 'bg-blue-600 text-white' : ''
                                }`}
                        >
                            Question #{index + 1}
                        </h2>
                    ))}
                </div>
                <div className="mt-5">
                    <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
                </div>
                <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
                    <h2 className='flex gap-2 items-center text-primary'>
                        <Lightbulb/>
                        <strong>Note:</strong>
                    </h2>
                    <h2 className='text-sm text-primary my-2' >{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
                </div>
            </div>
        )
    );
}

export default QuestionsSection;
