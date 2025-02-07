"use client"

import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const {selectedProjectId} = useParams()
    console.log(selectedProjectId);
    
  return (
    <div>
       <h2>This is id {selectedProjectId}</h2>
    </div>
  )
}

export default page
