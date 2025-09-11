import React, { useContext } from 'react';

import { Outlet } from 'react-router-dom';
import Navbar from '../common/navbar/Navbar';
import { Footer } from '../common/footer/Footer';

const Main = () => {

    return (
        <div className='mx-4'>

            <Navbar/>
            <Outlet/>
            <Footer/>
        
        </div>
    );
};

export default Main;