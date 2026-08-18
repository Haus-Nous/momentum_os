import { UserPersona } from '../types';

export interface PersonaLabels {
  careerHubTitle: string;
  careerSubtitle: string;
  internshipButton: string;
  hackathonButton: string;
  pipelineTitle: string;
  academicHubTitle: string;
  academicSubtitle: string;
  semesterNavLabel: string;
  careerNavLabel: string;
  deliverablesLabel: string;
  gpaOrSkillsLabel: string;
}

export const getPersonaLabels = (persona: UserPersona = 'student'): PersonaLabels => {
  if (persona === 'professional') {
    return {
      careerHubTitle: 'Career Growth Command Center',
      careerSubtitle: 'Active Industry & Role Pipeline',
      internshipButton: 'Log Opportunity / Role',
      hackathonButton: 'Log Industry Event',
      pipelineTitle: 'Opportunity & Interview Pipeline',
      academicHubTitle: 'Professional Upskilling & Certifications',
      academicSubtitle: 'Continuous Skill Growth & Industry Tracks',
      semesterNavLabel: 'Upskilling Hub',
      careerNavLabel: 'Career Growth',
      deliverablesLabel: 'Deliverables & Projects',
      gpaOrSkillsLabel: 'Skill Progress Rate',
    };
  }

  if (persona === 'builder') {
    return {
      careerHubTitle: 'Venture & Client Command Center',
      careerSubtitle: 'Active Client, Lead & Deal Pipeline',
      internshipButton: 'Log Lead / Opportunity',
      hackathonButton: 'Log Pitch / Hackathon',
      pipelineTitle: 'Deal & Venture Funnel Pipeline',
      academicHubTitle: 'R&D & Knowledge Hub',
      academicSubtitle: 'Technical Research & Product Development',
      semesterNavLabel: 'R&D Hub',
      careerNavLabel: 'Venture Pipeline',
      deliverablesLabel: 'Client & Product Milestones',
      gpaOrSkillsLabel: 'Milestone Execution Rate',
    };
  }

  // Default: student
  return {
    careerHubTitle: 'Career & Growth',
    careerSubtitle: 'Active Internship & Opportunity Pipeline',
    internshipButton: 'Log Internship',
    hackathonButton: 'Log Hackathon',
    pipelineTitle: 'Opportunity Pipeline',
    academicHubTitle: 'Learning & Coursework',
    academicSubtitle: 'Enrolled Courses & Academic Track',
    semesterNavLabel: 'Semester Hub',
    careerNavLabel: 'Career Hub',
    deliverablesLabel: 'Assignments & Submissions',
    gpaOrSkillsLabel: 'Target CGPA Score',
  };
};
