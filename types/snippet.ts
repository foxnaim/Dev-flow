export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string; // e.g., 'typescript', 'javascript', 'python'
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
} 
