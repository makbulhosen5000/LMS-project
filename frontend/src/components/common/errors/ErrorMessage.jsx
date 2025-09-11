import React from 'react';
import { Link, Navigate, useRouteError } from 'react-router-dom';

const ErrorMessage = () => {
    const errorImg = 'https://i.ibb.co/xsfjJt3/not-found.jpg';
    const error = useRouteError();
    return (
      <div className="flex flex-col place-items-center justify-center align-items-center h-screen">
        <img width="300" src={errorImg} alt="" />
        <p className='text-red-600 font-bold underline'>
          Error : {error.message? error.message : 'Page Not Found'}
  
        </p>
        <Link to="/">
          <button className="mt-5 bg-yellow-400 rounded-lg p-5 ml-3 font-bold">HOME</button>
        </Link>
      </div>
    );
};

export default ErrorMessage;