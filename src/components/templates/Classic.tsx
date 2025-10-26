import type { Resume } from '@/lib/types';
import { Mail, Phone, Linkedin, MapPin } from 'lucide-react';

interface ClassicTemplateProps {
  resume: Resume;
}

const ClassicTemplate = ({ resume }: ClassicTemplateProps) => {
  const { name, email, phone, linkedin, summary, skills, experience, education, projects } = resume;

  return (
    <div className="p-8 bg-white text-gray-900 font-body text-[10pt] leading-normal">
      <header className="text-center mb-6">
        <h1 className="text-[28pt] font-bold tracking-wider uppercase font-headline">{name || "Your Name"}</h1>
        <div className="flex justify-center items-center gap-x-6 gap-y-1 flex-wrap mt-2 text-gray-700 text-[9pt]">
          {email && <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/> {email}</span>}
          {phone && <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5"/> {phone}</span>}
          {linkedin && <span className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5"/> {linkedin}</span>}
        </div>
      </header>
      
      <div className="w-full h-px bg-gray-300 mb-6" />

      <main className="flex gap-8">
        {/* Left Column */}
        <div className="w-2/3 space-y-5">
           {summary && (
            <section>
              <h2 className="text-[12pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Summary</h2>
              <p className="text-gray-800 text-[9.5pt]">{summary}</p>
            </section>
          )}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-[12pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[11pt] font-bold">{exp.role}</h3>
                      <span className="text-[9pt] text-gray-600 font-medium">{exp.date}</span>
                    </div>
                    <h4 className="text-[10pt] font-semibold italic text-gray-700 mb-1">{exp.company}</h4>
                    <ul className="list-disc list-outside pl-4 text-gray-800 space-y-1 text-[9.5pt]">
                      {exp.description.split('\n').map((desc, i) => desc.trim() && <li key={i}>{desc.replace(/^- /, '')}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="w-1/3 space-y-5">
          {skills && (
            <section>
              <h2 className="text-[12pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Skills</h2>
              <p className="text-gray-800 text-[9.5pt]">{skills.split(',').join(', ')}</p>
            </section>
          )}
           {projects && projects.length > 0 && (
            <section>
              <h2 className="text-[12pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Projects</h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="text-[11pt] font-bold">{proj.name}</h3>
                    <p className="text-gray-800 text-[9.5pt]">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-[12pt] font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2 font-headline">Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                      <h3 className="text-[11pt] font-bold">{edu.degree}</h3>
                      <p className="text-gray-700 italic text-[10pt]">{edu.university}</p>
                      <p className="text-[9pt] text-gray-600 font-medium">{edu.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClassicTemplate;
