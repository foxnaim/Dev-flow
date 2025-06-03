// Интерфейс заметки
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  color?: string;
}

// Интерфейс данных формы для создания/редактирования заметки
export interface NoteFormData {
  title: string;
  content: string;
  tags?: string[];
  color?: string;
} 
