export const departments = [
  // 'CSE',
  'CSE-DS',
  // 'ECE',
  // 'EEE',
  // 'CEE',
  // 'MCE',
  // 'ISE'
] as const;

export const professorsByDepartment = {
  'CSE': [
    // { name: 'Dr. Alan Turing', subjects: ['Data Structures', 'Algorithms', 'Computer Networks'] },
  ],
  'CSE-DS': [
    // { name: 'Dr. Sunil Kumar', subjects: ['AI/ML'] },
    // { name: 'Dr. Joshua Daniel Raj', subjects: ['DLD'] },
    { name: 'Ms. Pallavi Nayak', subjects: ['Computer Networks', 'AI/ML'] },
    { name: 'Ms. T Sasikala', subjects: ['Software Testing'] },
    { name: 'Ms. Aanchal', subjects: ['Cyber Security'] },
    { name: 'Ms. Kavitha U', subjects: ['Computer Networks', 'Predictive Analytics'] },
    { name: 'Ms. Anju K', subjects: ['Cyber Security'] },
    { name: 'Ms. Swathi Sehgal', subjects: ['Mobile Development(MAD LAB)'] },
    { name: 'Dr. R Suganya', subjects: ['AI/ML'] },
    { name: 'Mr. Sankhadeep Pujaru', subjects: ['Software Testing'] },
  ],
  'ECE': [
    // { name: 'Dr. Rudolf Diesel', subjects: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer'] },
  ],
  'EEE': [
    // { name: 'Dr. Isambard Kingdom', subjects: ['Structural Engineering', 'Construction Management', 'Surveying'] },
  ],
  'CEE': [
    // { name: 'Dr. George Washington', subjects: ['Chemical Process', 'Unit Operations', 'Reaction Engineering'] },
  ],
  'MCE': [
    // { name: 'Dr. George Washington', subjects: ['Chemical Process', 'Unit Operations', 'Reaction Engineering'] },
  ],
  'ISE': [
    // { name: 'Dr. George Washington', subjects: ['Chemical Process', 'Unit Operations', 'Reaction Engineering'] },
  ]
} as const;

export const academicYears = [
  '2023-24',
  '2024-25',
  '2025-26'
] as const;

export const years = ['1', '2', '3', '4'] as const;
