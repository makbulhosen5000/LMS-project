import React from 'react'

export default function RecordNotFound({recordTitle="Record Not Found"}) {
  return (
    <div className="p-5 font-extrabold text-center">
        <p className="px-6 py-4">{recordTitle}</p>
    </div>
    
  )
}
