// Department type
export interface Department {
    name: string;
    code: string;
  }
  
  // Subject type
  export interface Subject {
    name: string;
    code: string;
  }
  
  // Semester subjects type
  export interface SemesterSubjects {
    [semester: string]: Subject[];
  }
  
  // All departments with subjects per semester
  export interface DepartmentSubjects {
    [departmentCode: string]: SemesterSubjects;
  }
  
  // List of departments
  export const programs: Department[] = [
    { name: "Computer Engineering", code: "bct" },
    { name: "Civil Engineering", code: "bce" },
    { name: "Electronics Engineering", code: "becie" },
  ];
  
  // Subjects per department per semester
  export const departmentSubjects: DepartmentSubjects = {
    bct: {
      "1": [
        { name: "Mathematics I", code: "sh401" },
        { name: "Computer Programming", code: "ct401" },
        { name: "Engineering Drawing I", code: "me401" },
        { name: "Engineering Physics", code: "sh452" },
        { name: "Applied Mechanics", code: "ce451" },
        { name: "Basic Electrical Engineering", code: "ee451" },
      ],
      "2": [
        { name: "Mathematics II", code: "sh451" },
        { name: "Engineering Drawing II", code: "me451" },
        { name: "Basic Electronics Engineering", code: "ex451" },
        { name: "Engineering Chemistry", code: "sh403" },
        { name: "Fundamentals of Thermodynamics & Heat Transfer", code: "me402" },
        { name: "Workshop Technology", code: "wt" },
      ],
      "3": [
        { name: "Mathematics III", code: "sh501" },
        { name: "Object Oriented Programming", code: "ct501" },
        { name: "Electrical Circuit Theory", code: "ee501" },
        { name: "Theory of Computation", code: "ct502" },
        { name: "Electronics Devices and Circuit", code: "ex501" },
        { name: "Digital Logic", code: "ex502" },
        { name: "Electromagnetism", code: "ex503" },
      ],
      "4": [
        { name: "Electrical Machine", code: "ee554" },
        { name: "Numerical Method", code: "sh553" },
        { name: "Applied Mathematics", code: "sh551" },
        { name: "Instrumentation I", code: "ee552" },
        { name: "Data Structure and Algorithm", code: "ct552" },
        { name: "Microprocessor", code: "ex551" },
        { name: "Discrete Structure", code: "ct551" },
      ],
      "5": [
        { name: "Communication English", code: "eg604sh" },
        { name: "Probability and Statistics", code: "ps" },
        { name: "Computer Organization and Architecture", code: "coa" },
        { name: "Software Engineering", code: "se" },
        { name: "Computer Graphics", code: "cg" },
        { name: "Instrumentation II", code: "inst2" },
        { name: "Data Communication", code: "dc" },
      ],
      "6": [
        { name: "Engineering Economics", code: "ce655" },
        { name: "Object Oriented Analysis and Design", code: "ct651" },
        { name: "Artificial Intelligence", code: "ct653" },
        { name: "Operating System", code: "ct656" },
        { name: "Embedded System", code: "ct655" },
        { name: "Database Management System", code: "ct652" },
        { name: "Minor Project", code: "minor_project" },
      ],
      "7": [
        { name: "ICT Project Management", code: "ict_pm" },
        { name: "Organization and Management", code: "me708" },
        { name: "Energy Environment and Society", code: "ees" },
        { name: "Distributed System", code: "dsys" },
        { name: "Computer Networks and Security", code: "cns" },
        { name: "Digital Signal Analysis and Processing", code: "dsap" },
        { name: "Elective I", code: "elective1" },
        { name: "Project I", code: "project1" },
      ],
      "8": [
        { name: "Engineering Professional Practice", code: "epp" },
        { name: "Information System", code: "is" },
        { name: "Internet and Intranet", code: "inet" },
        { name: "Simulation and Modeling", code: "sim" },
        { name: "Elective II", code: "elective2" },
        { name: "Elective III", code: "elective3" },
        { name: "Project II", code: "project2" },
      ],
    },
  
    // Add BCE subjects per semester similarly
    bce: {
      "1": [
        { name: "Engineering Math I", code: "em1" },
        { name: "Statics", code: "st" },
        { name: "Physics", code: "ph" },
        { name: "Chemistry", code: "ch" },
      ],
      "2": [
        { name: "Mechanics", code: "mech" },
        { name: "Thermodynamics", code: "thermo" },
        { name: "Materials Science", code: "ms" },
        { name: "Surveying", code: "sv" },
      ],
      // Add remaining semesters...
    },
  
    // Add BECIE subjects per semester similarly
    becie: {
      "1": [
        { name: "Digital Electronics", code: "de" },
        { name: "Signals & Systems", code: "ss" },
      ],
      "2": [
        { name: "Microprocessors", code: "mp" },
        { name: "Communication Systems", code: "cs" },
      ],
      // Add remaining semesters...
    },
  };

export interface examTypeDetails{
  type: string;
  marks: number;
}

export interface subjectDetails{
  name: string;
  level: string;
  description: string;
  code: string;
  credits: number;
  examType: examTypeDetails[];
}

// dummy subject details
export const subjectDetailsData:  subjectDetails = {
  name: "Computer Programming",
  level: "Hard",
  description: "Introduction to programming concepts using Python. Covers variables, control structures, functions, and basic data structures.",
  code: "CT401",
  credits: 3,
  examType: [
    { type: "Theory", marks: 60 },
    { type: "Pratical", marks: 40 }
  ]
};
