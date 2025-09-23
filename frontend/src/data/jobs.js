// small mock dataset to populate UI immediately
const jobs = [
  {
    id: "1",
    title: "Frontend Engineer",
    company: "Acme Corp",
    location: "Bangalore, India",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹8,00,000 - ₹12,00,000",
    postedAt: "2025-09-01",
    tags: ["React", "JavaScript", "CSS"],
    description:
      "We are looking for a Frontend Engineer experienced with React, TypeScript (bonus), and modern CSS.",
    logo: "/assets/logos/acme.png"
  },
  {
    id: "2",
    title: "Backend Engineer (Node.js)",
    company: "HireHub Inc",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "₹10,00,000 - ₹18,00,000",
    postedAt: "2025-08-28",
    tags: ["Node.js", "Express", "MongoDB"],
    description:
      "Design and build scalable REST APIs, work with MongoDB and implement authentication & role-based access."
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Emergent Studios",
    location: "Mumbai, India",
    type: "Contract",
    level: "Mid-level",
    salary: "₹40,000 - ₹70,000 / month",
    postedAt: "2025-09-10",
    tags: ["Figma", "Design System", "Prototyping"],
    description:
      "Design end-to-end user experiences for our B2B products. Strong portfolio required."
  },
  {
    id: "4",
    title: "Full Stack Developer",
    company: "TechSolutions Ltd",
    location: "Delhi, India",
    type: "Full-time",
    level: "Senior",
    salary: "₹12,00,000 - ₹20,00,000",
    postedAt: "2025-09-05",
    tags: ["React", "Node.js", "MongoDB", "AWS"],
    description:
      "Looking for a Full Stack Developer to build end-to-end features for our SaaS platform."
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "₹15,00,000 - ₹25,00,000",
    postedAt: "2025-09-12",
    tags: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    description:
      "Join our data science team to build predictive models and analyze large datasets."
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Hyderabad, India",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹9,00,000 - ₹16,00,000",
    postedAt: "2025-09-03",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    description:
      "Manage cloud infrastructure and implement DevOps practices across our engineering teams."
  },
  {
    id: "7",
    title: "Product Manager",
    company: "Innovate Labs",
    location: "Bangalore, India",
    type: "Full-time",
    level: "Senior",
    salary: "₹18,00,000 - ₹30,00,000",
    postedAt: "2025-09-08",
    tags: ["Product Strategy", "Agile", "User Research"],
    description:
      "Lead product development from conception to launch for our mobile applications."
  },
  {
    id: "8",
    title: "Mobile App Developer",
    company: "AppWorks Inc",
    location: "Remote",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹10,00,000 - ₹17,00,000",
    postedAt: "2025-09-15",
    tags: ["React Native", "iOS", "Android", "JavaScript"],
    description:
      "Develop cross-platform mobile applications using React Native for our growing user base."
  },
  {
    id: "9",
    title: "QA Engineer",
    company: "Quality First Tech",
    location: "Pune, India",
    type: "Full-time",
    level: "Junior",
    salary: "₹5,00,000 - ₹8,00,000",
    postedAt: "2025-09-07",
    tags: ["Testing", "Automation", "Selenium", "Jest"],
    description:
      "Ensure software quality through manual and automated testing methodologies."
  },
  {
    id: "10",
    title: "Technical Writer",
    company: "DocuTech",
    location: "Remote",
    type: "Part-time",
    level: "Mid-level",
    salary: "₹30,000 - ₹50,000 / month",
    postedAt: "2025-09-14",
    tags: ["Documentation", "Technical Writing", "API Docs"],
    description:
      "Create comprehensive documentation for our developer tools and APIs."
  },
  {
    id: "11",
    title: "Salesforce Developer",
    company: "CRM Experts",
    location: "Chennai, India",
    type: "Full-time",
    level: "Senior",
    salary: "₹11,00,000 - ₹19,00,000",
    postedAt: "2025-09-06",
    tags: ["Salesforce", "Apex", "Lightning", "CRM"],
    description:
      "Customize and develop Salesforce solutions for enterprise clients."
  },
  {
    id: "12",
    title: "Cyber Security Analyst",
    company: "SecureNet Systems",
    location: "Gurgaon, India",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹12,00,000 - ₹20,00,000",
    postedAt: "2025-09-09",
    tags: ["Security", "Network", "Penetration Testing", "SIEM"],
    description:
      "Protect our systems from security threats and implement security best practices."
  },
  {
    id: "13",
    title: "Business Analyst",
    company: "Strategy Partners",
    location: "Mumbai, India",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹8,00,000 - ₹14,00,000",
    postedAt: "2025-09-11",
    tags: ["Requirements", "Analysis", "SQL", "UML"],
    description:
      "Bridge the gap between business stakeholders and technical teams."
  },
  {
    id: "14",
    title: "Cloud Architect",
    company: "AWS Partners",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "₹20,00,000 - ₹35,00,000",
    postedAt: "2025-09-13",
    tags: ["AWS", "Architecture", "Microservices", "Serverless"],
    description:
      "Design and implement scalable cloud infrastructure solutions on AWS."
  },
  {
    id: "15",
    title: "React Native Developer",
    company: "MobileFirst Tech",
    location: "Bangalore, India",
    type: "Contract",
    level: "Mid-level",
    salary: "₹60,000 - ₹90,000 / month",
    postedAt: "2025-09-16",
    tags: ["React Native", "Redux", "Firebase", "TypeScript"],
    description:
      "Build performant mobile apps on iOS and Android using React Native."
  },
  {
    id: "16",
    title: "Python Django Developer",
    company: "WebSolutions Inc",
    location: "Hyderabad, India",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹9,00,000 - ₹15,00,000",
    postedAt: "2025-09-04",
    tags: ["Python", "Django", "REST API", "PostgreSQL"],
    description:
      "Develop robust backend systems using Django framework for web applications."
  },
  {
    id: "17",
    title: "Vue.js Developer",
    company: "Frontend Masters",
    location: "Remote",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹8,00,000 - ₹13,00,000",
    postedAt: "2025-09-17",
    tags: ["Vue.js", "JavaScript", "Vuex", "Vue Router"],
    description:
      "Create interactive user interfaces using Vue.js for our client projects."
  },
  {
    id: "18",
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Bangalore, India",
    type: "Full-time",
    level: "Senior",
    salary: "₹16,00,000 - ₹28,00,000",
    postedAt: "2025-09-18",
    tags: ["Python", "TensorFlow", "PyTorch", "MLOps"],
    description:
      "Build and deploy machine learning models for real-world applications."
  },
  {
    id: "19",
    title: "Flutter Developer",
    company: "CrossPlatform Apps",
    location: "Pune, India",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹10,00,000 - ₹16,00,000",
    postedAt: "2025-09-19",
    tags: ["Flutter", "Dart", "Firebase", "REST API"],
    description:
      "Develop beautiful cross-platform mobile applications using Flutter."
  },
  {
    id: "20",
    title: "Java Spring Boot Developer",
    company: "Enterprise Solutions",
    location: "Delhi, India",
    type: "Full-time",
    level: "Senior",
    salary: "₹11,00,000 - ₹18,00,000",
    postedAt: "2025-09-20",
    tags: ["Java", "Spring Boot", "Microservices", "Hibernate"],
    description:
      "Build enterprise-grade applications using Spring Boot and microservices architecture."
  },
  {
    id: "21",
    title: "Angular Developer",
    company: "WebTech Solutions",
    location: "Chennai, India",
    type: "Full-time",
    level: "Mid-level",
    salary: "₹8,00,000 - ₹14,00,000",
    postedAt: "2025-09-21",
    tags: ["Angular", "TypeScript", "RxJS", "NgRx"],
    description:
      "Develop single-page applications using Angular framework for enterprise clients."
  },
  {
    id: "22",
    title: "Blockchain Developer",
    company: "Crypto Tech",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "₹18,00,000 - ₹32,00,000",
    postedAt: "2025-09-22",
    tags: ["Solidity", "Ethereum", "Smart Contracts", "Web3"],
    description:
      "Build decentralized applications and smart contracts on blockchain platforms."
  },
  {
    id: "23",
    title: "Product Manager",
    company: "Innovate Labs",
    location: "Bangalore, India",
    type: "Full-time",
    level: "Senior",
    salary: "₹18,00,000 - ₹30,00,000",
    postedAt: "2025-09-08",
    tags: ["Product Strategy", "Agile", "User Research"],
    description:
      "Lead product development from conception to launch for our mobile applications."
  },
  {
    id: "24",
    title: "Backend Engineer (Node.js)",
    company: "HireHub Inc",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "₹10,00,000 - ₹18,00,000",
    postedAt: "2025-08-28",
    tags: ["Node.js", "Express", "MongoDB"],
    description:
      "Design and build scalable REST APIs, work with MongoDB and implement authentication & role-based access."
  },
  {
    id: "25",
    title: "Backend Developer",
    company: "Tech Corp",
    location: "Remote",
    type: "Full-time",
    description: "Backend development with Node.js...",
    salary: "₹8,00,000 - ₹12,00,000",
    tags: ["Node.js", "Express", "MongoDB", "Backend"],
    level: "Mid-level"
  }
];

export default jobs;