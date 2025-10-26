"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import jsPDF from 'jspdf';
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
import { useWatch } from 'react-hook-form';
import ExperienceItem from './ExperienceItem';


interface EditorProps {
    onSave: () => void;
}

export default function Editor({ onSave }: EditorProps) {
  const { register, control, formState: { errors, isDirty }, setValue, getValues } = useFormContext<Resume>();
  const selectedTemplate = useWatch({ control, name: 'template' });

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

  const handleDownloadPdf = () => {
    const resume = getValues();
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4',
    });

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 30;
    let y = margin;

    // Helper function to add text and manage y position
    const addText = (text: string | string[], options: any, startY?: number) => {
        if (startY) y = startY;
        doc.setFontSize(options.fontSize || 11);
        const textLines = doc.splitTextToSize(text, pageWidth - margin * 2);
        const textHeight = doc.getTextDimensions(textLines).h;

        if (y + textHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }

        doc.text(textLines, margin, y, options);
        y += textHeight + (options.lineHeightFactor || 1.15) * doc.getFontSize() / 2; // Add some padding after text
    };
    
    // --- Header ---
    doc.setFont('helvetica', 'bold');
    addText(resume.name, { align: 'center', fontSize: 28, lineHeightFactor: 1 }, pageWidth / 2);
    y -= 10;
    
    doc.setFont('helvetica', 'normal');
    const contactInfo = [resume.email, resume.phone, resume.linkedin].filter(Boolean).join(' | ');
    addText(contactInfo, { align: 'center', fontSize: 10, lineHeightFactor: 1 }, pageWidth/2);
    y += 10;
    
    // Add a line separator
    doc.setDrawColor(200); // Light gray
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    // --- Sections ---
    const addSection = (title: string, content: () => void) => {
      if (y > pageHeight - margin - 50) { // Check if there's enough space for a new section
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', 'bold');
      addText(title.toUpperCase(), { fontSize: 12, lineHeightFactor: 1.2 });
      y -= 5;
      doc.setDrawColor(150);
      doc.line(margin, y, pageWidth - margin, y);
      y += 15;
      doc.setFont('helvetica', 'normal');
      content();
      y += 15; // Space after section
    };
    
    // Summary
    if (resume.summary) {
        addSection('Summary', () => {
            addText(resume.summary, { fontSize: 10 });
        });
    }

    // Skills
    if (resume.skills) {
        addSection('Skills', () => {
            addText(resume.skills.split(',').map(s => s.trim()).join(', '), { fontSize: 10 });
        });
    }
    
    // Experience
    if (resume.experience?.length > 0) {
        addSection('Experience', () => {
            resume.experience.forEach((exp, index) => {
                if (index > 0) y += 10;
                doc.setFont('helvetica', 'bold');
                addText(`${exp.role}`, { fontSize: 11 });
                doc.setFont('helvetica', 'italic');
                addText(`${exp.company} | ${exp.date}`, { fontSize: 10 });
                doc.setFont('helvetical', 'normal');
                const descriptionPoints = exp.description.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*')).map(line => line.trim());
                descriptionPoints.forEach(point => {
                  addText(`\u2022 ${point.substring(1).trim()}`, { fontSize: 10 });
                });
            });
        });
    }

    // Projects
    if (resume.projects?.length > 0) {
        addSection('Projects', () => {
            resume.projects.forEach((proj, index) => {
                if (index > 0) y += 10;
                doc.setFont('helvetica', 'bold');
                addText(proj.name, { fontSize: 11 });
                doc.setFont('helvetica', 'normal');
                addText(proj.description, { fontSize: 10 });
            });
        });
    }

    // Education
    if (resume.education?.length > 0) {
        addSection('Education', () => {
            resume.education.forEach((edu) => {
                doc.setFont('helvetica', 'bold');
                addText(edu.degree, { fontSize: 11 });
                doc.setFont('helvetica', 'normal');
                addText(`${edu.university} | ${edu.date}`, { fontSize: 10 });
                 y+=5;
            });
        });
    }

    doc.save(`${resume.name.replace(/\s/g, '_')}_Resume.pdf`);
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
                    <Palette className="mr-2"/>
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
                <FileDown className="mr-2" />
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
            <ExperienceItem
              key={field.id}
              index={index}
              field={field}
              onRemove={() => removeExperience(index)}
              control={control}
              register={register}
            />
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
