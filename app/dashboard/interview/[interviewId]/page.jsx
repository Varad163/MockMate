"use client"
import { MockInterview } from '@/utils/schema'
import React, { useEffect } from 'react'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'

function Interview({ params }) {
   console.log(params);

    return (
        <div>Interview</div>
    )
}

export default Interview