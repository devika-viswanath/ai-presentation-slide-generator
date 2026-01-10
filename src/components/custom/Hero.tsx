import { Play, Video } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'


function Hero() {
  return (
    <div className='flex flex-col items-center justify-center mt-28 space-y-4'>
      <h2 className='font-bold text-5xl'>From Idea to Presentation in one Click ⚡</h2>
      <p className='text-xl text-gray-500 max-w-2xl'>Generate sleek, editable PPT decks in minutes. AI handle slide design, formatting and visual content so you can focus on your message, impress your audience, and work smarter, not harder.</p>
      <div className='flex gap-5 mt-10'>
        <Button variant={'outline'} size={'lg'}> Watch Video <Play /> </Button>
        <Button size={'lg'}>Get Started</Button>
      </div>
    </div>
  )
}

export default Hero
 