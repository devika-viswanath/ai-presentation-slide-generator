import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb, GeminiAiModel } from './../../../../config/FirebaseConfig';
import { Slice, Sliders } from 'lucide-react';
import { Slider } from '@radix-ui/react-slider';
import SlidersStyle from '@/components/custom/SlidersStyle';
import OutlineSection from '@/components/custom/OutlineSection';
import { set } from 'date-fns';

const OUTLINE_PROMPT=`Generate a PowerPoint slide outline for the topic {userInput}.  
Create {noOfSliders} slides in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.

Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank You screen.

Return the response only in JSON format, following this schema:
[
  {
    "slideNo": "",
    "slidePoint": "",
    "outline": ""
  }
]`

const DUMMY_OUTLINE=[
{
    "slideNo": "1",
    "slidePoint": "Welcome & Introduction",
    "outline": "A warm welcome to all attendees and brief introduction to the presentation.\nSetting expectations and overview of what will be covered in today's session."
  },
  {
    "slideNo": "2",
    "slidePoint": "Today's Agenda",
    "outline": "A clear roadmap outlining the key topics and sections we'll explore.\nTimeline and structure to help you follow along throughout the presentation."
  },
  {
    "slideNo": "3",
    "slidePoint": "Problem Statement & Context",
    "outline": "Identifying the core challenge or opportunity we're addressing.\nProviding background information and context to frame our discussion."
  },
  {
    "slideNo": "4",
    "slidePoint": "Current State Analysis",
    "outline": "Examining the present situation with relevant data and insights.\nHighlighting key trends, metrics, and factors influencing our topic."
  },
  {
    "slideNo": "5",
    "slidePoint": "Proposed Solution & Benefits",
    "outline": "Presenting our recommended approach or solution to the identified challenge.\nOutlining the key benefits and advantages of this proposed direction."
  },
  {
    "slideNo": "6",
    "slidePoint": "Implementation Strategy",
    "outline": "Detailed plan for executing the proposed solution effectively.\nTimeline, resources needed, and key milestones for successful implementation."
  },
  {
    "slideNo": "7",
    "slidePoint": "Expected Outcomes & Next Steps",
    "outline": "Anticipated results and impact of implementing our recommendations.\nClear action items and immediate next steps to move forward."
  },
  {
    "slideNo": "8",
    "slidePoint": "Thank You & Questions",
    "outline": "Appreciation for your time and attention during this presentation.\nOpen floor for questions, discussion, and feedback from the audience."
  }
]

type Project = {
  userInputPrompt: string;
  projectId: string;
  createdAt: string;
  noOfSliders: string;
  outline: Outline[];
}

export type Outline={
  slideNo: string;
  slidePoint: string;
  outline: string;
}

function Outline() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<Outline[]>(DUMMY_OUTLINE);
  useEffect(() => {
    projectId && GetProjectDetail();
  }, [projectId]);
  
  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, 'projects', projectId ?? '');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return;
    }
    
    console.log(docSnap.data());
    setProjectDetail(docSnap.data());
    if(!docSnap.data()?.outline)
    { 
      // GenerateSlidersOutline(docSnap.data());
    }
    
  }
  const GenerateSlidersOutline= async(projectData:Project) =>{
    setLoading(true);
    // Provide a prompt that contains text
  const prompt = OUTLINE_PROMPT.replace('{userInput}', projectData?.userInputPrompt).replace('{noOfSliders}', projectData?.noOfSliders);

  // To generate text output, call generateContent with the text input
  const result = await GeminiAiModel.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  console.log(text);
  const rawJson =text.replace('```json', '').replace('```', '');
  const JSONData=JSON.parse(rawJson);
  setOutline(JSONData);
  setLoading(false);
  }
  const handleUpdateOutline = (index: string, value: Outline) => {
  setOutline(prev =>
    prev.map(item =>
      String(item.slideNo) === String(index) ? { ...item, ...value } : item
    )
  );
};

  
  return (
    <div className='flex justify-center mt-20'>
      <div className='max-w-5xl w-full'>
        <h2 className='font-bold text-2xl'>Settings and Slider Outline</h2>
        <SlidersStyle />
        <OutlineSection loading={loading} outline={outline || []} 
        handleUpdateOutline={(index:string,value:Outline)=>handleUpdateOutline(index,value)}/>
      </div>
    </div>
  )
}

export default Outline