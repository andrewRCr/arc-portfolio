/**
 * Sample education data demonstrating Education interface usage
 *
 * In Phase 2, this will be replaced with actual degrees:
 * - Bachelor of Science - Computer Science | Oregon State University
 * - Bachelor of Arts - Psychology | The University of Texas at Dallas
 */

import { Education } from "@/types/education";

export const education: Education[] = [
  {
    // Required core fields
    degree: "Bachelor of Science",
    major: "Computer Science",
    institution: "Sample University",

    // Optional fields for future expansion (not currently used)
    location: "City, State",
    graduationDate: "2020",
    // gpa: "3.8/4.0",
    // honors: ["Cum Laude", "Dean's List"],
    // relevantCoursework: ["Data Structures", "Algorithms", "Software Engineering"],
  },

  {
    // Second degree showing minimal structure
    degree: "Bachelor of Arts",
    major: "Sample Major",
    institution: "Another University",
  },
];
