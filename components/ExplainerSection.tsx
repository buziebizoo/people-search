const useCases: { image: string; title: string; description: string }[] = [
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop",
    title: "Verify someone you met online",
    description:
      "Make sure the person you matched with is who they say they are before meeting up.",
  },
  {
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=80&h=80&fit=crop",
    title: "Identify unknown callers",
    description:
      "Look up any phone number to find out who's been calling or texting you.",
  },
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop",
    title: "Find lost friends & family",
    description:
      "Reconnect with people from your past using their name or last known address.",
  },
  {
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80&h=80&fit=crop",
    title: "Research your neighbors",
    description:
      "Look up who lives nearby or check the history of an address.",
  },
  {
    image: "https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=80&h=80&fit=crop",
    title: "Protect yourself & your family",
    description:
      "Run a quick background check before letting someone into your life.",
  },
  {
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=80&h=80&fit=crop",
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
              className="border border-gray-200 rounded-xl p-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u.image}
                alt=""
                aria-hidden="true"
                className="w-16 h-16 rounded-full object-cover mb-3"
              />
              <h3 className="font-bold text-gray-900 mb-1">{u.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{u.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
