/** Central site config — edit links/handles here. */
const defaultDonationUrl = "https://paypal.me/ianpaniagua";
const donationUrl =
  import.meta.env.PUBLIC_DONATION_URL?.trim() || defaultDonationUrl;
const isAllowedDonationLink =
  donationUrl.startsWith("https://buy.stripe.com/") ||
  donationUrl.startsWith("https://paypal.me/") ||
  donationUrl.startsWith("https://www.paypal.com/");

export const site = {
  name: "Garden Lodge",
  tagline: "We tend gardens the way you tend soil.",
  description:
    "Garden Lodge is a community garden in Hamburg run as a small agile project — sprints, a shared backlog, a progress log, and a growing trilingual garden-knowledge library.",
  links: {
    sprintBoard: "/sprints",
    backlog: "/backlog",
    email: "mailto:hello@example.com",
    support: isAllowedDonationLink ? donationUrl : defaultDonationUrl,
    supportExternal: true,
  },
  mainNav: [
    { label: "Why", href: "/#why" },
    { label: "How we work", href: "/#how-we-work" },
    { label: "Learn", href: "/learn" },
    { label: "Get involved", href: "/#get-involved" },
  ],
  footerNav: [
    { label: "Why", href: "/#why" },
    { label: "How we work", href: "/#how-we-work" },
    { label: "Sprints", href: "/sprints" },
    { label: "Progress", href: "/progress" },
    { label: "Learn", href: "/learn" },
    { label: "Get involved", href: "/#get-involved" },
  ],
};
