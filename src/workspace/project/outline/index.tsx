<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
=======
import { useEffect, useState } from 'react'
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firebaseDb, GeminiAiModel } from './../../../../config/FirebaseConfig'
import { ArrowRight, Loader2Icon } from 'lucide-react'
import SlidersStyle, { type DesignStyle } from '@/components/custom/SlidersStyle'
import OutlineSection from '@/components/custom/OutlineSection'
import { Button } from '@/components/ui/button'

/* ================= AI PROMPT ================= */

const OUTLINE_PROMPT = `Generate a PowerPoint slide outline for the topic: {userInput}

Create exactly {noOfSliders} slides. Each slide should have a topic name and a detailed 2-line description.

Structure:
1. Welcome/Title screen
2. Agenda/Overview
3-N. Core content slides
Final. Thank You/Q&A

Return ONLY valid JSON array (no markdown, no code blocks):
[
  {
    "slideNo": "1",
    "slidePoint": "Title of slide",
    "outline": "Detailed description of what this slide covers"
  }
]`

<<<<<<< HEAD
/* ================= GENERATE DETAILED OUTLINE  ================= */

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



const DUMMY_OUTLINE = generateDetailedOutline('Your Topic')
=======
/* ================= TYPE DEFINITIONS ================= */
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)

export type Outline = {
  slideNo: string
  slidePoint: string
  outline: string
}

export type Project = {
  userInputPrompt: string
  noOfSliders: string
  outline?: Outline[]
  designStyle?: any;
  slides?: any[];
}

function Outline() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [projectDetail, setProjectDetail] = useState<Project | null>(null)
  const [outline, setOutline] = useState<Outline[]>([])  // Start empty - will be filled by AI
  const [loading, setLoading] = useState(false)
  const [updateDbLoading, setUpdateDbLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | undefined>()

  useEffect(() => {
    if (projectId) GetProjectDetail()
  }, [projectId])

  /* ================= FIREBASE FETCH ================= */

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, 'projects', projectId!)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return

    const data = docSnap.data() as Project
    setProjectDetail(data)

    if (data.outline) {
      setOutline(data.outline)
<<<<<<< HEAD
    } else {
      // Generate detailed outline based on user input if no outline exists
      const detailedOutline = generateDetailedOutline(data.userInputPrompt || 'Your Topic')
      setOutline(detailedOutline)
    }
    
    if (data.designStyle) setSelectedStyle(data.designStyle)
=======
    }

    if (data.designStyle) {
      setSelectedStyle(data.designStyle)
    }

    // ❌ DO NOT AUTO CALL AI (IMPORTANT FOR COLLEGE)
    // GenerateSlidersOutline(data)
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
  }

  /* ================= AI GENERATION (MANUAL ONLY) ================= */

  const GenerateSlidersOutline = async () => {
    if (!projectDetail) return

    setLoading(true)

    try {
      const prompt = OUTLINE_PROMPT
        .replace('{userInput}', projectDetail.userInputPrompt)
        .replace('{noOfSliders}', projectDetail.noOfSliders)

      // 🔥 Using standard generateContent API
      const result = await GeminiAiModel.generateContent(prompt);
      const text = result.response.text();

      const rawJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(rawJson);
      setOutline(parsed);
      console.log("✅ Outline generated:", parsed);
    } catch (error: any) {
      console.error('AI generation error:', error)
      
      // If rate limited or any error, use fallback dummy data
      if (error?.message?.includes('429') || error?.message?.includes('quota') || error) {
        console.log("⚠️ Using fallback outline due to API limit");
        const numSlides = parseInt(projectDetail.noOfSliders) || 5;
        const fallbackOutline = generateFallbackOutline(projectDetail.userInputPrompt, numSlides);
        setOutline(fallbackOutline);
      }
    } finally {
      setLoading(false)
    }
  }

  // Fallback outline generator when API is unavailable
  const generateFallbackOutline = (topic: string, numSlides: number) => {
    const templates = [
      { slideNo: "1", slidePoint: `Welcome to ${topic}`, outline: `Introduction and overview of ${topic}. Setting the stage for an informative presentation.` },
      { slideNo: "2", slidePoint: "Agenda & Overview", outline: `What we'll cover today: key concepts, benefits, implementation strategies, and Q&A session.` },
      { slideNo: "3", slidePoint: "Key Concepts", outline: `Understanding the fundamental principles and core concepts of ${topic}.` },
      { slideNo: "4", slidePoint: "Benefits & Advantages", outline: `Exploring the main benefits and competitive advantages of implementing ${topic}.` },
      { slideNo: "5", slidePoint: "Implementation Strategy", outline: `Step-by-step approach to successfully implementing ${topic} in your organization.` },
      { slideNo: "6", slidePoint: "Case Studies", outline: `Real-world examples and success stories demonstrating the effectiveness of ${topic}.` },
      { slideNo: "7", slidePoint: "Challenges & Solutions", outline: `Common challenges faced and proven solutions to overcome them.` },
      { slideNo: "8", slidePoint: "Future Trends", outline: `Emerging trends and future developments in the field of ${topic}.` },
      { slideNo: "9", slidePoint: "Best Practices", outline: `Industry best practices and recommendations for optimal results.` },
      { slideNo: "10", slidePoint: "Thank You & Q&A", outline: `Summary of key takeaways and open floor for questions and discussion.` },
    ];
    return templates.slice(0, numSlides).map((t, i) => ({ ...t, slideNo: String(i + 1) }));
  }

  /* ================= SAVE ================= */

  const onGenerateSlider = async () => {
    if (!selectedStyle) {
      alert('Please select a slider style')
      return
    }

    setUpdateDbLoading(true)

    try {
      const { bannerImage, ...styleWithoutImage } = selectedStyle as any

      await updateDoc(doc(firebaseDb, 'projects', projectId!), { // 📤 API CALL
        designStyle: styleWithoutImage,
        outline: outline,
        updatedAt: Date.now()
      })
<<<<<<< HEAD

      // ✅ Navigate to editor page after successful save
      navigate(`/workspace/project/${projectId}/editor`)
    } catch (error) {
      console.error('Firestore error:', error)
=======
      
      // Navigate to editor after saving
      navigate(`/workspace/project/${projectId}/editor`)
    } catch (error) {
      console.error('Firestore update error:', error)
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
      alert('Failed to save. Please try again.')
    } finally {
      setUpdateDbLoading(false)
    }
  }
  //navigate to slider-Editor
  

  /* ================= UI ================= */

  return (
    <div className="flex justify-center mt-20">
      <div className="max-w-5xl w-full">
        <h2 className="font-bold text-2xl">Settings and Slider Outline</h2>

        <SlidersStyle
          selectStyle={(value: DesignStyle) => setSelectedStyle(value)}
          selectedStyle={selectedStyle}
        />

        {/* ✅ OPTIONAL: ENABLE ONLY DURING EVALUATION  */}
        
        <Button 
          variant="outline"
          className="my-3"
          onClick={GenerateSlidersOutline}
          disabled={loading}
        >
          {loading && <Loader2Icon className="animate-spin mr-2" />}
          Generate Outline (AI)
        </Button>
       

        <OutlineSection
          loading={loading}
          outline={outline}
          handleUpdateOutline={() => {}}
        />
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 left-1/2 -translate-x-1/2"
        onClick={onGenerateSlider}
        disabled={updateDbLoading || loading}
      >
        {updateDbLoading && <Loader2Icon className="animate-spin mr-2" />}
        Generate Sliders <ArrowRight />
      </Button>
    </div>
  )
}

export default Outline
