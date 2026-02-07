# Impostor Party Game — Deep Research

Comprehensive research on the "Impostor" / "Who is the Spy" social deduction genre. This covers existing apps, game mechanics, word lists, settings, UI/UX patterns, and what makes a great version.

---

## Table of Contents

1. [Genre Overview & Lineage](#1-genre-overview--lineage)
2. [Existing Apps & Implementations](#2-existing-apps--implementations)
3. [Core Game Mechanics](#3-core-game-mechanics)
4. [Game Variants & Related Games](#4-game-variants--related-games)
5. [Word Lists & Categories](#5-word-lists--categories)
6. [Game Settings & Options](#6-game-settings--options)
7. [UI/UX Patterns for Pass-and-Play](#7-uiux-patterns-for-pass-and-play)
8. [Timer & Discussion Mechanics](#8-timer--discussion-mechanics)
9. [What Makes a Great Version vs a Bad One](#9-what-makes-a-great-version-vs-a-bad-one)
10. [Key Takeaways for Building Our Own](#10-key-takeaways-for-building-our-own)

---

## 1. Genre Overview & Lineage

The "Impostor" party game belongs to the **social deduction** genre — games where players have hidden roles and must use discussion, deduction, and bluffing to achieve their goals. The specific sub-genre we're interested in is:

> **Everyone gets a secret word/location except one person (the impostor), then players discuss and try to find the impostor while the impostor tries to blend in.**

### Key Games in This Lineage

| Game | Year | Designer | Core Twist |
|------|------|----------|------------|
| **Spyfall** | 2014 | Alexander Ushan | Everyone gets a *location* + role; spy gets nothing. Structured Q&A. |
| **A Fake Artist Goes to New York** | 2012 | Jun Sasaki (Oink Games) | Everyone draws the same secret word; fake artist draws blind. |
| **Insider** | 2016 | Akihiro Itoh (Oink Games) | 20-questions format; insider secretly knows answer and steers discussion. |
| **The Chameleon** | 2017 | Rikki Tahta (Big Potato Games) | Grid of words on a topic card; everyone knows the secret word except the chameleon. One-word clues. |
| **Who is the Spy / Undercover** | ~2015+ | Chinese party game origin | Two *similar* words — civilians get one, undercover gets the other, Mr. White gets nothing. |
| **Impostor** (various apps) | 2020+ | Multiple developers | Digital versions of the above, primarily pass-and-play on one phone. |

The Chinese game "Who is the Spy" (shei shi wodie / "Undercover") is the most direct ancestor of the modern app versions. It introduced the **word-pair mechanic** (civilians get "orange", undercover gets "lemon") that most current apps use.

---

## 2. Existing Apps & Implementations

### Major Apps

#### Impostor Game - Party Edition (by Sven Vucak)
- **Platforms:** iOS, Android
- **Rating:** 4.9/5 (39,934 reviews)
- **Players:** 3-24
- **Price:** Free with IAP ($2.99-$9.99)
- **Key Features:**
  - Original Mode (classic impostor)
  - Find the Liar mode (different questions)
  - Random Mode (mystery number of impostors)
  - Family Mode (240 kid-friendly words across 4 categories)
  - 10+ categories, 1,500+ words
  - Custom word creation with bulk import
  - Optional impostor hint word
  - 35 languages
  - No data collection
  - Offline/single-device
- **Why it's top-rated:** Ad-free experience, family-friendly options, multiple game modes, responsive developer

#### Imposter Party (by Jesus Calleja)
- **Platforms:** iOS, Android
- **Rating:** 4.6/5 (444 ratings)
- **Size:** 109.3 MB
- **Key Features:**
  - Online multiplayer (private rooms + public matchmaking)
  - Single Device (pass-and-play)
  - Leader Mode vs Leaderless Mode
  - Questions Mode (one player gets different question)
  - Images Mode (pictures instead of words)
  - In-app chat for online play
  - 10 language support
- **Issues:** Crash reports, impostor gameplay balance complaints

#### Undercover: Word Party Game (by Yanstar Studio)
- **Platforms:** iOS, Android
- **Rating:** 4.77/5 (38,000 ratings)
- **Key Features:**
  - The "OG" digital version of the Chinese game
  - Three roles: Civilian, Undercover, Mr. White
  - Offline (pass-and-play) + Online (private/public rooms)
  - Hand-picked word database
  - Real-time ranking after each round
  - 3-20 players
- **Why it's popular:** Polished, long track record, strong word pair quality

#### SpyFall (by Maxcriser)
- **Platforms:** iOS, Android, Web (spyfall.co, spyfall.adrianocola.com)
- **Key Features:**
  - Location-based (not word-based) — everyone sees a location except the spy
  - 140+ locations
  - Quick 5-10 minute rounds
  - Ranking system
  - Offline, no registration needed
- **Issues:** Limited customization in newer versions, some free locations feel bland

#### Spy - Party and Friends Game
- **Platforms:** iOS
- **Players:** 3-20
- **500,000+ downloads claimed**
- **Key Features:**
  - Pass-and-play on single device
  - Q&A discussion format ("Hot or cold?" "Crowded or quiet?")
  - Glassmorphism UI design

#### Web-Based Generators
- **impostergame.net** — Free online, supports local + online multiplayer, 500+ word pairs, custom word packs via .txt import
- **playimposter.com** — Room & Play mode + Pass & Play mode, 20+ categories, 500+ word pairs, multiple impostor support
- **impostorgame.online** — Simple pass-and-reveal, players enter their own words
- **spyfall.adrianocola.com** — Classic Spyfall web version with all locations
- **spyfall.tannerkrewson.com** — Popular open-source Spyfall implementation

### App Store Landscape Summary

The market is **extremely fragmented** — there are 20+ apps with nearly identical names ("Imposter", "Impostor", "Who is the Spy"). Most are small indie projects. The top ones differentiate through:
- Polish and stability
- Word list quality and quantity
- Multiple game modes
- Family/kid-friendly options
- Custom word support

---

## 3. Core Game Mechanics

### The Standard Flow (Word-Based Version)

```
SETUP
  1. Enter player names (3-24 players)
  2. Select word category (or random)
  3. Choose number of impostors (usually 1, optionally 2+)

ROLE ASSIGNMENT (Pass-and-Play)
  4. Phone is passed to each player
  5. Player taps/holds to privately view their word
  6. Civilians see: the secret word (e.g., "Pizza")
  7. Impostor sees: "IMPOSTOR" (or a related hint word, e.g., "Burger")
  8. Mr. White sees: nothing / "Mr. White" / a special symbol

CLUE ROUND(S) (1-3 rounds)
  9. Going around the circle, each player says ONE word (or short phrase)
     describing what they received
  10. Goal for civilians: prove you know the word without being too obvious
  11. Goal for impostor: blend in using context clues from others

DISCUSSION PHASE
  12. Open discussion — who seemed suspicious?
  13. Players debate, accuse, defend

VOTING PHASE
  14. Everyone simultaneously votes (point, show fingers, or in-app)
  15. Player with most votes is eliminated

RESOLUTION
  16. If impostor is caught → Civilians win (but impostor can still win
      by correctly guessing the secret word)
  17. If a civilian is voted out → Continue playing (or impostor wins
      depending on variant)
  18. If Mr. White is voted out → Mr. White gets one chance to guess
      the word; if correct, Mr. White wins
```

### Three Main Information Models

| Model | Who Knows What | Examples |
|-------|----------------|----------|
| **Word-based (blank impostor)** | Civilians: same word. Impostor: nothing or "IMPOSTOR" | The Chameleon, basic Impostor apps |
| **Word-pair (similar words)** | Civilians: word A. Undercover: word B (related). Mr. White: nothing | Undercover, Who is the Spy |
| **Location-based** | Everyone: same location + unique role. Spy: nothing | Spyfall |

### Clue-Giving Variants

| Variant | Description | Tension Level |
|---------|-------------|---------------|
| **One-word clue** | Each player says exactly one word | Highest — minimal information, maximum deduction |
| **One-sentence clue** | Each player says one sentence | Medium — more room for creativity |
| **Free discussion** | No structured clue-giving, just open talk | Lowest structure, most social |
| **Q&A (Spyfall style)** | Players ask each other questions in turn | Structured interrogation feel |
| **Drawing (Fake Artist)** | Each player adds one line to a drawing | Visual, physical |

---

## 4. Game Variants & Related Games

### Spyfall Mechanics (Location-Based)
- 30 possible locations visible to all players (printed on reference cards)
- Each non-spy player gets the location AND a unique role at that location
- The spy does NOT know the location
- Players take turns asking each other questions
- Questions should be specific enough to prove you know the location, but vague enough not to reveal it to the spy
- The spy can stop the game at any time to guess the location
- Voting to indict requires **unanimous** agreement
- Timer: 8 minutes standard (adjustable; 8 min often considered too long)

### A Fake Artist Goes to New York (Drawing-Based)
- Question Master picks a category and word, writes it on dry-erase boards
- One board gets an "X" instead — this player is the Fake Artist
- Each artist draws ONE line per round (two rounds total)
- After drawing, all players point to who they think is the fake artist
- If caught, the fake artist can still win by correctly guessing the word
- Tension: real artists must show they know the word without making it too obvious

### Insider (20-Questions + Traitor)
- Game Master knows the word; Insider secretly knows it too
- Other players (Commons) ask yes/no questions to deduce the word
- 5-minute timer for the question phase
- If the word is guessed, players must then identify the Insider
- The Insider's goal: subtly steer the group toward the answer without being obvious

### The Chameleon (Grid-Based)
- Topic Card with a 4x4 grid of words is visible to all
- Two dice are rolled; the coordinates point to the secret word on the grid
- The Chameleon doesn't have coordinates — only sees the grid
- Everyone says one word related to the secret word
- Chameleon must deduce from others' clues which grid word is the target
- Voting and resolution similar to Impostor

### Find the Liar (Question-Based)
- Newer mode in some Impostor apps
- All players are asked the same question EXCEPT one who gets a different question
- Everyone answers their question
- Group debates and votes on who had the different question
- Example: "What's your favorite breakfast food?" vs "What's your favorite dinner food?"

---

## 5. Word Lists & Categories

### Standard Categories (Across Multiple Apps)

| Category | Example Words | Difficulty |
|----------|--------------|------------|
| **Food & Drinks** | Pizza, Hamburger, Ice cream, Coffee, Sushi, Tacos, Chocolate, Pancakes | Easy |
| **Animals** | Dog, Cat, Elephant, Lion, Penguin, Dolphin, Monkey, Giraffe, Shark | Easy |
| **Everyday Objects** | Phone, Chair, Toothbrush, Umbrella, Sunglasses, Pillow, Keys, Clock | Easy |
| **Places** | Beach, Airport, Library, Hospital, Gym, Museum, Casino, Aquarium | Medium |
| **Activities & Hobbies** | Camping, Yoga, Fishing, Karaoke, Bowling, Gardening, Photography | Medium |
| **Jobs & Professions** | Doctor, Firefighter, Chef, Pilot, Teacher, Astronaut, Detective | Medium |
| **Sports** | Soccer, Basketball, Tennis, Swimming, Marathon, Olympics | Medium |
| **Movies & TV** | Star Wars, Harry Potter, Titanic, Friends, The Office, Frozen | Medium |
| **Countries & Cities** | Paris, New York, Tokyo, London, Italy, Australia, Brazil, Egypt | Medium |
| **Music & Instruments** | Guitar, Piano, Drums, Violin, Saxophone, Trumpet, Microphone | Medium |
| **Technology** | Smartphone, Selfie, Emoji, Password, WiFi, Streaming, Screenshot | Medium |
| **Abstract Concepts** | Karma, Nostalgia, Sarcasm, Déjà vu, FOMO, Intuition, Procrastination | Hard |
| **Pop Culture** | Cliffhanger, Plot twist, Jump scare, Spoiler alert, Red carpet, Encore | Hard |

### Themed / Seasonal Packs
- **Holiday:** Mistletoe, Fireworks, Jack-o'-lantern, Easter egg, Birthday cake, Champagne, Countdown
- **Summer Vibes:** Sunscreen, Flip-flops, Beach towel, Popsicle, Campfire, Lemonade stand
- **School & Work:** Homework, Deadline, Group project, Pop quiz, Staff meeting, Report card, Snow day
- **Fashion:** Jeans, Sneakers, Sunglasses, Handbag, Fashion show, Fitting room, Dress code
- **Transportation:** Airplane, Subway, Taxi, Bicycle, Cruise ship, Hot air balloon, Traffic jam

### Word Pairs for Undercover/Similar-Word Mode

The key innovation of the "Undercover" variant is giving the impostor a **related but different** word. Good pairs are:

**Animals:**
- Dog / Wolf
- Cat / Tiger
- Chicken / Duck
- Horse / Zebra
- Dolphin / Shark
- Bear / Lion

**Food:**
- Coffee / Tea
- Pizza / Burger
- Apple / Orange
- Cake / Pie
- Pasta / Rice
- Beer / Wine

**Objects:**
- Phone / Tablet
- Car / Motorcycle
- Book / Magazine
- Chair / Couch
- Lamp / Candle
- Pen / Pencil

**Professions:**
- Doctor / Nurse
- Teacher / Professor
- Chef / Baker
- Lawyer / Judge
- Actor / Director
- Engineer / Architect

**Sports:**
- Basketball / Football
- Swimming / Diving
- Running / Sprinting
- Yoga / Pilates
- Chess / Checkers
- Tennis / Badminton

**Places:**
- Beach / Pool
- Mountain / Hill
- Hotel / Motel
- Airport / Train Station
- Restaurant / Cafe
- Park / Garden

**Abstract / Hard:**
- Love / Friendship
- Success / Happiness
- App / Website
- Instagram / TikTok
- Walking / Running
- Cooking / Baking

### What Makes a Good Word Pair

1. **Similar enough to confuse** — both words live in the same semantic universe
2. **Different enough to detect** — players' descriptions should subtly diverge
3. **Both are common knowledge** — avoid obscure terms
4. **Allow creative descriptions** — words that can be described from multiple angles
5. **Same "vibe"** — temperature, energy, context should overlap

Bad pair example: "Pizza / Quantum Physics" (too different, impostor is immediately obvious)
Bad pair example: "Pizza / Pizza Margherita" (too similar, no meaningful divergence)
Good pair example: "Pizza / Burger" (same domain, different enough, many overlapping descriptors)

### Spyfall Locations (Complete List — Spyfall 1)

Each location has 7 associated roles:

| Location | Roles |
|----------|-------|
| Airplane | First Class Passenger, Air Marshall, Mechanic, Air Hostess, Co-Pilot, Captain, Economy Class Passenger |
| Bank | Armored Car Driver, Manager, Consultant, Robber, Security Guard, Teller, Customer |
| Beach | Beach Waitress, Kite Surfer, Lifeguard, Thief, Beach Photographer, Ice Cream Truck Driver, Beach Goer |
| Casino | Bartender, Head Security Guard, Bouncer, Manager, Hustler, Dealer, Gambler |
| Cathedral | Priest, Beggar, Sinner, Tourist, Sponsor, Chorister, Parishioner |
| Circus Tent | Acrobat, Animal Trainer, Magician, Fire Eater, Clown, Juggler, Visitor |
| Corporate Party | Entertainer, Manager, Unwanted Guest, Owner, Secretary, Delivery Boy, Accountant |
| Crusader Army | Monk, Imprisoned Saracen, Servant, Bishop, Squire, Archer, Knight |
| Day Spa | Stylist, Masseuse, Manicurist, Makeup Artist, Dermatologist, Beautician, Customer |
| Embassy | Security Guard, Secretary, Ambassador, Tourist, Refugee, Diplomat, Government Official |
| Hospital | Nurse, Doctor, Anesthesiologist, Intern, Therapist, Surgeon, Patient |
| Hotel | Doorman, Security Guard, Manager, Housekeeper, Bartender, Bellman, Customer |
| Military Base | Deserter, Colonel, Medic, Sniper, Officer, Tank Engineer, Soldier |
| Movie Studio | Stunt Man, Sound Engineer, Camera Man, Director, Costume Artist, Producer, Actor |
| Ocean Liner | Cook, Captain, Bartender, Musician, Waiter, Mechanic, Rich Passenger |
| Passenger Train | Mechanic, Border Patrol, Train Attendant, Restaurant Chef, Train Driver, Stoker, Passenger |
| Pirate Ship | Cook, Slave, Cannoneer, Tied Up Prisoner, Cabin Boy, Brave Captain, Sailor |
| Polar Station | Medic, Expedition Leader, Biologist, Radioman, Hydrologist, Meteorologist, Geologist |
| Police Station | Detective, Lawyer, Journalist, Criminalist, Archivist, Criminal, Patrol Officer |
| Restaurant | Musician, Bouncer, Hostess, Head Chef, Food Critic, Waiter, Customer |
| School | Gym Teacher, Principal, Security Guard, Janitor, Cafeteria Lady, Maintenance Man, Student |
| Service Station | Manager, Tire Specialist, Biker, Car Owner, Car Wash Operator, Electrician, Auto Mechanic |
| Space Station | Engineer, Alien, Pilot, Commander, Scientist, Doctor, Space Tourist |
| Submarine | Cook, Commander, Sonar Technician, Electronics Technician, Radioman, Navigator, Sailor |
| Supermarket | Cashier, Butcher, Janitor, Security Guard, Food Sample Demonstrator, Shelf Stocker, Customer |
| Theater | Coat Check Lady, Prompter, Cashier, Director, Actor, Crew Man, Audience Member |
| University | Graduate Student, Professor, Dean, Psychologist, Maintenance Man, Janitor, Student |

Spyfall 2 added 20+ more locations: Amusement Park, Art Museum, Aquarium, Candy Factory, Cemetery, Coal Mine, Construction Site, Farm, Fire Station, Harbor, Haunted House, Jazz Club, Library, Mansion, Nuclear Power Plant, Race Track, Recording Studio, Retirement Home, Rock Concert, Zoo, and many others.

### Typical Word Counts

- **Minimum viable game:** ~50-100 words across 5+ categories
- **Good app:** 500+ words across 10+ categories
- **Top app:** 1,500+ words across 10-15 categories + themed packs
- **Per category:** 15-100 words is typical
- **Word pairs (Undercover mode):** at least 50-100 pairs minimum

---

## 6. Game Settings & Options

### Settings Found Across Top Apps

| Setting | Common Options | Notes |
|---------|---------------|-------|
| **Number of players** | 3-24 (some up to 99) | Minimum 3 for the game to work |
| **Number of impostors** | 1, 2, or random | 1 is standard; 2+ for 8+ players |
| **Impostor randomization** | Balanced, Chaos, Custom | Chaos = could be 0 or everyone |
| **Timer duration** | Off, 1-15 minutes | Some per-phase, some overall |
| **Number of rounds** | 1-10+ (or unlimited) | Often player-decided, not app-enforced |
| **Category selection** | Pick specific categories or "all" | Some apps let you multi-select |
| **Difficulty** | Easy, Medium, Hard | Controls word complexity |
| **Show category during game** | On/Off | Revealing category helps impostor |
| **Impostor hint word** | On/Off | Gives impostor a related word instead of blank |
| **Prevent impostor from speaking first** | On/Off | Prevents impostor from just copying the first person |
| **Number of clue rounds** | 1-3 | How many times around the circle |
| **Clue format** | One word / One sentence / Free | Restriction level |
| **Mr. White role** | On/Off | Third role with no word at all |
| **Custom words** | Create/import categories | Power users want this |
| **Language** | Multi-language | Top apps support 10-35 languages |

### Family / Kid Mode Settings

The best apps offer a **separate Family Mode** with:
- Curated simple words (240 words across Animals, Food, Playtime, World)
- Colorful visual aids
- Age-appropriate content only
- Simpler rules explanation

### Scoring Systems

| System | Description |
|--------|-------------|
| **Simple** | Civilians win or impostor wins (no points) |
| **Point-based** | Civilians: 2 pts for catching impostor. Impostor: 1 pt for surviving, bonus for guessing word |
| **Undercover scoring** | Civilians: 2 pts, Mr. White: 6 pts for surviving, Undercover: 10 pts for surviving |
| **Rounds-based** | Play N rounds, highest score wins |

---

## 7. UI/UX Patterns for Pass-and-Play

### The Core Challenge

In pass-and-play, the fundamental UX problem is: **how does each player see their secret word without anyone else seeing it?**

### Common Reveal Patterns

#### Pattern 1: Tap to Reveal
```
Screen shows: "Pass to Player 3"
              "Tap to see your word"

Player taps → word appears briefly
Player taps again or timer auto-hides → "Pass to Player 4"
```
**Pros:** Simple, fast
**Cons:** Accidental taps, someone might peek over shoulder

#### Pattern 2: Hold to Reveal
```
Screen shows: "Player 3's turn"
              "Hold the button to see your word"

Player holds finger down → word visible ONLY while holding
Release → word disappears immediately
```
**Pros:** Very private, word is only visible during intentional hold. Natural "peeking" gesture.
**Cons:** Requires explanation for first-time players

#### Pattern 3: Cover Screen + Peek
```
Screen shows word behind a "scratch card" or blur effect
Player swipes/scratches to reveal
Auto-re-covers after a few seconds
```
**Pros:** Playful, tactile
**Cons:** More complex to implement, might feel slow

#### Pattern 4: Phone-Down Flip
```
Screen says "Place phone face-down, then pass to Player 3"
Player picks up phone → motion sensor triggers reveal
After 3 seconds → screen auto-blanks
```
**Pros:** Theatrical, fun
**Cons:** Relies on gyroscope, can be glitchy

### Best Practices from Top Apps

1. **Clear "pass the phone" interstitial** — large text saying whose turn it is, with no information visible
2. **Explicit confirmation** — player must actively tap/hold to see their word (prevents accidental reveals)
3. **Auto-hide timer** — word disappears after 3-5 seconds
4. **"I've seen my word" button** — player explicitly confirms before the next player screen appears
5. **Distinct impostor screen** — use a different color/animation so the impostor can process their role without accidentally showing a "normal" screen
6. **Lock orientation** — prevent accidental rotation from revealing content
7. **No back button during reveal** — prevent navigation accidents
8. **Sound/haptic feedback** — subtle vibration when role is revealed helps confirm without visual cues
9. **Screen brightness consideration** — some apps dim the screen between players

### The Full Pass-and-Play Flow (Best Implementation)

```
1. SETUP SCREEN
   - Add player names
   - Configure settings
   - "Start Game" button

2. READY SCREEN (per player)
   "Pass the phone to [Player Name]"
   "Tap when ready"
   [Large, clear player name]
   [No game info visible]

3. REVEAL SCREEN (per player)
   "Hold to see your word"
   [Player holds → word appears]
   [Release → word disappears]
   "Got it!" button
   OR
   Auto-advance after hold + release

4. REPEAT for each player

5. GAME ACTIVE SCREEN
   "All players have seen their words!"
   "Begin discussion"
   [Optional timer]
   [Player list for voting reference]

6. VOTING SCREEN (if in-app)
   Each player's name as a button
   Simultaneous reveal or sequential

7. RESULT SCREEN
   "The impostor was [Name]!"
   "The word was [Word]!"
   [Score update]
   "Play Again" / "New Game"
```

### What Makes It Feel Smooth vs Clunky

**Smooth:**
- Minimal taps to progress
- Large touch targets
- Clear visual hierarchy
- Fast transitions
- Immediate feedback on actions
- Works in any orientation

**Clunky:**
- Too many confirmation dialogs
- Small buttons
- Confusing flow (which player is next?)
- Slow animations between players
- Word visible too briefly or too long
- No way to re-peek if you missed it

---

## 8. Timer & Discussion Mechanics

### Timer Durations by Game Type

| Game Type | Typical Timer | Notes |
|-----------|--------------|-------|
| **Spyfall (location Q&A)** | 8 minutes total | Often considered too long; 5-6 is better |
| **Impostor (word, one-word clues)** | No timer for clues; optional discussion timer | Clue rounds are quick (30s each) |
| **Impostor (free discussion)** | 3-5 minutes | Short debates work best |
| **Insider (20 questions)** | 5 minutes for questions | Sand timer in physical version |
| **Fake Artist (drawing)** | No timer (2 rounds of drawing) | Pace is naturally quick |

### Discussion Mechanics

#### Structured Q&A (Spyfall Style)
- Player A asks Player B a question
- Player B answers, then asks Player C
- **Cannot ask back** the person who just asked you
- Questions should relate to the location
- Examples: "How did you get here?" "What are you wearing?" "Do you enjoy being here?"
- **Advantage:** Ensures everyone participates, creates natural suspicion arcs
- **Disadvantage:** Can feel mechanical, less spontaneous

#### Clue Rounds + Free Discussion (Impostor Style)
- Round 1: Everyone says one word/phrase
- (Optional Round 2-3: Another word/phrase each)
- Then open discussion
- **Advantage:** Fast setup, natural conversation flow
- **Disadvantage:** Quieter players can hide; dominant personalities take over

#### Voting Mechanics

| Method | Description | Best For |
|--------|-------------|----------|
| **Simultaneous point** | Count of 3, everyone points at once | In-person, dramatic |
| **Sequential in-app** | Each player selects a name secretly, all revealed at once | Digital, fair |
| **Majority vote** | Most votes = eliminated | Standard |
| **Unanimous (Spyfall)** | Must be unanimous to indict | Higher stakes, more discussion |
| **Discussion then majority** | Discuss, then final binding vote | Balanced |

### Optimal Round Structure

Based on research across all games:

```
SWEET SPOT FOR A SINGLE ROUND: 5-10 minutes total

  Clue Phase:     1-3 minutes (30-60 seconds per clue round)
  Discussion:     2-5 minutes
  Voting:         30 seconds
  Reveal/Scoring: 30 seconds

FULL GAME SESSION: 20-45 minutes (3-5 rounds)
```

### Timer Recommendations by Player Count

| Players | Clue Rounds | Discussion Time | Total Round |
|---------|-------------|----------------|-------------|
| 3-4 | 2 | 2 min | ~4 min |
| 5-6 | 2 | 3 min | ~5 min |
| 7-8 | 1-2 | 4 min | ~6 min |
| 9-12 | 1 | 5 min | ~7 min |
| 13+ | 1 | 5 min | ~8 min |

---

## 9. What Makes a Great Version vs a Bad One

### What People Love (from reviews across all major apps)

1. **"Brought my family together"** — the social aspect is the #1 draw
2. **Simple to learn** — anyone can play within 1 minute of explanation
3. **Works offline on one phone** — no setup friction
4. **Quick rounds** — perfect for waiting rooms, car rides, parties
5. **Replay value** — different every time due to social dynamics
6. **Scales well** — works with 3 people or 15
7. **The tension** — "watching people try to figure out who's the spy is always hilarious"
8. **Balance between skill and luck** — new players can win

### Common Complaints (from App Store reviews)

| Complaint | Frequency | Notes |
|-----------|-----------|-------|
| **Words repeat too quickly** | Very common | Apps need 500+ words minimum |
| **Impostor word is too different from civilian word** | Common | Bad word pairs make impostor obvious |
| **Crashing / freezing mid-game** | Common | Stability is table stakes |
| **Paywall for more categories** | Common | Users want more free content |
| **Subscription model for word packs** | Moderate | One-time purchase preferred over subscription |
| **Timer too short/long for group size** | Moderate | Timer should auto-adjust or be easy to change |
| **Can't play remotely / online** | Moderate | Pass-and-play only is limiting |
| **Impostor is nearly impossible to win as** | Moderate | Blank impostor is too hard; hint word helps |
| **Too many ads** | Moderate | Ad-free experience is a huge differentiator |
| **Words too hard for kids** | Moderate | Need family/easy mode |
| **Can't create custom words** | Moderate | Power users want this badly |
| **Memorize all words over time** | Low-moderate | Need large, rotating word database |
| **Language/translation quality** | Low | Non-English users want good localization |

### Missing Features People Wish Existed

1. **Custom word packs** with easy import/sharing
2. **Online multiplayer** (not just pass-and-play)
3. **Adjustable difficulty** based on group
4. **Statistics and player history** across games
5. **More game modes** (Find the Liar, Drawing mode, Q&A mode)
6. **Themed seasonal packs** that rotate
7. **Accessibility options** (larger text, high contrast, screen reader)
8. **A mode where only 1 person knows the word** and everyone else is the impostor (reverse mode)
9. **Dark mode**
10. **Share custom word packs** with friends

### What Differentiates the Top-Rated Apps

1. **Word pair quality** — the #1 differentiator. Bad pairs = bad game.
2. **Multiple game modes** — not just one variant
3. **No ads or minimal ads** — willing to pay for ad-free
4. **Stability** — never crashes mid-game
5. **Fast, clean UX** — minimal taps from launch to playing
6. **Family mode** — separate kid-friendly content
7. **Customization** — timer, impostor count, hint words, custom words
8. **Large word database** — 1000+ words to prevent repetition
9. **Responsive developer** — updates, bug fixes, listens to feedback
10. **Offline-first** — works without internet

---

## 10. Key Takeaways for Building Our Own

### Must-Haves (MVP)

- [ ] Pass-and-play on single device (offline)
- [ ] Hold-to-reveal word mechanic (proven best UX)
- [ ] 3-24 player support
- [ ] At least 500 words across 8+ categories
- [ ] Classic mode: civilians get word, impostor gets "IMPOSTOR"
- [ ] Undercover mode: civilians get word A, impostor gets related word B
- [ ] Mr. White role: gets nothing, pure bluff
- [ ] Configurable impostor count (1 or 2)
- [ ] Discussion timer (configurable)
- [ ] Voting (at minimum, just show player list for in-person pointing)
- [ ] Clean, fast reveal flow with clear "pass to next player" interstitials
- [ ] Result screen showing impostor identity + the word

### Should-Haves (V1.1)

- [ ] Optional impostor hint word
- [ ] Family/kids mode with simple words
- [ ] Custom word creation
- [ ] Score tracking across rounds
- [ ] "Prevent impostor from going first" setting
- [ ] Category display toggle (show/hide during game)
- [ ] Dark mode
- [ ] Sound/haptic feedback on reveal

### Nice-to-Haves (V2+)

- [ ] Find the Liar mode (different questions)
- [ ] Spyfall mode (locations + roles + Q&A)
- [ ] Online multiplayer (room codes)
- [ ] Custom word pack sharing
- [ ] Seasonal/themed packs
- [ ] Statistics and player history
- [ ] Reverse mode (1 civilian, everyone else is impostor)
- [ ] Images mode
- [ ] AI-generated word pairs (use LLM to create balanced pairs on the fly)

### Design Principles

1. **Speed to play** — from app open to first round should be <30 seconds
2. **No account required** — ever
3. **Offline-first** — internet should never be required for local play
4. **Word pair quality is everything** — invest heavily in curating great pairs
5. **The phone is a tool, not the game** — the game is the conversation
6. **Impostor should have a fighting chance** — hint words and balanced pairs are crucial
7. **Respect the group dynamic** — configurable everything so groups can find their sweet spot

---

## Sources

### Apps
- [Impostor Game - Party Edition (iOS)](https://apps.apple.com/us/app/imposter-game-party-edition/id6745120053)
- [Imposter Party Word Game (iOS)](https://apps.apple.com/us/app/imposter-party-word-game/id1562982547)
- [Undercover: Word Party Game (iOS)](https://apps.apple.com/us/app/undercover-word-party-game/id946882449)
- [Undercover (Google Play)](https://play.google.com/store/apps/details?id=com.yanstarstudio.joss.undercover)
- [Imposter Up (Google Play)](https://play.google.com/store/apps/details?id=pt.cosmicode.imposter)
- [SpyFall (Google Play)](https://play.google.com/store/apps/details?id=io.github.maxcriser.spyfall)

### Game Rules & Mechanics
- [Spyfall Rules](https://www.spyfall.app/gamerules)
- [Spyfall - UltraBoardGames](https://www.ultraboardgames.com/spyfall/game-rules.php)
- [A Fake Artist Goes to New York - Oink Games](https://oinkgames.com/en/games/analog/a-fake-artist-goes-to-new-york/)
- [Insider - Oink Games](https://oinkgames.com/en/games/analog/insider/)
- [The Chameleon - How to Play](https://bigpotato.com/blogs/blog/how-to-play-the-chameleon-instructions)
- [Undercover Rules](https://www.yanstarstudio.com/undercover-how-to-play)
- [Spyfall - BoardGameGeek](https://boardgamegeek.com/boardgame/166384/spyfall)

### Word Lists & Content
- [ImposterGame.art - 500+ Words](https://www.impostergame.art/words.html)
- [ImposterGame.net - Word Lists](https://impostergame.net/imposter-game-words)
- [Imposter.app - 200+ Words by Category](https://imposter.app/imposter-game-words/)
- [ImposterWords.com - Best Word Pairs](https://www.imposterwords.com/blog/100-best-imposter-game-words)
- [Game On Family - Tutorial & Word Lists](https://gameonfamily.com/blogs/tutorials/imposter)
- [Spyfall Locations JSON (GitHub)](https://github.com/PepsRyuu/spyfall/blob/master/locations.json)
- [PlayImposter.com - Generator](https://playimposter.com/)

### Web-Based Implementations
- [Spyfall.co](https://spyfall.co/)
- [Spyfall by Adriano Cola](https://spyfall.adrianocola.com/)
- [ImposterGame.net (Online)](https://impostergame.net/)
- [ImpostorGame.online](https://impostorgame.online/)
- [PlaySpy.app](https://playspy.app/)

### Design & Analysis
- [Designing a Social Deduction Game - Balangay](https://www.balangay.games/designing-a-social-deduction-tabletop-game/)
- [Critical Play: Spyfall Analysis](https://mechanicsofmagic.com/2024/04/08/critical-play-spyfall-28/)
- [Social Deduction Games - Medium](https://medium.com/theuglymonster/on-games-part-2-social-deduction-games-cf4212740a92)
- [Spyfall Timer Discussion - BGG](https://boardgamegeek.com/thread/1387167/round-time-per-player)
