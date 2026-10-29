// One place to wire the site to the members app. Fill in and commit.
window.MHP = {
  // Sign-up forms (cheat sheets, webinar, waitlist). Once the app release is live:
  // "https://app.martinhowardproperty.co.uk/api/mhp/subscribe". Blank = forms show a "sign-up opens shortly" note.
  formAction: "",
  // Old Brevo form action, kept only as a fallback. Leave blank.
  brevoFormAction: "",
  // Brevo redirect page after a successful submit (set the same URL inside the Brevo form settings).
  thanksUrl: "/thanks/",
  // Webinar details shown on the registration page.
  webinarDate: "Wednesday 4 November, 7:30pm UK, on Zoom",
  // Zoom join link for the live webinar (paste the full https://...zoom.us/j/... URL).
  zoomJoinUrl: "",
  // Replay: a Zoom cloud recording share link, or a YouTube/Vimeo embed URL, once the call has happened.
  replayUrl: "",
  replayPasscode: "",
  // Webinar price window: the date in words the £997 price ends, e.g. "Wednesday 11 November". Blank hides the line.
  windowEnds: "",
  // Founders' Room places taken (update by hand until the app counts it).
  foundersTaken: 0,
  // Cohort 1 start date in words, once published.
  cohortDate: "",
  // Testimonial form. Once the app release is live: "https://app.martinhowardproperty.co.uk/api/mhp/story". Blank = email fallback.
  storyFormAction: "",
  storyEmail: "martin@propinvestuk.co.uk"
};
