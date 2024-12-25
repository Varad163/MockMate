"use client";
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

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
            setInterviewData(result[0]);
        } catch (error) {
            console.error('Error fetching interview details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='my-10 '>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid drid-cols-1 md:grid-cols-2 gap-10'>
                <div>
                {loading ? (
                    <p>Loading interview details...</p>
                ) : interviewData ? (
                    <div className='flex flex-col my-5 gap-5 '>
                                <div className='flex flex-col rounded-lg border gap-5 p-5'>
                        <h2 className='text-lg'>
                            <strong>Job Role/Job Position: </strong>{interviewData.jobPosition}
                        </h2>
                        <h2 className='text-lg'>
                            <strong>Job Description: </strong>{interviewData.jobDesc}
                        </h2>
                        <h2 className='text-lg'>
                    <strong>Job Experience:</strong> {interviewData.jobExperience}
                        </h2>
                        </div>
                        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                                    <h2 className='flex gap-2 items-center text-yellow-500'> <strong><Lightbulb />Information</strong></h2>
                                    <h2 className='text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                        </div>
                    </div>
                ) : (
                    <p>No interview data found.</p>
                    
                )}
                
            </div>
            <div>
                {webCamEnabled ? (
                    <Webcam
                    onUserMedia={() => setWebCamEnabled(true)}
                    onUserMediaError={() => setWebCamEnabled(false)}
                        mirrored={true}
                        style={{
                            height: 300,
                            width: 300,
                        }}
                    />
                ) : (
                    <>
                        <WebcamIcon className='h-72 my-7 w-full p-14 bg-secondary rounded-lg border' />
                        <Button variant="ghost" className="w-full border" onClick={() => setWebCamEnabled(true)}>
                            Enable Web Cam And Microphone
                        </Button>
                    </>
                )}
                </div>
             </div>
             <div className='flex justify-end items-end'>
                <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                <Button>Start Interview</Button>
                </Link>
                </div>
        </div>
    );
}

export default Interview;
