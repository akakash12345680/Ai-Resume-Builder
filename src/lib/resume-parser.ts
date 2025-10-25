import type { Resume } from './types';

export function parseResumeText(text: string): Partial<Resume> {
  const resume: Partial<Resume> = {
    experience: [],
    education: [],
    projects: [],
  };
  const lines = text.split('\n').filter(line => line.trim() !== '');

  let currentSection: string | null = null;
  
  // Basic contact info parsing from the top
  if (lines.length > 0) resume.name = lines[0];
  if (lines.length > 1) {
    const contactLine = lines[1];
    resume.email = contactLine.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || '';
    resume.phone = contactLine.match(/(\(\d{3}\)\s*|\d{3}-)\d{3}-\d{4}/)?.[0] || '';
    resume.linkedin = contactLine.match(/linkedin\.com\/in\/[\w-]+/)?.[0] || '';
  }


  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase().trim();
    if (lowerLine.startsWith('summary')) {
      currentSection = 'summary';
      resume.summary = '';
    } else if (lowerLine.startsWith('skills')) {
      currentSection = 'skills';
      resume.skills = '';
    } else if (lowerLine.startsWith('experience')) {
      currentSection = 'experience';
    } else if (lowerLine.startsWith('education')) {
      currentSection = 'education';
    } else if (lowerLine.startsWith('projects')) {
      currentSection = 'projects';
    } else {
      if (currentSection) {
        switch (currentSection) {
          case 'summary':
            resume.summary += line + '\n';
            break;
          case 'skills':
            resume.skills += line + '\n';
            break;
        }
      }
    }
  });

  // More complex parsing for multi-line sections
  const parseMultiLineSection = (startKeyword: string, endKeywords: string[]) => {
    const startIndex = lines.findIndex(line => line.toLowerCase().startsWith(startKeyword));
    if (startIndex === -1) return [];

    let endIndex = lines.length;
    for (const endKeyword of endKeywords) {
      const foundIndex = lines.findIndex((line, i) => i > startIndex && line.toLowerCase().startsWith(endKeyword));
      if (foundIndex !== -1) {
        endIndex = foundIndex;
        break;
      }
    }
    return lines.slice(startIndex + 1, endIndex);
  };
  
  const experienceLines = parseMultiLineSection('experience', ['education', 'projects']);
  let currentExperience = null;
  for(const line of experienceLines) {
    if (line.match(/^Role:/i) || line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/)) { // Title case role or "Role:"
      if(currentExperience) resume.experience?.push(currentExperience);
      currentExperience = { id: crypto.randomUUID(), role: line.replace(/^Role:/i, '').trim(), company: '', date: '', description: '' };
    } else if (line.match(/^Company:/i) || line.includes(' at ')) {
        if(currentExperience) currentExperience.company = line.replace(/^Company:/i, '').replace(' at ', '').trim();
    } else if (line.match(/^Date:/i) || line.match(/\w+ \d{4} - \w+/)) {
        if(currentExperience) currentExperience.date = line.replace(/^Date:/i, '').trim();
    } else if(line.trim().startsWith('-') || line.trim().startsWith('*')) {
        if(currentExperience) currentExperience.description += line.trim() + '\n';
    }
  }
  if (currentExperience) resume.experience?.push(currentExperience);

  const educationLines = parseMultiLineSection('education', ['projects', 'experience']);
  let currentEducation = null;
  for(const line of educationLines) {
    if(line.match(/^Degree:/i)) {
      if(currentEducation) resume.education?.push(currentEducation);
      currentEducation = { id: crypto.randomUUID(), degree: line.replace(/^Degree:/i, '').trim(), university: '', date: '' };
    } else if (line.match(/^University:/i)) {
        if(currentEducation) currentEducation.university = line.replace(/^University:/i, '').trim();
    } else if (line.match(/^Date:/i)) {
        if(currentEducation) currentEducation.date = line.replace(/^Date:/i, '').trim();
    }
  }
  if (currentEducation) resume.education?.push(currentEducation);


  const projectLines = parseMultiLineSection('projects', ['experience', 'education']);
  let currentProject = null;
  for(const line of projectLines) {
    if(line.match(/^Name:/i)) {
        if(currentProject) resume.projects?.push(currentProject);
        currentProject = { id: crypto.randomUUID(), name: line.replace(/^Name:/i, '').trim(), description: '' };
    } else if (line.match(/^Description:/i)) {
        if(currentProject) currentProject.description = line.replace(/^Description:/i, '').trim();
    } else {
        if(currentProject) currentProject.description += ' ' + line.trim();
    }
  }
  if (currentProject) resume.projects?.push(currentProject);


  // Clean up summaries
  if (resume.summary) resume.summary = resume.summary.trim();
  if (resume.skills) resume.skills = resume.skills.trim();

  return resume;
}
