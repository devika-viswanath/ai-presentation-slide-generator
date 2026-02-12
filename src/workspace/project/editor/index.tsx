import OutlineSection from '@/components/custom/OutlineSection'
import { firebaseDb, GeminiAiModel } from './../../../../config/FirebaseConfig'
import { IMAGEKIT_BASE_URL } from '../../../lib/imagekit'
import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import type { Project } from '../outline'

import SliderFrame from '@/components/custom/SliderFrame'
import { exportSlidesAsPPT, exportSlidesAsPDF } from '../../../lib/exportSlides'


const SLIDER_PROMPT = `Generate HTML
(TailwindCSS + Flowbite UI + Lucide Icons)
code for a 16:9 ppt slider in Modern Dark
style.
{DESIGN_STYLE}: No responsive design; use a
fixed 16:9 layout for slides.
Use Flowbite component structure. Use
different layouts depending on content and
style.
Use TailwindCSS colors like primary, accent,
gradients, background, etc., and include
colors from {COLORS_CODE}.
MetaData for Slider: {METADATA}

- Ensure images are optimized to fit within
their container div and do not overflow.
- Use proper width/height constraints on
images so they scale down if needed to
remain inside the slide.
- Maintain 16:9 aspect ratio for all slides
and all media.
- Use CSS classes like 'object-cover' or
'object-contain' for images to prevent
stretching or overflow.
- Use grid or flex layouts to properly
divide the slide so segments do not overlap.

Generate Image if needed using:
'${IMAGEKIT_BASE_URL}-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image
prompt and altImageName with a random image
name.

<!-- Slide Content Wrapper (Fixed 16:9
Aspect Ratio) -->
<div class="w-[800px] h-[500px] relative
overflow-hidden">
  <!-- Slide content here -->
</div>
Also do not add any overlay : Avoid this :
<div class="absolute inset-0 bg-
gradient-to-br from-primary to-secondary
opacity-20"></div>

Just provide body content for 1 slide. Make
sure all content, including images, stays
within the main slide div and preserves the
16:9 ratio.`


function Editor() {
    const { projectId } = useParams();
    const [projectDetail, setProjectDetail] = useState<Project>();
    const [loading, setLoading] = useState(false);
    const [sliders, setSliders] = useState<any>([]);
    const [generatingStatus, setGeneratingStatus] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

    useEffect(() => {
        if (projectId) GetProjectDetail()
      }, [projectId])
    
     
    
      const GetProjectDetail = async () => {
        setLoading(true);
        const docRef = doc(firebaseDb, 'projects', projectId!)
        const docSnap = await getDoc(docRef)
    
        if (!docSnap.exists()) {
          setLoading(false);
          return;
        }
    
        const data = docSnap.data() as Project
        setProjectDetail(data)
        
        // Load existing slides if any
        if (data.slides && data.slides.length > 0) {
          setSliders(data.slides);
        }
        
        setLoading(false);
      }

      // Save slide to Firebase immediately after generation
      const saveSlideToDb = async (slideData: any, index: number) => {
        try {
          const docRef = doc(firebaseDb, 'projects', projectId!);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const currentData = docSnap.data();
            const currentSlides = currentData.slides || [];
            currentSlides[index] = slideData;
            
            await setDoc(docRef, {
              slides: currentSlides
            }, { merge: true });
            
            console.log(`💾 Slide ${index + 1} saved to database`);
          }
        } catch (err) {
          console.error(`❌ Error saving slide ${index + 1} to database:`, err);
        }
      };

      // Generate a single slide
      const generateSingleSlide = async (index: number) => {
        if (!projectDetail?.outline || !projectDetail.outline[index]) return;
        
        setIsGenerating(true);
        setGeneratingStatus(`Generating slide ${index + 1}...`);

        const metaData = projectDetail.outline[index];
        const prompt = SLIDER_PROMPT
          .replace("{DESIGN_STYLE}", projectDetail?.designStyle?.designGuide ?? "")
          .replace("{COLORS_CODE}", JSON.stringify(projectDetail?.designStyle?.colors))
          .replace("{METADATA}", JSON.stringify(metaData));

        console.log("🎨 Generating Slide", index + 1);
        
        const success = await GeminiSlideCall(prompt, index);
        
        if (success) {
          setGeneratingStatus(`Slide ${index + 1} generated successfully!`);
          setTimeout(() => setGeneratingStatus(''), 3000);
        }
        
        setIsGenerating(false);
      };

        const GeminiSlideCall = async (prompt: string, index: number): Promise<boolean> => {
          
          try {
            const result = await GeminiAiModel.generateContent(prompt);  // 🤖 GEMINI AI CALL
            const text = result.response.text();

            const finalText = text
              .replace(/```html/g, "")
              .replace(/```/g, "")
              .trim();

            const slideData = { code: finalText};

            // Update the slider in state immediately
            setSliders((prev: any[]) => {
              const updated = prev ? [...prev] : [];
              updated[index] = slideData;
              return updated;
            });

            // Save to database immediately
            await saveSlideToDb(slideData, index);

            console.log("✅ Slide", index + 1, "complete and saved");
            return true;
          } catch (err: any) {
            console.error("❌ Error generating slide", index + 1, err);
            
            // Check if it's a rate limit error (429)
            if (err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('exceeded')) {
              setQuotaExceeded(true);
              setGeneratingStatus(`⚠️ API Quota Exceeded! Your free tier limit is used up. Wait 1-2 minutes or use Demo Slide.`);
              return false;
            }
            setGeneratingStatus(`Error generating slide. Please try again.`);
            return false;
          }
    };

    // Generate a demo/placeholder slide when API quota is exceeded
    const generateDemoSlide = async (index: number) => {
      if (!projectDetail?.outline || !projectDetail.outline[index]) return;
      
      const metaData = projectDetail.outline[index];
      const colors = projectDetail?.designStyle?.colors || { primary: '#3B82F6', secondary: '#1E40AF', background: '#1F2937' };
      
      const demoHtml = `
        <div class="w-[800px] h-[500px] relative overflow-hidden bg-gradient-to-br from-[${colors.background || '#1F2937'}] to-[${colors.secondary || '#1E40AF'}] p-8 flex flex-col justify-center">
          <div class="absolute top-0 right-0 w-64 h-64 bg-[${colors.primary || '#3B82F6'}] opacity-20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="relative z-10">
            <h1 class="text-4xl font-bold text-white mb-4">${metaData.slidePoint || 'Slide Title'}</h1>
            <div class="w-24 h-1 bg-[${colors.primary || '#3B82F6'}] mb-6"></div>
            <p class="text-xl text-gray-200 leading-relaxed">${metaData.outline || 'Slide content goes here'}</p>
          </div>
          <div class="absolute bottom-4 right-4 text-sm text-gray-400">Slide ${index + 1}</div>
        </div>
      `;

      const slideData = { code: demoHtml };
      
      setSliders((prev: any[]) => {
        const updated = prev ? [...prev] : [];
        updated[index] = slideData;
        return updated;
      });

      await saveSlideToDb(slideData, index);
      setGeneratingStatus(`Demo slide ${index + 1} created!`);
      setQuotaExceeded(false);
      setTimeout(() => setGeneratingStatus(''), 2000);
    };

    // Get the next slide index to generate
    const getNextSlideIndex = () => {
      const outlineLength = projectDetail?.outline?.length || 0;
      const slidersLength = sliders?.length || 0;
      
      // Find the first missing slide
      for (let i = 0; i < Math.min(outlineLength, 8); i++) {
        if (!sliders[i]) return i;
      }
      return slidersLength < outlineLength ? slidersLength : -1;
    };

    const nextSlideIndex = getNextSlideIndex();
    const totalOutlineSlides = projectDetail?.outline?.length || 0;

    return (
    <div className='grid grid-cols-5 p-10'>
      <div className='col-span-2 h-screen overflow-auto'>

        {/* Outlines */}
        <OutlineSection  outline={projectDetail?.outline ?? []} handleUpdateOutline={()=>console.log()}
          loading={loading}/>
      </div>
      <div className='col-span-3 h-screen overflow-auto'>
    
        {/* Status Banner */}
        {generatingStatus && (
          <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
            generatingStatus.includes('Quota') || generatingStatus.includes('Error') 
              ? 'bg-red-100 text-red-800' 
              : generatingStatus.includes('success') || generatingStatus.includes('created')
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
          }`}>
            {!generatingStatus.includes('success') && !generatingStatus.includes('Error') && !generatingStatus.includes('Quota') && !generatingStatus.includes('created') && (
              <div className='animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full'></div>
            )}
            <span>{generatingStatus}</span>
          </div>
        )}

        {/* Quota Exceeded Warning */}
        {quotaExceeded && (
          <div className='mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <h3 className='font-bold text-yellow-800 mb-2'>⚠️ API Quota Exceeded</h3>
            <p className='text-sm text-yellow-700 mb-3'>
              Your free Gemini API quota has been used up. Options:
            </p>
            <ul className='text-sm text-yellow-700 mb-3 list-disc list-inside'>
              <li>Wait 1-2 minutes and try again</li>
              <li>Use "Demo Slide" to create a placeholder slide</li>
              <li>Upgrade your Google AI plan for more quota</li>
            </ul>
          </div>
        )}

        {/* Generate Button */}
        {nextSlideIndex !== -1 && !isGenerating && (
          <div className='mb-4 p-4 bg-gray-50 rounded-lg'>
            <p className='text-sm text-gray-600 mb-3'>
              {sliders.length === 0 
                ? `Ready to generate ${totalOutlineSlides} slides. Generate one at a time to avoid rate limits.`
                : `${sliders.length} of ${totalOutlineSlides} slides generated.`
              }
            </p>
            <div className='flex gap-2 flex-wrap'>
              {/* Commented out AI button - will enable after API quota reset */}
              {/* <button
                onClick={() => generateSingleSlide(nextSlideIndex)}
                disabled={isGenerating}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                🤖 Generate Slide {nextSlideIndex + 1} with AI
              </button> */}
              <button
                onClick={() => generateDemoSlide(nextSlideIndex)}
                disabled={isGenerating}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                📝 Create Slide {nextSlideIndex + 1}
              </button>
              <button
                onClick={async () => {
                  const slideHtmls = (sliders || []).map((s: any) => s.code || '');
                  if (slideHtmls.length === 0) return;
                  await exportSlidesAsPPT(slideHtmls, 'project-slides.pptx');
                }}
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg'
              >
                📦 Export PPT
              </button>
              <button
                onClick={async () => {
                  const slideHtmls = (sliders || []).map((s: any) => s.code || '');
                  if (slideHtmls.length === 0) return;
                  await exportSlidesAsPDF(slideHtmls, 'project-slides.pdf');
                }}
                className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg'
              >
                📄 Export PDF
              </button>
            </div>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div className='mb-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3'>
            <div className='animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full'></div>
            <span className='text-blue-800'>Generating slide... Please wait.</span>
          </div>
        )}

        {/* Slides */}
        {sliders && sliders.length > 0 ? (
          <>
            {sliders.map((slide:any, index:number) => (
              <div key={index} className='mb-6'>
                <h3 className='text-sm text-gray-500 mb-2'>Slide {index + 1}</h3>
                <SliderFrame slide={slide} colors={projectDetail?.designStyle?.colors} />
              </div>
            ))}
            
            {/* All slides generated message */}
            {nextSlideIndex === -1 && (
              <div className='p-4 bg-green-50 text-green-800 rounded-lg text-center'>
                ✅ All slides have been generated!
              </div>
            )}
          </>
        ) : !isGenerating && (
          <div className='flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg'>
            <p className='mb-2'>No slides generated yet</p>
            <p className='text-sm text-gray-400'>Click the button above to generate your first slide</p>
          </div>
        )}
      </div>
    </div>
  )

  }

export default Editor
