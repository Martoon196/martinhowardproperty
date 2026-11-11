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
  windowEnds: "Wednesday 11 November at 7:30pm GMT",
  // Exact moment the webinar price ends (UTC). The course buttons switch to the standard price at this moment.
  // The members app enforces the same moment on its side, so changing this never changes what is charged.
  windowEndsAt: "2026-11-11T19:30:00Z",
  // Founders' Room places taken (update by hand until the app counts it).
  foundersTaken: 0,
  // Cohort 1 start date in words, once published.
  cohortDate: "",
  // Testimonial form. Once the app release is live: "https://app.martinhowardproperty.co.uk/api/mhp/story". Blank = email fallback.
  storyFormAction: "https://app.martinhowardproperty.co.uk/api/mhp/story",
  storyEmail: "martin@propinvestuk.co.uk",
  // Module kits checkout (members app). Once POST /api/mhp/checkout/kit is live (form field "kit" = slug from /assets/kits.json):
  // "https://app.martinhowardproperty.co.uk/api/mhp/checkout/kit". Blank = kit buy buttons are disabled with an "opening shortly" note.
  kitCheckoutAction: "https://app.martinhowardproperty.co.uk/api/mhp/checkout/kit",
  // Thank-you page offer (two more kits for the price of one). Once POST /api/mhp/checkout/kit-pair is live:
  // "https://app.martinhowardproperty.co.uk/api/mhp/checkout/kit-pair". Blank = the offer shows "opens later today".
  kitPairCheckoutAction: "https://app.martinhowardproperty.co.uk/api/mhp/checkout/kit-pair",
  // Land Gap Kit launch price (£27) ends at this moment (UTC), then £97. The members app enforces the same moment.
  landIntroEndsAt: "2026-11-15T23:59:00Z",
  // Mentoring applications. Once the app release with /api/mhp/apply is live:
  // "https://app.martinhowardproperty.co.uk/api/mhp/apply". Blank = the form opens an email with the answers.
  applyAction: "https://app.martinhowardproperty.co.uk/api/mhp/apply",
  // Cookieless page-event counter. Once live: "https://app.martinhowardproperty.co.uk/api/mhp/event". Blank = off.
  eventEndpoint: "https://app.martinhowardproperty.co.uk/api/mhp/event",
  // Calendar booking link for the Income Path Call. Blank = "I'll email you within one working day".
  bookingUrl: "",
  // Set to true once the app accepts webinar sign-ups without marketing consent (same release as applyAction).
  webinarConsentOptional: true,
  // Show the optional mobile number on the webinar form. Set to true once the app release that stores PHONE is live.
  collectPhone: true
};
