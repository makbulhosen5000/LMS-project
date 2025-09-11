import React from 'react'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../provider/AdminAuthProvider';

export default function AdminPrivateRoute({children}) {
    const {admin} = useContext(AdminAuthContext);
    if(!admin){
       return <Navigate to="/admin/login" />
    }
    return children;
}
