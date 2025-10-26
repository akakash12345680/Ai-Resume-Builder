import type { Resume } from '@/lib/types';
import { Mail, Phone, Linkedin } from 'lucide-react';

interface ClassicTemplateProps {
  resume: Resume;
}

const ClassicTemplate = ({ resume }: ClassicTemplateProps) => {
  const { name, email, phone, linkedin, summary, skills, experience, education, projects } = resume;

  return (
    <div className="p-10 bg-white text-gray-900 font-serif text-[11px] leading-relaxed">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-widest uppercase">{name || "Your Name"}</h1>
        <div className="flex justify-center items-center gap-6 mt-3 text-gray-600 text-xs">
          {email && <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/> {email}</span>}
          {phone && <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5"/> {phone}</span>}
          {linkedin && <span className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5"/> {linkedin}</span>}
        </div>
      </header>
      
      <div className="w-full h-px bg-gray-300 mb-8" />

      <main className="space-y-8">
        {summary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">Summary</h2>
            <p className="text-gray-800">{summary}</p>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">Experience</h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold">{exp.role}</h3>
                    <span className="text-sm text-gray-600 font-medium">{exp.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold italic text-gray-700 mb-1">{exp.company}</h4>
                  <ul className="list-disc list-outside pl-5 text-gray-800 space-y-1">
                    {exp.description.split('\n').map((desc, i) => desc.trim() && <li key={i}>{desc.replace(/^- /, '')}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">Skills</h2>
            <p className="text-gray-800">{skills}</p>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-bold">{edu.degree}</h3>
                    <p className="text-gray-700 italic">{edu.university}</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{edu.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-3">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="text-base font-bold">{proj.name}</h3>
                  <p className="text-gray-800">{proj.description}</p>
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

    