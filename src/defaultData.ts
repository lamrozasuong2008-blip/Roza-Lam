/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-ignore
import photoUrl from './assets/images/photo_2026-07-04_16-57-19.jpg';

import { CVData } from './types';

export const defaultCVData: CVData = {
  personalInfo: {
    name: "LAM ROZA",
    title: "Digital Economy Student & Aspiring Professional",
    phone1: "+855 88 494 1096",
    phone2: "",
    email1: "rozalam64@gmail.com",
    email2: "lamrozasuong2008@gmail.com",
    address: "Street 2002, Teuk Thla, Sen Sok, Phnom Penh, Cambodia",
    summary: "Motivated and tech-savvy Digital Economy student with a strong foundation in modern business concepts and digital trends. Possesses exceptional interpersonal and communication skills, with a natural ability to confidently build rapport, trust, and positive relationships with new people. Quick to learn, highly adaptable, and eager to bring a strong work ethic and professional attitude to an entry-level role.",
    photoUrl: photoUrl,
    showPhoto: true
  },
  education: [
    {
      id: "edu-1",
      degree: "Bachelor's Degree in Digital Economy (Year 1)",
      institution: "National University of Management",
      duration: "2025 – Present",
      description: "Developing foundational knowledge in digital business frameworks, economics, and modern technology trends."
    },
    {
      id: "edu-2",
      degree: "High School",
      institution: "High School Somdech Techo Hun Sen Suong",
      duration: "Graduated: 2025",
      description: "Successfully completed secondary education with focus on general science and mathematics."
    }
  ],
  skills: [
    {
      id: "skill-1",
      name: "Relationship Building & Communication",
      description: "Highly skilled at initiating conversations, active listening, and building immediate rapport with strangers and customers."
    },
    {
      id: "skill-2",
      name: "Digital Literacy",
      description: "Fast learner of new software, digital tools, and online business platforms."
    },
    {
      id: "skill-3",
      name: "Adaptability & Interpersonal Skills",
      description: "Comfortable stepping into new environments, handling diverse personalities, and working effectively in teams."
    },
    {
      id: "skill-4",
      name: "Problem-Solving",
      description: "Strong critical thinking skills enhanced by academic training in economic principles."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Academic Presentations & Teamwork",
      subtitle: "University Projects | Year 1",
      bullets: [
        "Collaborated effectively with classmates on group assignments, demonstrating strong teamwork and coordination.",
        "Utilized strong verbal communication skills to present ideas clearly during classroom discussions and presentations."
      ]
    }
  ],
  languages: [
    {
      id: "lang-1",
      name: "Khmer",
      proficiency: "Native proficiency"
    },
    {
      id: "lang-2",
      name: "English",
      proficiency: "Intermediate / Professional working proficiency"
    }
  ],
  portfolioLinks: [
    {
      id: "link-1",
      platform: "linkedin",
      label: "LinkedIn Profile",
      url: "https://linkedin.com/in/lam-roza"
    },
    {
      id: "link-2",
      platform: "github",
      label: "GitHub Portfolio",
      url: "https://github.com/lamroza"
    },
    {
      id: "link-3",
      platform: "telegram",
      label: "Telegram Contact",
      url: "https://t.me/rozalam"
    },
    {
      id: "link-4",
      platform: "website",
      label: "Personal Website",
      url: "https://lamroza.me"
    }
  ]
};
