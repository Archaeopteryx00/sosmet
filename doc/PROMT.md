You are the lead engineer and product designer for this project.

Build **Sosmet**, a mobile-first Progressive Web App (PWA) that looks and feels like a clean, familiar photo-based social media app, while a background probabilistic simulation engine creates a believable synthetic social network around the user.

The goal is NOT to make an “AI social media” interface.

The goal is:

> Make the user feel like they have entered a small, living social network.

AI should mostly stay backstage.

==================================================
1. PROJECT CONTEXT
==================================================

Project name:
Sosmet

Repository:
https://github.com/Archaeopteryx00/sosmet.git

Platform:
Progressive Web App (PWA)

Primary experience:
Mobile

Secondary experience:
Desktop browser

The application is fully sandboxed.

Do not connect to or manipulate real social media platforms.

Do not scrape real users.

All synthetic users, posts, interactions, likes, comments, follows, and follower growth exist only inside Sosmet.

==================================================
2. IMPORTANT DEVELOPMENT RULE
==================================================

Before changing anything:

1. Inspect the existing repository.
2. Inspect package.json.
3. Inspect the current src structure.
4. Inspect existing components and styles.
5. Determine whether anything has already been implemented.
6. Reuse existing architecture where reasonable.
7. Do NOT blindly overwrite an existing project.
8. Do NOT rewrite the whole application unless necessary.

If the repository is empty, initialize the project according to this specification.

After inspection, create a concise implementation plan and then implement incrementally.

==================================================
3. TECH STACK
==================================================

Use:

- Vite
- React
- TypeScript
- Zustand
- Vanilla CSS
- lucide-react

Use IndexedDB/localStorage for persistence as appropriate.

PWA requirements:
- installable
- standalone display
- service worker
- web manifest
- mobile safe-area support
- responsive layout
- app-like behavior
- cached application shell
- persistent session

Keep dependencies minimal.

Do not introduce unnecessary frameworks.

==================================================
4. VISUAL DIRECTION
==================================================

The UI should feel like:

Instagram familiarity
+
Pinterest visual cleanliness
+
modern mobile-native design

Do NOT copy Instagram exactly.

Do NOT copy proprietary layouts, logos, or branding.

### Visual principles

- photo-first
- clean
- minimal
- neutral
- spacious
- understated
- polished
- mobile-native

Use:
- white / near-white surfaces
- dark typography
- subtle borders
- restrained shadows
- clean typography
- rounded corners only where appropriate
- smooth but subtle micro-interactions

IMPORTANT:

Do NOT use heavy glassmorphism.

Do NOT use:
- neon gradients
- glowing UI
- excessive blur
- futuristic AI visuals
- robot icons
- “AI-powered” badges
- excessive cards
- dashboard aesthetics
- giant metrics

The interface should look like a normal social app.

==================================================
5. BRAND
==================================================

Name:

SOSMET

The name is a casual shortening of “Social Media”.

The brand should feel:
- familiar
- social
- visual
- youthful
- slightly playful
- understated

Do not make “AI” part of the visible branding.

The user should naturally be able to think:

“Upload di Sosmet.”

“Cek Sosmet.”

“Dia nge-like post gue di Sosmet.”

==================================================
6. CORE USER EXPERIENCE
==================================================

The user should be able to:

- create a profile
- upload photos
- write captions
- browse a feed
- like posts
- comment
- follow users
- view profiles
- see followers/following
- receive notifications
- discover new accounts

Synthetic accounts should independently:

- browse
- like
- comment
- follow
- post
- interact with each other
- become inactive
- develop recurring relationships

The social world should not exist solely to serve the user.

It should feel like the user has entered an already-existing network.

==================================================
7. MVP NAVIGATION
==================================================

Bottom navigation:

HOME
DISCOVER
CREATE
ACTIVITY
PROFILE

Use lucide-react icons.

Keep navigation visually simple.

Create can be slightly emphasized but should still feel native.

==================================================
8. HOME FEED
==================================================

Build a photo-first feed.

Each post should contain:

- avatar
- username
- image
- caption
- timestamp
- like count
- comment count
- like button
- comment button
- save/share affordance if appropriate

The feed must NOT simply be chronological.

Ranking should consider:

- recency
- relationship
- prior interaction
- relevance
- engagement
- creator affinity
- discovery probability

However, do not over-optimize the feed.

A slightly imperfect feed is desirable.

==================================================
9. CREATE POST
==================================================

Flow:

Select photo
→ preview/crop
→ caption
→ publish

After publishing:

- post immediately appears on user's profile
- post enters the simulation engine
- synthetic accounts can discover it
- engagement develops gradually

Do NOT instantly generate 10 likes.

Do NOT make every post successful.

==================================================
10. PHOTO UNDERSTANDING
==================================================

When a user uploads a photo, the system may analyze it once.

The architecture should support:

Photo
↓
Vision analysis
↓
Compact visual metadata
↓
Store metadata with Post
↓
Simulation uses metadata

Example metadata:

{
  "content_type": "mirror_selfie",
  "scene": "bedroom",
  "subjects": ["person"],
  "mood": "casual",
  "visual_style": "low_light",
  "objects": ["mirror", "bed"],
  "outfit": ["black shirt"],
  "possible_topics": ["selfie", "outfit", "night"]
}

The original image should NOT be sent to an LLM every time an account interacts with the post.

Analyze once and reuse the metadata.

==================================================
11. AI PROVIDER ARCHITECTURE
==================================================

Do NOT hard-code the application around a single AI provider.

Create an abstraction such as:

AIProvider

Possible providers:

- Gemini
- Groq
- local/fallback

The application must work without an API key.

If no AI API key is configured:

- image analysis uses a lightweight fallback
- comments use deterministic/template-based generation
- simulation continues normally

AI should be an enhancement, not a dependency for the core social system.

==================================================
12. SYNTHETIC USERS
==================================================

Create an initial population of approximately 30–50 synthetic accounts for MVP.

Prioritize believable identities over quantity.

Each account should have:

- id
- username
- display name
- avatar
- bio
- interests
- niche
- personality
- activity level
- posting frequency
- engagement tendency
- follower count
- following count
- social relationships

Example archetypes:

Lurker:
- high viewing
- low likes
- almost no comments

Active User:
- frequent likes
- occasional comments
- moderate following

Creator:
- frequent posting
- stronger audience
- niche identity

Niche User:
- highly specific interests

Social User:
- many relationships
- frequent comments

Casual User:
- inconsistent activity

Do NOT make accounts feel like:

user001
user002
ai_user_04

Use coherent usernames, bios, profile photos, and interests.

Synthetic users should have internally consistent identities.

==================================================
13. SOCIAL GRAPH
==================================================

Create an actual social graph.

Relationships:

- follows
- mutual follows
- frequent interaction
- occasional interaction
- no relationship

Past behavior must influence future probabilities.

Example:

AI repeatedly interacts with the user's posts
→ relationship strength increases
→ future interaction probability increases.

The system should remember social history.

==================================================
14. SIMULATION ENGINE
==================================================

Create:

src/services/simulationEngine.ts

The simulation engine decides:

- who sees posts
- who likes
- who comments
- who visits profiles
- who follows
- who posts
- when events happen

IMPORTANT:

The simulation engine decides WHAT happens.

Generative AI decides HOW something is expressed.

For example:

Simulation engine:

“@naya has a 12% probability of commenting.”

If the event happens:

AI comment generator:

Generate a natural comment appropriate to @naya.

Do NOT use an LLM for every event.

==================================================
15. ENGAGEMENT MODEL
==================================================

Never implement:

likes = random(1, 100)

Use probabilistic behavior.

Factors can include:

- activity level
- content relevance
- relationship strength
- previous interactions
- post age
- popularity
- personality
- randomness

Conceptually:

P(like)
=
activity
× relevance
× relationship
× popularity
× time decay
× personality
× randomness

Comments should be much rarer than likes.

Follows should be rarer still.

==================================================
16. BELIEVABLE IMPERFECTION
==================================================

This is a core product requirement.

Not every post should get engagement.

Some posts should have:

- 0 likes
- 1 like
- no comments
- delayed engagement

Some posts can unexpectedly spike.

Synthetic accounts should sometimes:

- like an old post
- follow without commenting
- comment without following
- repeatedly like but never comment
- disappear for days
- post at unusual times
- interact hours after publication

Avoid predictable patterns.

Perfect engagement is fake-looking.

==================================================
17. FOLLOWER GROWTH
==================================================

Follower growth must emerge from behavior.

Example:

Post
↓
distribution
↓
views
↓
profile visit
↓
possible follow
↓
new relationship

Do not simply increment followers on a timer.

Growth can be:

- zero
- +1
- small burst
- occasional spike

==================================================
18. PROFILE VISITS
==================================================

Profile visits are a real simulation event.

Potential chain:

Synthetic user sees post
→ becomes curious
→ visits profile
→ may view older posts
→ may follow

This creates a believable path from content to follower growth.

==================================================
19. AI COMMENTS
==================================================

Create:

src/services/aiCommentGenerator.ts

The generator should receive:

- post visual metadata
- caption
- commenter personality
- relationship to creator
- previous interactions
- commenter style

Comments should be:

- short
- natural
- contextually relevant
- varied
- imperfect

Examples:

“finally 😭”

“where is this”

“the shirt actually goes hard”

“you look tired lmao”

Avoid making every comment an elaborate description of the image.

Do not make every comment insightful.

Sometimes a person simply reacts.

Sometimes they say nothing.

==================================================
20. TIME-BASED ACTIVITY
==================================================

Synthetic activity should vary by:

- morning
- daytime
- evening
- late night
- weekday
- weekend

Do not make every synthetic account equally active.

The world should continue moving even when the user is not interacting.

==================================================
21. POST LIFECYCLE
==================================================

Posts follow:

Published
↓
Initial distribution
↓
Early engagement
↓
Secondary distribution
↓
Peak
↓
Decay
↓
Low activity

Occasionally a post may resurface.

==================================================
22. NOTIFICATIONS
==================================================

Activity screen should show:

- likes
- comments
- follows
- older-post likes
- mentions where applicable

Notifications should not all arrive instantly.

Example:

8:00 post
8:01 like
8:06 profile visit
8:14 comment
8:31 like
9:02 follower

Use simulation timing to create natural pacing.

==================================================
23. DISCOVER
==================================================

Discover should be visually driven.

Include:

- photo grid
- recommended accounts
- popular posts
- topic clusters

Do not turn this into a dashboard.

==================================================
24. PROFILE
==================================================

User profile:

- avatar
- username
- bio
- follower count
- following count
- post count
- photo grid
- edit profile

Other profiles:

- same visual language
- follow/unfollow
- posts
- follower stats
- coherent identity

==================================================
25. ONBOARDING
==================================================

Keep onboarding short.

Suggested:

Step 1:
username + display name

Step 2:
avatar

Step 3:
select a few interests

Then immediately enter the feed.

Do not create a long questionnaire.

==================================================
26. PERSISTENCE
==================================================

Persist:

- user profile
- posts
- comments
- likes
- follows
- notifications
- synthetic accounts
- social graph
- interaction history
- simulation state

Use Zustand for app state.

Use localStorage for lightweight state.

Use IndexedDB when image/storage requirements justify it.

The app should survive reloads and PWA restarts.

==================================================
27. PWA
==================================================

Implement:

- manifest.webmanifest
- service worker
- standalone mode
- icons
- theme metadata
- viewport configuration
- safe-area handling
- cached app shell
- install-friendly experience

The mobile experience should feel app-like.

Desktop can use a centered responsive layout rather than pretending to be a desktop-first social platform.

==================================================
28. DEBUG MODE
==================================================

Create a discreet developer-only simulation drawer.

File:

src/components/debug/SimulationDebugDrawer.tsx

Show:

- synthetic user count
- posts
- interactions
- active accounts
- follower growth
- event log
- simulation speed
- current simulation time

Controls:

- pause
- resume
- accelerate
- reset
- trigger event
- seed content

Do not expose this in the normal user experience.

==================================================
29. DATA TYPES
==================================================

Create:

src/types/sosmet.ts

At minimum:

User
SyntheticUser
Post
Comment
Like
Follow
Notification
InteractionEvent
ProfileVisit
VisualMetadata
SocialRelationship
SimulationConfig
Niche

Keep the model extensible.

==================================================
30. SEED DATA
==================================================

Create believable seed data.

Use approximately:

30–50 synthetic accounts

and enough initial posts to make the feed feel populated.

Content niches can include:

- streetwear
- coffee / food
- architecture
- tech
- travel
- minimalist lifestyle
- fitness
- art
- photography
- gaming

Do not make every account perfectly curated.

Some accounts should have ordinary posts.

Some should be inactive.

Some should have very little engagement.

==================================================
31. IMAGES
==================================================

Seed content can use high-quality royalty-safe/appropriate placeholder photography.

Do not rely on fragile external image URLs if avoidable.

The architecture should allow local/static assets later.

User-uploaded images must work reliably in the PWA.

==================================================
32. COMPONENT STRUCTURE
==================================================

Suggested structure:

src/
  components/
    layout/
      MobileShell.tsx
      Navbar.tsx

    onboarding/
      OnboardingModal.tsx

    feed/
      FeedView.tsx
      PostCard.tsx

    create/
      CreatePostModal.tsx

    profile/
      ProfileView.tsx

    discover/
      DiscoverView.tsx

    notifications/
      NotificationView.tsx

    debug/
      SimulationDebugDrawer.tsx

  services/
    simulationEngine.ts
    imageAnalyzer.ts
    aiCommentGenerator.ts
    aiProvider.ts

  store/
    sosmetStore.ts

  data/
    seedAccounts.ts
    seedPosts.ts

  types/
    sosmet.ts

Keep components small and reusable.

==================================================
33. UX DETAILS
==================================================

Implement subtle interactions:

- double tap to like
- heart animation
- button feedback
- smooth modal transitions
- image loading states
- optimistic UI for likes/follows/comments
- pull-to-refresh-like behavior where appropriate
- safe-area spacing

Do not over-animate.

Motion should reinforce interaction rather than decorate the app.

==================================================
34. IMPORTANT: NO STORIES IN MVP
==================================================

Do not implement Stories/highlights yet.

Do not expand scope unnecessarily.

Focus on:

Feed
Posts
Social graph
Engagement
Profiles
Discover
Activity
Simulation

==================================================
35. COST-EFFICIENT AI
==================================================

Design the AI layer so that the majority of events require ZERO LLM calls.

Target hierarchy:

NO AI:
- views
- likes
- follows
- profile visits
- feed ranking
- follower growth
- timing
- notification events

LIGHT AI:
- comments
- captions
- occasional personality-driven content

VISION:
- one-time analysis of newly uploaded photos

Cache AI outputs.

Never regenerate the same comment repeatedly.

==================================================
36. FALLBACK MODE
==================================================

If no AI API key exists:

The entire application must still work.

Fallback comment generation should use:

- post type
- metadata
- personality
- predefined language patterns
- randomness

The user should still experience a functioning social simulation.

==================================================
37. SECURITY
==================================================

Never hard-code API keys in source code.

Use environment variables.

If a browser-side API key would expose credentials, structure the code so a server-side proxy/API route can be introduced later.

Document environment variables in README.

==================================================
38. RESPONSIVENESS
==================================================

Mobile is the primary target.

Optimize for approximately:

360px–430px widths.

Desktop should remain usable but should not dominate the design.

Use safe-area insets for modern mobile devices.

==================================================
39. ACCESSIBILITY
==================================================

Use:

- semantic buttons
- alt text
- keyboard accessibility
- sufficient contrast
- visible focus states
- accessible labels for icons

Do not sacrifice accessibility for visual minimalism.

==================================================
40. PERFORMANCE
==================================================

Prioritize:

- fast first render
- lazy-loaded images
- efficient state updates
- minimal unnecessary rerenders
- lightweight simulation ticks
- no unnecessary AI requests

Do not run expensive simulation work continuously in a tight loop.

Use scheduled/batched events.

==================================================
41. IMPLEMENTATION ORDER
==================================================

Implement in this order:

PHASE 1
Repository inspection and setup

PHASE 2
PWA shell + design system

PHASE 3
User profile + onboarding

PHASE 4
Seed synthetic world

PHASE 5
Feed + posts

PHASE 6
Follow + like + comments

PHASE 7
Simulation engine

PHASE 8
Notifications

PHASE 9
Discover

PHASE 10
Photo metadata analysis

PHASE 11
AI comment provider abstraction

PHASE 12
Persistence

PHASE 13
Debug simulation drawer

PHASE 14
Polish + responsive QA

==================================================
42. VERIFICATION
==================================================

Run:

npm run build

and:

npx tsc --noEmit

Verify:

- app builds with zero TypeScript errors
- dev server starts
- PWA manifest works
- service worker registers
- app can be installed
- onboarding works
- photo upload works
- posts persist
- likes persist
- follows persist
- comments persist
- simulation continues after reload
- synthetic accounts behave differently
- notifications are generated
- follower counts change through actual simulation
- AI layer works when configured
- fallback mode works without API keys

==================================================
43. FINAL QUALITY BAR
==================================================

Do not stop at “it technically works.”

The result should feel like a polished prototype of a real social app.

When opening Sosmet, the user should immediately understand:

- this is a social app
- this is where I post photos
- there are people here
- people are interacting
- the feed is alive

The user should NOT immediately think:

- this is an AI demo
- these are bots
- these numbers are random
- this is a developer dashboard

The central illusion is:

> There is a small social world happening here.

Build toward that feeling.

==================================================
44. FIRST ACTION
==================================================

Do NOT immediately generate all files.

First inspect the repository and report:

1. Current project state
2. Existing files
3. Existing dependencies
4. What can be reused
5. What needs to be created
6. Any conflicts with this specification

Then present the implementation sequence briefly.

After that, begin implementation.
""" 
from pathlib import Path
path = Path("/mnt/data/Sosmet_Coding_Agent_Prompt.md")
path.write_text(prd, encoding="utf-8")
print(f"Created: {path}")