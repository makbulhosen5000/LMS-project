import React from 'react'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuthContext } from '../provider/UserAuthProvider';

export default function UserPrivateRoute({children}) {
    const {user} = useContext(UserAuthContext);
    if(!user){
        // User is authenticated, allow access to the route
       return <Navigate to="/account/user/login" />
    }
    return children;
}
