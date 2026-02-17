import React, { useEffect, useState } from 'react'
import professionalSlider from './../../assets/professional.jpg'
import MinWhiteSlider from './../../assets/Minimalist-White.jpg'
import ModernGradientSlider from './../../assets/modern-gradient.jpg'
import DarkSlider from './../../assets/dark.jpg'
import PasteSlider from './../../assets/pastel-ppt.jpg'
import TechSlider from './../../assets/tech.jpg'

const Design_Styles = [
  {
    "styleName": "Professional Blue 💼",
    "colors": {
      "primary": "#0A66C2",
      "secondary": "#1C1C1C",
      "accent": "#E8F0FE",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #0A66C2, #E8F0FE)"
    },
    "designGuide": "🧠 Create a professional corporate-style presentation ...",
    "icon": "Briefcase",
    "bannerImage": professionalSlider
  },
  {
    "styleName": "Minimal White ⚪",
    "colors": {
      "primary": "#1C1C1C",
      "secondary": "#AAAAAA",
      "accent": "#EDEDED",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #FFFFFF, #EDEDED)"
    },
    "designGuide": "🧠 Generate a minimalist slide deck ...",
    "icon": "Square",
    "bannerImage": MinWhiteSlider
  },
  {
    "styleName": "Modern Gradient 🌈",
    "colors": {
      "primary": "#8A2BE2",
      "secondary": "#00C9FF",
      "accent": "#92FE9D",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #8A2BE2, #00C9FF, #92FE9D)"
    },
    "designGuide": "🧠 Design a modern gradient-style PPT ...",
    "icon": "Sparkles",
    "bannerImage": ModernGradientSlider
  },
  {
    "styleName": "Elegant Dark 🖤",
    "colors": {
      "primary": "#0D0D0D",
      "secondary": "#1F1F1F",
      "accent": "#FFD700",
      "background": "#0D0D0D",
      "gradient": "linear-gradient(135deg, #0D0D0D, #1F1F1F)"
    },
    "designGuide": "🧠 Create a luxury-style dark presentation ...",
    "icon": "Star",
    "bannerImage": DarkSlider
  },
  {
    "styleName": "Creative Pastel 🎨",
    "colors": {
      "primary": "#F6D6FF",
      "secondary": "#A0E7E5",
      "accent": "#B4F8C8",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #F6D6FF, #A0E7E5, #B4F8C8)"
    },
    "designGuide": "🧠 Build a creative pastel-style presentation ...",
    "icon": "Palette",
    "bannerImage": PasteSlider
  },
  {
    "styleName": "Startup Pitch 🚀",
    "colors": {
      "primary": "#0052CC",
      "secondary": "#36B37E",
      "accent": "#172B4D",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #0052CC, #36B37E)"
    },
    "designGuide": "🧠 Design a sleek startup pitch deck ...",
    "icon": "Rocket",
    "bannerImage": TechSlider
  }
]

export type DesignStyle = {
  styleName: string,
  colors: any,
  designGuide: string,
  icon: string,
  bannerImage: any
}

type Props = {
  selectStyle: (value: DesignStyle) => void;
  selectedStyle?: DesignStyle | null;
}

function SlidersStyle({ selectStyle, selectedStyle }: Props) {
  return (
    <div className='mt-5'>
      <h2 className='font-bold text-xl text-gray-900 dark:text-white'>Select Slider Style</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-3'>
        {Design_Styles.map((design, index) => {
          const isSelected =
            selectedStyle && selectedStyle.styleName === design.styleName;

          return (
            <div
              key={index}
              className={`cursor-pointer p-1 rounded-2xl transition-all bg-white dark:bg-gray-800 ${
                isSelected ? 'border-2 border-blue-500' : 'border border-gray-300'
              }`}
              onClick={() => selectStyle(design)}
            >
              <img
                src={design.bannerImage}
                className='w-full h-[130px] object-cover rounded-xl'
              />
              <h2 className='font-medium text-center mt-1 text-gray-900 dark:text-white'>{design.styleName}</h2>
            </div>
          );
        })}
      </div>
    </div>
  )
}
// export the design styles array for use in other components
export default SlidersStyle

