"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle, GripVertical, Save, FileDown, Palette } from 'lucide-react';
import type { Resume } from '@/lib/types';
import AtsAnalyzer from './AtsAnalyzer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface EditorProps {
    onSave: () => void;
}

export default function Editor({ onSave }: EditorProps) {
  const { register, control, formState: { errors, isDirty }, setValue, watch } = useFormContext<Resume>();
  const selectedTemplate = watch('template');

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects",
  });

  const handleDownloadPdf = async () => {
    const resumePreviewElement = document.getElementById('resume-preview-content');
    if (!resumePreviewElement) {
        console.error("Resume preview element not found");
        return;
    }

    const canvas = await html2canvas(resumePreviewElement, {
        scale: 4, // Higher scale for better quality
        useCORS: true,
        width: resumePreviewElement.scrollWidth,
        height: resumePreviewElement.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Maintain aspect ratio
    const ratio = canvasWidth / canvasHeight;
    let imgWidth = pdfWidth;
    let imgHeight = imgWidth / ratio;
    
    // If the image is taller than the page, scale it down to fit the height and adjust width accordingly
    if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = imgHeight * ratio;
    }

    let heightLeft = canvasHeight * (pdfWidth / canvasWidth); // Total height of the image in PDF units
    let position = 0;
    const imgDataAsPng = canvas.toDataURL('image/png');

    // Create a new PDF and add the image
    pdf.addImage(imgDataAsPng, 'PNG', 0, position, pdfWidth, heightLeft);
    heightLeft -= pdfHeight;

    // If content is longer than one page, add new pages
    while (heightLeft > 0) {
        position = heightLeft - (canvasHeight * (pdfWidth / canvasWidth));
        pdf.addPage();
        pdf.addImage(imgDataAsPng, 'PNG', 0, position, pdfWidth, canvasHeight * (pdfWidth / canvasWidth));
        heightLeft -= pdfHeight;
    }

    pdf.save("resume.pdf");
  };
  
  return (
    <div className="space-y-8">
      <div className='flex justify-between items-center'>
        <div>
            <h1 className="font-headline text-3xl font-bold">Resume Editor</h1>
            <p className="text-muted-foreground">Fine-tune your resume here. Changes will be reflected in the live preview.</p>
        </div>
        <Button onClick={onSave} disabled={!isDirty}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
        </Button>
      </div>

       <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="template-select" className="mb-2 block">Template</Label>
             <Select
                value={selectedTemplate}
                onValueChange={(value) => setValue('template', value, { shouldDirty: true })}
            >
                <SelectTrigger id="template-select" className="w-full">
                    <Palette />
                    <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="flex flex-1 items-end gap-2 min-w-[200px]">
            <AtsAnalyzer />
            <Button onClick={handleDownloadPdf} variant="outline" className="w-full">
                <FileDown />
                Download PDF
            </Button>
          </div>
      </div>
      
      <Separator />

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" {...register('linkedin')} />
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Summary</h2>
        <Textarea {...register('summary')} className="min-h-[120px]" />
        {errors.summary && <p className="text-sm text-destructive mt-1">{errors.summary.message}</p>}
      </section>

      <Separator />

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Skills</h2>
        <p className="text-sm text-muted-foreground mb-2">Enter skills separated by commas.</p>
        <Textarea {...register('skills')} className="min-h-[100px]" />
        {errors.skills && <p className="text-sm text-destructive mt-1">{errors.skills.message}</p>}
      </section>

      <Separator />

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline text-2xl font-semibold">Experience</h2>
          <Button variant="outline" size="sm" onClick={() => appendExperience({ id: crypto.randomUUID(), role: '', company: '', date: '', description: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </div>
        <Accordion type="multiple" className="space-y-4">
          {experienceFields.map((field, index) => (
            <AccordionItem key={field.id} value={field.id} className="border rounded-lg bg-background p-4 shadow-sm">
                <div className="flex items-center">
                    <GripVertical className="h-5 w-5 text-muted-foreground mr-2 cursor-grab"/>
                    <AccordionTrigger className="flex-1 font-headline text-lg py-0">
                        {watch(`experience.${index}.role`) || `Experience #${index + 1}`}
                    </AccordionTrigger>
                    <Button variant="ghost" size="icon" onClick={() => removeExperience(index)} className="ml-2 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              <AccordionContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Input {...register(`experience.${index}.role`)} />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input {...register(`experience.${index}.company`)} />
                  </div>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input {...register(`experience.${index}.date`)} placeholder="e.g., Jan 2020 - Present"/>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea {...register(`experience.${index}.description`)} className="min-h-[120px]" placeholder="Start each point with a hyphen (-)" />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline text-2xl font-semibold">Education</h2>
          <Button variant="outline" size="sm" onClick={() => appendEducation({ id: crypto.randomUUID(), degree: '', university: '', date: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </div>
        <div className="space-y-4">
          {educationFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg bg-background shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Label>Degree</Label>
                    <Input {...register(`education.${index}.degree`)} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeEducation(index)} className="ml-4 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
              <div>
                <Label>University</Label>
                <Input {...register(`education.${index}.university`)} />
              </div>
              <div>
                <Label>Date</Label>
                <Input {...register(`education.${index}.date`)} placeholder="e.g., 2018 - 2022" />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <Separator />
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline text-2xl font-semibold">Projects</h2>
          <Button variant="outline" size="sm" onClick={() => appendProject({ id: crypto.randomUUID(), name: '', description: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
        <div className="space-y-4">
          {projectFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg bg-background shadow-sm space-y-4">
               <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Label>Project Name</Label>
                    <Input {...register(`projects.${index}.name`)} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeProject(index)} className="ml-4 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              <div>
                <Label>Description</Label>
                <Textarea {...register(`projects.${index}.description`)} className="min-h-[80px]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
