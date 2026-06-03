import { ReactNode } from "react";

const MagnifyingGlass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
    <path d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9" />
    <path d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const steps: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: <MagnifyingGlass />,
    title: "Search",
    description:
      "Enter a name, phone number, or address into the search bar. Our system scans millions of public records in seconds.",
  },
  {
    icon: <DatabaseIcon />,
    title: "Discover",
    description:
      "View aggregated data from government records, public databases, and other lawful sources — all in one place.",
  },
  {
    icon: <PeopleIcon />,
    title: "Connect",
    description:
      "Verify identities, reconnect with lost contacts, or do your due diligence before meeting someone new.",
  },
];

export default function ExplainerSection() {
  return (
    <section className="bg-gray-50 py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
          How Who Is My Date? works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-4">
              <div className="text-teal-600">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
