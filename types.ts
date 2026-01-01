
export enum UserRole {
  CLINIC = 'Clinic',
  EMPLOYER = 'Employer',
  JOB_SEEKER = 'Job Seeker',
  ADMIN = 'Admin'
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  about: string;
  services: string[];
}
