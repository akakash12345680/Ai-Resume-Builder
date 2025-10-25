"use client";

import { useFormContext } from 'react-hook-form';
import ModernTemplate from '@/components/templates/Modern';

export default function Preview() {
  const { watch } = useFormContext();
  const resumeData = watch();

  return (
    <div className="sticky top-0">
      <div id="resume-preview" className="w-full aspect-[8.5/11] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="transform scale-[0.8] origin-top">
          <ModernTemplate resume={resumeData} />
        </div>
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none;
            box-shadow: none;
            border-radius: 0;
            transform: scale(1) !important;
          }
           div.transform {
            transform: scale(1) !important;
          }
        }
      `}</style>
    </div>
  );
}
