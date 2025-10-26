import type { Resume } from '@/lib/types';
import { Mail, Phone, Linkedin } from 'lucide-react';

interface ClassicTemplateProps {
  resume: Resume;
}

const ClassicTemplate = ({ resume }: ClassicTemplateProps) => {
  const { name, email, phone, linkedin, summary, skills, experience, education, projects } = resume;

  return (
    <div className="p-8 bg-white text-gray-900 font-body text-[11pt] leading-normal">
      <header className="text-center mb-6">
        <h1 className="text-[28pt] font-bold tracking-wider uppercase font-headline">{name || "Your Name"}</h1>
        <div className="flex justify-center items-center gap-6 mt-2 text-gray-700 text-[10pt]">
          {email && <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/> {email}</span>}
          {phone && <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5"/> {phone}</span>}
          {linkedin && <span className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5"/> {linkedin}</span>}
        </div>
      </header>
      
      <div className="w-full h-px bg-gray-300 mb-6" />

      <main className="space-y-6">
        {summary && (
          <section>
            <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Summary</h2>
            <p className="text-gray-800">{summary}</p>
          </section>
        )}

        {skills && (
          <section>
            <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Skills</h2>
            <p className="text-gray-800">{skills}</p>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12pt] font-bold">{exp.role}</h3>
                    <span className="text-[10pt] text-gray-600 font-medium">{exp.date}</span>
                  </div>
                  <h4 className="text-[11pt] font-semibold italic text-gray-700 mb-1">{exp.company}</h4>
                  <ul className="list-disc list-outside pl-5 text-gray-800 space-y-1">
                    {exp.description.split('\n').map((desc, i) => desc.trim() && <li key={i}>{desc.replace(/^- /, '')}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="text-[12pt] font-bold">{proj.name}</h3>
                  <p className="text-gray-800">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="text-[14pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[12pt] font-bold">{edu.degree}</h3>
                    <p className="text-gray-700 italic">{edu.university}</p>
                  </div>
                  <span className="text-[10pt] text-gray-600 font-medium">{edu.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default ClassicTemplate;
