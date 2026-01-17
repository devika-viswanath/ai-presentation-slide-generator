import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firebaseDb, GeminiAiModel } from './../../../../config/FirebaseConfig'
import { ArrowRight, Loader2Icon } from 'lucide-react'
import SlidersStyle, { type DesignStyle } from '@/components/custom/SlidersStyle'
import OutlineSection from '@/components/custom/OutlineSection'
import { Button } from '@/components/ui/button'

const OUTLINE_PROMPT = `Generate a PowerPoint slide outline for the topic {userInput}.  
Create {noOfSliders} slides in total.

Return the response only in JSON format:
[
  {
    "slideNo": "",
    "slidePoint": "",
    "outline": ""
  }
]`

const DUMMY_OUTLINE = [
  { slideNo: '1', slidePoint: 'Welcome', outline: 'Welcome slide' },
  { slideNo: '2', slidePoint: 'Agenda', outline: 'Agenda slide' },
  { slideNo: '3', slidePoint: 'Thank You', outline: 'Thank you slide' }
]

export type Outline = {
  slideNo: string
  slidePoint: string
  outline: string
}

type Project = {
  userInputPrompt: string
  noOfSliders: string
  outline?: Outline[]
  designStyle?: any
}

function Outline() {
  const { projectId } = useParams()

  const [projectDetail, setProjectDetail] = useState<Project | null>(null)
  const [outline, setOutline] = useState<Outline[]>(DUMMY_OUTLINE)
  const [loading, setLoading] = useState(false)
  const [UpdateDbLoading, setUpdateDbLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | undefined>()

  useEffect(() => {
    if (projectId) GetProjectDetail()
  }, [projectId])

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, 'projects', projectId!)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return

    const data = docSnap.data() as Project
    setProjectDetail(data)

    if (data.outline) setOutline(data.outline)
    if (data.designStyle) setSelectedStyle(data.designStyle)
  }

  const handleUpdateOutline = (index: string, value: Outline) => {
    setOutline(prev =>
      prev.map(item =>
        item.slideNo === index ? { ...item, ...value } : item
      )
    )
  }

  const onGenerateSlider = async () => {
    if (!selectedStyle) {
      alert('Please select a slider style')
      return
    }

    setUpdateDbLoading(true)

    try {
      // 🔥 remove image import before saving
      const { bannerImage, ...styleWithoutImage } = selectedStyle as any

      await updateDoc(doc(firebaseDb, 'projects', projectId!), {
        designStyle: styleWithoutImage,
        outline: outline,
        updatedAt: Date.now()
      })
    } catch (error) {
      console.error('Firestore error:', error)
    } finally {
      setUpdateDbLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <div className="max-w-5xl w-full">
        <h2 className="font-bold text-2xl">Settings and Slider Outline</h2>

        {/* ✅ PASS selectedStyle */}
        <SlidersStyle
          selectStyle={(value: DesignStyle) => setSelectedStyle(value)}
          selectedStyle={selectedStyle}
        />

        <OutlineSection
          loading={loading}
          outline={outline}
          handleUpdateOutline={(index, value) =>
            handleUpdateOutline(index, value)
          }
        />
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 left-1/2 -translate-x-1/2"
        onClick={onGenerateSlider}
        disabled={UpdateDbLoading || loading}
      >
        {UpdateDbLoading && <Loader2Icon className="animate-spin mr-2" />}
        Generate Sliders <ArrowRight />
      </Button>
    </div>
  )
}

export default Outline
