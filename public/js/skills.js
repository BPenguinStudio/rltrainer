// ─────────────────────────────────────────────────────────────────────────
//  RL Trainer — the skill curriculum
//
//  RANKS  : the eight competitive tiers, with theme colours + emblems.
//  SKILLS : an ordered, beginner-to-expert curriculum. Each skill lives in
//           one tier and is listed in the order you should learn it.
//
//  Video IDs below were sourced from real, well-known YouTube tutorials.
//  Every skill also auto-generates a "Search YouTube" link from its name,
//  so there is always a way to find more help.
// ─────────────────────────────────────────────────────────────────────────

export const RANKS = [
  {
    key: 'bronze',
    name: 'Bronze',
    tagline: 'The First Touch',
    blurb: "Everyone starts here. The goal isn't fancy mechanics — it's learning to drive, hit the ball where you want, and stop crashing into your own teammate.",
    colorA: '#a9601f',
    colorB: '#e08a3c',
    divisions: ['Bronze I', 'Bronze II', 'Bronze III']
  },
  {
    key: 'silver',
    name: 'Silver',
    tagline: 'Getting Airborne',
    blurb: 'You can drive now. Time to leave the ground, learn to turn around fast, and stop chasing the ball like a puppy.',
    colorA: '#7c8794',
    colorB: '#cfd8e3',
    divisions: ['Silver I', 'Silver II', 'Silver III']
  },
  {
    key: 'gold',
    name: 'Gold',
    tagline: 'Wheels Off the Floor',
    blurb: 'Aerials become reliable, the wall becomes your friend, and you start thinking one pass ahead instead of one touch ahead.',
    colorA: '#c79a23',
    colorB: '#ffe06a',
    divisions: ['Gold I', 'Gold II', 'Gold III']
  },
  {
    key: 'platinum',
    name: 'Platinum',
    tagline: 'Speed & Control',
    blurb: 'The speed flip, directional air roll, and ground dribbles arrive. This is where mechanics start separating players.',
    colorA: '#2f9c8f',
    colorB: '#5ff0dd',
    divisions: ['Platinum I', 'Platinum II', 'Platinum III']
  },
  {
    key: 'diamond',
    name: 'Diamond',
    tagline: 'Flicks & Air Dribbles',
    blurb: 'Dribble flicks, your first air dribbles, and real shadow defense. You can now genuinely break ankles.',
    colorA: '#2f6cd6',
    colorB: '#7db4ff',
    divisions: ['Diamond I', 'Diamond II', 'Diamond III']
  },
  {
    key: 'champion',
    name: 'Champion',
    tagline: 'The Freestyle Threshold',
    blurb: 'Flip resets, ceiling shots, and double taps. The mechanics that make spectators gasp are now on the menu.',
    colorA: '#7b32cf',
    colorB: '#c07bff',
    divisions: ['Champion I', 'Champion II', 'Champion III']
  },
  {
    key: 'gc',
    name: 'Grand Champion',
    tagline: 'Mechanics Meet IQ',
    blurb: 'Consistency is king. Flip resets that actually go in, stalls, fakes, and reads that look like cheating.',
    colorA: '#c01f5b',
    colorB: '#ff5f8d',
    divisions: ['Grand Champion I', 'Grand Champion II', 'Grand Champion III']
  },
  {
    key: 'ssl',
    name: 'Supersonic Legend',
    tagline: 'The Ceiling',
    blurb: 'The top 0.1%. Flip reset double taps, the Psycho, air-dribble resets, and a game brain that sees the play before it happens.',
    colorA: '#d6d6e6',
    colorB: '#ffffff',
    divisions: ['Supersonic Legend']
  }
];

// Helper to keep the data terse: s(...) builds a skill object.
function s(o) {
  return {
    youtubeId: null,
    searchQuery: null,
    tips: [],
    ...o
  };
}

export const SKILLS = [
  // ───────────────────────────── BRONZE ─────────────────────────────
  s({
    id: 'settings',
    rank: 'bronze',
    name: 'Dial In Your Settings',
    icon: '⚙️',
    difficulty: 1,
    division: 'Bronze I',
    short: 'Before any mechanic, set up camera and controls so the game stops fighting you.',
    steps: [
      'Set Camera Shake OFF, FOV to 110, Camera Distance ~270, Height ~110, Angle ~-4.0, Stiffness ~0.45.',
      'Set Ball Camera Toggle to a comfortable button — you will tap it constantly.',
      'Bind Air Roll Left and Air Roll Right to two separate buttons (e.g. the bumpers). This single change unlocks every advanced mechanic later.',
      'Turn Camera Shake and controller vibration off so the screen stays readable.',
      'Play 10 minutes of free-play just driving around with these settings until they feel normal.'
    ],
    tips: [
      'Almost every pro uses ball-cam toggling — hold it when chasing, release it when lining up a shot.',
      "Don't skip the directional air roll bind. Future-you will thank present-you."
    ],
    searchQuery: 'best rocket league camera settings and air roll bind'
  }),
  s({
    id: 'powerslide',
    rank: 'bronze',
    name: 'Powerslide Turning',
    icon: '🛞',
    difficulty: 1,
    division: 'Bronze I',
    short: 'The handbrake turns a wide, slow arc into a tight, fast snap.',
    youtubeId: 'rA8fccIIMVs',
    steps: [
      'Drive forward at speed and pick a direction to turn.',
      'Hold the powerslide (handbrake) button while steering into the turn.',
      'Release powerslide the moment your car points where you want to go.',
      'Tap boost on exit to recover the speed the slide scrubbed off.',
      'Practice 180° turns against a wall: approach, slide, end up facing the other way.'
    ],
    tips: [
      'Short taps of powerslide adjust your angle; long holds spin you around.',
      'Powersliding on landings keeps you from skidding out of control.'
    ]
  }),
  s({
    id: 'boost-management',
    rank: 'bronze',
    name: 'Boost Management & Pads',
    icon: '⛽',
    difficulty: 1,
    division: 'Bronze II',
    short: 'Boost wins games. Learn to collect the little pads instead of always running dry.',
    steps: [
      'Memorise the 6 big boost pads (the corners and the middle of each side) — each gives 100.',
      'There are 28 small pads (12 along the field) giving 12 each; drive over them on your way to plays.',
      'Plan your path so you pass over pads instead of taking a straight, padless line.',
      'Try to never sit at 0 boost — keep a working reserve of ~20-30 for recoveries and challenges.',
      'When low, peel off to a corner big-boost instead of weakly chasing.'
    ],
    tips: [
      'Stealing the enemy corner boost both fuels you and starves them.',
      'You move plenty fast on small pads + flips — you do not need to boost everywhere.'
    ],
    searchQuery: 'rocket league boost management small pads tutorial'
  }),
  s({
    id: 'ball-control',
    rank: 'bronze',
    name: 'Basic Ball Control',
    icon: '🎯',
    difficulty: 2,
    division: 'Bronze II',
    short: 'Hit the ball where you mean to — the foundation of literally everything.',
    youtubeId: '576yfVb3MUM',
    steps: [
      'In free-play, push the ball around the field keeping it just in front of your car.',
      'Practice hitting the ball to a specific target (a corner, the wall) over and over.',
      'Learn that where on your car you strike the ball changes its direction — nose, roof, side.',
      'Approach a still ball and roll it up onto your hood, then keep it balanced while driving slowly.',
      'Hold the dribble for a few seconds, then push it off for a controlled shot.'
    ],
    tips: [
      'Small steering corrections keep a hood-dribble alive — big jerks lose it.',
      'Control beats power at this stage; a placed soft shot scores more than a wild boom.'
    ]
  }),
  s({
    id: 'no-ballchase',
    rank: 'bronze',
    name: "Stop Ball-Chasing",
    icon: '🧭',
    difficulty: 2,
    division: 'Bronze III',
    short: 'The single biggest rank-up at low levels: learn when NOT to go for the ball.',
    steps: [
      "After you hit the ball, don't immediately chase it again — peel back toward your half.",
      'Let your teammate take the touch they are closer to; trust the rotation.',
      'Ask: "If I miss this challenge, who is behind me?" If nobody — wait and defend.',
      'Default position when not challenging: between the ball and your own goal.',
      'Grab boost while you reposition so you arrive at the next play with fuel.'
    ],
    tips: [
      'Two cars going for the same ball = an open net. One challenges, one supports.',
      'Patience literally raises your rank with zero mechanical skill required.'
    ],
    searchQuery: 'rocket league how to stop ballchasing positioning tutorial'
  }),
  s({
    id: 'kickoffs-basic',
    rank: 'bronze',
    name: 'Basic Kickoffs',
    icon: '🏁',
    difficulty: 2,
    division: 'Bronze III',
    short: 'Win or neutralise the very first contact of every play.',
    youtubeId: 'xULyQd8sY00',
    steps: [
      'Boost straight toward the ball off the whistle.',
      'Just before contact, front-flip into the ball to add power and protect yourself.',
      'Angle your flip slightly so the ball goes to a corner, not straight back to the enemy.',
      'On diagonal kickoffs, grab the small pads on the way for extra boost.',
      'Finish with a little boost left so you can recover and follow up.'
    ],
    tips: [
      'If you are NOT taking the kickoff, grab back boost and get ready to defend.',
      'A neutral kickoff you survive is better than a flashy one that leaves your net open.'
    ]
  }),
  s({
    id: 'power-clears',
    rank: 'bronze',
    name: 'Power Clears',
    icon: '💥',
    difficulty: 2,
    division: 'Bronze III',
    short: 'Get the ball far away from your net, to the side, with authority.',
    steps: [
      'When defending, aim to send the ball wide toward the sideline — never straight up the middle.',
      'Front-flip through the ball for maximum power on the clear.',
      'Time your jump so contact happens on the way up, through the centre of the ball.',
      'Clear toward your own attacking corners so a clear can turn into offence.',
      'After clearing, recover facing the ball, not the wall.'
    ],
    tips: [
      'A clear up the middle often lands right back on an attacker. Always go wide.',
      'Powerful, placed clears buy your team time to reset.'
    ],
    searchQuery: 'rocket league how to clear the ball defense tutorial'
  }),

  // ───────────────────────────── SILVER ─────────────────────────────
  s({
    id: 'first-aerials',
    rank: 'silver',
    name: 'Your First Aerials',
    icon: '🚀',
    difficulty: 2,
    division: 'Silver I',
    short: 'Leave the ground with control and touch the ball in the air.',
    youtubeId: 'bgy8foUzx90',
    steps: [
      'Jump once, then point your nose toward the ball.',
      'Tap boost in short bursts to climb — pitch back to gain height, level off to drive forward.',
      'Aim to meet the ball, not where it is now — lead the target.',
      'Use small joystick adjustments; over-correcting sends you spinning.',
      'Start with slow, high balls in free-play before trying live aerials.'
    ],
    tips: [
      'Double-jumping mid-aerial gives a small boost of height and a flip for power.',
      'Keep some boost in reserve — running out halfway to the ball is the classic mistake.'
    ]
  }),
  s({
    id: 'half-flip',
    rank: 'silver',
    name: 'Half-Flip',
    icon: '🔄',
    difficulty: 2,
    division: 'Silver I',
    short: 'The fastest way to turn around when you are facing the wrong way.',
    youtubeId: 'FtgzgYhApuU',
    steps: [
      'From a standstill or reverse, jump and flip backwards (pull stick down).',
      'Immediately after the flip starts, push the stick the other way (up/forward) to cancel the front-down rotation.',
      'Add air roll to flip the car back onto its wheels as you come down.',
      'Hold boost through the motion to keep your speed.',
      'You should end up facing the opposite direction, still moving fast.'
    ],
    tips: [
      'Half-flipping back to defend is far faster than a wide U-turn.',
      'Bind air roll to a button to make the recovery cleaner.'
    ]
  }),
  s({
    id: 'rotation-basics',
    rank: 'silver',
    name: 'Rotation Basics',
    icon: '♻️',
    difficulty: 2,
    division: 'Silver II',
    short: 'Cycle through the field as a team so someone is always back.',
    steps: [
      'Think of three jobs: 1st man (attacking), 2nd man (support), 3rd man (defending).',
      'After you attack, rotate back toward your own goal — usually through the back post.',
      'Rotate toward the boost so you refuel as you reset position.',
      "Don't rotate through the middle of the field where you block teammates and leave the net exposed.",
      'As a teammate commits forward, you slide back to cover their spot.'
    ],
    tips: [
      'Good rotation looks like a slow, constant cycle — never two players in the same place.',
      'In 2s, it is more of a you-go-I-go seesaw than a full circle.'
    ],
    searchQuery: 'rocket league rotation tutorial back post'
  }),
  s({
    id: 'powershot',
    rank: 'silver',
    name: 'Shooting With Power',
    icon: '⚡',
    difficulty: 2,
    division: 'Silver II',
    short: 'Turn weak taps into real shots that beat the keeper.',
    steps: [
      'Approach the ball with speed and line up your shot before you arrive.',
      'Front-flip into the ball, timing contact at the peak of the flip for max power.',
      'Strike through the centre-bottom of the ball to keep it low and driven.',
      'Angle your car toward the open side of the net, not straight at the goalie.',
      'Follow your shot in case of a rebound — but only if you have cover behind you.'
    ],
    tips: [
      'A flip-shot is much harder to save than a slow roll.',
      'Disguise direction: drive at one corner, flip into the other.'
    ],
    searchQuery: 'rocket league power shot tutorial'
  }),
  s({
    id: 'speed',
    rank: 'silver',
    name: 'Driving Faster',
    icon: '💨',
    difficulty: 2,
    division: 'Silver II',
    short: 'Maintain supersonic speed using flips, not just boost.',
    steps: [
      'Supersonic is the max speed (the ball-cam shows speed lines) — boost gets you there.',
      'Once at supersonic, front-flip to keep moving fast without spending boost.',
      'Chain flips: land, drive briefly, flip again to stay fast across the field.',
      "Avoid flipping right before the ball — you can't steer mid-flip.",
      'Use diagonal flips to cover ground while slightly adjusting direction.'
    ],
    tips: [
      'Flipping forward is free speed — use it to transition, not to challenge.',
      'Boosting + flipping at supersonic wastes boost; flip on its own once you are fast.'
    ],
    searchQuery: 'rocket league how to move fast flipping tutorial'
  }),
  s({
    id: 'catching',
    rank: 'silver',
    name: 'Catching & Cushioning',
    icon: '🪂',
    difficulty: 3,
    division: 'Silver III',
    short: 'Soften a falling ball onto your car instead of bouncing it away.',
    steps: [
      'Read where a high ball will land and get under it early.',
      'Match the ball\'s horizontal speed so you are moving with it, not into it.',
      'As it lands, ease off so it settles onto your roof rather than ricocheting.',
      'Once caught, begin a slow dribble to set up a shot or pass.',
      'Practice with high free-play throws until the ball "sticks".'
    ],
    tips: [
      'Catching kills the ball\'s momentum and gives you total control of the next play.',
      'Driving the same direction as the ball is the secret to a soft touch.'
    ],
    searchQuery: 'rocket league catching the ball cushion tutorial'
  }),
  s({
    id: 'goalie-positioning',
    rank: 'silver',
    name: 'Defending the Net',
    icon: '🥅',
    difficulty: 2,
    division: 'Silver III',
    short: 'Make saves by being in the right spot, not by diving wildly.',
    steps: [
      'When you are last back, sit on or near your goal-line, slightly off-centre toward the ball.',
      'Stay on the ground and mobile — don\'t commit a jump until you must.',
      'Mirror the attacker: shift to cover the side of the net they threaten.',
      'Save toward the sideline, never back into the centre of your own net.',
      'After the save, clear properly and rotate up — don\'t sit and watch.'
    ],
    tips: [
      'A patient keeper who waits forces the attacker to make the first mistake.',
      'Jumping early is how clean shots fly under you. Stay grounded as long as possible.'
    ],
    searchQuery: 'rocket league goalkeeping defending net tutorial'
  }),

  // ───────────────────────────── GOLD ─────────────────────────────
  s({
    id: 'consistent-aerials',
    rank: 'gold',
    name: 'Consistent Aerials',
    icon: '🛫',
    difficulty: 3,
    division: 'Gold I',
    short: 'Hit aerials on demand with clean car control.',
    youtubeId: '78_qNh2_vVc',
    steps: [
      'Practice the "Aerial Car Control" free-play routine: fly up and hold the ball steady against the wall.',
      'Learn to point your nose precisely using pitch + yaw together.',
      'Use short boost taps to control height instead of holding boost the whole way.',
      'Approach the ball with your wheels facing it so a tap of the ball is clean.',
      'Drill the in-game "Aerial" training mode shots until they feel routine.'
    ],
    tips: [
      'Smooth, tiny stick inputs beat big corrections every time.',
      'Confidence is half of aerials — commit fully or stay grounded.'
    ]
  }),
  s({
    id: 'fast-aerial',
    rank: 'gold',
    name: 'Fast Aerial',
    icon: '⏫',
    difficulty: 3,
    division: 'Gold I',
    short: 'Reach the ball faster by jumping, tilting, and double-jumping efficiently.',
    youtubeId: 'qSduNdQeL7Q',
    steps: [
      'Jump once and immediately pitch your nose up toward the ball.',
      'Start boosting as soon as your nose points up.',
      'Quickly jump a second time (the double jump) to gain height — but delay it slightly so it adds power.',
      'Hold boost continuously through the climb for maximum speed.',
      'Level off near the ball for a controlled touch.'
    ],
    tips: [
      'The fast aerial gets you to high balls a half-second sooner — that wins races.',
      'Keep your nose pointed where you want to GO, and the boost does the rest.'
    ]
  }),
  s({
    id: 'wall-play',
    rank: 'gold',
    name: 'Playing Off the Wall',
    icon: '🧱',
    difficulty: 3,
    division: 'Gold II',
    short: 'Drive up the wall, read bouncing balls, and clear or shoot from it.',
    steps: [
      'Approach the wall straight-on with speed to drive up it cleanly.',
      'Read where a ball rolling up or bouncing off the wall will be and meet it there.',
      'To come off the wall toward the ball, jump off and adjust with air control.',
      'Use the wall to defend: drive up and clear balls that would otherwise sit dangerously.',
      'Practice reading backboard bounces — many goals come from balls off the back wall.'
    ],
    tips: [
      'Most players ignore the wall — using it makes you unpredictable.',
      'Jumping off the wall toward the ball is the gateway to wall air dribbles later.'
    ],
    searchQuery: 'rocket league wall play reads tutorial'
  }),
  s({
    id: 'wave-dash',
    rank: 'gold',
    name: 'Wave Dash',
    icon: '🌊',
    difficulty: 3,
    division: 'Gold II',
    short: 'A flip cut short by the ground that converts into a speed boost.',
    youtubeId: 'GQuV_EH-M6g',
    steps: [
      'While airborne and close to the ground, angle your car slightly nose-up.',
      'Just before your wheels touch, flip diagonally forward.',
      'The ground interrupts the flip, and you keep the forward speed without floating.',
      'Use directional air roll to keep the car flat so you land clean.',
      'Chain it after recoveries to instantly regain momentum.'
    ],
    tips: [
      'Wave dashing on a landing turns a slow recovery into free speed.',
      'Timing is everything — flip too high and you just face-plant.'
    ]
  }),
  s({
    id: 'shadow-intro',
    rank: 'gold',
    name: 'Shadow Defense (Intro)',
    icon: '👤',
    difficulty: 3,
    division: 'Gold III',
    short: 'Retreat with the attacker, staying goal-side and ready to pounce.',
    youtubeId: 'PmCBkHsKGVs',
    steps: [
      'When an attacker has the ball and you are back, retreat toward your goal at a similar speed.',
      'Stay slightly goal-side and off to one angle — never head-on.',
      'Keep your wheels on the ground and your nose roughly toward the ball.',
      'Wait for their touch to get loose, then strike — don\'t lunge at a controlled ball.',
      'If they flick, you are positioned to follow and save the rebound.'
    ],
    tips: [
      'Shadowing buys time and forces mistakes instead of gifting them a 1v0.',
      'Match their speed — too fast and you overshoot, too slow and they blow past.'
    ]
  }),
  s({
    id: 'aerial-control-boost-tap',
    rank: 'gold',
    name: 'Aerial Control & Boost Tapping',
    icon: '🎮',
    difficulty: 3,
    division: 'Gold III',
    short: 'Fine-tune your flight path with feathered boost and precise tilts.',
    steps: [
      'Instead of holding boost, "feather" it — quick taps to control speed and height.',
      'Combine pitch and yaw to curve toward a moving ball.',
      'Practice holding the ball against the wall with your car for 5+ seconds.',
      'Learn to keep your wheels pointed at the ball so contact is always controlled.',
      'Use the "Aerial" free-play and custom training packs daily.'
    ],
    tips: [
      'Boost tapping saves fuel and gives finer control than full throttle.',
      'This control is the prerequisite for air dribbles and freestyles later.'
    ],
    searchQuery: 'rocket league aerial control boost tapping tutorial'
  }),
  s({
    id: 'recoveries',
    rank: 'gold',
    name: 'Fast Recoveries',
    icon: '🔧',
    difficulty: 3,
    division: 'Gold III',
    short: 'Land on your wheels facing the play, ready to go again instantly.',
    steps: [
      'While falling, use air roll to rotate your car flat (wheels down).',
      'Point your nose toward where the next play will be before you land.',
      'Powerslide on touchdown to absorb the landing and keep control.',
      'Where possible, wave dash on landing to convert the fall into speed.',
      'Drill recoveries from awkward bumps and demos until they\'re automatic.'
    ],
    tips: [
      'A bad recovery wastes a full second — that\'s the difference between a save and a goal.',
      'Always be turning your car toward the ball on the way down.'
    ],
    searchQuery: 'rocket league fast recovery landing tutorial'
  }),

  // ───────────────────────────── PLATINUM ─────────────────────────────
  s({
    id: 'speed-flip',
    rank: 'platinum',
    name: 'Speed Flip Kickoff',
    icon: '🏎️',
    difficulty: 4,
    division: 'Platinum I',
    short: 'The fastest kickoff in the game — diagonal flip + cancel + air roll.',
    youtubeId: 'KV6PqcMM9hY',
    steps: [
      'Boost forward, then angle your car ~45° off-straight.',
      'Jump and flip diagonally forward-and-to-the-side.',
      'Immediately cancel the flip by pulling the stick back toward neutral/down.',
      'Hold directional air roll the whole time to keep the car flat and pointed straight.',
      'Keep boosting throughout; you should arrive at the ball noticeably faster.'
    ],
    tips: [
      'It is timing, not strength — practice it slowly in free-play 50+ times.',
      'Winning kickoffs with a speed flip swings entire games in your favour.'
    ]
  }),
  s({
    id: 'directional-air-roll',
    rank: 'platinum',
    name: 'Directional Air Roll',
    icon: '🧭',
    difficulty: 4,
    division: 'Platinum I',
    short: 'The master key — controlled air roll that unlocks every freestyle mechanic.',
    youtubeId: 'eZ6upQhTpBQ',
    steps: [
      'Make sure Air Roll Left and Air Roll Right are bound to separate buttons.',
      'In free-play, hold air roll left/right and combine it with pitch and yaw.',
      'Practice flying up and rotating the car to any orientation, then holding it steady.',
      'Goal: be able to point any part of your car at the ball on command.',
      'Spend time daily in a "car control" free-play routine — this skill is slow to build.'
    ],
    tips: [
      'Every flip reset, ceiling shot, and air dribble depends on this. Invest the hours.',
      'Most players who plateau never learned directional air roll. Don\'t be them.'
    ]
  }),
  s({
    id: 'ground-dribble',
    rank: 'platinum',
    name: 'Ground Dribbling',
    icon: '🤹',
    difficulty: 4,
    division: 'Platinum II',
    short: 'Balance the ball on your car and carry it through defenders.',
    youtubeId: 'ko-QwAwhv18',
    steps: [
      'Roll the ball up onto your hood and find the balance point just ahead of your roof.',
      'Use throttle to speed up/slow down so the ball stays on the sweet spot.',
      'Steer with tiny inputs; the ball should sit slightly toward the direction you turn.',
      'Keep your speed moderate — too fast and it rolls off the front.',
      'Once stable, carry it toward goal to set up a flick.'
    ],
    tips: [
      'Catching the ball into a dribble is easier than scooping a rolling ball.',
      'A good dribble freezes defenders because they fear the flick.'
    ]
  }),
  s({
    id: 'backboard-reads',
    rank: 'platinum',
    name: 'Backboard Reads & Clears',
    icon: '🪞',
    difficulty: 3,
    division: 'Platinum II',
    short: 'Defend balls rolling down the back wall and turn them into clears.',
    steps: [
      'Watch high balls heading toward your backboard and predict where they\'ll roll down.',
      'Drive up the back wall to meet the ball before it drops in front of your net.',
      'Clear off the backboard toward the sideline, away from danger.',
      'On offence, read your own backboard touches for double-tap opportunities.',
      'Communicate/anticipate so you and your keeper don\'t both leave the net.'
    ],
    tips: [
      'Backboard goals are extremely common at mid ranks — owning that area saves games.',
      'Wheels on the wall, nose toward the ball — that\'s a clean backboard clear.'
    ],
    searchQuery: 'rocket league backboard clears reads tutorial'
  }),
  s({
    id: 'redirects',
    rank: 'platinum',
    name: 'Power Shots & Redirects',
    icon: '↪️',
    difficulty: 4,
    division: 'Platinum III',
    short: 'Change a pass or clear\'s direction toward goal with a single touch.',
    steps: [
      'Read the path of an incoming ball (a teammate\'s pass or a loose ball).',
      'Position so your car meets it at an angle pointing toward the net.',
      'Strike through the ball, using a flip if you need extra power.',
      'Keep your touch firm and angled — you are redirecting momentum, not catching it.',
      'Practice redirecting wall passes and aerial passes onto the goal.'
    ],
    tips: [
      'Redirects are unsaveable when fast — the keeper has no time to react.',
      'Add your car\'s speed to the ball\'s speed for a rocket of a shot.'
    ],
    searchQuery: 'rocket league redirect tutorial'
  }),
  s({
    id: 'aerial-shots',
    rank: 'platinum',
    name: 'Aerial Shots & Goals',
    icon: '🎯',
    difficulty: 4,
    division: 'Platinum III',
    short: 'Finish in the air with power and placement, not just a weak touch.',
    steps: [
      'Fast-aerial to arrive at the ball with your wheels facing it and speed to spare.',
      'Hit through the centre of the ball toward the open part of the net.',
      'Use a double-jump flip into the ball for extra power on a high shot.',
      'Aim down into the net so the keeper can\'t easily wall-save it.',
      'Follow your aerial in case the keeper parries it back out.'
    ],
    tips: [
      'Power + placement beats a perfectly placed marshmallow touch.',
      'Most plat keepers can\'t save a driven aerial into the top corner.'
    ],
    searchQuery: 'rocket league aerial shots power tutorial'
  }),
  s({
    id: 'fifties',
    rank: 'platinum',
    name: '50/50s & Challenges',
    icon: '🤜',
    difficulty: 3,
    division: 'Platinum III',
    short: 'Win the contested collisions that decide loose-ball situations.',
    steps: [
      'Approach a contested ball with speed and a flip ready.',
      'Flip THROUGH the ball at the moment of contact to push it past your opponent.',
      'Angle your flip so the ball pops to your advantage (toward their net or your support).',
      'If you\'ll lose the 50, position to recover the rebound instead of fully committing.',
      'Time your challenge — flipping too early lets them flick around you.'
    ],
    tips: [
      'The player who flips with better timing and angle wins the 50.',
      'A "soft" 50 that pops the ball to your teammate is often better than a hard one.'
    ],
    searchQuery: 'rocket league 50/50 challenge tutorial'
  }),

  // ───────────────────────────── DIAMOND ─────────────────────────────
  s({
    id: 'wall-air-dribble',
    rank: 'diamond',
    name: 'Air Dribble (Off the Wall)',
    icon: '🌀',
    difficulty: 4,
    division: 'Diamond I',
    short: 'Push the ball up the wall, pop it off, and carry it through the air to goal.',
    youtubeId: 'ddEe3t_cKyw',
    steps: [
      'Roll the ball up the side wall, keeping it just ahead of your car.',
      'Near the top, give it a gentle tap to pop it off the wall into the air.',
      'Jump off the wall after it and get under/behind the ball.',
      'Use light boost taps and air-roll control to keep nudging it toward the net.',
      'Guide it down into the goal with small, repeated touches.'
    ],
    tips: [
      'Soft, frequent touches keep the ball attached — one hard touch ends the dribble.',
      'Directional air roll keeps your car oriented for each nudge.'
    ]
  }),
  s({
    id: 'ground-to-air-dribble',
    rank: 'diamond',
    name: 'Ground-to-Air Dribble',
    icon: '🪁',
    difficulty: 5,
    division: 'Diamond II',
    short: 'Carry a dribble straight from the ground up into an air dribble.',
    youtubeId: 'hD0BxP5o3kY',
    steps: [
      'Start with a stable ground dribble, ball balanced on your hood.',
      'Push the ball slightly forward and up while boosting to lift it off the ground.',
      'Jump and follow it into the air, staying just behind and below the ball.',
      'Feather boost and use air roll to keep the ball ahead of your nose.',
      'Steer it toward the net with gentle continuous touches.'
    ],
    tips: [
      'The transition touch is the hard part — practice the pop-up in free-play first.',
      'Keep your speed under control; rushing the lift kills the dribble.'
    ]
  }),
  s({
    id: 'dribble-flick',
    rank: 'diamond',
    name: 'The 45° Dribble Flick',
    icon: '🎪',
    difficulty: 4,
    division: 'Diamond II',
    short: 'The bread-and-butter flick that beats keepers off a dribble.',
    steps: [
      'Get a controlled ground dribble with the ball balanced on your car.',
      'Let the ball roll slightly toward the back of your roof.',
      'Jump, then flip diagonally (about 45°) into the ball.',
      'The flip launches the ball forward and to a side, faster than the keeper expects.',
      'Aim the flick toward the open corner of the net.'
    ],
    tips: [
      'Ball position on your car determines flick direction — experiment in free-play.',
      'A flick is most lethal right as the keeper commits to challenge the dribble.'
    ],
    searchQuery: 'rocket league 45 degree dribble flick tutorial'
  }),
  s({
    id: 'musty-flick',
    rank: 'diamond',
    name: 'Musty Flick',
    icon: '🐮',
    difficulty: 4,
    division: 'Diamond III',
    short: 'The infamous flick: lean back, then snap forward to launch the ball.',
    youtubeId: '-euMP3dGYho',
    steps: [
      'Dribble the ball balanced toward the front of your hood.',
      'Jump, and as you rise pitch your nose DOWN (lean the car back, ball sits up by your back wheels).',
      'Just before contact, snap the stick forward and air roll so the nose whips up into the ball.',
      'The flick sends the ball up and forward in a deceptive arc.',
      'Time the snap so you catch the ball cleanly — too early and it slips off.'
    ],
    tips: [
      'Invented by amustycow — devastating because the wind-up looks like a miss.',
      'Pair a directional air roll with the forward snap for a cleaner motion.'
    ]
  }),
  s({
    id: 'shadow-proper',
    rank: 'diamond',
    name: 'Proper Shadow Defense',
    icon: '🥷',
    difficulty: 4,
    division: 'Diamond III',
    short: 'Delay attackers all the way to your net and punish their loose touch.',
    steps: [
      'Position goal-side and at an angle, mirroring the dribbler\'s movements.',
      'Keep an even gap — close enough to threaten, far enough not to get flicked over.',
      'Force them toward the sideline and away from a central shot.',
      'When their touch gets loose or they flick, strike decisively.',
      'If beaten, recover immediately back to net rather than chasing.'
    ],
    tips: [
      'Patience is the whole skill — the attacker usually cracks first.',
      'Never jump at a controlled dribble; wait for the mistake.'
    ],
    searchQuery: 'rocket league shadow defense delaying tutorial'
  }),
  s({
    id: 'ground-pinch',
    rank: 'diamond',
    name: 'Ground Pinches',
    icon: '🤏',
    difficulty: 4,
    division: 'Diamond III',
    short: 'Trap the ball between your car and a surface to launch it at rocket speed.',
    steps: [
      'Find a ball rolling along the ground toward you or a wall.',
      'Hit it at the right angle so it\'s squeezed between your car and the ground/wall.',
      'The pinch fires the ball off at huge speed — aim that line at the net.',
      'Practice the contact angle; a few degrees changes everything.',
      'Use pinches off kickoffs and loose balls for surprise shots.'
    ],
    tips: [
      'Pinch shots are nearly unsaveable because of the sheer speed.',
      'Consistency comes only from repetition — drill the angle in free-play.'
    ],
    searchQuery: 'rocket league ground pinch shot tutorial'
  }),
  s({
    id: 'demos',
    rank: 'diamond',
    name: 'Demos & Bumps',
    icon: '💢',
    difficulty: 3,
    division: 'Diamond III',
    short: 'Remove a defender from the play with a well-timed demolition.',
    steps: [
      'Reach supersonic speed (demos only happen at supersonic).',
      'Line up the enemy car and hit them to send them back to spawn.',
      'Target the last defender to open the net for your team.',
      'Use bumps (non-supersonic nudges) to knock opponents off their line.',
      'Don\'t over-commit to demos and abandon your defensive duties.'
    ],
    tips: [
      'A demo on the keeper right before your teammate shoots = free goal.',
      'Bumping a dribbler is a clean, low-risk way to end their play.'
    ],
    searchQuery: 'rocket league demo and bump tutorial'
  }),

  // ───────────────────────────── CHAMPION ─────────────────────────────
  s({
    id: 'full-air-dribble',
    rank: 'champion',
    name: 'Consistent Air Dribbles',
    icon: '🪐',
    difficulty: 5,
    division: 'Champion I',
    short: 'Carry the ball across distance in the air and finish under pressure.',
    steps: [
      'Combine your wall and ground air dribbles into longer, controlled carries.',
      'Maintain a rhythm of small boost taps and gentle touches.',
      'Use directional air roll constantly to keep the ball on your nose.',
      'Read the keeper and curve the dribble around their challenge.',
      'Finish by guiding the ball down and into the open net.'
    ],
    tips: [
      'The fewer, softer touches you make, the longer the dribble survives.',
      'Air dribbles are as much about boost management as car control.'
    ],
    searchQuery: 'rocket league consistent air dribble tutorial'
  }),
  s({
    id: 'flip-reset',
    rank: 'champion',
    name: 'Flip Reset (Intro)',
    icon: '🔁',
    difficulty: 5,
    division: 'Champion I',
    short: 'Touch the ball with all four wheels to regain your flip in mid-air.',
    youtubeId: 'groBRjh5KXQ',
    steps: [
      'Get under the ball in the air with your wheels facing up toward it.',
      'Make contact so all four wheels touch the ball — this resets your jump/flip.',
      'You\'ll see/feel the flip return; now you have a free flip in the air.',
      'Reorient with directional air roll and flip into the ball toward goal.',
      'Start in free-play just earning the reset before trying to score.'
    ],
    tips: [
      'All four wheels MUST touch — a partial touch gives no reset.',
      'First just learn to GET the reset reliably; finishing comes later.'
    ]
  }),
  s({
    id: 'ceiling-shot',
    rank: 'champion',
    name: 'Ceiling Shot',
    icon: '🔝',
    difficulty: 5,
    division: 'Champion II',
    short: 'Drive across the ceiling, drop onto the ball, and smash it down.',
    youtubeId: 'PkIupX66sF8',
    steps: [
      'Drive up the wall and onto the ceiling, holding boost to stay attached.',
      'Drive across the ceiling to line up above the ball\'s path.',
      'Drop off the ceiling at the right moment, falling toward the ball.',
      'Aerial-control to meet the ball and strike it powerfully downward.',
      'Time the drop so you connect on the way down with speed.'
    ],
    tips: [
      'The timing of when to drop off the ceiling is the hardest part — drill it.',
      'Ceiling shots come down with huge power and are tough to save.'
    ]
  }),
  s({
    id: 'double-tap',
    rank: 'champion',
    name: 'Double Tap',
    icon: '✌️',
    difficulty: 5,
    division: 'Champion II',
    short: 'Hit the ball into the backboard, then hit it again before it lands.',
    youtubeId: 'y6Wa7CJXlIw',
    steps: [
      'Send the ball into the opponent\'s backboard (or it bounces off it) at a good angle.',
      'Follow it into the air immediately after the first touch.',
      'Read the rebound off the backboard and meet it before it drops.',
      'Tap it down into the net with your second touch.',
      'Practice the backboard angle so the rebound comes to a hittable spot.'
    ],
    tips: [
      'Your first touch sets up the second — control it, don\'t blast it.',
      'Double taps beat keepers who only watch the first bounce.'
    ]
  }),
  s({
    id: 'advanced-redirects',
    rank: 'champion',
    name: 'Advanced Redirects',
    icon: '⤵️',
    difficulty: 4,
    division: 'Champion II',
    short: 'Redirect fast aerial and wall passes first-time into the net.',
    steps: [
      'Anticipate a teammate\'s pass or a backboard rebound early.',
      'Aerial to the interception point with your wheels facing where you\'ll send it.',
      'Strike first-time, adding your speed to the ball\'s for a powerful redirect.',
      'Angle the touch to the far corner away from the keeper.',
      'Practice catching crossfield passes and snapping them on goal.'
    ],
    tips: [
      'Pre-jumping so you\'re already in the air for the pass makes redirects easy.',
      'First-time redirects are unsaveable when fast and well-placed.'
    ],
    searchQuery: 'rocket league advanced redirect aerial tutorial'
  }),
  s({
    id: 'breezi-flick',
    rank: 'champion',
    name: 'Breezi Flick',
    icon: '🍃',
    difficulty: 5,
    division: 'Champion III',
    short: 'A flashy stall-and-flick that sends the ball with surprising power.',
    youtubeId: 'kxTtnSCvFKU',
    steps: [
      'Start from a controlled dribble or catch the ball onto your car.',
      'Jump and pitch back while air-rolling to briefly "stall" the car upside-down-ish under the ball.',
      'Position the ball toward your back wheels at the stall point.',
      'Snap forward out of the stall, flicking the ball with speed and spin.',
      'Aim the flick toward the open net.'
    ],
    tips: [
      'It combines a stall and a flick — learn each piece separately first.',
      'The deception comes from the awkward wind-up; keepers misjudge it.'
    ]
  }),
  s({
    id: 'tornado-spin',
    rank: 'champion',
    name: 'Tornado Spin / Flick',
    icon: '🌪️',
    difficulty: 5,
    division: 'Champion III',
    short: 'Spin the car around the ball to keep it controlled, then flick.',
    steps: [
      'Get the ball balanced and begin a continuous directional air roll.',
      'The constant spin keeps the ball cradled as the car rotates around it.',
      'Maintain light contact so the ball stays glued through the rotation.',
      'Release into a flick at the spin angle that points the ball at goal.',
      'This is advanced car control — build it slowly in free-play.'
    ],
    tips: [
      'Tornado control is the backbone of many freestyle resets and flicks.',
      'Smooth, constant air roll is the secret — never stop the spin mid-motion.'
    ],
    searchQuery: 'rocket league tornado spin flick tutorial'
  }),
  s({
    id: 'wall-pinch',
    rank: 'champion',
    name: 'Wall Pinch Shots',
    icon: '🧨',
    difficulty: 5,
    division: 'Champion III',
    short: 'Pinch the ball against the wall to fire it across the field at light speed.',
    steps: [
      'Find a ball near the wall and time your approach.',
      'Hit it so it\'s squeezed between your car and the wall at the right angle.',
      'The pinch rockets the ball off the wall — aim that line toward goal.',
      'Tiny changes in your contact angle drastically change the result, so drill it.',
      'Use wall pinches off corner boost reads and loose balls.'
    ],
    tips: [
      'A clean wall pinch is one of the fastest shots in the game.',
      'Consistency takes hundreds of reps — use a pinch training pack.'
    ],
    searchQuery: 'rocket league wall pinch shot tutorial'
  }),

  // ───────────────────────────── GRAND CHAMPION ─────────────────────────────
  s({
    id: 'consistent-flip-reset',
    rank: 'gc',
    name: 'Consistent Flip Resets',
    icon: '🔂',
    difficulty: 5,
    division: 'Grand Champion I',
    short: 'Get the reset on demand and convert it into a controlled shot.',
    steps: [
      'Read the ball early and position your car under it with wheels up.',
      'Get a clean four-wheel touch every time, even on moving balls.',
      'Immediately stabilise with directional air roll after the reset.',
      'Line up the now-available flip toward the net.',
      'Drill it from a training pack until the reset is automatic, not lucky.'
    ],
    tips: [
      'Consistency, not flashiness, is what separates GC resets from Champ ones.',
      'A reset you can\'t finish is just a fancy whiff — practice the finish too.'
    ],
    searchQuery: 'rocket league consistent flip reset training tutorial'
  }),
  s({
    id: 'flip-reset-shot',
    rank: 'gc',
    name: 'Flip Reset → Shot',
    icon: '🎯',
    difficulty: 5,
    division: 'Grand Champion I',
    short: 'Finish the flip reset by flipping the ball into the net with power.',
    steps: [
      'After securing the reset, reorient so your nose points at the ball and the net beyond.',
      'Use the regained flip to drive the ball downward into the goal.',
      'Add boost on the flip for power and to beat the keeper\'s challenge.',
      'Aim for the part of the net the keeper has left open.',
      'Practice reset-to-finish reps, not just earning the reset.'
    ],
    tips: [
      'Most players can get a reset; GCs can actually score with it.',
      'Don\'t rush the flip — a half-second of control makes it go in.'
    ],
    searchQuery: 'rocket league flip reset finishing shot tutorial'
  }),
  s({
    id: 'full-ceiling-shot',
    rank: 'gc',
    name: 'Full Ceiling Shots',
    icon: '🏛️',
    difficulty: 5,
    division: 'Grand Champion II',
    short: 'Ceiling shots from live play, including off your own setups.',
    steps: [
      'Set up the ceiling shot by pushing the ball up the wall toward the ceiling.',
      'Drive across the ceiling and drop with precise timing onto the ball.',
      'Strike it down and toward a corner with power.',
      'Mix in fakes — sometimes the threat of the ceiling shot opens other options.',
      'Practice catching your own wall pop into a ceiling shot.'
    ],
    tips: [
      'Setting up your own ceiling shot in a real match is peak highlight material.',
      'Keepers cheat for the power shot — place it instead.'
    ],
    searchQuery: 'rocket league ceiling shot setup tutorial'
  }),
  s({
    id: 'tight-double-tap',
    rank: 'gc',
    name: 'Tight Double Taps',
    icon: '🎯',
    difficulty: 5,
    division: 'Grand Champion II',
    short: 'Quick, low double taps off the backboard that give keepers no time.',
    steps: [
      'Hit a controlled first touch into the backboard at a sharp, quick angle.',
      'Stay close to the ball rather than letting it travel far.',
      'Meet the fast rebound immediately and tap it down into the net.',
      'Keep both touches compact so the whole play happens in a heartbeat.',
      'Drill the timing window relentlessly — it\'s very tight.'
    ],
    tips: [
      'Tight double taps are nearly unreactable at any rank.',
      'Control over power on touch one — you need a predictable rebound.'
    ],
    searchQuery: 'rocket league tight double tap tutorial'
  }),
  s({
    id: 'air-dribble-flick',
    rank: 'gc',
    name: 'Air Dribble to Flick',
    icon: '🎢',
    difficulty: 5,
    division: 'Grand Champion II',
    short: 'Finish an air dribble with a snap flick to beat the keeper\'s save.',
    steps: [
      'Carry a stable air dribble toward the net.',
      'As the keeper challenges, hold the ball with a final controlled touch.',
      'Snap a flip or flick into the ball to redirect it past them.',
      'Use directional air roll to angle the flick into the open net.',
      'Read the keeper\'s timing so your flick beats their jump.'
    ],
    tips: [
      'The flick at the end turns a saveable dribble into a goal.',
      'Patience: wait for the keeper to commit, then flick around them.'
    ],
    searchQuery: 'rocket league air dribble flick tutorial'
  }),
  s({
    id: 'corner-pinch',
    rank: 'gc',
    name: 'Corner & Wall Pinches',
    icon: '📐',
    difficulty: 5,
    division: 'Grand Champion III',
    short: 'Read and execute pinches from corners for instant, lethal shots.',
    steps: [
      'Recognise loose balls near corners and walls as pinch opportunities.',
      'Time your hit so the ball is squeezed between car and surface at the perfect angle.',
      'Direct the resulting rocket toward the net or a teammate.',
      'Learn the common corner-boost-read pinches off kickoffs.',
      'Use a pinch training pack to lock in the angles.'
    ],
    tips: [
      'Corner pinches turn defensive scrambles into instant counter-goals.',
      'A few degrees of angle = the difference between a goal and a whiff.'
    ],
    searchQuery: 'rocket league corner pinch tutorial'
  }),
  s({
    id: 'stalls',
    rank: 'gc',
    name: 'Stalls (Zero-G Control)',
    icon: '🛸',
    difficulty: 5,
    division: 'Grand Champion III',
    short: 'Cancel your rotation in mid-air to hover the car for control.',
    steps: [
      'While flipping/spinning, press the opposite air roll to cancel the rotation.',
      'The car "stalls" — momentarily frozen in orientation, hovering.',
      'Use the stall to wait for the ball or set up a flick from an odd angle.',
      'Combine left + right air roll inputs to hold the stall steady.',
      'Practice stalling at the apex of a jump in free-play.'
    ],
    tips: [
      'Stalls are the foundation of breezi flicks, stall flicks, and many freestyles.',
      'Holding both air roll directions is the classic stall trick.'
    ],
    searchQuery: 'rocket league stall tutorial how to'
  }),
  s({
    id: 'fakes-mindgames',
    rank: 'gc',
    name: 'Fakes & Mind Games',
    icon: '🎭',
    difficulty: 4,
    division: 'Grand Champion III',
    short: 'Beat opponents with the touch they don\'t expect, not just mechanics.',
    steps: [
      'Dummy the ball: drive at it as if to hit, then let it roll to a teammate.',
      'Fake a challenge to bait the attacker\'s flick, then take the ball cleanly.',
      'Vary your shot timing so keepers can\'t pre-jump your patterns.',
      'Use body language (car angle) to suggest one play and do another.',
      'Read opponents\' habits and exploit them.'
    ],
    tips: [
      'At GC, everyone is mechanical — deception is the new edge.',
      'A well-timed dummy is more effective than the hardest shot.'
    ],
    searchQuery: 'rocket league fakes dummies mind games tutorial'
  }),

  // ───────────────────────────── SUPERSONIC LEGEND ─────────────────────────────
  s({
    id: 'flip-reset-double-tap',
    rank: 'ssl',
    name: 'Flip Reset Double Tap',
    icon: '👑',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'Reset on the backboard, flip the ball, then tap the rebound in.',
    steps: [
      'Get a flip reset off a ball heading toward the backboard.',
      'Use the reset flip to send the ball into the backboard, controlled.',
      'Follow the rebound and tap it into the net with your remaining momentum.',
      'Chain reset → backboard → finish in one fluid motion.',
      'This requires elite air control and reads — expect a long grind.'
    ],
    tips: [
      'One of the most iconic SSL-level scores in the game.',
      'Master flip resets and double taps separately before combining them.'
    ],
    searchQuery: 'rocket league flip reset double tap tutorial'
  }),
  s({
    id: 'musty-double-tap',
    rank: 'ssl',
    name: 'Musty Double Tap',
    icon: '🐄',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'Use a musty-style motion to double tap the ball off the backboard.',
    steps: [
      'Approach the backboard ball and set up the musty lean-back position.',
      'Snap the ball into the backboard with the upward musty motion.',
      'Recover and follow the rebound into the air.',
      'Tap it down into the net before it drops.',
      'Demands flawless timing of both the musty and the rebound read.'
    ],
    tips: [
      'A flashy, high-difficulty finish reserved for the very top players.',
      'If your musty flick and double tap aren\'t automatic, build those first.'
    ],
    searchQuery: 'rocket league musty double tap tutorial'
  }),
  s({
    id: 'psycho',
    rank: 'ssl',
    name: 'The Psycho',
    icon: '🤯',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'A flip-reset musty hybrid — touch the ball, lean, and snap an unreadable flick.',
    steps: [
      'Get a flip reset under the ball in the air.',
      'Lean the car back (musty-style) while keeping the ball cradled with the reset touch.',
      'Snap forward out of the lean, flicking the ball with the regained flip.',
      'The motion combines reset + musty for a wildly deceptive shot.',
      'Reserve attempts for free-play until the muscle memory is solid.'
    ],
    tips: [
      'The "Psycho" is named for how impossible it looks to read.',
      'Built on flip resets, stalls, and the musty — it is a capstone mechanic.'
    ],
    searchQuery: 'rocket league psycho flick reset tutorial'
  }),
  s({
    id: 'stall-flick',
    rank: 'ssl',
    name: 'Stall Flicks',
    icon: '🪐',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'Hold the ball in a stall, then unleash an unpredictable flick.',
    steps: [
      'Catch the ball into a controlled position on your car.',
      'Stall the car (cancel rotation) under the ball to freeze the moment.',
      'Reposition the ball to your desired flick angle while stalled.',
      'Snap out of the stall to flick the ball, adding spin and speed.',
      'The pause before the flick is what makes it unreadable.'
    ],
    tips: [
      'Breezi and stall flicks share DNA — learn the stall cold first.',
      'The longer you can hold a clean stall, the more options you create.'
    ],
    searchQuery: 'rocket league stall flick tutorial'
  }),
  s({
    id: 'adfr',
    rank: 'ssl',
    name: 'Air Dribble Flip Reset (ADFR)',
    icon: '🌌',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'Carry an air dribble, grab a reset off the ball, then finish — all in one flow.',
    steps: [
      'Begin a controlled air dribble carrying the ball through the air.',
      'Roll under the ball mid-dribble to get a four-wheel flip reset.',
      'Stabilise and reposition while keeping the dribble alive.',
      'Flip the ball into the net with the regained flip.',
      'One of the hardest single mechanics in the game — expect months of practice.'
    ],
    tips: [
      'ADFR demands elite air dribbling AND elite resets simultaneously.',
      'Pros use this as a flex finish — chase it only after the basics are flawless.'
    ],
    searchQuery: 'rocket league air dribble flip reset ADFR tutorial'
  }),
  s({
    id: 'speed-pinch',
    rank: 'ssl',
    name: 'Pinch Flicks & Speed Pinches',
    icon: '⚙️',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'Combine pinch reads with flicks for instant, max-speed finishes.',
    steps: [
      'Read pinch opportunities from dribbles, walls, and corners in live play.',
      'Execute the pinch angle perfectly to fire the ball at top speed.',
      'Layer a flick or redirect onto the pinch for placement.',
      'Use these as surprise finishes when defenders expect a normal play.',
      'Built entirely on rep-grinded pinch consistency.'
    ],
    tips: [
      'Pinch shots are the fastest in the game — pair with deception for goals.',
      'The angle window is razor-thin; only thousands of reps make it reliable.'
    ],
    searchQuery: 'rocket league speed pinch flick tutorial'
  }),
  s({
    id: 'double-flip-reset',
    rank: 'ssl',
    name: 'Double Flip Reset',
    icon: '♾️',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'Earn two flip resets in a single air play before finishing.',
    steps: [
      'Get a first clean flip reset under the ball.',
      'Instead of immediately finishing, reposition for a second four-wheel touch.',
      'Secure the second reset, regaining your flip again.',
      'Finish with a powered flip into the net.',
      'A true showpiece mechanic — extremely demanding on control and reads.'
    ],
    tips: [
      'If a single reset isn\'t second nature, a double is out of reach.',
      'Mostly a freestyle/flex mechanic, but devastating when landed in a match.'
    ],
    searchQuery: 'rocket league double flip reset tutorial'
  }),
  s({
    id: 'freestyle-chaining',
    rank: 'ssl',
    name: 'Mechanical Chaining',
    icon: '🔗',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'Link mechanics together fluidly — reset into stall into flick, etc.',
    steps: [
      'Treat each mechanic as a building block, not an endpoint.',
      'Practice transitioning between control states: dribble → air dribble → reset → flick.',
      'Keep boost and orientation managed so each link flows into the next.',
      'Build combos slowly in free-play, then speed them up.',
      'Develop a personal "flow" of mechanics you can deploy under pressure.'
    ],
    tips: [
      'Chaining is what makes SSL freestyles look superhuman.',
      'Smoothness comes from never letting the car lose control between links.'
    ],
    searchQuery: 'rocket league mechanical chaining freestyle combo tutorial'
  }),
  s({
    id: 'ssl-game-iq',
    rank: 'ssl',
    name: 'Top-Level Game IQ',
    icon: '🧠',
    difficulty: 5,
    division: 'Supersonic Legend',
    short: 'The real SSL skill: seeing the play before it happens.',
    steps: [
      'Read the entire field — your car, both opponents, the ball, and all boost.',
      'Anticipate where the ball and players will be in 2-3 seconds, not just now.',
      'Rotate perfectly: always have a man back, always refuel, never double-commit.',
      'Pick the highest-value play, not the flashiest — sometimes a simple pass wins.',
      'Stay composed under pressure and exploit opponents\' tendencies.'
    ],
    tips: [
      'At the very top, decision-making beats raw mechanics. Both must be elite.',
      'Watch pro replays and your own from the keeper\'s view to train your reads.'
    ],
    searchQuery: 'rocket league game sense decision making pro tutorial'
  })
];

// Total skill count, handy for progress math on the client.
export const TOTAL_SKILLS = SKILLS.length;
