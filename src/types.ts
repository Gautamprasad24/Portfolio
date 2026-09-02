export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  role: string;
  client: string;
  description: string;
  image: string;
  secondaryImages?: string[];
  tags: string[];
  link?: string;
  github?: string;
  featured: boolean;
  accentColor?: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  tools: string[];
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  location: string;
  description: string;
}

export interface TechSkill {
  name: string;
  category: 'core' | 'creative' | 'design' | 'tools';
  highlight?: boolean;
}

export interface CursorState {
  x: number;
  y: number;
  text: string;
  variant: 'default' | 'hover' | 'project' | 'drag' | 'view' | 'hidden';
  activeImage?: string;
}
