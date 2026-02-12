import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

async function renderHtmlToImage(html: string, width = 1280, height = 720) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = width + 'px';
  container.style.height = height + 'px';
  container.innerHTML = html;
  document.body.appendChild(container);

  // Wait a tick for fonts/styles to apply
  await new Promise((r) => setTimeout(r, 50));

  const canvas = await html2canvas(container as HTMLElement, {scale: 2, useCORS: true, allowTaint: true});
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

  document.body.removeChild(container);
  return { dataUrl, width: canvas.width, height: canvas.height };
}

export async function exportSlidesAsPPT(slides: string[], fileName = 'slides.pptx') {
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE';

  for (let i = 0; i < slides.length; i++) {
    try {
      const { dataUrl } = await renderHtmlToImage(slides[i], 1280, 720);
      const slide = pres.addSlide();
      slide.addImage({ data: dataUrl, x: 0, y: 0, w: pres.width, h: pres.height });
    } catch (err) {
      console.error('Error rendering slide', i, err);
    }
  }

  await pres.writeFile({ fileName });
}

export async function exportSlidesAsPDF(slides: string[], fileName = 'slides.pdf') {
  const pdf = new jsPDF({ unit: 'px', format: [1280, 720] });

  for (let i = 0; i < slides.length; i++) {
    try {
      const { dataUrl, width, height } = await renderHtmlToImage(slides[i], 1280, 720);
      // add image and if more slides, add a new page after
      pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height);
      if (i < slides.length - 1) pdf.addPage([1280, 720], 'landscape');
    } catch (err) {
      console.error('Error rendering slide for PDF', i, err);
    }
  }

  pdf.save(fileName);
}
