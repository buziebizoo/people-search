import type { Metadata } from "next";
import { pickAffiliate } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Free Reverse Phone Lookup | Find Out Who's Calling | Who Is My Date?",
  description:
    "Enter any phone number to instantly find out who's calling you. Free reverse phone lookup using public records. No sign-up required.",
  openGraph: {
    title: "Free Reverse Phone Lookup | Find Out Who's Calling | Who Is My Date?",
    description:
      "Enter any phone number to instantly find out who's calling you. Free reverse phone lookup using public records. No sign-up required.",
  },
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const STEPS: { emoji: string; title: string; description: string }[] = [
  {
    emoji: "📱",
    title: "Enter the number",
    description: "Type any US phone number including area code",
  },
  {
    emoji: "🔍",
    title: "We search public records",
    description: "Our system scans millions of public records instantly",
  },
  {
    emoji: "✅",
    title: "See who's calling",
    description: "Get the owner's name, address, and more",
  },
];

const USE_CASES: { title: string; description: string }[] = [
  { title: "Unknown caller", description: "Find out who keeps calling from that unknown number" },
  { title: "Spam calls", description: "Identify telemarketers and robocall numbers" },
  { title: "Verify a contact", description: "Confirm someone's phone number is legitimate" },
  { title: "Suspicious texts", description: "Find out who's texting your partner" },
];

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is reverse phone lookup really free?",
    answer:
      "Yes. Searching a phone number on Who Is My Date? is completely free and requires no account or credit card. We surface owner information drawn from publicly available records at no cost. For a complete report you can optionally use one of our partner services.",
  },
  {
    question: "What information can I find with a reverse phone lookup?",
    answer:
      "A reverse phone lookup can reveal the name associated with a number, the general location where it is registered, the line type (mobile, landline, or VoIP), and in many cases additional public-record details such as address history and possible relatives.",
  },
  {
    question: "How accurate is the information?",
    answer:
      "Accuracy depends on how current the underlying public records are. Numbers change hands, people switch carriers, and prepaid numbers may not be registered to anyone, so treat results as a strong lead rather than a guarantee. Cross-checking multiple sources gives the most reliable picture.",
  },
  {
    question: "Can I look up cell phone numbers?",
    answer:
      "Yes. Our reverse phone lookup works with mobile, landline, and VoIP numbers. Just enter the full 10-digit US number including the area code to see whatever public information is available.",
  },
];

// ---------------------------------------------------------------------------
// Structured data (JSON-LD)
// ---------------------------------------------------------------------------

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReversePhoneLookupPage() {
  const affiliateUrl = pickAffiliate("phone", 42);

  return (
    <div className="bg-white">
      <FaqJsonLd />

      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100 px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Free Reverse Phone Lookup
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Enter any phone number to find out who&apos;s really calling or texting you.
          </p>

          <form
            action="/results"
            method="get"
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input type="hidden" name="type" value="phone" />
            <input
              type="tel"
              name="q"
              required
              placeholder="(555) 555-5555"
              aria-label="Phone number"
              className="flex-1 rounded-lg px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Search →
            </button>
          </form>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-sm font-medium text-gray-600">
            <span>✓ Free to Search</span>
            <span>✓ No Sign Up Required</span>
            <span>✓ Instant Results</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-3">
                <span className="text-4xl leading-none">{step.emoji}</span>
                <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-gray-50 px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What People Use It For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {USE_CASES.map((u) => (
              <div key={u.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-1">{u.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{u.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate banner */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-teal-950 rounded-2xl px-6 py-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Want the full story behind a number?
            </h2>
            <p className="text-teal-100 mb-6">
              Get the owner&apos;s name, address history, and background details in one report.
            </p>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              Get Full Caller Details on PeopleFinders →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-6">
            {FAQS.map((f) => (
              <div key={f.question} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{f.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
