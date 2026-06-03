import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Who Is My Date?",
  description:
    "Who Is My Date? privacy policy covering data collection, cookies, FCRA compliance, CCPA rights, and your opt-out rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500">Last updated: June 2, 2026</p>
      </div>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <p>
            Who Is My Date? (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates a free public
            records search engine at whoismy.date (the &ldquo;Service&rdquo;). This
            Privacy Policy describes how we collect, use, disclose, and protect
            information in connection with your use of the Service. By accessing
            or using the Service you agree to the practices described in this
            policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Information We Collect From Users
          </h2>
          <h3 className="font-medium text-gray-800 mb-2">
            1.1 Search Queries
          </h3>
          <p className="mb-3">
            When you perform a search, we collect the terms you enter (names,
            addresses, phone numbers) along with metadata such as the date and
            time of the query, your IP address, browser type, and referring URL.
            This information is used to operate and improve the Service and is
            retained for up to 24 months.
          </p>
          <h3 className="font-medium text-gray-800 mb-2">
            1.2 Automatically Collected Technical Data
          </h3>
          <p className="mb-3">
            We automatically receive certain technical information when you
            visit the Service, including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600 mb-3">
            <li>IP address and approximate geographic location</li>
            <li>Browser type, version, and operating system</li>
            <li>Pages visited, time on page, and navigation paths</li>
            <li>Referring and exit URLs</li>
            <li>Device identifiers</li>
          </ul>
          <h3 className="font-medium text-gray-800 mb-2">
            1.3 Opt-Out Request Information
          </h3>
          <p>
            When you submit an opt-out or removal request, we collect the
            personal information you provide (name, address, email address) for
            the sole purpose of identifying and removing your record. This
            information is used only to process your request and is not retained
            for marketing or any other purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Public Records Data We Display
          </h2>
          <p className="mb-3">
            The search results displayed through the Service consist of
            information compiled from publicly available government sources,
            including voter registration rolls, property records, court filings,
            business registrations, and similar official datasets. This data was
            originally collected and published by government agencies; Who Is My Date?
            aggregates and indexes it to make searching easier.
          </p>
          <p>
            We do not create profiles by combining public record data with
            privately obtained information. All records displayed were lawfully
            obtained from public sources and are provided for informational
            purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. Cookies and Tracking Technologies
          </h2>
          <p className="mb-3">
            We use cookies and similar tracking technologies to operate and
            improve the Service. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 text-gray-600 mb-3">
            <li>
              <strong className="text-gray-800">Essential cookies</strong> — required for the Service to function
              (session management, security tokens). These cannot be disabled.
            </li>
            <li>
              <strong className="text-gray-800">Analytics cookies</strong> — help us understand how visitors use
              the Service (e.g., Google Analytics). Data is aggregated and
              anonymized.
            </li>
            <li>
              <strong className="text-gray-800">Advertising cookies</strong> — used by our third-party
              advertising partners to deliver relevant ads and measure their
              performance (see Section 4).
            </li>
          </ul>
          <p>
            You can control or disable non-essential cookies through your
            browser settings. Note that disabling cookies may affect the
            functionality of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Third-Party Partners and Affiliates
          </h2>
          <p className="mb-3">
            We may share aggregated, non-personally-identifiable information
            with third-party service providers and advertising partners who help
            us operate the Service, analyze usage, and deliver advertising.
            These partners may include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600 mb-3">
            <li>Analytics providers (e.g., Google Analytics)</li>
            <li>Advertising networks (e.g., Google AdSense)</li>
            <li>Cloud infrastructure and hosting providers</li>
            <li>Fraud prevention and security services</li>
          </ul>
          <p className="mb-3">
            These third parties are prohibited from using your information for
            any purpose other than the services they provide to us. We do not
            sell personal information to third parties for their independent
            marketing purposes.
          </p>
          <p>
            Third-party advertising partners may set their own cookies and use
            tracking technologies subject to their own privacy policies. We
            encourage you to review those policies directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            5. How We Use Information
          </h2>
          <p className="mb-3">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
            <li>Providing, operating, and improving the Service</li>
            <li>Analyzing search patterns to improve result quality</li>
            <li>Detecting and preventing fraud and abuse</li>
            <li>Complying with legal obligations</li>
            <li>Responding to opt-out and data requests</li>
            <li>Delivering and measuring advertising</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            6. FCRA Compliance
          </h2>
          <p className="mb-3">
            Who Is My Date? is not a consumer reporting agency as defined by the Fair
            Credit Reporting Act, 15 U.S.C. § 1681 et seq. (&ldquo;FCRA&rdquo;). The
            information available through the Service may not be used as a
            factor in determining a consumer&apos;s eligibility for:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600 mb-3">
            <li>Credit or insurance</li>
            <li>Employment or contractor positions</li>
            <li>Rental housing or tenancy</li>
            <li>Any other purpose covered by the FCRA</li>
          </ul>
          <p>
            Accessing the Service constitutes your acknowledgment that you will
            not use any information obtained through the Service for any
            FCRA-regulated purpose. Violation of this restriction may expose you
            to civil and criminal liability under applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Your Rights and Opt-Out Options
          </h2>
          <p className="mb-3">
            You have the right to request removal of your personal information
            from our search index at no cost. To submit a removal request,
            visit our{" "}
            <a href="/opt-out" className="text-teal-600 hover:underline">
              Opt-Out / Do Not Sell page
            </a>
            . We will process your request within 45 days as required by
            applicable law.
          </p>
          <p className="mb-3">
            Depending on your state of residence, you may have additional rights
            under applicable privacy laws, including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600 mb-3">
            <li>
              <strong className="text-gray-800">California residents</strong> — rights under the California
              Consumer Privacy Act (CCPA) including the right to know, delete,
              and opt out of the sale or sharing of personal information (see Section 8)
            </li>
            <li>
              <strong className="text-gray-800">Virginia, Colorado, Connecticut, and other state residents</strong> —
              rights under applicable state privacy laws
            </li>
          </ul>
          <p>
            To exercise any of these rights, visit our{" "}
            <a href="/opt-out" className="text-teal-600 hover:underline">
              Opt-Out page
            </a>{" "}
            or contact us at{" "}
            <a href="mailto:privacy@whoismy.date" className="text-teal-600 hover:underline">
              privacy@whoismy.date
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            8. California Privacy Rights — Do Not Sell or Share My Personal Information
          </h2>
          <p className="mb-3">
            This section applies to residents of California and is provided pursuant to the
            California Consumer Privacy Act of 2018 and the California Privacy Rights Act
            of 2020 (collectively, &ldquo;CCPA&rdquo;).
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">8.1 What Personal Information We Collect</h3>
          <p className="mb-3">
            In the course of operating the Service, we collect the following categories of
            personal information about California residents who use our site:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600 mb-3">
            <li>Identifiers — IP address, browser identifiers, search queries you submit</li>
            <li>Internet or electronic network activity — pages visited, time on site, referring URLs</li>
            <li>Geolocation data — approximate location derived from IP address</li>
            <li>
              Records we index from public government sources — names, addresses, and other
              information originally published by government agencies
            </li>
          </ul>
          <p className="mb-4">
            We use this information solely to operate and improve the Service, prevent fraud,
            and comply with legal obligations. We do not use it for targeted advertising
            profiling without your consent.
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">8.2 Your Rights Under the CCPA</h3>
          <p className="mb-2">California residents have the following rights, exercisable free of charge:</p>
          <ul className="list-disc list-inside space-y-2 ml-2 text-gray-600 mb-4">
            <li>
              <strong className="text-gray-800">Right to Know</strong> — You may request that we disclose the
              categories and specific pieces of personal information we have collected about
              you, the sources from which it was collected, the business purpose for collection,
              and the categories of third parties with whom we share it.
            </li>
            <li>
              <strong className="text-gray-800">Right to Delete</strong> — You may request that we delete
              personal information we have collected from or about you, subject to certain
              exceptions permitted by law (e.g., information needed to complete a transaction
              or comply with a legal obligation).
            </li>
            <li>
              <strong className="text-gray-800">Right to Opt Out of Sale or Sharing</strong> — You may direct us
              not to sell or share your personal information with third parties. We do not sell
              personal information for monetary consideration; however, certain disclosures to
              advertising partners (such as cookies and identifiers shared with Google Analytics
              and advertising networks) may constitute a &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; under the CCPA.
              You may opt out of these disclosures using the link below.
            </li>
            <li>
              <strong className="text-gray-800">Right to Non-Discrimination</strong> — We will not discriminate
              against you for exercising any of your CCPA rights.
            </li>
            <li>
              <strong className="text-gray-800">Right to Correct</strong> — You may request correction of
              inaccurate personal information we maintain about you.
            </li>
            <li>
              <strong className="text-gray-800">Right to Limit Use of Sensitive Personal Information</strong> —
              We do not collect or use sensitive personal information beyond what is necessary
              to operate the Service.
            </li>
          </ul>

          <h3 className="font-semibold text-gray-800 mb-2">8.3 How to Submit a Request</h3>
          <p className="mb-3">
            To exercise any of the rights described above — including to opt out of the sale
            or sharing of your personal information — submit a request using any of the
            following methods:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600 mb-4">
            <li>
              <strong className="text-gray-800">Online:</strong>{" "}
              <a href="/opt-out" className="text-teal-600 hover:underline">
                whoismy.date/opt-out
              </a>{" "}
              (our Do Not Sell / Remove My Info page)
            </li>
            <li>
              <strong className="text-gray-800">Email:</strong>{" "}
              <a href="mailto:privacy@whoismy.date" className="text-teal-600 hover:underline">
                privacy@whoismy.date
              </a>
            </li>
          </ul>
          <p className="mb-4">
            We will acknowledge your request within 10 business days and respond substantively
            within <strong>45 days</strong> of receipt. If we need additional time (up to
            90 days total), we will notify you of the extension and the reason for the delay.
            We may ask you to verify your identity before processing your request.
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">8.4 Authorized Agent</h3>
          <p>
            You may designate an authorized agent to submit a CCPA request on your behalf.
            We will require written proof of the agent&apos;s authorization and may verify
            your identity directly to ensure the request is legitimate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            9. Data Retention and Security
          </h2>

          <p className="mb-3">
            We retain user-generated data (search logs, technical data) for up
            to 24 months, after which it is deleted or anonymized. Opt-out
            request information is retained only as long as necessary to process
            the request and maintain a suppression list.
          </p>
          <p>
            We implement reasonable technical and organizational measures to
            protect information against unauthorized access, disclosure,
            alteration, or destruction. However, no internet transmission is
            completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            10. Children&apos;s Privacy
          </h2>
          <p>
            The Service is not directed to individuals under the age of 18. We
            do not knowingly collect personal information from children. If you
            believe a child has submitted information to us, please contact us
            at{" "}
            <a
              href="mailto:privacy@whoismy.date"
              className="text-teal-600 hover:underline"
            >
              privacy@whoismy.date
            </a>{" "}
            and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            11. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will post the revised policy on this page with an updated effective
            date. Your continued use of the Service after any changes constitutes
            acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            12. Contact Information
          </h2>
          <p className="mb-3">
            For privacy-related questions, requests, or concerns, please contact
            us:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium text-gray-900">Who Is My Date? Privacy Team</p>
            <p>
              Email:{" "}
              <a
                href="mailto:privacy@whoismy.date"
                className="text-teal-600 hover:underline"
              >
                privacy@whoismy.date
              </a>
            </p>
            <p>Response time: within 5 business days</p>
          </div>
        </section>
      </div>
    </div>
  );
}
