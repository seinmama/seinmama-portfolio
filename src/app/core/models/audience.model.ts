export type AudienceId = 'recruiter' | 'developer' | 'designer' | 'curious';

export interface Audience {
  id: AudienceId;
  name: string;
  description: string;
}
