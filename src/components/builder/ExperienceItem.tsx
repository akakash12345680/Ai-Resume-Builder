"use client";

import { useWatch, Control, UseFormRegister } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Trash2 } from 'lucide-react';
import type { Resume, Experience } from '@/lib/types';

interface ExperienceItemProps {
  index: number;
  field: Experience & { id: string };
  onRemove: () => void;
  control: Control<Resume>;
  register: UseFormRegister<Resume>;
}

export default function ExperienceItem({ index, field, onRemove, control, register }: ExperienceItemProps) {
  const role = useWatch({
    control,
    name: `experience.${index}.role`,
  });

  return (
    <AccordionItem value={field.id} className="border rounded-lg bg-background p-4 shadow-sm">
      <div className="flex items-center">
        <GripVertical className="h-5 w-5 text-muted-foreground mr-2 cursor-grab" />
        <AccordionTrigger className="flex-1 font-headline text-lg py-0">
          {role || `Experience #${index + 1}`}
        </AccordionTrigger>
        <Button variant="ghost" size="icon" onClick={onRemove} className="ml-2 text-muted-foreground hover:text-destructive">
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
          <Input {...register(`experience.${index}.date`)} placeholder="e.g., Jan 2020 - Present" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea {...register(`experience.${index}.description`)} className="min-h-[120px]" placeholder="Start each point with a hyphen (-)" />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
