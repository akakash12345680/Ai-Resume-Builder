export type Experience = {
  id: string;
  role: string;
  company: string;
  date: string;
  description: string;
};

export type Education = {
  id: string;
  degree: string;
  university: string;
  date: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
};

export type Resume = {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  skills: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
};
