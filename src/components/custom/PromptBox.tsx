import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import { ArrowUp, Loader2Icon } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { v4 as uuidv4 } from 'uuid'
import { doc, setDoc } from 'firebase/firestore'
import { firebaseDb } from './../../../config/FirebaseConfig'
import { useUser } from '@clerk/clerk-react'   
import { useNavigate } from 'react-router-dom'
//ut

function PromptBox() {
  const [userInput, setUserInput] = useState<string>('');
  const [noOfSlider, setNoOfSlider] = useState<string>('4-6');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const CreateAndSaveProject = async () => {
    if (!userInput) return;

    const projectId = uuidv4();
    setLoading(true);

    try {
      await setDoc(doc(firebaseDb, "projects", projectId), {
        projectId,
        userInputPrompt: userInput,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: Date.now(),
        noOfSlides: noOfSlider
        

      });
    } finally {
      setLoading(false);
      navigate('/workspace/project/' + projectId + '/outline');
    }
  }

  return (
    <div className="w-full">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-4xl space-y-4 rounded-2xl bg-white/80 p-5 shadow-xl ring-1 ring-black/5 backdrop-blur dark:bg-slate-900/70 dark:ring-white/10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Start with a clear prompt
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">Include audience, tone, and goal for sharper slides.</p>
          </div>

          <InputGroup>
            <InputGroupTextarea
              placeholder="Describe the deck you want to create (topic, audience, tone, call-to-action)"
              className="min-h-36 bg-transparent"
              onChange={(event) => setUserInput(event.target.value)}
            />

            <InputGroupAddon align={'block-end'}>
              <Select onValueChange={(value) => setNoOfSlider(value)} value={noOfSlider}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select No of Slides" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>No. Of Slides</SelectLabel>
                    <SelectItem value="4-6">4-6 Slides</SelectItem>
                    <SelectItem value="6-8">6-8 Slides</SelectItem>
                    <SelectItem value="8-12">8-12 Slides</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <InputGroupButton
                variant={'default'}
                className='ml-auto rounded-full'
                size={'icon-sm'}
                onClick={CreateAndSaveProject}
                disabled={!userInput || loading}
              >
                {loading ? <Loader2Icon className='animate-spin' /> : <ArrowUp />}
              </InputGroupButton>

            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
            <span>Slides to generate: {noOfSlider.replace('-', ' to ')}</span>
            <span>Projects save automatically to your workspace</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptBox;
