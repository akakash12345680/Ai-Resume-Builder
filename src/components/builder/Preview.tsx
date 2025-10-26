"use client";

import { useFormContext } from 'react-hook-form';
import ModernTemplate from '@/components/templates/Modern';
import ClassicTemplate from '@/components/templates/Classic';
import CreativeTemplate from '@/components/templates/Creative';
import type { Resume } from '@/lib/types';

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
};

export default function Preview() {
  const { watch } = useFormContext<Resume>();
  const resumeData = watch();
  const templateName = resumeData.template || 'modern';

  const SelectedTemplate = templates[templateName as keyof typeof templates] || ModernTemplate;

  return (
    <div className="sticky top-0">
      <div id="resume-preview" className="w-full aspect-[8.5/11] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div id="resume-preview-content">
            <SelectedTemplate resume={resumeData} />
        </div>
      </div>
    </div>
  );
}

    