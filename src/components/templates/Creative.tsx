import type { Resume } from '@/lib/types';
import { Mail, Phone, Linkedin, Briefcase, GraduationCap, Lightbulb } from 'lucide-react';

interface CreativeTemplateProps {
  resume: Resume;
}

const CreativeTemplate = ({ resume }: CreativeTemplateProps) => {
  const { name, email, phone, linkedin, summary, skills, experience, education, projects } = resume;

  return (
    <div className="flex bg-white text-[10pt] leading-snug h-full font-body">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-slate-800 text-white p-6 flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full bg-slate-700 mb-4 flex items-center justify-center">
          <span className="text-5xl font-headline text-slate-400">{name?.charAt(0) || 'U'}</span>
        </div>
        <h1 className="font-headline text-2xl font-bold">{name || "Your Name"}</h1>
        
        <div className="w-full h-px bg-slate-600 my-6" />

        <div className="w-full text-left space-y-5 text-[9pt]">
            <div>
                <h2 className="font-headline text-sm uppercase tracking-wider text-slate-300 mb-2">Contact</h2>
                 <div className="space-y-2 text-slate-300">
                    {email && <p className="flex items-center gap-2 break-all"><Mail className="w-3.5 h-3.5 flex-shrink-0" /> {email}</p>}
                    {phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 flex-shrink-0" /> {phone}</p>}
                    {linkedin && <p className="flex items-center gap-2 break-all"><Linkedin className="w-3.5 h-3.5 flex-shrink-0" /> {linkedin}</p>}
                </div>
            </div>

            {skills && (
              <div>
                <h2 className="font-headline text-sm uppercase tracking-wider text-slate-300 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.split(',').map((skill, index) => (
                    skill.trim() && <span key={index} className="bg-primary/80 text-primary-foreground text-[8pt] font-semibold px-2 py-1 rounded-sm">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-8 text-slate-800 space-y-5">
        {summary && (
          <section>
            <h2 className="flex items-center gap-2 font-headline text-lg font-bold uppercase tracking-wider text-slate-700 border-b-2 border-slate-200 pb-1 mb-2">
              About Me
            </h2>
            <p className="italic text-slate-600">{summary}</p>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 font-headline text-lg font-bold uppercase tracking-wider text-slate-700 border-b-2 border-slate-200 pb-1 mb-2">
              <Briefcase className="w-5 h-5"/> Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-headline font-bold text-slate-800 text-[11pt]">{exp.role}</h3>
                    <span className="text-slate-500 font-medium text-[9pt]">{exp.date}</span>
                  </div>
                  <h4 className="font-medium text-slate-600 mb-1">{exp.company}</h4>
                  <ul className="list-disc list-outside pl-4 text-slate-700 space-y-1 text-[9.5pt]">
                    {exp.description.split('\n').map((desc, i) => desc.trim() && <li key={i}>{desc.replace(/^- /, '')}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 font-headline text-lg font-bold uppercase tracking-wider text-slate-700 border-b-2 border-slate-200 pb-1 mb-2">
              <Lightbulb className="w-5 h-5"/> Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-headline font-bold text-slate-800 text-[11pt]">{proj.name}</h3>
                  <p className="text-slate-700 text-[9.5pt]">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
             <h2 className="flex items-center gap-2 font-headline text-lg font-bold uppercase tracking-wider text-slate-700 border-b-2 border-slate-200 pb-1 mb-2">
              <GraduationCap className="w-5 h-5"/> Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-headline font-bold text-slate-800 text-[11pt]">{edu.degree}</h3>
                    <p className="text-slate-600">{edu.university}</p>
                  </div>
                  <span className="text-slate-500 font-medium text-[9pt]">{edu.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CreativeTemplate;
