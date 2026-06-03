import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Who Is My Date? — Free Public Records Search",
  description:
    "Learn about Who Is My Date?, a free public records search engine powered by government and publicly available data sources.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About <span className="text-teal-600">Who Is My Date?</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Who Is My Date? is a free public records search engine that helps you
          locate individuals using information drawn entirely from government and
          publicly available sources.
        </p>
      </div>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Our Mission
          </h2>
          <p>
            We believe access to public records should be straightforward and
            free. Who Is My Date? was built to make it easy for anyone to search the
            same government databases that have always been publicly available —
            without the paywalls or confusing interfaces common on other
            platforms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Where Our Data Comes From
          </h2>
          <p className="mb-3">
            Every record displayed on Who Is My Date? originates from a legitimate
            public source. Our dataset is compiled from:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 text-gray-600">
            <li>
              <strong className="text-gray-800">Voter registration records</strong> — filed with state and county
              election boards and released under public records laws
            </li>
            <li>
              <strong className="text-gray-800">Property and tax records</strong> — maintained by county assessors
              and recorders
            </li>
            <li>
              <strong className="text-gray-800">Court and legal filings</strong> — from federal, state, and local
              court systems
            </li>
            <li>
              <strong className="text-gray-800">Business registrations</strong> — from state secretary of state
              offices
            </li>
            <li>
              <strong className="text-gray-800">Other government-published datasets</strong> — including
              professional licenses and public safety records
            </li>
          </ul>
          <p className="mt-3">
            We do not purchase, scrape, or aggregate data from private social
            networks or non-public databases. All information displayed is
            either directly government-published or derived from sources
            explicitly made available to the public under applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            How Who Is My Date? Works
          </h2>
          <p>
            Our search indexes are built by ingesting and normalizing public
            record datasets from across the country. When you enter a name,
            address, or phone number, Who Is My Date? queries this index and returns
            matching entries in a clean, readable format. We regularly update
            our datasets to reflect newly released government records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Responsible Use
          </h2>
          <p className="mb-3">
            Who Is My Date? is intended for lawful personal use — reconnecting with
            family, verifying contact information, or conducting general
            research. It is{" "}
            <strong>not</strong> a consumer reporting agency and may not be used
            for purposes regulated by the Fair Credit Reporting Act (FCRA),
            including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
            <li>Employment screening</li>
            <li>Tenant or housing evaluations</li>
            <li>Credit or insurance decisions</li>
            <li>Any purpose requiring a consumer report</li>
          </ul>
          <p className="mt-3">
            Use of Who Is My Date? for any prohibited purpose is a violation of our
            Terms of Service and may be unlawful.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Your Privacy Rights
          </h2>
          <p>
            If your information appears in our results and you would like it
            removed, you have the right to submit an opt-out request at no
            charge. We process all requests within 30 days in accordance with
            applicable law.
          </p>
          <div className="mt-4">
            <a
              href="/opt-out"
              className="inline-block bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Submit an Opt-Out Request
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Contact Us
          </h2>
          <p>
            Questions, concerns, or feedback can be directed to our team at{" "}
            <a
              href="mailto:privacy@whoismy.date"
              className="text-teal-600 hover:underline"
            >
              privacy@whoismy.date
            </a>
            . We aim to respond within 5 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
