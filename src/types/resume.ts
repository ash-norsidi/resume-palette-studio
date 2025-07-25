export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface SectionStyle {
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  marginBottom?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
}

export interface HeaderData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  profileImage?: string;
}

export interface SummaryData {
  content: string;
}

export interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface ExperienceData {
  items: ExperienceItem[];
}

export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa?: string;
}

export interface EducationData {
  items: EducationItem[];
}

export interface SkillsData {
  skills: string[];
}

export type SectionType = 'header' | 'summary' | 'experience' | 'education' | 'skills';

export interface ResumeSection {
  id: string;
  type: SectionType;
  position: Position;
  size: Size;
  data: any; // Changed to any for flexibility
  style: SectionStyle;
}

export interface DragItem {
  type: 'section';
  sectionType: SectionType;
  label: string;
}