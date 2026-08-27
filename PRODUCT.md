# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the shopper.** Pakistani buyers, overwhelmingly on a phone, browsing
handmade beaded and steel accessories for themselves or as a gift. They arrive
from social media (Instagram/WhatsApp status) rather than search, so the site
often has to do the work a shop assistant would: show the piece clearly, answer
"is this available / how much / how do I get it" without friction.

**Secondary: the shop owner (the client).** Non-technical. Runs the whole
business herself — makes the pieces, photographs them, handles orders. She needs
to add products, change prices, mark things out of stock, and confirm orders
without touching code or asking Hasan for help.

## Product Purpose

A storefront that lets a one-person handmade accessories business sell directly,
instead of losing orders in Instagram DMs. Success is the owner running it alone
after handover: listing new pieces the day she makes them, and seeing orders in
one place instead of scattered across chats.

## Positioning

Three confirmed differentiators, in the owner's own framing:

1. **Custom / made-to-order** — pieces can be customised (colours, size,
   personalised for the buyer).
2. **One-of-a-kind** — each piece is unique, never mass-produced, made in
   limited quantities.
3. **Affordable everyday handmade** — accessible pricing, meant to be worn
   daily. Explicitly *not* positioned as luxury.

The combination is the position: handmade and customisable at everyday prices.
Neither a mass-market accessory brand nor a luxury jeweller could claim both.

## Operating Context

- Orders are fulfilled by hand, one at a time, by the owner.
- Delivery is via Pakistani courier services (TCS and similar).
- Payment at launch is Cash on Delivery, with bank transfer as a manual
  second option. No card/wallet gateway exists yet — that requires a merchant
  account (business verification + per-transaction fees) that has not been set up.
- The owner confirms each order manually before it ships.

## Capabilities and Constraints

**Product catalogue**
- Two categories: Beaded Accessories and Steel/Metal Bracelets.
- Beaded Accessories has sub-types: bracelets, earrings, necklaces. The data
  model carries `sub_type` so new sub-types can be added without a schema change.
- Only beaded **bracelets** have real photography today (12 images). Earrings,
  necklaces, and all steel pieces have no photos yet and must use deliberate
  placeholders — never a broken image.
- Out-of-stock items stay visible and are clearly marked, not hidden.

**Orders**
- Cart → checkout (name, phone, address, payment method) → order saved as
  `pending` → owner confirms → marks fulfilled when shipped.
- Payment methods: Cash on Delivery (default), bank transfer (manual reference).
  JazzCash/Easypaisa/card are out of scope until a merchant account exists.

**Admin**
- Login-protected. Product create/edit/delete, stock in/out, and order
  management with confirm / reject / fulfil.
- Must be usable by a non-technical person: big controls, plain labels, no jargon.

**Technical constraints**
- Stack is fixed by the client brief: Next.js (App Router), Tailwind, Supabase
  (Postgres + Auth + Storage), Vercel. Free tier throughout.
- Prices are Pakistani Rupees (PKR).
- Mobile-first is a requirement, not a preference — most traffic is phones.

**Open / undecided**
- Delivery charge: courier is TCS-style, but whether the site charges a flat
  fee, free delivery, or buyer-pays-on-delivery is not yet decided.
- Admin login email: the client has no business email address yet.
- WhatsApp contact number: confirmed to exist, not yet provided.

## Brand Commitments

- **Name:** WishUpon.
- **Logo:** `assets/logo/wishupon-logo.jpg` — white cursive script wordmark with
  a white butterfly mark, over a purple floral photograph.
- **Palette (binding, from `design/color-palette.md`):** background `#FAF7F5`,
  primary `#5B3A7A`, accent `#C9A9E0`, text `#2A1B3D`, neutral `#D9C9B8`.
  Pure black and pure white are explicitly excluded.
- **Stated vibe:** soft, warm, handmade/boutique — small-business, not
  big-box or corporate.

## Evidence on Hand

- 12 real product photographs of beaded bracelets, at
  `assets/products/beaded-accessories/` — crystal-bead cluster bracelets with
  gold tassels and chain detail, shot both worn-on-hand and as flat-lays.
- Logo file (above).

**Absences that must not be fabricated:** there are no customer testimonials,
no reviews, no sales figures, no press, no founder photograph, and no "as seen
in" credentials. There is no About copy written by the owner yet. Any such
content must come from the client, not be invented to fill a section.

## Product Principles

1. **The photograph is the product.** Every layout decision serves the piece
   being shown; nothing competes with it for attention.
2. **Handmade means imperfect and personal, not unprofessional.** Warmth is the
   brand; sterile grid-and-filter e-commerce would misrepresent it.
3. **The owner has to run this alone.** Any admin feature she cannot use
   unaided is a failed feature, regardless of how good it looks.
4. **Never fake credibility.** With no reviews or press, trust is earned through
   clear pricing, honest stock status, real photography, and a reachable human.
5. **Phone-first, on a slow connection.** The shopper is on mobile data in
   Pakistan; heavy pages cost real orders.

## Accessibility & Inclusion

No client-specific standard was set. Baseline still applies: legible type on the
warm background, real contrast for text and controls, keyboard-reachable
interactive elements, alt text on product photography, and full functionality
under `prefers-reduced-motion`.
