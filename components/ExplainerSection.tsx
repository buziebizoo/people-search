const useCases: { emoji: string; title: string; description: string }[] = [
  {
    emoji: "🔍",
    title: "Verify someone you met online",
    description:
      "Make sure the person you matched with is who they say they are before meeting up.",
  },
  {
    emoji: "📱",
    title: "Identify unknown callers",
    description:
      "Look up any phone number to find out who's been calling or texting you.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Find lost friends & family",
    description:
      "Reconnect with people from your past using their name or last known address.",
  },
  {
    emoji: "🏠",
    title: "Research your neighbors",
    description:
      "Look up who lives nearby or check the history of an address.",
  },
  {
    emoji: "🛡️",
    title: "Protect yourself & your family",
    description:
      "Run a quick background check before letting someone into your life.",
  },
  {
    emoji: "💼",
    title: "Do your due diligence",
    description:
      "Verify contact info, check address history, and confirm someone's identity.",
  },
];

export default function ExplainerSection() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
          Why people use Who Is My Date?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {useCases.map((u) => (
            <div
              key={u.title}
              className="border border-gray-200 rounded-xl p-6 flex items-start gap-4"
            >
              <span className="text-3xl leading-none">{u.emoji}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{u.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{u.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
