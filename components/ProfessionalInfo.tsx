export default function ProfessionalInfo({
  firstName,
  lastName,
  state,
}: {
  firstName: string;
  lastName: string;
  state: string;
}) {
  const query = [firstName, lastName, state].filter(Boolean).join(" ");
  const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
  const googleUrl   = `https://www.google.com/search?q=${encodeURIComponent(query + " linkedin")}`;

  return (
    <div className="bg-white border border-teal-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">
          Professional Information
        </h2>
      </div>
      <div className="px-6 py-5 flex flex-wrap gap-3">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Search LinkedIn
        </a>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 transition-colors"
        >
          Search Google
        </a>
      </div>
    </div>
  );
}
