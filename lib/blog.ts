// Central blog data. Posts are hardcoded for now; swap for a CMS/MDX loader later.

export type BlogCategory = "Dating Safety" | "People Search" | "Background Checks";

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  category: BlogCategory;
  excerpt: string;
  content: string; // HTML
};

export const BLOG_CATEGORIES: ("All" | BlogCategory)[] = [
  "All",
  "Dating Safety",
  "People Search",
  "Background Checks",
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-verify-tinder-date",
    title: "How to Verify Your Tinder Match Before Meeting Up",
    date: "2026-06-01",
    category: "Dating Safety",
    excerpt:
      "Before you meet someone from a dating app, here's how to quickly verify they are who they say they are using free public records.",
    content: `
<p>Meeting someone from Tinder can be exciting, but a profile is only as honest as the person behind it. Photos can be old, names can be made up, and stories can be exaggerated. Spending ten minutes verifying your match before you meet up is one of the easiest ways to protect yourself — and it's something most people never bother to do.</p>

<h2>Start with their full name</h2>
<p>The first step is getting a real first and last name. If your match has only given you a first name, that's not necessarily a red flag this early, but you'll want a last name before meeting in person. A natural way to ask is to mention you like to know who you're meeting "just to be safe" — anyone genuine will understand. Once you have a name, run it through a free public records search to confirm the person exists, roughly matches the age on their profile, and lives in the city they claim.</p>

<h2>Run a reverse phone lookup</h2>
<p>If you've moved the conversation to text, you already have a powerful verification tool: their phone number. A reverse phone lookup can tell you the name associated with that number and the general area it's registered to. If the name attached to the phone is completely different from the name on the profile, ask about it before you write it off — but treat a mismatch as a reason to dig deeper.</p>

<h2>Search public records</h2>
<p>Public records pull together information that's already legally available: address history, approximate age, possible relatives, and more. When you search your match's name and city, look for consistency. Does the age line up with their profile? Is the location the same? Do the listed relatives match anything they've told you? You're not looking for a perfect dossier — you're looking for confirmation that the basic facts check out.</p>

<h2>Reverse image search their photos</h2>
<p>Save a couple of their profile pictures and run them through a reverse image search. If the same photos show up attached to a different name, a stock-photo site, or a model's Instagram, you may be dealing with a fake profile. Catfishers frequently reuse attractive photos lifted from elsewhere on the internet.</p>

<h2>Red flags to watch for</h2>
<ul>
<li>They refuse to share a last name or any verifiable detail.</li>
<li>They won't do a quick video call before meeting.</li>
<li>Their stories about work, location, or family keep changing.</li>
<li>The name on their phone number doesn't match their profile.</li>
<li>They pressure you to move to a private messaging app immediately.</li>
<li>They ask for money, gift cards, or financial help — always a dealbreaker.</li>
</ul>

<h2>Trust your instincts</h2>
<p>Verification tools are there to confirm what your gut is already telling you. If something feels off even after the records check out, you're allowed to cancel. And regardless of how the verification goes, always meet for the first time in a public place, tell a friend where you'll be, and arrange your own transportation. A few minutes of research plus a few simple precautions turns a blind date into a much safer one.</p>
`,
  },
  {
    slug: "background-check-hinge-match",
    title: "How to Run a Background Check on Your Hinge Match",
    date: "2026-06-02",
    category: "Background Checks",
    excerpt:
      "A step-by-step guide to doing a free background check on someone you met on Hinge before your first date.",
    content: `
<p>Hinge markets itself as the app "designed to be deleted," which means the people on it are often looking for something serious. That's exactly why it's worth doing a quick background check before a first date — you may be meeting a future partner, and you deserve to know who they really are.</p>

<h2>Gather what you already know</h2>
<p>Before you search anything, write down everything your match has told you: their full name, age, city, job, school, and any family details. Hinge profiles often include a first name, workplace, and hometown, which is more than enough to start. The more data points you collect, the easier it is to confirm you're looking at the right person when multiple people share the same name.</p>

<h2>Step one: confirm their identity</h2>
<p>Run their name and city through a people search. You're verifying the basics first — that a real person by that name lives in that area and is roughly the age they claim. If your match said they're 32 and live in Charlotte, but the only match by that name is 50 and lives three states away, it's time to ask some questions.</p>

<h2>Step two: check address and relatives</h2>
<p>Public records typically include current and past addresses along with possible relatives. This information helps you confirm consistency with their story. Someone who claims to have lived in the same city their whole life but shows a long trail of out-of-state addresses isn't necessarily lying — but it's worth understanding before you get emotionally invested.</p>

<h2>Step three: look for public red flags</h2>
<p>A free background check won't give you a full criminal report, but it can surface publicly available information and point you toward official county and court resources if you want to dig further. For anything formal — like criminal or court records — go directly to the relevant government databases, which are free and authoritative.</p>

<h2>Step four: verify online consistency</h2>
<p>Search their name alongside their employer or city. Genuine people usually leave a consistent trail: a LinkedIn profile, a work bio, maybe a social account or two. A complete absence of any online footprint for someone who claims a public-facing career is worth a second look. So is a footprint that contradicts what they've told you.</p>

<h2>What a background check can't tell you</h2>
<p>Records confirm facts, not character. Someone can have a spotless public record and still be a poor match for you, and a single old record doesn't define a person. Use what you find as context, not a verdict. Most importantly, never use these tools for decisions about employment, housing, or credit — that's both against the terms of most services and, in many cases, illegal under the FCRA.</p>

<h2>Put it together</h2>
<p>Ten minutes of verification gives you confidence walking into a first date. Confirm the identity, check the story for consistency, glance at their online footprint, and then meet somewhere public. Do that, and you can relax and actually enjoy getting to know the person across the table.</p>
`,
  },
  {
    slug: "reverse-phone-lookup-guide",
    title: "Reverse Phone Lookup: Find Out Who's Really Calling You",
    date: "2026-06-03",
    category: "People Search",
    excerpt:
      "Getting calls from an unknown number? Here's how to find out exactly who is calling you for free.",
    content: `
<p>An unknown number lights up your phone. Is it a recruiter, a doctor's office, a scammer, or just a wrong number? Instead of guessing — or worse, calling back blind — a reverse phone lookup lets you find out who's behind a number before you ever pick up.</p>

<h2>What is a reverse phone lookup?</h2>
<p>A normal phone search starts with a name and finds a number. A reverse lookup flips that: you start with the number and find the name and location attached to it. The data comes from public and commercially available records — carrier registrations, public directories, and aggregated people-search databases.</p>

<h2>How to do a reverse phone lookup</h2>
<p>Enter the full ten-digit number into a reverse phone search tool. Within seconds you'll typically see the name associated with the line, the city and state where it's registered, and whether it's a mobile, landline, or VoIP number. VoIP numbers — internet-based lines from services like Google Voice — are worth noting, because scammers favor them since they're free and disposable.</p>

<h2>Why people use reverse lookups</h2>
<ul>
<li><strong>Screening unknown callers</strong> — decide whether a call is worth answering or returning.</li>
<li><strong>Identifying missed calls</strong> — put a name to a number that didn't leave a voicemail.</li>
<li><strong>Verifying a dating match</strong> — confirm the name on a number matches the person you're talking to.</li>
<li><strong>Spotting spam and scams</strong> — check whether a number has been reported for robocalls.</li>
<li><strong>Reconnecting</strong> — figure out who an old saved number belonged to.</li>
</ul>

<h2>Spotting scam numbers</h2>
<p>Certain patterns should raise your guard. "Neighbor spoofing" uses a number with your own area code and prefix to look local and familiar. A number that shows up as VoIP with no associated name, or one that's been widely reported online, is a classic scam signature. If a caller claims to be from your bank or the government but the number doesn't match the official one printed on your card or their website, hang up and call the verified number directly.</p>

<h2>What you can learn — and what you can't</h2>
<p>A reverse lookup is great for matching a number to a name and location. It won't hand you someone's full life history, and the accuracy depends on how current the underlying records are. Numbers change hands, people switch carriers, and prepaid phones may not be registered to anyone at all. Treat the result as a strong lead, not gospel.</p>

<h2>Protect your own number</h2>
<p>The same records that help you identify callers can expose your number too. Register with the national Do Not Call list, be cautious about where you post your number online, and submit opt-out requests to people-search sites if you'd rather not appear. A reverse phone lookup is a simple, free tool — use it to stay one step ahead of spam, verify who you're dealing with, and answer your phone with confidence.</p>
`,
  },
  {
    slug: "online-dating-safety-tips",
    title: "10 Online Dating Safety Tips Everyone Should Know in 2026",
    date: "2026-06-04",
    category: "Dating Safety",
    excerpt:
      "Stay safe while dating online with these essential tips for verifying identities and spotting red flags.",
    content: `
<p>Online dating has never been more popular — or more full of fake profiles, scams, and people who aren't quite who they claim to be. The good news is that staying safe doesn't require paranoia, just a handful of smart habits. Here are ten tips everyone should follow in 2026.</p>

<h2>1. Verify before you meet</h2>
<p>Take a few minutes to confirm your match's identity using a public records search. Check that their name, age, and city line up with what they've told you. A quick verification step catches the majority of fake profiles.</p>

<h2>2. Do a reverse image search</h2>
<p>Drop their photos into a reverse image search. If the pictures appear under a different name or on stock-photo sites, you're likely looking at a catfish using stolen images.</p>

<h2>3. Insist on a video call</h2>
<p>Before meeting in person, have at least one video call. It's the single fastest way to confirm the person matches their photos. Anyone who repeatedly dodges a quick video chat is waving a red flag.</p>

<h2>4. Keep the conversation on the app at first</h2>
<p>Scammers love to rush you onto private messaging apps where there's no moderation. There's no harm in keeping things on the dating platform until you're comfortable.</p>

<h2>5. Guard your personal information</h2>
<p>Don't share your home address, workplace, or financial details early on. Let trust build gradually. There's no legitimate reason a new match needs to know where you live before a first date.</p>

<h2>6. Never send money</h2>
<p>This is the golden rule. No matter the story — a medical emergency, a stranded trip, a sudden bill — never send money, gift cards, or crypto to someone you haven't met. It is the defining feature of a romance scam.</p>

<h2>7. Meet in public, every time</h2>
<p>For first dates, choose a busy public place and stay there. Don't agree to a private location, and don't accept a ride from someone you've just met. Arrange your own transportation both ways.</p>

<h2>8. Tell a friend your plans</h2>
<p>Share the details of your date with a friend or family member: who you're meeting, where, and when you expect to be home. Consider sharing your live location from your phone during the date.</p>

<h2>9. Trust your gut</h2>
<p>If something feels off, it's okay to leave. You never owe anyone your continued presence. Your safety and comfort come before politeness, every single time.</p>

<h2>10. Know how to report</h2>
<p>Familiarize yourself with the reporting and blocking tools on your dating app, and report suspicious profiles — you might be protecting the next person. If you encounter a scam, report it to the FTC as well.</p>

<h2>The bottom line</h2>
<p>Dating online is genuinely fun and, for millions of people, the way they meet their partner. Following these ten habits lets you enjoy it while keeping the small minority of bad actors at arm's length. Verify, communicate, meet smart, and trust yourself.</p>
`,
  },
  {
    slug: "how-to-find-someones-address",
    title: "How to Find Someone's Current Address Using Public Records",
    date: "2026-06-05",
    category: "People Search",
    excerpt:
      "A complete guide to finding someone's current address using free public records and people search tools.",
    content: `
<p>Whether you're sending a wedding invitation, reconnecting with an old friend, or serving legal paperwork, there are plenty of legitimate reasons to look up someone's current address. Much of this information is part of the public record — you just need to know where to look.</p>

<h2>Start with what you know</h2>
<p>The more identifying details you have, the better your results. A full name is the bare minimum; adding a city, state, approximate age, or the names of relatives dramatically narrows things down. This matters most for common names, where dozens of people might share the exact same first and last name.</p>

<h2>Use a people search tool</h2>
<p>People search engines aggregate public records into a single profile, often including current and previous addresses, phone numbers, and possible relatives. Enter the person's name and any location you know, then look through the results for the age and city that match your target. This is usually the fastest path to a current address.</p>

<h2>Check property and tax records</h2>
<p>If the person owns their home, county property and tax assessor records will list them as the owner along with the property address. These records are maintained at the county level and are almost always free to search online through the assessor's or recorder's website. This is one of the most reliable sources for a current address when someone is a homeowner.</p>

<h2>Search voter registration data</h2>
<p>In many states, voter registration records are public and include a registered voter's address. Availability and access rules vary by state, but where it's accessible, it's an authoritative and up-to-date source since people generally register where they live.</p>

<h2>Look at court and business filings</h2>
<p>Court records, business registrations, and professional licenses frequently list addresses. If the person owns a business or holds a state-issued license, the secretary of state or licensing board database may have a current address on file.</p>

<h2>Verify across multiple sources</h2>
<p>Addresses change, and any single record can be outdated. The best practice is to cross-check: if the same current address shows up in a people-search profile, a property record, and a recent court filing, you can be confident it's accurate. If sources disagree, the most recently dated record is usually the safest bet.</p>

<h2>Use the information responsibly</h2>
<p>Finding an address comes with responsibility. These tools are intended for lawful personal use — reconnecting, sending mail, or general research. They are <strong>not</strong> to be used for stalking, harassment, or any purpose regulated by the Fair Credit Reporting Act, such as tenant or employment screening. If someone has asked you not to contact them, respect that. Used appropriately, public records make it simple to find the address you need in just a few minutes.</p>
`,
  },
  {
    slug: "catfishing-how-to-spot-it",
    title: "How to Tell If You're Being Catfished (And What to Do About It)",
    date: "2026-06-06",
    category: "Dating Safety",
    excerpt:
      "Catfishing is more common than ever. Here's how to spot the warning signs and verify someone's real identity online.",
    content: `
<p>A catfish is someone who creates a fake online identity to deceive others — usually using stolen photos and a fabricated backstory. It happens on dating apps, social media, and in online friendships, and it can lead to emotional heartbreak or outright financial fraud. Knowing the warning signs is your best defense.</p>

<h2>The classic warning signs</h2>
<ul>
<li><strong>They avoid video calls.</strong> A catfish can't show their face on camera because they don't look like their photos. Endless excuses about a broken camera or bad connection are the number-one red flag.</li>
<li><strong>Their photos look too perfect.</strong> Model-quality pictures with no candid, everyday shots often mean the images were lifted from someone else.</li>
<li><strong>They fall for you fast.</strong> "Love bombing" — intense affection within days — is designed to lower your guard before the ask.</li>
<li><strong>Their story has holes.</strong> Details about their job, location, or family shift over time or don't add up.</li>
<li><strong>They eventually ask for money.</strong> This is the endgame of most catfishing scams, often wrapped in an emergency or a promise to pay you back.</li>
</ul>

<h2>How to verify their identity</h2>
<p>If you suspect something, verify before you invest any more time or emotion. Start with a reverse image search of their profile photos — if the same images appear under different names, you have your answer. Next, run their name and city through a public records search to confirm a real person by that name and age exists where they claim to live. Finally, a reverse phone lookup can reveal whether the name attached to their number matches the person you're talking to.</p>

<h2>Insist on a live video call</h2>
<p>The simplest test of all is a spontaneous video call. A genuine person will happily hop on camera. A catfish will deflect, reschedule, or vanish. Don't accept pre-recorded videos or photos "taken just now" as a substitute — those are easy to fake.</p>

<h2>What to do if you've been catfished</h2>
<p>First, stop all contact and don't send money, gift cards, or any further personal information. If you've already sent funds, contact your bank or payment provider immediately — fast action sometimes allows a reversal. Save the evidence: screenshots of conversations, profiles, and any photos they sent.</p>

<h2>Report it</h2>
<p>Report the profile to the platform where you met so they can remove it and protect others. In the United States, file a report with the FTC at reportfraud.ftc.gov, and if you lost money, contact the FBI's Internet Crime Complaint Center (IC3). Reporting matters — it helps investigators track scam networks that target many victims at once.</p>

<h2>Be kind to yourself</h2>
<p>Being catfished is not a reflection of your intelligence; these schemes are engineered to exploit trust and empathy, and they fool plenty of careful people. The lesson isn't to stop trusting — it's to verify early and protect yourself. A few minutes of checking identity up front can save you months of heartache later.</p>
`,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All posts, newest first. */
export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Posts in the same category as `post`, excluding it, newest first. */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, limit);
}

/** Estimated reading time in minutes (based on ~200 words/min). */
export function readingTimeMinutes(content: string): number {
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Format an ISO yyyy-mm-dd date as "June 1, 2026" (UTC, no TZ drift). */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
