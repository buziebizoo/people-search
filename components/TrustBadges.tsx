const badges = [
  "Always Free",
  "No Sign Up Required",
  "Instant Results",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function TrustBadges() {
  return (
    <div className="bg-teal-950 py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2">
        {badges.map((label) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-sm font-medium text-teal-300"
          >
            <CheckIcon />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
