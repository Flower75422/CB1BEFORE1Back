export const ALL_INTERESTS_600 = [
  "AI", "Dev", "SaaS", "React", "Rust", "Web3", "Cloud", "UX", // Short
  "TypeScript", "Next.js 14", "PostgreSQL", "Cybersecurity", // Medium
  "Artificial Intelligence", "Full Stack Development", "Machine Learning" // Long
].concat(Array.from({ length: 585 }, (_, i) => i % 3 === 0 ? `Tech-System-${i}` : `Tag-${i}`));