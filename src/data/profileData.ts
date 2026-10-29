export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  partnerOrAccreditor: string;
  date: string;
  participantId: string;
  credentialCode?: string;
  creditsDescription?: string;
  image: string;
  summary: string;
  signatory: string;
  badges: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  type: 'Freelance' | 'Part-time' | 'Full-time' | 'Internship';
  location: string;
  period: string;
  category: 'training' | 'legal' | 'research';
  summary?: string;
  responsibilities: string[];
  skills: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  period: string;
  status: 'In Progress' | 'Completed';
  highlights?: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; context?: string }[];
}

export interface ResearchFocus {
  id: string;
  title: string;
  category: string;
  scope: string;
  doctrinalFocus: string;
  topics: string[];
}

export interface ResearchMethodology {
  title: string;
  description: string;
}

export const PROFILE = {
  name: "Muskan Shokeen",
  tagline: "Empowering minds. Enriching lives. Advocating justice.",
  headline: "Soft Skills & Corporate Trainer | Advocate | Academic Legal Researcher | PhD Scholar in Law",
  location: "Delhi, India",
  emailPlaceholder: "contact@muskanshokeen.com", // clearly marked placeholder
  linkedinUrl: "https://www.linkedin.com/in/muskan-shokeen",
  about: {
    lead: "I am a Soft Skills Trainer, Certified Trainer from PROTOUCH, Advocate, and PhD Scholar in Law, passionate about empowering students and young professionals through effective communication, emotional intelligence, confidence building, interview preparation, group discussions, professional etiquette, and personality development.",
    currentRole: "Currently working as a freelance Soft Skills Trainer at St. Andrews Institute of Technology and Management, I focus on enhancing employability skills and preparing students for professional success.",
    interdisciplinaryEdge: "With an academic background in B.A. LL.B. and an LL.M. specializing in AI and Cyber Law, I bring together rigorous legal knowledge, professional ethics, and communication expertise to support holistic learning and human potential development."
  },
  pillars: [
    {
      title: "Soft Skills & Employability",
      description: "Delivering structured corporate training, campus placement coaching, interview preparation, GD facilitation, and executive presence development.",
      icon: "Users"
    },
    {
      title: "Legal Practice & Advocacy",
      description: "Licensed advocate with hands-on litigation experience in the Negotiable Instruments Act, SARFAESI Act, Debt Recovery Tribunal, and statutory pleadings.",
      icon: "Scale"
    },
    {
      title: "Academic Research in Law",
      description: "PhD scholar and corporate law academic writer covering SEBI regulations, Companies Act, insolvency, AI governance, and contemporary cyber jurisprudence.",
      icon: "BookOpen"
    },
    {
      title: "Transformational Life Coaching",
      description: "Cultivating emotional intelligence, personal growth mindset, stress navigation, verbal clarity, and confidence for emerging professionals.",
      icon: "Sparkles"
    }
  ]
};

export const CERTIFICATIONS: Certificate[] = [
  {
    id: "shrm-trainer",
    title: "Soft Skill Trainer Certification",
    issuer: "PROTOUCH",
    partnerOrAccreditor: "SHRM Recertification Provider",
    date: "August 23, 2026",
    participantId: "PRO - 79635",
    credentialCode: "26-5WVA3",
    creditsDescription: "Earned 30 PDCs towards SHRM-CP / SHRM-SCP recertification",
    image: `${import.meta.env.BASE_URL}certificates/shrm-soft-skill-trainer.png`,
    signatory: "Dr. Aparna Sethi · Affiliate Representative",
    summary: "Comprehensive professional certification validating advanced competency in soft skills training methodology, curriculum execution, and adult learning behavior.",
    badges: ["SHRM Approved", "30 PDCs", "Credential 26-5WVA3"]
  },
  {
    id: "train-the-trainer",
    title: "Train The Trainer Certification",
    issuer: "PROTOUCH",
    partnerOrAccreditor: "CPD Accredited · HRCI Approved · ISO 9001:2015 · SHRM",
    date: "August 23, 2026",
    participantId: "PRO - 79635",
    image: `${import.meta.env.BASE_URL}certificates/train-the-trainer.png`,
    signatory: "Dr. Aparna Sethi · Director",
    summary: "Rigorous institute assessment and certification qualifying master facilitation techniques, pedagogy design, audience engagement, and corporate instruction.",
    badges: ["ISO 9001:2015", "CPD Accredited", "HRCI Provider", "Master Trainer"]
  },
  {
    id: "cpd-corporate-trainer",
    title: "Corporate Trainer and Facilitator Certification",
    issuer: "Protouchpro Services Private Limited",
    partnerOrAccreditor: "The CPD Standards Office (Provider No: 22381)",
    date: "August 23, 2026",
    participantId: "PRO - 79635",
    image: `${import.meta.env.BASE_URL}certificates/cpd-corporate-trainer.png`,
    signatory: "Dr. Aparna Sethi",
    summary: "Official CPD accredited qualification recognizing professional excellence in corporate training design, interactive facilitation, and learning reflection frameworks.",
    badges: ["CPD Standards Office", "Provider No: 22381", "International Standard"]
  },
  {
    id: "hrci-corporate-trainer",
    title: "Corporate Trainer and Facilitator Certification (HRCI Approved)",
    issuer: "PROTOUCH",
    partnerOrAccreditor: "HR Certification Institute (HRCI Approved 2026 Provider)",
    date: "August 23, 2026",
    participantId: "PRO - 79635",
    credentialCode: "Program ID No. 748691",
    creditsDescription: "Approved for 30 HR (General) recertification credit hours toward aPHRi, aPHR, PHR, PHRca, SPHRi, GPHR, PHRi, and SPHR",
    image: `${import.meta.env.BASE_URL}certificates/hrci-corporate-trainer.png`,
    signatory: "Dr. Aparna Sethi · PROTOUCH",
    summary: "Elite corporate facilitator certification recognized globally by HRCI for delivering high-impact human resources, organizational development, and leadership workshops.",
    badges: ["HRCI Approved", "30 HR Credit Hours", "Program ID: 748691"]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: "standrews-trainer",
    title: "Soft Skill & Placement Trainer",
    company: "St. Andrews Institute of Technology & Management",
    type: "Freelance",
    location: "Gurugram, Haryana, India · On-site",
    period: "Sep 2026 – Present",
    category: "training",
    responsibilities: [
      "Conducting structured soft-skills and employability training programs to prepare students for campus placements and corporate environments.",
      "Training students in verbal ability, interpersonal communication, professional etiquette, confidence building, and executive presence.",
      "Preparing candidates for HR interviews, technical interviews, personal interviews, aptitude assessments, and high-stakes group discussions.",
      "Executing mock interviews, role-plays, impromptu speaking exercises, and presentation simulations with individual constructive feedback.",
      "Guiding students in ATS-optimized resume building, video introductions, body language mastery, and professional networking strategies.",
      "Designing interactive classroom simulations and real-world problem-solving scenarios to cultivate teamwork, leadership, and decision-making."
    ],
    skills: ["Soft Skills Training", "Placement Training", "Transformational Life Coaching", "People Management", "Communication", "Emotional Intelligence"]
  },
  {
    id: "global-research-consultant",
    title: "Research Consultant & Academic Writer",
    company: "Global Research Work",
    type: "Part-time",
    location: "Delhi, India · Remote",
    period: "Aug 2026 – Present",
    category: "research",
    summary: "Specialising in Corporate Laws, case-law analysis, statutory interpretation, and structured legal research publications.",
    responsibilities: [
      "Conducting in-depth jurisprudence research on the Companies Act, SEBI regulations, and Insolvency and Bankruptcy Code (IBC).",
      "Analyzing landmark Supreme Court & NCLAT judicial decisions, securities laws, corporate governance norms, and mergers & acquisitions.",
      "Developing academically rigorous legal articles, research papers, case digests, and specialized learning modules with precise legal citation standards.",
      "Ensuring intellectual originality, doctrinal accuracy, and clear analytical structure across complex commercial law topics."
    ],
    skills: ["Legal Research", "Academic Writing", "Corporate Laws", "SEBI Regulations", "Case Law Analysis", "Analytical Skills"]
  },
  {
    id: "protouch-intern",
    title: "Soft Skill & L&D Intern",
    company: "Protouch",
    type: "Internship",
    location: "Gurugram, Haryana, India · Remote",
    period: "Aug 2026 – Present",
    category: "training",
    responsibilities: [
      "Gaining hands-on experience in corporate Learning & Development (L&D) through specialized training-session planning and instructional design.",
      "Developing engaging digital and video-based learning content focused on communication mastery, emotional resilience, and professional development.",
      "Collaborating on live corporate training projects and facilitator debriefs under master trainer mentorship."
    ],
    skills: ["Instructional Design", "Soft Skills Training", "Video-Based Learning", "Facilitation"]
  },
  {
    id: "trulegal-associate",
    title: "Legal Associate",
    company: "TruLegalSolutions",
    type: "Full-time",
    location: "Delhi, India · On-site",
    period: "Nov 2025 – Jun 2026",
    category: "legal",
    responsibilities: [
      "Effectively managed diverse legal responsibilities and optimized litigation workflows for corporate and banking clientele.",
      "Drafted and filed statutory legal documents, pleadings, notices, and applications adhering to procedural court mandates.",
      "Attended court proceedings across Delhi judicial forums, representing clients in litigation under the Negotiable Instruments (NI) Act, SARFAESI Act, and Debt Recovery Tribunal (DRT).",
      "Maintained structured digital tracking systems and case-management workflows, driving operational speed and procedural compliance."
    ],
    skills: ["Negotiable Instruments Act", "SARFAESI Act", "Debt Recovery Tribunal", "Court Appearances", "Legal Drafting", "Legal Administration"]
  },
  {
    id: "skhan-intern",
    title: "Legal Intern",
    company: "S Khan Advocate",
    type: "Internship",
    location: "Delhi, India · On-site",
    period: "Oct 2020 – Jan 2021",
    category: "legal",
    responsibilities: [
      "Assisted senior counsel in court proceedings, hearing observations, brief preparation, and case file compilation.",
      "Conducted extensive statutory and case law research to support trial preparation and legal arguments."
    ],
    skills: ["Court Proceedings", "Legal Research", "Analytical Skills", "Case Management"]
  },
  {
    id: "rohitkumar-intern",
    title: "Litigation Intern",
    company: "Rohit Kumar Advocate",
    type: "Internship",
    location: "Rohini Court, Delhi · On-site",
    period: "Jun 2019 – Jul 2019",
    category: "legal",
    responsibilities: [
      "Actively supported senior advocate in court appearances, trial research, and client litigation strategy.",
      "Drafted legal notices, applications, and pleadings under supervision."
    ],
    skills: ["Court Appearances", "Legal Notices Drafting", "Litigation Support", "Case Analysis"]
  }
];

export const EDUCATION_LIST: Education[] = [
  {
    degree: "Doctor of Philosophy (Ph.D.)",
    field: "Law",
    institution: "GD Goenka University",
    period: "Jul 2026 – Present",
    status: "In Progress",
    highlights: "Advanced doctoral research focusing on contemporary legal frameworks, jurisprudence, and scholarly legal contributions."
  },
  {
    degree: "Master of Laws (LL.M.)",
    field: "Artificial Intelligence (AI) and Cyber Law",
    institution: "Chandigarh University",
    period: "Aug 2023 – Aug 2024",
    status: "Completed",
    highlights: "Specialized postgraduate mastery in emerging technologies law, cyber jurisprudence, data protection, and algorithmic ethics."
  },
  {
    degree: "Bachelor of Law (B.A. LL.B.)",
    field: "Law",
    institution: "Lloyd Law College - India",
    period: "Jun 2017 – Oct 2022",
    status: "Completed",
    highlights: "Five-year comprehensive integrated law degree encompassing constitutional law, corporate law, procedural codes, civil and criminal litigation."
  }
];

export const RESEARCH_AREAS: ResearchFocus[] = [
  {
    id: "corporate-governance",
    title: "Corporate Law & Regulatory Compliance",
    category: "Corporate Jurisprudence",
    scope: "Global Research Work Consultancy",
    doctrinalFocus: "Doctrinal analysis of the Companies Act, SEBI regulations, disclosure mandates, and judicial precedents governing board governance and shareholder rights.",
    topics: ["Companies Act Framework", "SEBI Regulations & Norms", "Mergers & Acquisitions", "Corporate Compliance"]
  },
  {
    id: "insolvency-commercial",
    title: "Insolvency, Bankruptcy & Debt Recovery",
    category: "Commercial Resolution",
    scope: "Litigation & Advisory Practice",
    doctrinalFocus: "Statutory interpretation of creditor rights, resolution procedures under the Insolvency & Bankruptcy Code (IBC), and recovery under the NI Act and SARFAESI Act.",
    topics: ["Insolvency & Bankruptcy Code", "SARFAESI Enforcement", "Debt Recovery Tribunal (DRT)", "Negotiable Instruments Act"]
  },
  {
    id: "ai-cyber-law",
    title: "AI Governance & Cyber Jurisprudence",
    category: "Emerging Tech Law",
    scope: "LL.M. Postgraduate Specialization",
    doctrinalFocus: "Postgraduate legal inquiry into algorithmic accountability, digital forensics, data privacy legislation, and cyber jurisdiction across borders.",
    topics: ["AI Liability & Ethics", "Cyber Regulations", "Data Protection & Privacy", "Digital Evidence Standards"]
  },
  {
    id: "doctoral-scholarship",
    title: "Contemporary Doctrinal Legal Scholarship",
    category: "Doctoral Research",
    scope: "GD Goenka University Ph.D. Program",
    doctrinalFocus: "Rigorous scholarly inquiry combining case law synthesis, legislative intent mapping, and analytical academic writing methodologies.",
    topics: ["Constitutional & Statutory Harmonization", "Judicial Precedent Mapping", "Doctrinal Legal Writing", "Comparative Commercial Law"]
  }
];

export const RESEARCH_METHODOLOGIES: ResearchMethodology[] = [
  {
    title: "Doctrinal Statutory Synthesis",
    description: "Systematic interpretation of primary legislative codes, regulatory circulars, and authoritative High Court and Supreme Court judgments."
  },
  {
    title: "Rigorous Legal Citation",
    description: "Consistent application of formal academic legal citation standards, verifying doctrinal sources, originality, and analytical precision."
  },
  {
    title: "Structured Case-Law Digestion",
    description: "Synthesizing complex multi-party commercial litigation, NCLAT decisions, and debt recovery tribunals into lucid judicial precedents."
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Training, L&D & Facilitation",
    skills: [
      { name: "Soft Skills Training", context: "St. Andrews & Protouch" },
      { name: "Placement & Employability Training", context: "Campus recruitment focus" },
      { name: "Train The Trainer (TTT)", context: "ISO & HRCI accredited" },
      { name: "Corporate Facilitation", context: "CPD Standards certified" },
      { name: "HR Interview & GD Coaching", context: "Mock trials & rubric assessment" },
      { name: "Resume & Portfolio Building", context: "Executive presence" },
      { name: "Transformational Life Coaching", context: "Behavioral mindset" },
      { name: "People Management", context: "Cross-functional teams" }
    ]
  },
  {
    category: "Legal Acumen & Court Practice",
    skills: [
      { name: "Negotiable Instruments Act (NI Act)", context: "Commercial litigation" },
      { name: "SARFAESI Act & Recovery", context: "Banking & asset enforcement" },
      { name: "Debt Recovery Tribunal (DRT)", context: "Tribunal proceedings" },
      { name: "Corporate Laws & Compliance", context: "Companies Act & SEBI" },
      { name: "Court Appearances & Litigation", context: "Delhi Courts & tribunals" },
      { name: "Pleadings & Legal Drafting", context: "Notices, petitions & briefs" },
      { name: "Legal Administration", context: "Case management systems" },
      { name: "AI & Cyber Law", context: "LL.M. specialization" }
    ]
  },
  {
    category: "Analytical, Research & Behavioral",
    skills: [
      { name: "Emotional Intelligence", context: "Core professional skill" },
      { name: "Academic Legal Writing", context: "Published research papers" },
      { name: "Case Law & Statutory Analysis", context: "Global Research Work" },
      { name: "Conflict Resolution & Etiquette", context: "Workplace dynamics" },
      { name: "Public Speaking & Presentation", context: "Interactive workshops" },
      { name: "Critical Reasoning", context: "Multi-jurisdictional rigor" }
    ]
  }
];
