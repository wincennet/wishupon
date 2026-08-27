# Accounts You Need Before Starting (all free)

Set these up first — Claude Code will need you to connect them during the build.

## 1. GitHub (free)
- Go to github.com → Sign up
- This stores your code and connects to Vercel for auto-deploys
- No credit card needed

## 2. Vercel (free)
- Go to vercel.com → Sign up using your GitHub account (easiest)
- This is where your live website will be hosted
- Free tier covers a small business site with room to grow
- No credit card needed for the free (Hobby) plan

## 3. Supabase (free)
- Go to supabase.com → Sign up
- Create a new project (pick any name, e.g. "wishupon")
- Note down (Claude Code will ask for these, or can help you find them):
  - Project URL
  - Project API Key (anon/public key)
- Free tier includes: 500MB database, 1GB file storage, built-in login system —
  plenty for a small product catalog + admin panel
- No credit card needed for the free tier

## Nothing else costs money at this stage
Everything in this build — the framework, the 3D library, the animation library,
hosting, and database — is free and open-source at this scale. The only future cost
would be if you eventually outgrow the free tiers (lots of traffic/orders) or want a
custom domain name (e.g. wishupon.com, ~$10-15/year — optional, not required to launch).

## About JazzCash / Easypaisa / Card payments (not needed to start)
The site launches with Cash on Delivery — completely free, no extra accounts needed.
Whenever you're ready to accept JazzCash, Easypaisa, or card payments, that requires
registering a **merchant account** directly with that provider (business verification,
and they take a small fee per transaction — typically 1-3%). That's separate from
everything else in this checklist and isn't required to launch the site.

## Order of operations
1. Create all 3 accounts above
2. Hand this whole project folder to Claude Code
3. Say: "Read CLAUDE.md and PROJECT_BRIEF.md and start building the project"
4. When Claude Code needs your Supabase keys or asks to connect GitHub/Vercel, have
   this checklist handy
