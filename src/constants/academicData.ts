export const departments = [
  'CSE',
  'CSE-DS',
  'ECE',
  'EEE',
  'CEE',
  'MCE',
  'ISE'
] as const;

export const professorsByDepartment = {
  'CSE': [
    { name: 'Dr. Alan Turing', subjects: ['Data Structures', 'Algorithms', 'Computer Networks'] },
    { name: 'Dr. Ada Lovelace', subjects: ['Database Systems', 'Operating Systems', 'Cloud Computing'] },
    { name: 'Dr. John von Neumann', subjects: ['Computer Architecture', 'Digital Logic', 'Microprocessors'] }
  ],
  'CSE-DS': [
    { name: 'Dr. Sunil Kumar', subjects: ['AI/ML', 'Data Science', "Computer Vision"] },
    { name: 'Dr. Joshua Daniel Raj', subjects: ['Computer Networks', 'Machine Learning', 'Signal Processing'] },
    { name: 'Dr. Gordon Moore', subjects: ['Semiconductor Devices', 'Control Systems', 'Power Electronics'] }
  ],
  'ECE': [
    { name: 'Dr. Rudolf Diesel', subjects: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer'] },
    { name: 'Dr. Karl Benz', subjects: ['Machine Design', 'Manufacturing Processes', 'Automotive Engineering'] },
    { name: 'Dr. James Watt', subjects: ['Engineering Mechanics', 'Material Science', 'Industrial Engineering'] }
  ],
  'EEE': [
    { name: 'Dr. Isambard Kingdom', subjects: ['Structural Engineering', 'Construction Management', 'Surveying'] },
    { name: 'Dr. Emily Roebling', subjects: ['Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering'] },
    { name: 'Dr. Hardy Cross', subjects: ['Steel Structures', 'Concrete Technology', 'Highway Engineering'] }
  ],
  'CEE': [
    { name: 'Dr. George Washington', subjects: ['Chemical Process', 'Unit Operations', 'Reaction Engineering'] },
    { name: 'Dr. Fritz Haber', subjects: ['Process Control', 'Industrial Chemistry', 'Thermodynamics'] },
    { name: 'Dr. Carl Bosch', subjects: ['Mass Transfer', 'Heat Transfer Operations', 'Plant Design'] }
  ],
  'MCE': [
    { name: 'Dr. George Washington', subjects: ['Chemical Process', 'Unit Operations', 'Reaction Engineering'] },
    { name: 'Dr. Fritz Haber', subjects: ['Process Control', 'Industrial Chemistry', 'Thermodynamics'] },
    { name: 'Dr. Carl Bosch', subjects: ['Mass Transfer', 'Heat Transfer Operations', 'Plant Design'] }
  ],
  'ISE': [
    { name: 'Dr. George Washington', subjects: ['Chemical Process', 'Unit Operations', 'Reaction Engineering'] },
    { name: 'Dr. Fritz Haber', subjects: ['Process Control', 'Industrial Chemistry', 'Thermodynamics'] },
    { name: 'Dr. Carl Bosch', subjects: ['Mass Transfer', 'Heat Transfer Operations', 'Plant Design'] }
  ]
} as const;

export const academicYears = [
  '2023-24',
  '2024-25',
  '2025-26'
] as const;

export const years = ['1', '2', '3', '4'] as const;
