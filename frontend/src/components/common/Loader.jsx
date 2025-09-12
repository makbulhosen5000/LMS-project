import React from 'react'
import { BeatLoader } from "react-spinners";

export default function Loader() {
  return (
    <>
      <div className='flex justify-center items-center h-32'>
        <BeatLoader color="#454B1B" size={15} />
      </div>
    </>
  )
}
