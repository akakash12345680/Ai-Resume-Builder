import type { Resume } from '@/lib/types';
import { Mail, Phone, Linkedin } from 'lucide-react';

interface ModernTemplateProps {
  resume: Resume;
}

const ModernTemplate = ({ resume }: ModernTemplateProps) => {
  const { name, email, phone, linkedin, summary, skills, experience, education, projects } = resume;

  return (
    <div className="p-8 bg-white text-gray-800 font-body text-[10.5pt] leading-relaxed">
      <header className="text-center mb-6 border-b-2 border-gray-200 pb-4">
        <h1 className="font-headline text-[32pt] font-bold text-gray-800">{name || "Your Name"}</h1>
        <div className="flex justify-center items-center gap-5 mt-2 text-gray-600 text-[10pt]">
          {email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {email}</span>}
          {phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {phone}</span>}
          {linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5"/> {linkedin}</span>}
        </div>
      </header>

      <main className="space-y-5">
        {summary && (
          <section>
            <h2 className="font-headline text-[13pt] font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {skills && (
          <section>
            <h2 className="font-headline text-[13pt] font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.split(',').map((skill, index) => (
                skill.trim() && <span key={index} className="bg-primary/10 text-primary text-[9pt] font-medium px-2.5 py-1 rounded">{skill.trim()}</span>
              ))}
            </div>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <h2 className="font-headline text-[13pt] font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-headline font-bold text-gray-800 text-[11.5pt]">{exp.role}</h3>
                    <span className="text-gray-500 font-medium text-[9.5pt]">{exp.date}</span>
                  </div>
                  <h4 className="font-medium text-gray-600 mb-1">{exp.company}</h4>
                  <ul className="list-disc list-outside pl-5 text-gray-700 space-y-1">
                    {exp.description.split('\n').map((desc, i) => desc.trim() && <li key={i}>{desc.replace(/^- /, '')}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section>
            <h2 className="font-headline text-[13pt] font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-headline font-bold text-gray-800 text-[11.5pt]">{proj.name}</h3>
                  <p className="text-gray-700">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="font-headline text-[13pt] font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-headline font-bold text-gray-800 text-[11.5pt]">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.university}</p>
                  </div>
                  <span className="text-gray-500 font-medium text-[9.5pt]">{edu.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;
