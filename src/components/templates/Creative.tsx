import type { Resume } from '@/lib/types';
import { Mail, Phone, Linkedin, Briefcase, GraduationCap, Lightbulb, Star } from 'lucide-react';

interface CreativeTemplateProps {
  resume: Resume;
}

const CreativeTemplate = ({ resume }: CreativeTemplateProps) => {
  const { name, email, phone, linkedin, summary, skills, experience, education, projects } = resume;

  return (
    <div className="flex bg-white text-[10px] leading-snug h-full font-body">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-slate-800 text-white p-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-slate-700 mb-6 flex items-center justify-center">
          <span className="text-6xl font-headline text-slate-400">{name?.charAt(0) || 'U'}</span>
        </div>
        <h1 className="font-headline text-3xl font-bold text-center">{name || "Your Name"}</h1>
        
        <div className="w-full mt-8 text-left space-y-4">
            <div>
                <h2 className="font-headline text-lg uppercase tracking-wider text-slate-300 mb-2">Contact</h2>
                 <div className="space-y-2 text-slate-300">
                    {email && <p className="flex items-center gap-2 break-all"><Mail className="w-3 h-3 flex-shrink-0" /> {email}</p>}
                    {phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3 flex-shrink-0" /> {phone}</p>}
                    {linkedin && <p className="flex items-center gap-2 break-all"><Linkedin className="w-3 h-3 flex-shrink-0" /> {linkedin}</p>}
                </div>
            </div>

            {skills && (
              <div>
                <h2 className="font-headline text-lg uppercase tracking-wider text-slate-300 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.split(',').map((skill, index) => (
                    skill.trim() && <span key={index} className="bg-primary/80 text-primary-foreground text-[9px] font-semibold px-2.5 py-1 rounded">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-8 text-slate-800 space-y-6">
        {summary && (
          <section>
            <p className="italic text-slate-600">{summary}</p>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 font-headline text-xl font-bold uppercase tracking-wider text-slate-700 border-b-2 border-slate-200 pb-1 mb-3">
              <Briefcase className="w-5 h-5"/> Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-headline font-bold text-slate-800">{exp.role}</h3>
                    <span className="text-slate-500 font-medium">{exp.date}</span>
                  </div>
                  <h4 className="font-medium text-slate-600 mb-1">{exp.company}</h4>
                  <ul className="list-disc list-outside pl-4 text-slate-700 space-y-1">
                    {exp.description.split('\n').map((desc, i) => desc.trim() && <li key={i}>{desc.replace(/^- /, '')}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
             <h2 className="flex items-center gap-2 font-headline text-xl font-bold uppercase tracking-wider text-slate-700 border-b-2 border-slate-200 pb-1 mb-3">
              <GraduationCap className="w-5 h-5"/> Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-headline font-bold text-slate-800">{edu.degree}</h3>
                    <p className="text-slate-600">{edu.university}</p>
                  </div>
                  <span className="text-slate-500 font-medium">{edu.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 font-headline text-xl font-bold uppercase tracking-wider text-slate-700 border-b-2 border-slate-200 pb-1 mb-3">
              <Lightbulb className="w-5 h-5"/> Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-headline font-bold text-slate-800">{proj.name}</h3>
                  <p className="text-slate-700">{proj.description}</p>
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

    