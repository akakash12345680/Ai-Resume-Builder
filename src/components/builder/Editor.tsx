"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle, GripVertical, Save } from 'lucide-react';
import type { Resume } from '@/lib/types';
import AtsAnalyzer from './AtsAnalyzer';

interface EditorProps {
    onSave: () => void;
}

export default function Editor({ onSave }: EditorProps) {
  const { register, control, formState: { errors, isDirty } } = useFormContext<Resume>();

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

  const handlePrint = () => {
    window.print();
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

       <div className="flex gap-2">
          <AtsAnalyzer />
          <Button onClick={handlePrint} variant="outline">Download PDF</Button>
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

// Helper to access form values for trigger title
function watch(name: string) {
    const { watch } = useFormContext();
    return watch(name);
}
