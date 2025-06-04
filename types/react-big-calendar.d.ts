declare module 'react-big-calendar' {
  import { ComponentType } from 'react';

  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

  export interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
  }

  export interface CalendarProps {
    localizer: any;
    events: Event[];
    startAccessor: string;
    endAccessor: string;
    style?: React.CSSProperties;
    messages?: {
      allDay?: string;
      previous?: string;
      next?: string;
      today?: string;
      month?: string;
      week?: string;
      day?: string;
      agenda?: string;
      date?: string;
      time?: string;
      event?: string;
      noEventsInRange?: string;
      showMore?: (total: number) => string;
    };
    culture?: string;
    eventPropGetter?: (event: Event) => { style?: React.CSSProperties };
    onSelectEvent?: (event: Event) => void;
    
    // Added props for navigation and view control
    date?: Date;
    view?: View;
    onNavigate?: (newDate: Date) => void;
    onView?: (newView: View) => void;
  }

  export const Calendar: ComponentType<CalendarProps>;
  export const dateFnsLocalizer: (config: any) => any;
} 
