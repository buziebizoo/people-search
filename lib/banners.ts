export const BANNERS = {
  "728x90": [
    { id: "10545158", html: `<a href="https://www.dpbolvw.net/click-101769486-10545158" target="_blank" rel="noopener noreferrer"><img src="https://www.lduhtrp.net/image-101769486-10545158" width="728" height="90" alt="People Finders" border="0"/></a>` },
    { id: "17168664", html: `<a href="https://www.kqzyfj.com/click-101769486-17168664" target="_blank" rel="noopener noreferrer"><img src="https://www.lduhtrp.net/image-101769486-17168664" width="728" height="90" alt="PeopleFinders" border="0"/></a>` },
    { id: "10685671", html: `<a href="https://www.anrdoezrs.net/click-101769486-10685671" target="_blank" rel="noopener noreferrer"><img src="https://www.awltovhc.com/image-101769486-10685671" width="728" height="90" alt="PeopleFinders" border="0"/></a>` },
  ],
  "300x250": [
    { id: "10802499", html: `<a href="https://www.jdoqocy.com/click-101769486-10802499" target="_blank" rel="noopener noreferrer"><img src="https://www.lduhtrp.net/image-101769486-10802499" width="300" height="250" alt="Reverse Phone Lookup" border="0"/></a>` },
    { id: "17051117", html: `<a href="https://www.tkqlhce.com/click-101769486-17051117" target="_blank" rel="noopener noreferrer"><img src="https://www.awltovhc.com/image-101769486-17051117" width="300" height="250" alt="" border="0"/></a>` },
    { id: "17051136", html: `<a href="https://www.dpbolvw.net/click-101769486-17051136" target="_blank" rel="noopener noreferrer"><img src="https://www.ftjcfx.com/image-101769486-17051136" width="300" height="250" alt="" border="0"/></a>` },
    { id: "10686441", html: `<a href="https://www.kqzyfj.com/click-101769486-10686441" target="_blank" rel="noopener noreferrer"><img src="https://www.tqlkg.com/image-101769486-10686441" width="300" height="250" alt="PeopleFinders" border="0"/></a>` },
    { id: "10802501", html: `<a href="https://www.dpbolvw.net/click-101769486-10802501" target="_blank" rel="noopener noreferrer"><img src="https://www.awltovhc.com/image-101769486-10802501" width="300" height="250" alt="PeopleFinders" border="0"/></a>` },
    { id: "12526557", html: `<a href="https://www.anrdoezrs.net/click-101769486-12526557" target="_blank" rel="noopener noreferrer"><img src="https://www.tqlkg.com/image-101769486-12526557" width="300" height="250" alt="PeopleFinders.com" border="0"/></a>` },
    { id: "17051126", html: `<a href="https://www.dpbolvw.net/click-101769486-17051126" target="_blank" rel="noopener noreferrer"><img src="https://www.awltovhc.com/image-101769486-17051126" width="300" height="250" alt="" border="0"/></a>` },
    { id: "10545153", html: `<a href="https://www.jdoqocy.com/click-101769486-10545153" target="_blank" rel="noopener noreferrer"><img src="https://www.ftjcfx.com/image-101769486-10545153" width="300" height="250" alt="People Finders" border="0"/></a>` },
    { id: "12528316", html: `<a href="https://www.kqzyfj.com/click-101769486-12528316" target="_blank" rel="noopener noreferrer"><img src="https://www.ftjcfx.com/image-101769486-12528316" width="300" height="250" alt="PeopleFinders" border="0"/></a>` },
    { id: "10802509", html: `<a href="https://www.anrdoezrs.net/click-101769486-10802509" target="_blank" rel="noopener noreferrer"><img src="https://www.awltovhc.com/image-101769486-10802509" width="300" height="250" alt="Find Anyone, Anywhere" border="0"/></a>` },
    { id: "10846740", html: `<a href="https://www.anrdoezrs.net/click-101769486-10846740" target="_blank" rel="noopener noreferrer"><img src="https://www.ftjcfx.com/image-101769486-10846740" width="300" height="250" alt="PeopleFinders" border="0"/></a>` },
  ],
  "468x60": [
    { id: "17168669", html: `<a href="https://www.kqzyfj.com/click-101769486-17168669" target="_blank" rel="noopener noreferrer"><img src="https://www.awltovhc.com/image-101769486-17168669" width="468" height="60" alt="PeopleFinders" border="0"/></a>` },
    { id: "10545159", html: `<a href="https://www.kqzyfj.com/click-101769486-10545159" target="_blank" rel="noopener noreferrer"><img src="https://www.tqlkg.com/image-101769486-10545159" width="468" height="60" alt="People Finders" border="0"/></a>` },
    { id: "17051118", html: `<a href="https://www.kqzyfj.com/click-101769486-17051118" target="_blank" rel="noopener noreferrer"><img src="https://www.lduhtrp.net/image-101769486-17051118" width="468" height="60" alt="" border="0"/></a>` },
  ],
};

/** Pick a banner by seed for rotation. Same seed → same banner every time. */
export function pickBanner(size: keyof typeof BANNERS, seed: number) {
  const arr = BANNERS[size];
  return arr[Math.abs(seed) % arr.length]!;
}

/**
 * Inject SID into the click URL for A/B tracking in CJ Reports.
 * SID format: [size]-[adID]-[page]  e.g. "728x90-10545158-blog"
 */
export function injectSid(html: string, sid: string): string {
  return html.replace(
    /(https:\/\/www\.[a-z]+\.(?:com|net)\/click-[0-9]+-[0-9]+)/,
    `$1?sid=${encodeURIComponent(sid)}`,
  );
}
