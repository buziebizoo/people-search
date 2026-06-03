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
  {
    slug: "check-sex-offender-registry-before-date",
    title: "How to Check the Sex Offender Registry Before a First Date",
    date: "2026-06-03",
    category: "Background Checks",
    excerpt:
      "Before meeting someone from a dating app, learn how to quickly search the national and state sex offender registries — for free — in under five minutes.",
    content: `
<p>Most people never think to check the sex offender registry before a first date. It takes about three minutes, it's completely free, and it's one of the most concrete safety steps you can take before meeting a stranger from a dating app. Here's exactly how to do it — and what to make of the results.</p>

<h2>Why the registry exists and who's on it</h2>
<p>The National Sex Offender Public Website (NSOPW) is a federally coordinated database that links the public sex offender registries of all 50 states, Washington D.C., U.S. territories, and tribal governments. Anyone convicted of a qualifying sex offense is legally required to register and keep their address current. The registry is public because lawmakers determined the public safety benefit outweighs any privacy concern. If someone is on it, you have a right to know.</p>

<h2>Search the national registry first</h2>
<p>Go to nsopw.gov and enter your match's first name, last name, and state. The search is free and requires no account. If a result comes back, you'll see a photo, age, address, and a brief description of the offense and conviction date. Because the registry pulls from all participating jurisdictions simultaneously, a single national search is usually sufficient — but if you know your match has lived in multiple states, it's worth running the search for each one.</p>

<h2>Check your state's registry directly</h2>
<p>Every state also maintains its own public registry with the most up-to-date information. State sites sometimes include more detail — additional photos, a more complete offense history, or registration compliance status. A quick search for "[your state] sex offender registry" will take you to the official government site. Common examples include Megan's Law in California (meganslaw.ca.gov) and the Florida Department of Law Enforcement registry (offender.fdle.state.fl.us). Most state sites allow searches by name, city, or ZIP code.</p>

<h2>What to do with a name mismatch</h2>
<p>A common obstacle is that you only have your match's first name. Before searching the registry, try to confirm their full name — ask naturally, mention that you like to know who you're meeting, or check whether they've connected a social profile to their dating account. Even a partial last name helps narrow results dramatically. If your match is unwilling to share a last name before meeting in person, that reluctance is itself a reason to pause.</p>

<h2>Understand what a clean result means — and doesn't mean</h2>
<p>Not finding someone on the registry is reassuring, but it doesn't mean a person has no criminal history at all. The registry only covers sex offense convictions where registration was required. Other serious offenses — assault, fraud, domestic violence — don't appear there. For a broader picture, you can run a general public records or background check search, which surfaces court records, criminal filings, and other publicly available information. Think of the registry check as one layer of a safety routine, not the whole thing.</p>

<h2>What to do if you find a match</h2>
<p>If a search returns a result that matches your date's name and approximate age, don't panic yet — confirm before acting. Compare the photo carefully. Registry entries include an address, which you can cross-reference against what your match has told you about where they live. If the details align — name, age, photo, city — you have information you need to act on. There is no obligation to continue contact. You can simply stop responding, and you don't owe anyone an explanation.</p>

<h2>Build it into your routine</h2>
<p>The registry check pairs naturally with the other verification steps you should run before a first date: a public records search to confirm identity and address, a reverse image search to rule out stolen photos, and a reverse phone lookup to match the name on the number. Together these take less than fifteen minutes and give you a meaningful baseline of confidence before you walk into a coffee shop to meet a stranger.</p>

<h2>Resources</h2>
<ul>
<li><strong>National registry:</strong> nsopw.gov — searches all states at once</li>
<li><strong>FTC romance scam reporting:</strong> reportfraud.ftc.gov</li>
<li><strong>FBI internet crime complaints:</strong> ic3.gov</li>
</ul>

<p>Dating app profiles are self-reported, which means they're only as accurate as the person filling them out. Public registries are government-maintained and legally enforced. Taking three minutes to cross-check one against the other is one of the simplest and most effective safety habits you can add to your dating life.</p>
`,
  },
  {
    slug: "how-to-verify-bumble-date",
    title: "How to Verify Someone You Met on Bumble Before Your First Date",
    date: "2026-06-03",
    category: "Dating Safety",
    excerpt:
      "Bumble puts women in charge of the first message, but it can't verify who's on the other side of the screen. Here's how to confirm your Bumble match is who they claim to be before you meet.",
    content: `
<p>Bumble's design gives women control of the first message, which filters out a lot of noise. But it can't verify that the person behind a profile is using their real name, real photos, or an honest backstory. Before you meet your Bumble match in person, a few quick checks can confirm you're dealing with someone genuine — and they take less time than picking an outfit for the date.</p>

<h2>Why Bumble profiles aren't the same as verified identities</h2>
<p>Bumble does offer a photo verification badge — a small checkmark that confirms the account holder has taken a selfie matching their profile pictures. That's a useful filter against completely stolen photos, but it doesn't confirm a real name, a real location, or the absence of a criminal history. A person can pass photo verification and still be using a nickname, lying about their age, or hiding a significant past. Verification badges are a floor, not a ceiling.</p>

<h2>Get their full name before you search</h2>
<p>Bumble profiles typically show only a first name. That's not enough to run a meaningful background check, so you'll want a last name before you meet. Asking is completely normal — something like "I like to know who I'm actually meeting; mind if I get your last name?" is polite and direct. Anyone genuine won't be bothered by it. If they deflect, invent a reason not to share, or get defensive, note that reaction carefully.</p>

<h2>Run a public records search</h2>
<p>Once you have a full name and their stated city, search it through a public records tool. You're looking to confirm three things: that a real person by that name exists in or near that city, that their approximate age matches the profile, and that their general story is consistent with the public record. This step catches a surprisingly large number of misrepresentations — fake names, wrong cities, and profiles where the listed age is off by a decade or more.</p>

<h2>Do a reverse image search on their photos</h2>
<p>Save one or two of their profile photos and run them through a reverse image search. If the same images appear elsewhere under a different name, or on stock-photo or modeling sites, you're looking at a stolen-photo profile — Bumble's verification badge notwithstanding, since the verification selfie only has to resemble the profile photos, not prove identity. A genuine person's photos will typically show up only on their own social accounts, if anywhere at all.</p>

<h2>Look them up on LinkedIn or Instagram</h2>
<p>Bumble lets users link their Instagram and Spotify accounts. If they've done that, check it — a real, active Instagram with a history of photos across multiple years is a strong authenticity signal. If they haven't linked anything, a quick LinkedIn search for their name and employer can confirm whether the job they mentioned is real and whether their career history lines up. You're not investigating their character, just confirming the basics.</p>

<h2>Run a reverse phone lookup once you're texting</h2>
<p>Most Bumble conversations move to texting before a date. Once you have a number, a reverse phone lookup takes about thirty seconds and tells you the name registered to that line. If the name attached to the number is completely different from what your match told you, ask about it — people do use other people's phones, have numbers in a family member's name, or use work lines. But a clear mismatch with no explanation is a reason to pause.</p>

<h2>Red flags specific to Bumble matches</h2>
<ul>
<li><strong>They want to move off the app immediately</strong> — pressure to text or use WhatsApp before any meaningful conversation has happened is a scammer tactic.</li>
<li><strong>Their profile was created very recently</strong> — check the "joined" date if visible. A brand-new profile on an older account holder can indicate someone who was previously banned.</li>
<li><strong>They avoid specifics about their job or neighborhood</strong> — vagueness about verifiable details often means those details won't hold up to scrutiny.</li>
<li><strong>They escalate emotionally very fast</strong> — intense declarations of connection within days are a manipulation technique, not a sign of chemistry.</li>
<li><strong>They dodge video calls</strong> — one short video call before a first meeting is a perfectly reasonable request and something any genuine person will agree to.</li>
</ul>

<h2>The video call test</h2>
<p>Before committing to a first date location and time, suggest a brief video call. Keep it casual — "Want to do a quick FaceTime before we meet?" is normal and friendly. The purpose is simple: confirm the person on screen looks like their photos and seems like a real, grounded human. A catfish, a scammer, or someone using significantly old photos will find a reason to skip it. A genuine person will say sure.</p>

<h2>Put it all together</h2>
<p>Bumble's matching mechanics are good, but identity verification is still your job. A full name search, a reverse image check, a LinkedIn glance, and one video call add up to maybe fifteen minutes of effort. In exchange, you walk into that first coffee date knowing the person across from you is who they say they are — which means you can spend the time actually getting to know them instead of quietly wondering.</p>
`,
  },
  {
    slug: "how-to-verify-match-com-date",
    title: "How to Verify Your Match.com Date Before Meeting In Person",
    date: "2026-06-03",
    category: "Dating Safety",
    excerpt:
      "Match.com attracts people who say they want something serious — but profiles are still self-reported. Here's how to verify your match's identity before your first date.",
    content: `
<p>Match.com has been connecting people since 1995, and its paid membership filters out some of the casual traffic you'd see on free apps. But a subscription fee doesn't verify anyone's identity. Names, ages, locations, and relationship statuses on Match profiles are entered by users themselves — with no independent check. Before you drive across town to meet a stranger, it's worth spending ten minutes confirming the basics are actually true.</p>

<h2>Why Match profiles need a second look</h2>
<p>Paid platforms like Match attract people who are serious about dating, which is exactly why scammers operate there too — the pool of emotionally invested, financially stable adults is exactly what a romance scammer is looking for. Catfishing, married people posing as single, and age misrepresentation are all documented problems on Match.com despite the subscription model. A quick identity check isn't cynicism; it's the same instinct that makes you look both ways before crossing a street you've crossed a hundred times.</p>

<h2>Get a full name before you search anything</h2>
<p>Match profiles show a username and a first name, which isn't enough for a meaningful search. Before your first date, ask for a last name. A straightforward approach works best: "I like to know who I'm meeting — mind sharing your last name?" Anyone genuine will understand and comply. If your match gets evasive or annoyed at a simple request for their last name before you meet in person, that reaction is itself useful information.</p>

<h2>Run a public records search</h2>
<p>Once you have a full name and the city they claim to live in, plug both into a public records or people-search tool. You're confirming three things: that a real person by that name lives in or near that city, that their approximate age matches what's on their profile, and that any other basic facts they've shared — like a general neighborhood or how long they've lived in the area — are consistent with the public record. People-search databases pull from voter rolls, property records, and other publicly available sources, so the results are usually reliable for basic identity confirmation.</p>

<h2>Check their marital status</h2>
<p>Match.com requires users to self-report their relationship status, and "divorced" or "separated" is easy to select even when it isn't true. If your match says they're divorced, you can verify it. Marriage and divorce records are public in every U.S. state, maintained at the county level. Search for their name in the county recorder or court portal for the area where they live or where they say they grew up. Finding a marriage record with no corresponding divorce filing is a reason to ask a direct question before you go further.</p>

<h2>Do a reverse image search on their photos</h2>
<p>Save one or two profile photos and run them through a reverse image search. Match users can upload up to 26 photos, which often provides more material to work with than apps that limit you to a handful. If the images appear elsewhere under a different name — or on a modeling or stock-photo site — the profile is almost certainly fake. Genuine people's photos typically don't turn up anywhere except their own social accounts, if they appear online at all.</p>

<h2>Look them up on LinkedIn</h2>
<p>Match profiles often include a job title and employer. A quick LinkedIn search for their name and company takes thirty seconds and tells you whether the career they described is real. A real LinkedIn profile with a multi-year employment history and mutual connections is a strong authenticity signal. A complete absence of any professional footprint for someone who claims a white-collar job in a major city is worth noting — most people with those jobs have at least a minimal LinkedIn presence.</p>

<h2>Confirm with a video call first</h2>
<p>Before committing to a time and place, suggest a short video call. Frame it casually — "Want to do a quick video chat before we meet? I find it helps break the ice." A real person will agree. A catfish, a scammer, or someone whose photos are ten years old will find a reason to skip it. One five-minute video call removes more uncertainty than any records search because you're seeing the person in real time.</p>

<h2>Red flags specific to Match.com</h2>
<ul>
<li><strong>Profile photos are all professionally shot</strong> — a few candid, everyday photos are a sign of a real person; a gallery of perfect shots often isn't.</li>
<li><strong>They push to move off Match immediately</strong> — Match has in-app messaging for a reason; pressure to switch to WhatsApp or personal email before you're comfortable is a scammer pattern.</li>
<li><strong>Their age or location doesn't match their story</strong> — someone who says they've lived in Boston for twenty years but whose public records show a different state deserves a follow-up question.</li>
<li><strong>They talk about finances, investments, or crypto early</strong> — romance scammers on paid platforms often build trust over weeks before introducing a "can't-miss" investment opportunity.</li>
<li><strong>Excuses for skipping video calls pile up</strong> — a broken camera works once; a broken camera that's still broken three weeks later is a pattern.</li>
</ul>

<h2>The ten-minute routine that makes a difference</h2>
<p>Put it together and the whole verification process takes about ten minutes: confirm their full name, run a public records search, glance at LinkedIn, drop a photo into a reverse image search, and schedule a video call. You'll walk into your Match.com first date with a meaningful baseline of confidence — not because the records guarantee a great match, but because they confirm you're meeting a real person who is who they say they are. That's the only foundation worth building on.</p>
`,
  },
  {
    slug: "background-check-texas-date",
    title: "How to Run a Background Check in Texas Before a First Date",
    date: "2026-06-03",
    category: "Background Checks",
    excerpt:
      "Texas has some of the most accessible public records in the country. Here's how to verify your date's identity, criminal history, and more using free Texas government resources.",
    content: `
<p>Texas has some of the most accessible public records in the country. If you're dating someone in Houston, Dallas, Austin, San Antonio, or anywhere else in the Lone Star State, you can confirm their identity, check their criminal history, and verify their address using free government resources — often in under fifteen minutes.</p>

<h2>Why Texas makes verification easier than most states</h2>
<p>Texas is an open-records state under the Texas Public Information Act. That means a wide range of government records — court filings, property ownership, sex offender registry entries, and more — are available to the public without a special request or a court order. For someone who wants to verify a date's identity before meeting in person, that legal framework is a genuine advantage.</p>

<h2>Step 1: Confirm their identity with a people search</h2>
<p>Start with the basics. Enter their full name and city into a people-search tool to confirm that a real person by that name lives where they say they do and is approximately the age listed on their profile. Texas's large population means common names return many results, so use every detail you have — age, neighborhood, or employer — to narrow things down.</p>

<h2>Step 2: Check Texas court records</h2>
<p>Texas courts maintain a public case-search portal at search.txcourts.gov that covers hundreds of courts statewide. Enter your match's name to search for any civil or criminal filings. The results include case type, filing date, and court location. For more detailed county-level searches, visit the district clerk's website for the relevant county directly — Harris County (Houston), Dallas County, Travis County (Austin), and Bexar County (San Antonio) all have free online portals with searchable records.</p>

<h2>Step 3: Search the Texas sex offender registry</h2>
<p>The Texas Department of Public Safety maintains the state's sex offender registry. You can search by name, city, or ZIP code through the DPS website. Texas also participates in the national registry at nsopw.gov, so a single national search covers Texas registrants. If you know your match lives in a specific county or city, a targeted state-level search will give you the most current information, including registration compliance status.</p>

<h2>Step 4: Look up property records</h2>
<p>If your match claims to own a home, county appraisal district records confirm it. Texas appraisal districts publish property ownership online; most county sites have a free search tool. Finding a property registered to your match's name at the address they've given you is a strong identity confirmation. The Texas Association of Appraisal Districts links to every county's portal if you're not sure where to start.</p>

<h2>Step 5: Check Texas vital records for marital status</h2>
<p>Marriage records in Texas are maintained at the county level by the county clerk. For most counties, basic marriage index searches are available online at no cost. Texas also has a statewide vital statistics index through the Texas DSHS for marriages from 1966 onward. If your match says they're divorced, you can cross-check by searching for divorce decrees through the county district court records — these are public civil filings.</p>

<h2>Red flags that make verification more urgent</h2>
<ul>
<li><strong>They're vague about which Texas city they live in.</strong> Houston, Dallas, Austin, and San Antonio are massive cities; someone genuinely from one of them can usually name a neighborhood, a major cross-street, or a local landmark. Vagueness about basic geography is worth noting.</li>
<li><strong>They claim to work in oil and gas, tech, or the military.</strong> These are common cover stories in Texas dating scams precisely because they're plausible and hard to verify without specific details.</li>
<li><strong>They say they travel frequently for work.</strong> A constant reason for being out of town is a classic romance-scammer setup for why they can't meet in person.</li>
</ul>

<h2>Put it all together</h2>
<p>A Texas background check before a first date doesn't require paid services or special access — it requires knowing where to look. A people search confirms the basics, Texas court records surface any criminal or civil history, the DPS registry covers the most serious concerns, and county property records confirm they live where they claim. Together, these free steps give you a meaningful picture of who you're meeting in under twenty minutes. Use them, meet somewhere public, and enjoy the date.</p>
`,
  },
  {
    slug: "how-to-check-if-someone-is-married",
    title: "How to Check If Someone Is Married Before Your First Date",
    date: "2026-06-07",
    category: "Background Checks",
    excerpt:
      "Worried your new match might already be taken? Here's how to check someone's marital status using free public records before you get attached.",
    content: `
<p>You've been chatting with someone for two weeks. The conversation is great, the photos check out, and you're ready to meet. But something keeps nagging at you — they're vague about their home life, they only text during business hours, and they've never once mentioned family or roommates. Before you invest any more time or emotion, it's worth finding out if the person you're talking to is already married.</p>

<p>This isn't paranoia. Married people on dating apps are a real and documented phenomenon, and the signs are often subtle enough to miss until you're already emotionally involved. A quick records check can save you a lot of heartbreak.</p>

<h2>Why marriage records are public</h2>
<p>In the United States, marriage is a legal contract registered with the government, which means marriage licenses are public records maintained at the county or state level. This isn't a loophole — it's how the system is designed. Anyone can request or search these records, and many counties have digitized them and made them available for free online.</p>

<h2>How to search marriage records</h2>
<p>The most direct method is to search the vital records or county clerk database for the state and county where you believe the person lives or grew up. Searches typically require a first name, last name, and approximate year range. If your match has told you their hometown or city, start there. Many state vital records offices have online portals; a quick search for "[state name] marriage records search" will usually find the right government site.</p>

<p>A people search tool can also surface this information. Running someone's name and location through a public records search often returns relationship status indicators along with address history and relatives — which can also reveal a spouse's name if the records include it.</p>

<h2>What to look for in the results</h2>
<p>A marriage record will show the names of both parties, the county, and the date. If you find a marriage record and no corresponding divorce record, the person may still be married. Divorce records are also public in most states and can be searched through the same court systems. The absence of a divorce filing after a marriage record is worth a conversation.</p>

<h2>Check for a divorce record too</h2>
<p>Someone who was married and then divorced is not a red flag — but someone who was married and has no record of a divorce filing is. Search the same county court system for divorce decrees using the person's name. Divorce proceedings create public filings that are typically searchable online through the county court's civil records portal.</p>

<h2>Other signals to watch for</h2>
<ul>
<li><strong>They only communicate at unusual hours</strong> — early morning, late at night, or only on weekdays during work hours.</li>
<li><strong>They're vague about living arrangements</strong> — they've never mentioned a roommate or explained who they share space with.</li>
<li><strong>They won't let you call</strong> — texts only, with explanations about why calling "doesn't work" for them.</li>
<li><strong>They suggest meeting far from their neighborhood</strong> — avoiding places where they might be recognized.</li>
<li><strong>Social media is private or sparse</strong> — no public photos, no check-ins, a suspiciously minimal digital footprint.</li>
<li><strong>A ring tan line</strong> — if you do meet in person and notice a lighter band of skin on their ring finger, ask about it directly.</li>
</ul>

<h2>Have the direct conversation</h2>
<p>Records are a verification tool, not a replacement for honest communication. Before the first date — or at least early in the relationship — it is completely reasonable to ask: "Are you currently married or in a serious relationship?" A genuine person won't be offended by the question. Evasiveness, anger, or a subject change in response to a simple yes-or-no question is itself information worth having.</p>

<h2>If you find a marriage record</h2>
<p>Finding a record doesn't automatically mean deception — they could be separated, legally separated, or in the middle of a divorce that hasn't finalized yet. But it does mean you deserve a direct and complete explanation before you go any further. If they've presented themselves as single and there's a marriage on the books with no corresponding divorce, you have every right to walk away. Your time and emotional investment belong with someone who's actually available.</p>
`,
  },
  {
    slug: "find-secret-dating-profile",
    title: "How to Find Out If Someone Has a Secret Dating Profile",
    date: "2026-06-03",
    category: "People Search",
    excerpt:
      "Suspect your partner is on Tinder, Bumble, or another dating app behind your back? Here's how to find hidden dating profiles using free tools — no hacking required.",
    content: `
<p>The suspicion that your partner might have a secret dating profile is one of the more gut-wrenching feelings in a relationship. Before you spiral, or before you confront someone on nothing but a hunch, there are legitimate ways to find out — using free, publicly available tools that don't require any special access or technical skills.</p>

<h2>Why people maintain hidden dating profiles</h2>
<p>Not everyone with an active dating profile is actively cheating. Some people forget to delete old accounts; others keep profiles as a passive "escape hatch" while telling themselves they'd never act on it. But some are actively using apps to meet other people while in a committed relationship. Whatever the reason, you deserve to know what's actually going on before you make any decisions about the relationship.</p>

<h2>Search by email address</h2>
<p>Most dating apps require an email address to create an account. If you know your partner's email address — or even a secondary one they use — you can test whether it's associated with a dating profile in a couple of ways. First, go to the dating app's login page and enter the email in the "forgot password" field. If the site says it will send a reset link, that email is registered on the platform. If it says no account exists, the email isn't tied to one. This works on Tinder, Bumble, Hinge, OkCupid, and most other major apps without requiring you to log in or create an account yourself.</p>

<h2>Search by username</h2>
<p>If your partner uses a consistent username across platforms — a gaming handle, an old email prefix, a nickname — search for it on dating sites directly or run it through a username search tool. People often recycle usernames out of habit, which makes a secret profile easier to find than they'd expect. A username that appears on a dating platform is a strong signal worth investigating further.</p>

<h2>Run a people search</h2>
<p>A people search can surface email addresses, phone numbers, and usernames associated with a person's name and location. If your partner has created a dating profile under their real name, a people search may surface it alongside their other public digital footprint. This is particularly useful if they've used a profile that's indexed or linked from a public-facing social account.</p>

<h2>Search their phone number</h2>
<p>Many dating apps allow users to sign up or log in with a phone number instead of an email. A reverse phone lookup can tell you what names and accounts are associated with a number. If the same number is registered to a profile under a different name or an unfamiliar username, that's a discrepancy worth understanding. Some people-search tools also cross-reference phone numbers with social and dating accounts in their aggregated results.</p>

<h2>Check their digital footprint manually</h2>
<p>Open a private or incognito browser window and search your partner's name, nickname, city, and any usernames you know they use. Add the word "profile" or the name of a specific dating app to narrow results. Dating profiles are sometimes indexed by search engines, particularly on platforms with less aggressive privacy settings or when someone hasn't set their profile to hidden. A result that links to a dating app profile is difficult to explain away.</p>

<h2>Look for app icons on their phone</h2>
<p>This one requires physical proximity but no technical skill. Dating apps have recognizable icons — Tinder's flame, Bumble's yellow hexagon, Hinge's logo. People who want to hide apps will sometimes move them into unmarked folders, rename them, or use lesser-known apps specifically because they're harder to recognize. If you notice an unfamiliar app you can't identify, a quick search of the app's name will tell you what it does.</p>

<h2>Check app usage history</h2>
<p>On many phones, app usage history is visible without unlocking anything sensitive. On Android, you can often access recent notification history through the settings menu. On iPhone, checking Screen Time under Settings shows app usage by day, including apps opened recently. High usage of an unfamiliar app — especially late at night — is worth a conversation.</p>

<h2>What to do with what you find</h2>
<p>Finding a dating profile doesn't automatically tell you the full story. Before you react, consider what you actually know: Is the profile active? When was it last used? Does it post-date your relationship, or could it be an old forgotten account? Screenshot everything before you bring it up — app profiles can be deleted quickly once someone knows they've been found.</p>

<p>If the profile is clearly active and recent, you have enough to have a direct conversation. Come in with the evidence, not just a feeling, and give the other person a chance to explain before you decide what to do next. If the explanation doesn't add up, trust what the evidence is telling you.</p>

<h2>Your gut is also data</h2>
<p>The fact that you're searching at all usually means something has already changed in the relationship — a shift in attention, unexplained late nights, a phone that's suddenly always face-down. The tools above can confirm or rule out a specific suspicion, but they can't fix an underlying problem in the relationship. Whether or not you find a profile, if trust is already broken, that conversation needs to happen regardless of what the search turns up.</p>
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
export function getRelatedPosts(post: BlogPost, limit = 4): BlogPost[] {
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
