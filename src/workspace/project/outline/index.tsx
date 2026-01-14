import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from './../../../../config/FirebaseConfig';
import { Slice, Sliders } from 'lucide-react';
import { Slider } from '@radix-ui/react-slider';
import SlidersStyle from '@/components/custom/SlidersStyle';

type Project = {
  userInputPrompt: string;
  projectId: string;
  createdAt: string;
}

function Outline() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  
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
    setProjectDetail(docSnap.data() as Project);
  }
  
  return (
    <div className='flex justify-center mt-20'>
      <div className='max-w-5xl w-full'>
        <h2 className='font-bold text-2xl'>Settings and Slider Outline</h2>
        <SlidersStyle />
      </div>
    </div>
  )
}

export default Outline