export interface WorkItem {
  slug: string;
  title: string;
  role: string;
  year: number;
  summary: string;
  tags: string[];
  link?: string;
  /** Screenshot shown in the project's frame; falls back to the drop placeholder. */
  image?: string;
}
