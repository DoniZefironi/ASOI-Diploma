// src/internships/dto/internship-stats.dto.ts
export interface InternshipStat {
  internshipId: number;
  internshipTitle: string;
  company: string;
  views: number;
  applications: number;
  conversionRate: number;
  lastViewedAt?: Date;
  lastAppliedAt?: Date;
}

export interface InternshipApplicationRecord {
  id: number;
  userId: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  internshipId: number;
  internshipTitle: string;
  company: string;
  appliedAt: Date;
  comment?: string;
}
