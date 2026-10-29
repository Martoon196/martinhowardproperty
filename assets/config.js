// One place to wire the site to the members app. Fill in and commit.
window.MHP = {
  // Sign-up forms (cheat sheets, webinar, waitlist). Once the app release is live:
  // "https://app.martinhowardproperty.co.uk/api/mhp/subscribe". Blank = forms show a "sign-up opens shortly" note.
  formAction: "https://app.martinhowardproperty.co.uk/api/mhp/subscribe",
  // Old Brevo form action, kept only as a fallback. Leave blank.
  brevoFormAction: "",
  // Brevo redirect page after a successful submit (set the same URL inside the Brevo form settings).
  thanksUrl: "/thanks/",
  // Webinar details shown on the registration page.
  webinarDate: "Wednesday 4 November, 7:30pm UK, on YouTube Live",
  // YouTube live stream video ID (the part after youtube.com/live/). Unlisted stream on the Martin Howard channel.
  youtubeLiveId: "wFXgw_dPl-A",
  // From this time the replay page plays the same YouTube video as the recording (UTC; 08:00 UK on Thursday 5 November).
  replayFrom: "2026-11-05T08:00:00Z",
  // Optional override: a different replay URL (YouTube/Vimeo embed or a share link). Leave blank to use the stream above.
  replayUrl: "",
  replayPasscode: "",
  // Webinar price window: the date in words the £997 price ends, e.g. "Wednesday 11 November". Blank hides the line.
  windowEnds: "",
  // Founders' Room places taken (update by hand until the app counts it).
  foundersTaken: 0,
  // Cohort 1 start date in words, once published.
  cohortDate: "",
  // Testimonial form. Once the app release is live: "https://app.martinhowardproperty.co.uk/api/mhp/story". Blank = email fallback.
  storyFormAction: "https://app.martinhowardproperty.co.uk/api/mhp/story",
  storyEmail: "martin@propinvestuk.co.uk"
};
