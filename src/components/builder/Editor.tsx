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

    const addText = (text: string | string[], options: any = {}, startY?: number) => {
        if (startY) y = startY;
        const { align, fontSize = 11, fontStyle = 'normal', color = '#000', x = margin } = options;

        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        doc.setTextColor(color);

        const maxWidth = options.maxWidth || pageWidth - margin * 2;
        const textLines = doc.splitTextToSize(text, maxWidth);
        const textHeight = doc.getTextDimensions(textLines).h;

        if (y + textHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
        
        let textX = x;
        if(align === 'center') {
            textX = pageWidth / 2
        } else if (align === 'right') {
            textX = pageWidth - margin;
        }

        doc.text(textLines, textX, y, { align });
        y += textHeight + (options.lineSpacing || 0);
    };

    const addSectionTitle = (title: string, options: any = {}) => {
       const {fontSize = 12, fontStyle='bold', color='#000', underlineColor = '#ccc', yOffset = 15, x = margin, maxWidth = pageWidth - margin * 2} = options;

        if (y + 30 > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        addText(title, { fontSize, fontStyle, color, x, maxWidth});
        y += 2;
        doc.setDrawColor(underlineColor);
        doc.line(x, y, x + maxWidth, y);
        y += yOffset;
    };


    switch(selectedTemplate) {
        case 'creative':
            const sidebarWidth = pageWidth * 0.33;
            const contentWidth = pageWidth - sidebarWidth - margin * 2;
            const sidebarX = 0;
            const contentX = sidebarWidth + margin;
            
            let ySidebar = 0;
            let yContent = 0;

            // --- Sidebar ---
            doc.setFillColor(47, 62, 80); // bg-slate-800
            doc.rect(sidebarX, 0, sidebarWidth, pageHeight, 'F');
            
            ySidebar = margin + 80;
            
            // Name
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#FFFFFF');
            const nameLines = doc.splitTextToSize(resume.name || "Your Name", sidebarWidth - 20);
            doc.text(nameLines, sidebarWidth / 2, margin + 40, { align: 'center' });

            // Line
            ySidebar = margin + 50 + doc.getTextDimensions(nameLines).h;
            doc.setDrawColor(71, 85, 105); // bg-slate-600
            doc.setLineWidth(1);
            doc.line(sidebarX + 15, ySidebar, sidebarWidth - 15, ySidebar);
            ySidebar += 20;

            // Contact
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#d1d5db'); // text-slate-300
            doc.text('CONTACT', 15, ySidebar);
            ySidebar += 15;
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor('#d1d5db');
            if (resume.email) {
              const emailLines = doc.splitTextToSize(resume.email, sidebarWidth - 30);
              doc.text(emailLines, 15, ySidebar);
              ySidebar += doc.getTextDimensions(emailLines).h + 5;
            }
            if (resume.phone) {
              doc.text(resume.phone, 15, ySidebar);
              ySidebar += 12;
            }
             if (resume.linkedin) {
              const linkedinLines = doc.splitTextToSize(resume.linkedin, sidebarWidth - 30);
              doc.text(linkedinLines, 15, ySidebar);
              ySidebar += doc.getTextDimensions(linkedinLines).h + 5;
            }
            ySidebar += 15;

            // Skills
             if (resume.skills) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor('#d1d5db');
              doc.text('SKILLS', 15, ySidebar);
              ySidebar += 15;
              
              doc.setFontSize(9);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor('#FFFFFF');
              const skills = resume.skills.split(',').map(s => s.trim()).filter(s => s);
              
              const chipPadding = 5;
              const chipMargin = 3;
              let currentX = 15;

              skills.forEach(skill => {
                  const skillWidth = doc.getTextDimensions(skill).w + chipPadding * 2;
                  if (currentX + skillWidth > sidebarWidth - 15) {
                      currentX = 15;
                      ySidebar += 14;
                  }
                  doc.setFillColor(30, 41, 59);
                  doc.roundedRect(currentX, ySidebar - 9, skillWidth, 12, 2, 2, 'F');
                  doc.text(skill, currentX + chipPadding, ySidebar);
                  currentX += skillWidth + chipMargin;
              });
             }

            // --- Main Content ---
            yContent = margin;

            const addContentSection = (title: string, contentFn: () => void) => {
              if (yContent > pageHeight - margin - 50) { 
                doc.addPage();
                // Redraw sidebar on new page
                doc.setFillColor(47, 62, 80);
                doc.rect(sidebarX, 0, sidebarWidth, pageHeight, 'F');
                yContent = margin;
              }
              doc.setFontSize(14);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(51, 65, 85); // text-slate-700
              doc.text(title.toUpperCase(), contentX, yContent);
              yContent += 5;
              doc.setDrawColor(226, 232, 240); // border-slate-200
              doc.setLineWidth(1.5);
              doc.line(contentX, yContent, pageWidth - margin, yContent);
              yContent += 15;
              contentFn();
              yContent += 15;
            };

            // Summary
            if (resume.summary) {
              addContentSection('About Me', () => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(71, 85, 105); // text-slate-600
                const summaryLines = doc.splitTextToSize(resume.summary, contentWidth);
                doc.text(summaryLines, contentX, yContent);
                yContent += doc.getTextDimensions(summaryLines).h;
              });
            }
            
             // Experience
            if (resume.experience?.length) {
              addContentSection('Experience', () => {
                resume.experience.forEach(exp => {
                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.setTextColor(30, 41, 59); // text-slate-800
                  doc.text(exp.role, contentX, yContent);
                  
                  const dateWidth = doc.getTextDimensions(exp.date).w;
                  doc.setFontSize(9);
                  doc.setFont('helvetica', 'normal');
                  doc.setTextColor(100, 116, 139); // text-slate-500
                  doc.text(exp.date, pageWidth - margin, yContent, {align: 'right'});
                  yContent += 12;

                  doc.setFontSize(10);
                  doc.setFont('helvetica', 'normal');
                  doc.setTextColor(71, 85, 105); // text-slate-600
                  doc.text(exp.company, contentX, yContent);
                  yContent += 14;

                  const descriptionLines = exp.description.split('\n').filter(line => line.trim());
                  descriptionLines.forEach(line => {
                      doc.setFontSize(9.5);
                      doc.setTextColor(51, 65, 85); // text-slate-700
                      const bulletPoint = '\u2022';
                      const pointText = line.replace(/^- /, '').trim();
                      const pointLines = doc.splitTextToSize(pointText, contentWidth - 10);
                      
                      if (yContent + doc.getTextDimensions(pointLines).h > pageHeight - margin) {
                          doc.addPage();
                          doc.setFillColor(47, 62, 80);
                          doc.rect(sidebarX, 0, sidebarWidth, pageHeight, 'F');
                          yContent = margin;
                      }

                      doc.text(bulletPoint, contentX, yContent);
                      doc.text(pointLines, contentX + 10, yContent);
                      yContent += doc.getTextDimensions(pointLines).h + 3;
                  });
                   yContent += 10;
                });
              });
            }

            // Projects
            if (resume.projects?.length) {
                addContentSection('Projects', () => {
                    resume.projects.forEach(proj => {
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(30, 41, 59);
                        doc.text(proj.name, contentX, yContent);
                        yContent += 12;

                        doc.setFontSize(9.5);
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(51, 65, 85);
                        const descLines = doc.splitTextToSize(proj.description, contentWidth);
                        doc.text(descLines, contentX, yContent);
                        yContent += doc.getTextDimensions(descLines).h + 10;
                    });
                });
            }

            // Education
            if (resume.education?.length) {
                addContentSection('Education', () => {
                    resume.education.forEach(edu => {
                         doc.setFontSize(11);
                         doc.setFont('helvetica', 'bold');
                         doc.setTextColor(30, 41, 59);
                         doc.text(edu.degree, contentX, yContent);
                         
                         const dateWidth = doc.getTextDimensions(edu.date).w;
                         doc.setFontSize(9);
                         doc.setFont('helvetica', 'normal');
                         doc.setTextColor(100, 116, 139);
                         doc.text(edu.date, pageWidth - margin, yContent, {align: 'right'});
                         yContent += 12;

                         doc.setFontSize(10);
                         doc.setFont('helvetica', 'normal');
                         doc.setTextColor(71, 85, 105);
                         doc.text(edu.university, contentX, yContent);
                         yContent += 15;
                    })
                })
            }

            break;
        case 'classic':
            const leftColumnWidth = pageWidth * 0.66 - margin;
            const rightColumnWidth = pageWidth * 0.34 - margin * 2;
            const rightColumnX = pageWidth * 0.66;
            
            // Header
            addText(resume.name, { align: 'center', fontSize: 28, fontStyle: 'bold', lineSpacing: 5 });
            const contactInfo = [resume.email, resume.phone, resume.linkedin].filter(Boolean).join(' | ');
            addText(contactInfo, { align: 'center', fontSize: 10, lineSpacing: 10 });
            doc.setDrawColor(200);
            doc.line(margin, y, pageWidth - margin, y);
            y += 20;

            const startOfColumnsY = y;
            let yLeft = startOfColumnsY;
            let yRight = startOfColumnsY;

            // --- Left Column Content ---
            const renderLeftColumn = () => {
                y = yLeft;
                if (resume.summary) {
                    addSectionTitle('Summary', { yOffset: 10, maxWidth: leftColumnWidth });
                    addText(resume.summary, { fontSize: 10, maxWidth: leftColumnWidth, lineSpacing: 3 });
                    y += 15;
                }

                if (resume.experience?.length) {
                    addSectionTitle('Experience', { yOffset: 10, maxWidth: leftColumnWidth });
                    resume.experience.forEach(exp => {
                        addText(exp.role, { fontSize: 11, fontStyle: 'bold', maxWidth: leftColumnWidth, lineSpacing: 2 });
                        addText(`${exp.company} | ${exp.date}`, { fontSize: 10, fontStyle: 'italic', color: '#4a5568', maxWidth: leftColumnWidth, lineSpacing: 5 });
                        const descriptionPoints = exp.description.split('\n').filter(line => line.trim());
                        descriptionPoints.forEach(point => {
                            addText(`\u2022 ${point.replace(/^- /, '').trim()}`, { fontSize: 9.5, x: margin + 5, maxWidth: leftColumnWidth - 5, lineSpacing: 2 });
                        });
                        y += 10;
                    });
                }
                yLeft = y;
            };

            // --- Right Column Content ---
            const renderRightColumn = () => {
                y = yRight;
                if (resume.skills) {
                    addSectionTitle('Skills', { yOffset: 10, x: rightColumnX, maxWidth: rightColumnWidth });
                    addText(resume.skills, { fontSize: 9.5, x: rightColumnX, maxWidth: rightColumnWidth, lineSpacing: 3 });
                    y += 15;
                }

                if (resume.projects?.length) {
                    addSectionTitle('Projects', { yOffset: 10, x: rightColumnX, maxWidth: rightColumnWidth });
                    resume.projects.forEach(proj => {
                        addText(proj.name, { fontSize: 11, fontStyle: 'bold', x: rightColumnX, maxWidth: rightColumnWidth, lineSpacing: 2 });
                        addText(proj.description, { fontSize: 9.5, x: rightColumnX, maxWidth: rightColumnWidth, lineSpacing: 3 });
                        y += 10;
                    });
                }

                if (resume.education?.length) {
                    addSectionTitle('Education', { yOffset: 10, x: rightColumnX, maxWidth: rightColumnWidth });
                    resume.education.forEach(edu => {
                        addText(edu.degree, { fontSize: 11, fontStyle: 'bold', x: rightColumnX, maxWidth: rightColumnWidth, lineSpacing: 2 });
                        addText(edu.university, { fontSize: 10, fontStyle: 'italic', color: '#4a5568', x: rightColumnX, maxWidth: rightColumnWidth, lineSpacing: 2 });
                        addText(edu.date, { fontSize: 9, color: '#718096', x: rightColumnX, maxWidth: rightColumnWidth, lineSpacing: 3 });
                        y += 10;
                    });
                }
                yRight = y;
            };

            renderLeftColumn();
            renderRightColumn();

            // Add a new page if necessary
            if (Math.max(yLeft, yRight) > pageHeight - margin) {
              doc.addPage();
              yLeft = margin;
              yRight = margin;
              // Re-render might be needed on new page if content splits across pages, complex logic
            }
            
            break;
        case 'modern':
        default:
            // Header
            addText(resume.name, { align: 'center', fontSize: 32, fontStyle: 'bold', color: '#2d3748', lineSpacing: 10 });
            const modernContactInfo = [resume.email, resume.phone, resume.linkedin].filter(Boolean).join('  |  ');
            addText(modernContactInfo, { align: 'center', fontSize: 10, color: '#4a5568', lineSpacing: 10 });
            y += 5;
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, y, pageWidth - margin, y);
            y += 20;

            const modernSectionOptions = {
              fontSize: 13,
              fontStyle: 'bold',
              color: '#2b6cb0', // primary
              underlineColor: '#e2e8f0',
              yOffset: 10
            };
            
            // Summary
            if (resume.summary) {
                addSectionTitle('Summary', modernSectionOptions);
                addText(resume.summary, { fontSize: 10.5, color: '#4a5568', lineSpacing: 4 });
                y += 15;
            }

            // Skills
            if (resume.skills) {
                addSectionTitle('Skills', modernSectionOptions);
                addText(resume.skills, { fontSize: 10.5, color: '#4a5568', lineSpacing: 4 });
                y += 15;
            }

            // Experience
            if (resume.experience?.length) {
                addSectionTitle('Experience', modernSectionOptions);
                resume.experience.forEach(exp => {
                    doc.setFontSize(11.5);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor('#2d3748');
                    doc.text(exp.role, margin, y);

                    const dateWidth = doc.getTextDimensions(exp.date).w;
                    doc.setFontSize(9.5);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor('#718096');
                    doc.text(exp.date, pageWidth - margin, y, { align: 'right' });
                    y += 14;

                    doc.setFontSize(10.5);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor('#4a5568');
                    doc.text(exp.company, margin, y);
                    y += 14;

                    const descriptionPoints = exp.description.split('\n').filter(line => line.trim());
                    descriptionPoints.forEach(point => {
                        addText(`\u2022 ${point.replace(/^- /, '').trim()}`, { fontSize: 10.5, x: margin + 5, maxWidth: pageWidth - margin * 2 - 5, lineSpacing: 3, color: '#4a5568' });
                    });
                    y += 10;
                });
            }

            // Projects
            if (resume.projects?.length) {
                addSectionTitle('Projects', modernSectionOptions);
                resume.projects.forEach(proj => {
                    addText(proj.name, { fontSize: 11.5, fontStyle: 'bold', color: '#2d3748', lineSpacing: 4 });
                    addText(proj.description, { fontSize: 10.5, color: '#4a5568', lineSpacing: 4 });
                    y+= 10;
                });
            }

            // Education
            if (resume.education?.length) {
                addSectionTitle('Education', modernSectionOptions);
                resume.education.forEach(edu => {
                    doc.setFontSize(11.5);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor('#2d3748');
                    doc.text(edu.degree, margin, y);

                    const dateWidth = doc.getTextDimensions(edu.date).w;
                    doc.setFontSize(9.5);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor('#718096');
                    doc.text(edu.date, pageWidth - margin, y, { align: 'right' });
                    y += 14;

                    doc.setFontSize(10.5);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor('#4a5568');
                    doc.text(edu.university, margin, y);
                    y += 15;
                });
            }
            break;
    }

    doc.save(`${(resume.name || 'resume').replace(/\s/g, '_')}_${selectedTemplate}.pdf`);
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
