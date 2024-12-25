"use client"
import React from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useState } from 'react';
import { Loader } from 'lucide-react';
import QuestionsSection from './_components/QuestionsSection';
import { useEffect } from 'react';
import RecordAnswerSection from './_components/RecordAnswersection';
function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [loading, setLoading] = useState(false);
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
    useEffect(() => {
        GetInteriewDetails();
    }, []);

    const GetInteriewDetails = async () => {
        setLoading(true);
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));
            const jsonMockResp = JSON.parse(result[0].jsonMockResp)
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);
            console.log(jsonMockResp);

        } catch (error) {
            console.error('Error fetching interview details:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className='flex lg:flex-cols-2 md:grid-cols cols-2 m-1.5 gap-14'>
                {/*Questions*/}
                <QuestionsSection activeQuestionIndex={activeQuestionIndex} mockInterviewQuestion={mockInterviewQuestion}/>
                <RecordAnswerSection />
        </div>
        </div>
    )
}

export default StartInterview