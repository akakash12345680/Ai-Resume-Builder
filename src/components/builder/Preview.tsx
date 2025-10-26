"use client";

import { useFormContext } from 'react-hook-form';
import ModernTemplate from '@/components/templates/Modern';

export default function Preview() {
  const { watch } = useFormContext();
  const resumeData = watch();

  return (
    <div className="sticky top-0">
      <div id="resume-preview" className="w-full aspect-[8.5/11] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div id="resume-preview-content">
            <ModernTemplate resume={resumeData} />
        </div>
      </div>
    </div>
  );
}
