export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  color?: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags?: string[];
  color?: string;
} 
