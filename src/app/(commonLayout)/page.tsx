import About from '@/components/shared/static/About'
import Category from '@/components/shared/static/Catagory'
import HeroSection from '@/components/shared/static/Hero'
import Oppning from '@/components/shared/static/oppning'
import React from 'react'

export default function Home() {
  return (
    <div>
        <HeroSection />
           <Category/>
           <About/>
           <Oppning/>
    </div>
  )
}
