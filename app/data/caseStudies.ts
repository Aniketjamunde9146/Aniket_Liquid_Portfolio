export type CaseStudy = {
  title: string;
  category: string;
  problem: string;
  solution: string;
  outcome: string;
  result: string;
  accent: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "The Square Aesthetics",
    category: "Healthcare / premium clinic website",
    problem:
      "The clinic needed a premium digital presence that felt trustworthy, elevated, and easy for patients to navigate on mobile while booking consultations quickly.",
    solution:
      "I designed and built a premium conversion-focused website with luxury visual direction, treatment pages, WhatsApp/phone CTAs, clear service narratives, and a responsive booking-first layout.",
    outcome:
      "The new experience gives the clinic a polished, high-trust brand presence and makes it easier for prospective patients to understand services and request treatment inquiries.",
    result: "Improved trust + consultation intent",
    accent: "#6366f1",
  },
  {
    title: "Phulwari",
    category: "Education and community platform",
    problem:
      "Phulwari wanted a warm, credible website that presented their institution with more confidence and helped visitors quickly understand the programs and value they offer.",
    solution:
      "I created a modern, conversion-friendly website with focused messaging, clear academic value propositions, and a smooth responsive experience that feels approachable and professional.",
    outcome:
      "The brand presence now feels more established, with clearer visitor journey and stronger credibility for prospective students and families.",
    result: "Stronger first impression and trust signal",
    accent: "#8b5cf6",
  },
  {
    title: "Smart Edge Education Consultancy",
    category: "Student recruitment and advisory website",
    problem:
      "The consultancy needed a sharper online presence to present services clearly, build trust, and help students and parents understand the support they offer across study choices and guidance.",
    solution:
      "I built a polished consultancy website with clearer service positioning, strong SEO structure, and a more confident user journey from landing to enquiry.",
    outcome:
      "The site now better communicates expertise and gives the consultancy a more professional, searchable presence for student inquiries.",
    result: "More qualified enquiry intent and clearer positioning",
    accent: "#10b981",
  },
];
