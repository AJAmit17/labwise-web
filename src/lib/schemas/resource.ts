import { z } from 'zod';
import { departments, academicYears, years } from '@/constants/academicData';

export const resourceSchema = z.object({
  resourceName: z.string().min(1, 'Resource name is required'),
  course: z.string().min(1, 'Course is required'),
  description: z.string().min(1, 'Description is required'),
  department: z.enum(departments, {
    required_error: 'Please select a department',
  }),
  year: z.enum(years, {
    required_error: 'Please select a year',
  }),
  academicYear: z.enum(academicYears, {
    required_error: 'Please select an academic year',
  }),
  professorName: z.string().min(1, 'Professor name is required'),
  file : z.any(),
});

export type ResourceFormData = z.infer<typeof resourceSchema>;