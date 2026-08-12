export interface WorkItem {
  slug: string;
  title: string;
  role: string;
  year: number;
  summary: string;
  tags: string[];
  link?: string;
}
