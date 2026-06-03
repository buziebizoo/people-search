import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Who Is My Date?",
  description:
    "Terms of service for Who Is My Date?, a free public records search engine.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500">Last updated: June 2, 2026</p>
      </div>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
            the Who Is My Date? website and services (collectively, the
            &ldquo;Service&rdquo;) operated by Who Is My Date? (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
            By accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Eligibility
          </h2>
          <p>
            You must be at least 18 years of age to use the Service. By using
            the Service, you represent and warrant that you are 18 or older and
            have the legal capacity to enter into these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Description of Service
          </h2>
          <p>
            Who Is My Date? provides access to an index of publicly available
            government records, including but not limited to voter registration
            data, property records, court filings, and business registrations.
            The Service is provided for informational purposes only. We do not
            guarantee the accuracy, completeness, or timeliness of any
            information displayed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. FCRA Notice — Prohibited Uses
          </h2>
          <p className="mb-3">
            Who Is My Date? is <strong>not</strong> a consumer reporting agency as
            defined by the Fair Credit Reporting Act, 15 U.S.C. § 1681 et seq.
            (&ldquo;FCRA&rdquo;). You expressly agree that you will not use the Service,
            or any information obtained through it, as a factor in:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600 mb-3">
            <li>Establishing a consumer&apos;s eligibility for credit or insurance</li>
            <li>Employment screening or hiring decisions</li>
            <li>Tenant screening or housing eligibility</li>
            <li>
              Any other purpose requiring a consumer report under the FCRA
            </li>
          </ul>
          <p>
            Any use of the Service for FCRA-regulated purposes is a material
            breach of these Terms and may violate federal and state law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Permitted Uses
          </h2>
          <p className="mb-3">
            You may use the Service solely for lawful personal, non-commercial
            purposes, such as:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
            <li>Reconnecting with lost family members or friends</li>
            <li>Verifying contact information for individuals you know</li>
            <li>General personal research</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            5. Prohibited Conduct
          </h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
            <li>Use the Service to stalk, harass, or harm any individual</li>
            <li>
              Collect or harvest information for commercial resale or
              distribution
            </li>
            <li>
              Use automated tools, bots, scrapers, or crawlers to access the
              Service without our prior written consent
            </li>
            <li>
              Attempt to reverse-engineer, decompile, or interfere with the
              Service or its underlying systems
            </li>
            <li>
              Use the Service in any manner that violates applicable federal,
              state, or local law
            </li>
            <li>
              Impersonate another person or entity when submitting opt-out or
              other requests
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            6. Intellectual Property
          </h2>
          <p>
            The Service, including its design, software, and compilation of
            data, is the property of Who Is My Date? and is protected by applicable
            intellectual property laws. The underlying public records data
            originates from government sources and is not claimed as our
            proprietary content, but the manner in which it is indexed,
            organized, and presented is our original work. You may not
            reproduce, distribute, or create derivative works from the Service
            without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Disclaimer of Warranties
          </h2>
          <p>
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
            LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, ACCURACY, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
            SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR
            OTHER HARMFUL COMPONENTS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            8. Limitation of Liability
          </h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, WHO IS MY DATE? AND ITS
            OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR
            ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE,
            EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL
            LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS OR THE
            SERVICE SHALL NOT EXCEED $100.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            9. Indemnification
          </h2>
          <p>
            You agree to indemnify, defend, and hold harmless Who Is My Date? and
            its affiliates, officers, directors, employees, and agents from any
            claims, liabilities, damages, losses, or expenses (including
            reasonable attorneys&apos; fees) arising out of or related to your use
            of the Service, your violation of these Terms, or your violation of
            any rights of a third party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            10. Privacy
          </h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <a href="/privacy-policy" className="text-teal-600 hover:underline">
              Privacy Policy
            </a>
            , which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            11. Modifications to Terms
          </h2>
          <p>
            We reserve the right to update these Terms at any time. We will
            post the revised Terms on this page with an updated effective date.
            Your continued use of the Service after any changes constitutes
            your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            12. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms are governed by the laws of the United States and the
            state in which Who Is My Date? is incorporated, without regard to
            conflict of law principles. Any dispute arising from these Terms
            shall be resolved through binding arbitration on an individual basis
            (not as part of a class action) under the rules of the American
            Arbitration Association, except that either party may seek
            injunctive relief in a court of competent jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            13. Contact
          </h2>
          <p className="mb-3">
            Questions about these Terms can be directed to:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium text-gray-900">Who Is My Date? Legal</p>
            <p>
              Email:{" "}
              <a
                href="mailto:legal@whoismy.date"
                className="text-teal-600 hover:underline"
              >
                legal@whoismy.date
              </a>
            </p>
            <p>
              Or use our{" "}
              <a href="/contact" className="text-teal-600 hover:underline">
                contact form
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
