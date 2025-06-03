export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date; // Дата и время начала события
  end: Date;   // Дата и время окончания события
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
} 
