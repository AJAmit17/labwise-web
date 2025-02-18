export interface TimeTableSlot {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  professor: string;
}

export type AvailableSlot = {
  id: string;
  subject: string;
  subjectCode: string;
  professor: string;
  type: 'class' | 'break';
};

export interface TimeTable {
  id: string;
  department: string;
  year: number;
  academicYear: string;
  slots: TimeTableSlot[];
  createdAt: Date;
  updatedAt: Date;
}
