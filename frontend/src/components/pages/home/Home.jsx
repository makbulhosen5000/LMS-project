import React from 'react'
import { Helmet } from 'react-helmet-async'
import Banner from '../banner/Banner';
import Categories from '../category/Categories';
import FeaturedCourses from '../course/FeaturedCourses';


export default function Home() {
  return (
    <>
    <Helmet>
      <title>MAKLearning || Home</title>
    </Helmet>
    <Banner/>
    <Categories/>
    <FeaturedCourses/>
    </>
  )
}
