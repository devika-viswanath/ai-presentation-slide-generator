import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

/* ================= GENERATE DETAILED OUTLINE (8 SLIDES) ================= */

const generateDetailedOutline = (topic: string): Outline[] => {
  return [
    { 
      slideNo: '1', 
      slidePoint: `Welcome to ${topic}`, 
      outline: `Introduction and overview of ${topic}. Setting the stage for what will be covered in this presentation.` 
    },
    { 
      slideNo: '2', 
      slidePoint: 'Agenda & Objectives', 
      outline: `Presentation roadmap and key learning goals. What you'll gain by the end of this session.` 
    },
    { 
      slideNo: '3', 
      slidePoint: `Understanding ${topic}`, 
      outline: `Core concepts, definitions, and fundamental principles. Breaking down the key components and terminology.` 
    },
    { 
      slideNo: '4', 
      slidePoint: 'Current Challenges & Analysis', 
      outline: `Identifying existing problems and pain points. Analysis of the current state and areas requiring attention.` 
    },
    { 
      slideNo: '5', 
      slidePoint: `${topic} - Solution & Strategy`, 
      outline: `Proposed approach and methodology to address challenges. Step-by-step action plan with clear milestones.` 
    },
    { 
      slideNo: '6', 
      slidePoint: 'Implementation & Roadmap', 
      outline: `Execution timeline, resources, and required tools. Practical steps for successful implementation and delivery.` 
    },
    { 
      slideNo: '7', 
      slidePoint: 'Expected Results & Benefits', 
      outline: `Anticipated outcomes, success metrics, and ROI. How this solution delivers value and addresses key objectives.` 
    },
    { 
      slideNo: '8', 
      slidePoint: 'Summary & Q&A', 
      outline: `Key takeaways and main conclusions. Open floor for questions, discussion, and next steps.` 
    }
  ]
}

/* ================= DEFAULT DUMMY OUTLINE ================= */

const DUMMY_OUTLINE = generateDetailedOutline('Your Topic')

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
  const navigate = useNavigate()

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

    if (data.outline) {
      setOutline(data.outline)
    } else {
      // Generate detailed outline based on user input if no outline exists
      const detailedOutline = generateDetailedOutline(data.userInputPrompt || 'Your Topic')
      setOutline(detailedOutline)
    }
    
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

      // ✅ Navigate to editor page after successful save
      navigate(`/workspace/project/${projectId}/editor`)
    } catch (error) {
      console.error('Firestore error:', error)
      alert('Failed to save. Please try again.')
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
