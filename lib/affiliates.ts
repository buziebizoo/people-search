export const AFFILIATES = {
  peoplefinders: {
    // Dating/verification — show on name-search profiles
    dating: [
      "https://www.dpbolvw.net/click-101769486-14479423", // Do you know who you are dating?
      "https://www.dpbolvw.net/click-101769486-13312872", // CONFIRM YOUR TRUST
      "https://www.dpbolvw.net/click-101769486-17112791", // PeopleFinders Dating
      "https://www.dpbolvw.net/click-101769486-17112792", // PeopleFinders Dating
      "https://www.dpbolvw.net/click-101769486-17112790", // PeopleFinders Dating
      "https://www.dpbolvw.net/click-101769486-17112793", // PeopleFinders Dating
      "https://www.dpbolvw.net/click-101769486-14479426", // New Neighbors? See Where They Came From
    ],
    // Phone/reverse lookup — show on phone search results
    phone: [
      "https://www.dpbolvw.net/click-101769486-10667260", // See Who Your Partner Is Calling
      "https://www.dpbolvw.net/click-101769486-11000285", // FREE Reverse Phone Search
      "https://www.dpbolvw.net/click-101769486-15248525", // NEW Reverse Phone
      "https://www.dpbolvw.net/click-101769486-15248527", // NEW Reverse Phone
      "https://www.dpbolvw.net/click-101769486-17168657", // Who Keeps Calling
      "https://www.dpbolvw.net/click-101769486-17168658", // Who Keeps Calling
      "https://www.dpbolvw.net/click-101769486-17168660", // Unknown Number Don't Guess
      "https://www.dpbolvw.net/click-101769486-17168661", // Unknown Number Don't Guess
      "https://www.dpbolvw.net/click-101769486-17168662", // Unknown Number Don't Guess
      "https://www.dpbolvw.net/click-101769486-17168663", // Unknown Number Don't Guess
      "https://www.dpbolvw.net/click-101769486-17168664", // Unknown Number Don't Guess
      "https://www.dpbolvw.net/click-101769486-17168665", // Unknown Number Don't Guess
      "https://www.dpbolvw.net/click-101769486-17168666", // Protect Yourself from Unknown Numbers
      "https://www.dpbolvw.net/click-101769486-17168667", // Protect Yourself from Unknown Numbers
      "https://www.dpbolvw.net/click-101769486-17168668", // Protect Yourself from Unknown Numbers
      "https://www.dpbolvw.net/click-101769486-17168669", // Protect Yourself from Unknown Numbers
      "https://www.dpbolvw.net/click-101769486-10802501", // NEW Reverse Phone
      "https://www.dpbolvw.net/click-101769486-10545821", // New neighbors? Search their phone number
    ],
    // Background check — show on profile pages
    background: [
      "https://www.dpbolvw.net/click-101769486-10802507", // Get the facts before it's too late
      "https://www.dpbolvw.net/click-101769486-17051117", // Background 300x250
      "https://www.dpbolvw.net/click-101769486-17075940", // Background Report Membership
      "https://www.dpbolvw.net/click-101769486-13312298", // Find Anyone Anywhere
      "https://www.dpbolvw.net/click-101769486-15733401", // Evergreen
      "https://www.dpbolvw.net/click-101769486-10545135", // General
    ],
    // Family/reconnect — show on name search no-results
    family: [
      "https://www.dpbolvw.net/click-101769486-10545138", // Found Daughter
      "https://www.dpbolvw.net/click-101769486-10545139", // Found Father
      "https://www.dpbolvw.net/click-101769486-10545158", // Found Lost Love
      "https://www.dpbolvw.net/click-101769486-10934925", // Find Lost Family Friends Classmates
      "https://www.dpbolvw.net/click-101769486-10545136", // Looking for old friend
      "https://www.dpbolvw.net/click-101769486-10686441", // Lost family find them
      "https://www.dpbolvw.net/click-101769486-17271244", // Classmates
      "https://www.dpbolvw.net/click-101769486-17271242", // Classmates
      "https://www.dpbolvw.net/click-101769486-17271241", // Classmates
      "https://www.dpbolvw.net/click-101769486-17219498", // Genealogy
      "https://www.dpbolvw.net/click-101769486-17219496", // Genealogy
    ],
  },
  // Placeholders — replace when approved
  truthfinder: {
    general: ["https://www.truthfinder.com"],
  },
  beenverified: {
    general: ["https://www.beenverified.com"],
  },
};

/**
 * Pick a PeopleFinders affiliate URL by category.
 *
 * Uses Math.abs(seed) % pool length so the same seed always yields the same
 * URL (deterministic per profile/slug) while different seeds spread load
 * across the pool. Pass a slug-derived seed for profile pages so the same
 * profile always shows the same link; pass Date.now() for one-off placements.
 */
export function pickAffiliate(
  category: keyof typeof AFFILIATES.peoplefinders,
  seed: number = Date.now(),
): string {
  const urls = AFFILIATES.peoplefinders[category];
  return urls[Math.abs(seed) % urls.length]!;
}
