<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react'
import FloatingActionTool from './FloatingActionTool'
import { GeminiAiModel } from './../../../config/FirebaseConfig'
import { IMAGEKIT_BASE_URL } from '../../lib/imagekit'
=======
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Loader2Icon, Wand2, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)

const HTML_DEFAULT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
<<<<<<< HEAD
  <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
  <title>AI Website Builder</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Custom Tailwind Config for Colors -->
=======
  <title>AI Slide</title>
  <script src="https://cdn.tailwindcss.com"></script>
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {colorCodes},
<<<<<<< HEAD
          backgroundImage: {
            gradient: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)', // Primary → Secondary
          },
=======
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
        },
      },
    };
  </script>
<<<<<<< HEAD

  <!-- Flowbite CSS & JS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <!-- Font Awesome Icons -->
  <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+2Qt1v7K8E5X29nLNXg+CWEN/q97Gq0pM8R1+5/FQJpD1T2U2E5WPsV95U15uA=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />

  <!-- Chart.js for charts & graphs -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- AOS (Animate On Scroll) for scroll animations -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

  <!-- GSAP (GreenSock) for advanced animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

  <!-- Lottie for JSON-based animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

  <!-- Swiper.js for sliders/carousels -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

  <!-- Optional: Tooltip & Popover Library (Tippy.js) -->
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
  <script src="https://unpkg.com/@popperjs/core@2"></script>
  <script src="https://unpkg.com/tippy.js@6"></script>
</head>

{code}

</html>`;

type props={
    slide:{code:string};
    colors:any
}

function SliderFrame({slide,colors }: props) {
  const FINAL_CODE = HTML_DEFAULT
    .replace("{colorCodes}", JSON.stringify(colors))
    .replace("{code}", slide?.code);

  const iframeRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const selectedElRef = useRef<HTMLElement | null>(null);
  const [cardPosition, setCardPosition] = useState<{ x: number, y: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_updatedSliderCode, setUpdatedSliderCode] = useState<string>('');

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Write the HTML inside the iframe
=======
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
</head>
{code}
</html>`;

type FloatingActionToolProps = {
  position: { x: number; y: number } | null;
  onClose: () => void;
  loading: boolean;
  handleAiChange: (value: string) => void;
}

function FloatingActionTool({ position, onClose, loading, handleAiChange }: FloatingActionToolProps) {
  const [inputValue, setInputValue] = useState('');

  if (!position) return null;

  const handleSubmit = () => {
    if (inputValue.trim()) {
      handleAiChange(inputValue);
      setInputValue('');
    }
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-xl border p-3 min-w-[300px]"
      style={{ left: position.x - 150, top: position.y + 10 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center gap-1">
          <Wand2 className="w-4 h-4" /> AI Edit
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Describe changes..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={loading}
          className="flex-1"
        />
        <Button size="sm" onClick={handleSubmit} disabled={loading || !inputValue.trim()}>
          {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : 'Apply'}
        </Button>
      </div>
    </div>
  );
}

type SliderFrameProps = {
  slide: { code: string };
  colors: any;
}

function SliderFrame({ slide, colors }: SliderFrameProps) {
  const FINAL_CODE = HTML_DEFAULT
    .replace("{colorCodes}", JSON.stringify(colors || {}))
    .replace("{code}", slide?.code || '');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(false);
  const selectedElRef = useRef<HTMLElement | null>(null);
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!iframeRef.current || !slide?.code) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
    doc.open();
    doc.write(FINAL_CODE);
    doc.close();

<<<<<<< HEAD
    // Allow iframe to capture keyboard events
    // doc.body.setAttribute("tabindex", "0");

=======
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) {
        hoverEl.style.outline = "";
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
<<<<<<< HEAD
      e.stopPropagation(); // ✅ allow editing text inside
=======
      e.stopPropagation();
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
      const target = e.target as HTMLElement;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
      selectedElRef.current = target;
<<<<<<< HEAD

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
=======
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
      selectedEl.style.outline = "2px solid blue";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();

<<<<<<< HEAD
      console.log("Selected element:", selectedEl);

      // ✅ Calculate position relative to iframe container
=======
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
      const rect = target.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();

      setCardPosition({
        x: iframeRect.left + rect.left + rect.width / 2,
        y: iframeRect.top + rect.bottom
      });
    };

<<<<<<< HEAD
    const handleBlur = () => {
      if (selectedEl) {
        console.log("Final edited element:", selectedEl.outerHTML);
        const newSliderCode = iframe.contentDocument?.body?.innerHTML;
        console.log(newSliderCode);
        setUpdatedSliderCode(newSliderCode || '');
      }
    };

=======
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
<<<<<<< HEAD
        selectedEl.removeEventListener("blur", handleBlur);
        selectedEl = null;
      }
    };

    // ✅ Wait for DOM content to be ready
    doc.addEventListener("DOMContentLoaded", () => {
=======
        selectedEl = null;
        setCardPosition(null);
      }
    };

    const setupListeners = () => {
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
      doc.body?.addEventListener("mouseover", handleMouseOver);
      doc.body?.addEventListener("mouseout", handleMouseOut);
      doc.body?.addEventListener("click", handleClick);
      doc.body?.addEventListener("keydown", handleKeyDown);
<<<<<<< HEAD
    });

    // ✅ Cleanup listeners on unmount
=======
    };

    setTimeout(setupListeners, 100);

>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc.body?.removeEventListener("keydown", handleKeyDown);
    };
<<<<<<< HEAD

  }, [slide?.code]);

  const handleAiSectionChange = async (userAiPrompt: string) => {
    setLoading(true);

    const selectedEl = selectedElRef.current;
    const iframe = iframeRef.current;

    if (!selectedEl || !iframe) return;

    // Get the current HTML of the selected element
    const oldHTML = selectedEl.outerHTML;

    // Build AI prompt
    const prompt = `
  Regenerate or rewrite the following HTML code based on this user instruction.
  If user asked to change the image/regenerate the image then make sure to use ImageKit:
  '${IMAGEKIT_BASE_URL}/prompt-{imagePrompt}/{altImageName}.jpg'
  Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.
  If user want to crop image, or remove background or scale image or optimize image then add image kit ai transformation
  by providing tr=fo-auto,<other transformation> etc.
  User instruction is : ${userAiPrompt}
  HTML code:
  ${oldHTML}
  `;

    try {
      const result = await GeminiAiModel.generateContent(prompt); // 🤖 GEMINI AI CALL
      const newHTML = (await result.response.text()).trim();

      // ✅ Replace only the selected element
      const tempDiv = iframe.contentDocument?.createElement("div");
      if (tempDiv) {
        tempDiv.innerHTML = newHTML;
        const newNode = tempDiv.firstElementChild;

        if (newNode && selectedEl.parentNode) {
          selectedEl.parentNode.replaceChild(newNode, selectedEl);
          selectedElRef.current = newNode as HTMLElement;
          console.log("✅ Element replaced successfully");

          const newSliderCode =
            iframe.contentDocument?.body?.innerHTML || newHTML;
          console.log(newSliderCode);
          setUpdatedSliderCode(newSliderCode);
        }
      }

    } catch (err) {
      console.error("AI generation failed:", err);
    }

    setLoading(false);
  };

  return (
    <div className="mb-5">
      <iframe
        ref={iframeRef}
        className="w-[800px] h-[500px] border-0 rounded-2xl"
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
      />

=======
  }, [slide?.code, FINAL_CODE]);

  const handleAiSectionChange = async (userAiPrompt: string) => {
    setLoading(true);
    console.log("AI Edit Request:", userAiPrompt);
    setTimeout(() => {
      setLoading(false);
      setCardPosition(null);
    }, 1000);
  };

  if (!slide?.code) {
    return (
      <div className="mb-5 w-[800px] h-[500px] border rounded-2xl flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">No slide content</p>
      </div>
    );
  }

  return (
    <div className="mb-5 relative">
      <iframe
        ref={iframeRef}
        className="w-[800px] h-[500px] border-0 rounded-2xl shadow-lg"
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
      />
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
      <FloatingActionTool
        position={cardPosition}
        onClose={() => setCardPosition(null)}
        loading={loading}
<<<<<<< HEAD
        handleAiChange={(value: string) => handleAiSectionChange(value)}
=======
        handleAiChange={handleAiSectionChange}
>>>>>>> 49924b5 (Add Malayalam language support for slide generation)
      />
    </div>
  );
}

export default SliderFrame
