"use client"
import { MockInterview } from '@/utils/schema'
import React, { useEffect } from 'react'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'

function Interview({ params }) {


    useEffect(() => {
        console.log(params.InterviewId)
        GetInteriewDetails();
    }, [])

    const GetInteriewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.InterviewId))

        console.log(result);
    }
    GetInteriewDetails();

    return (
        <div>Interview</div>
    )
}

export default Interview