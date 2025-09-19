// small mock dataset to populate UI immediately
const jobs = [
  {
    id: "1",
    title: "Frontend Engineer",
    company: "Acme Corp",
    location: "Bangalore, India",
    type: "Full-time",
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
    salary: "₹40,000 - ₹70,000 / month",
    postedAt: "2025-09-10",
    tags: ["Figma", "Design System", "Prototyping"],
    description:
      "Design end-to-end user experiences for our B2B products. Strong portfolio required."
  }
];

export default jobs;
