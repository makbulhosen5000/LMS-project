import React from 'react'
import { Helmet } from 'react-helmet-async'
import Shop from '../../../pages/product/Products';
import Slider from '../slider/Slider';


export default function Home() {
  return (
    <>
    <Helmet>
      <title>MAKFashion || Home</title>
    </Helmet>
    <Slider/>
    <Shop/>
    </>
  )
}
