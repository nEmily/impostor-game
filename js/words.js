/* words.js — Word lists with categories and impostor hints */

var Words = (function () {
  'use strict';

  const data = {
    food: {
      name: 'Food & Drinks',
      words: [
        { word: 'Pizza', hint: 'Slice' },
        { word: 'Sushi', hint: 'Delicate' },
        { word: 'Hamburger', hint: 'Classic' },
        { word: 'Taco', hint: 'Tuesday' },
        { word: 'Pasta', hint: 'Twirl' },
        { word: 'Chocolate', hint: 'Tempting' },
        { word: 'Ice Cream', hint: 'Scoop' },
        { word: 'Pancake', hint: 'Flat' },
        { word: 'Sandwich', hint: 'Packed' },
        { word: 'Steak', hint: 'Rare' },
        { word: 'Salad', hint: 'Toss' },
        { word: 'Soup', hint: 'Simmer' },
        { word: 'Popcorn', hint: 'Salty' },
        { word: 'Donut', hint: 'Glaze' },
        { word: 'Waffle', hint: 'Grid' },
        { word: 'Burrito', hint: 'Foil' },
        { word: 'Cupcake', hint: 'Mini' },
        { word: 'Pretzel', hint: 'Twisted' },
        { word: 'Bacon', hint: 'Crispy' },
        { word: 'Omelette', hint: 'Fold' },
        { word: 'French Fries', hint: 'Golden' },
        { word: 'Cheesecake', hint: 'Rich' },
        { word: 'Lasagna', hint: 'Stacked' },
        { word: 'Cereal', hint: 'Morning' },
        { word: 'Croissant', hint: 'Flaky' },
        { word: 'Smoothie', hint: 'Blend' },
        { word: 'Coffee', hint: 'Bitter' },
        { word: 'Lemonade', hint: 'Stand' },
        { word: 'Milkshake', hint: 'Thick' },
        { word: 'Hot Dog', hint: 'Ballpark' },
        { word: 'Brownie', hint: 'Dense' },
        { word: 'Muffin', hint: 'Top' },
        { word: 'Curry', hint: 'Fragrant' },
        { word: 'Ramen', hint: 'Late night' },
        { word: 'Avocado', hint: 'Trendy' },
        { word: 'Honey', hint: 'Sweet' },
        { word: 'Peanut Butter', hint: 'Sticky' },
        { word: 'Nachos', hint: 'Loaded' },
        { word: 'Mango', hint: 'Juicy' },
        { word: 'Cinnamon Roll', hint: 'Spiral' },
        { word: 'Fried Rice', hint: 'Leftover' },
        { word: 'Garlic Bread', hint: 'Savory' },
        { word: 'Macaroni', hint: 'Comfort' },
        { word: 'Pumpkin Pie', hint: 'Seasonal' },
        { word: 'Cotton Candy', hint: 'Fluffy' },
        { word: 'Spaghetti', hint: 'Slurp' },
        { word: 'Grape', hint: 'Bunch' },
        { word: 'Watermelon', hint: 'Refreshing' },
        { word: 'Pickle', hint: 'Tangy' },
        { word: 'Marshmallow', hint: 'Soft' },
        { word: 'Lobster', hint: 'Fancy' },
        { word: 'Dumpling', hint: 'Pocket' },
        { word: 'Boba Tea', hint: 'Chewy' },
        { word: 'Churro', hint: 'Street' },
        { word: 'Fondue', hint: 'Sharing' },
        { word: 'Granola', hint: 'Crunchy' },
        { word: 'Hummus', hint: 'Smooth' },
        { word: 'Tiramisu', hint: 'Layered' },
        { word: 'Guacamole', hint: 'Mash' },
        { word: 'Clam Chowder', hint: 'Coastal' }
      ]
    },
    animals: {
      name: 'Animals',
      words: [
        { word: 'Dolphin', hint: 'Friendly' },
        { word: 'Elephant', hint: 'Memory' },
        { word: 'Penguin', hint: 'Waddle' },
        { word: 'Giraffe', hint: 'Tall' },
        { word: 'Lion', hint: 'Pride' },
        { word: 'Butterfly', hint: 'Fragile' },
        { word: 'Octopus', hint: 'Clever' },
        { word: 'Kangaroo', hint: 'Bounce' },
        { word: 'Parrot', hint: 'Mimic' },
        { word: 'Turtle', hint: 'Patient' },
        { word: 'Wolf', hint: 'Howl' },
        { word: 'Eagle', hint: 'National' },
        { word: 'Shark', hint: 'Feared' },
        { word: 'Panda', hint: 'Gentle' },
        { word: 'Chameleon', hint: 'Blend' },
        { word: 'Hummingbird', hint: 'Tiny' },
        { word: 'Cheetah', hint: 'Sprint' },
        { word: 'Owl', hint: 'Wise' },
        { word: 'Flamingo', hint: 'Balance' },
        { word: 'Gorilla', hint: 'Strong' },
        { word: 'Seahorse', hint: 'Drift' },
        { word: 'Koala', hint: 'Sleepy' },
        { word: 'Polar Bear', hint: 'White' },
        { word: 'Jellyfish', hint: 'Transparent' },
        { word: 'Peacock', hint: 'Display' },
        { word: 'Bat', hint: 'Nocturnal' },
        { word: 'Fox', hint: 'Sly' },
        { word: 'Hedgehog', hint: 'Curl' },
        { word: 'Whale', hint: 'Vast' },
        { word: 'Crocodile', hint: 'Ancient' },
        { word: 'Sloth', hint: 'Lazy' },
        { word: 'Frog', hint: 'Croak' },
        { word: 'Zebra', hint: 'Pattern' },
        { word: 'Hamster', hint: 'Pocket' },
        { word: 'Crab', hint: 'Sideways' },
        { word: 'Toucan', hint: 'Colorful' },
        { word: 'Scorpion', hint: 'Desert' },
        { word: 'Moose', hint: 'Northern' },
        { word: 'Squirrel', hint: 'Hoard' },
        { word: 'Pelican', hint: 'Coast' },
        { word: 'Starfish', hint: 'Regenerate' },
        { word: 'Raccoon', hint: 'Mischief' },
        { word: 'Caterpillar', hint: 'Transform' },
        { word: 'Llama', hint: 'Altitude' },
        { word: 'Porcupine', hint: 'Sharp' },
        { word: 'Armadillo', hint: 'Tough' },
        { word: 'Goldfish', hint: 'Won' },
        { word: 'Swan', hint: 'Graceful' },
        { word: 'Ladybug', hint: 'Lucky' },
        { word: 'Beaver', hint: 'Busy' },
        { word: 'Stingray', hint: 'Glide' },
        { word: 'Mongoose', hint: 'Fearless' },
        { word: 'Firefly', hint: 'Evening' },
        { word: 'Narwhal', hint: 'Mythical' },
        { word: 'Meerkat', hint: 'Alert' },
        { word: 'Axolotl', hint: 'Unusual' },
        { word: 'Iguana', hint: 'Bask' },
        { word: 'Chinchilla', hint: 'Soft' },
        { word: 'Mantis', hint: 'Still' },
        { word: 'Otter', hint: 'Playful' }
      ]
    },
    objects: {
      name: 'Everyday Objects',
      words: [
        { word: 'Umbrella', hint: 'Shelter' },
        { word: 'Backpack', hint: 'Carry' },
        { word: 'Candle', hint: 'Ambient' },
        { word: 'Mirror', hint: 'Vanity' },
        { word: 'Pillow', hint: 'Soft' },
        { word: 'Scissors', hint: 'Sharp' },
        { word: 'Wallet', hint: 'Pocket' },
        { word: 'Toothbrush', hint: 'Routine' },
        { word: 'Sunglasses', hint: 'Cool' },
        { word: 'Key', hint: 'Jingle' },
        { word: 'Clock', hint: 'Ticking' },
        { word: 'Blanket', hint: 'Cozy' },
        { word: 'Headphones', hint: 'Private' },
        { word: 'Lamp', hint: 'Beside' },
        { word: 'Calendar', hint: 'Routine' },
        { word: 'Notebook', hint: 'Blank' },
        { word: 'Stapler', hint: 'Click' },
        { word: 'Battery', hint: 'Drain' },
        { word: 'Zipper', hint: 'Stuck' },
        { word: 'Lighter', hint: 'Flick' },
        { word: 'Doorbell', hint: 'Visitor' },
        { word: 'Sponge', hint: 'Absorb' },
        { word: 'Eraser', hint: 'Mistake' },
        { word: 'Thermos', hint: 'Insulate' },
        { word: 'Compass', hint: 'Direction' },
        { word: 'Paperclip', hint: 'Bend' },
        { word: 'Broom', hint: 'Corner' },
        { word: 'Rubber Band', hint: 'Snap' },
        { word: 'Magnifying Glass', hint: 'Inspect' },
        { word: 'Whistle', hint: 'Shrill' },
        { word: 'Plunger', hint: 'Awkward' },
        { word: 'Alarm Clock', hint: 'Dreaded' },
        { word: 'Bookmark', hint: 'Place' },
        { word: 'Flashlight', hint: 'Beam' },
        { word: 'Coaster', hint: 'Ring' },
        { word: 'Tape', hint: 'Fix' },
        { word: 'Corkscrew', hint: 'Twist' },
        { word: 'Clothespin', hint: 'Clip' },
        { word: 'Ruler', hint: 'Straight' },
        { word: 'Dice', hint: 'Chance' },
        { word: 'Soap', hint: 'Slippery' },
        { word: 'Stamp', hint: 'Collect' },
        { word: 'Thimble', hint: 'Tiny' },
        { word: 'Funnel', hint: 'Narrow' },
        { word: 'Padlock', hint: 'Secure' },
        { word: 'Whisk', hint: 'Quick' },
        { word: 'Ladle', hint: 'Deep' },
        { word: 'Mop', hint: 'Damp' },
        { word: 'Pliers', hint: 'Grip' },
        { word: 'Wrench', hint: 'Torque' }
      ]
    },
    places: {
      name: 'Places',
      words: [
        { word: 'Airport', hint: 'Waiting' },
        { word: 'Beach', hint: 'Horizon' },
        { word: 'Library', hint: 'Quiet' },
        { word: 'Hospital', hint: 'Sterile' },
        { word: 'Museum', hint: 'Hushed' },
        { word: 'Restaurant', hint: 'Reserved' },
        { word: 'Gym', hint: 'Sweat' },
        { word: 'Movie Theater', hint: 'Dark' },
        { word: 'Park', hint: 'Stroll' },
        { word: 'School', hint: 'Bell' },
        { word: 'Mall', hint: 'Busy' },
        { word: 'Zoo', hint: 'Exotic' },
        { word: 'Bank', hint: 'Secure' },
        { word: 'Stadium', hint: 'Roar' },
        { word: 'Church', hint: 'Solemn' },
        { word: 'Gas Station', hint: 'Pit stop' },
        { word: 'Amusement Park', hint: 'Thrill' },
        { word: 'Farm', hint: 'Rural' },
        { word: 'Aquarium', hint: 'Glass' },
        { word: 'Casino', hint: 'Lucky' },
        { word: 'Lighthouse', hint: 'Coastal' },
        { word: 'Laundromat', hint: 'Spin' },
        { word: 'Bakery', hint: 'Warm' },
        { word: 'Cemetery', hint: 'Peaceful' },
        { word: 'Subway', hint: 'Rush' },
        { word: 'Bowling Alley', hint: 'Loud' },
        { word: 'Barbershop', hint: 'Classic' },
        { word: 'Planetarium', hint: 'Dome' },
        { word: 'Courthouse', hint: 'Formal' },
        { word: 'Spa', hint: 'Soothe' },
        { word: 'Ski Resort', hint: 'Lodge' },
        { word: 'Warehouse', hint: 'Empty' },
        { word: 'Post Office', hint: 'Queue' },
        { word: 'Campsite', hint: 'Remote' },
        { word: 'Fire Station', hint: 'Ready' },
        { word: 'Nightclub', hint: 'Pulse' },
        { word: 'Rooftop', hint: 'Skyline' },
        { word: 'Pharmacy', hint: 'Counter' },
        { word: 'Junkyard', hint: 'Forgotten' },
        { word: 'Observatory', hint: 'Above' },
        { word: 'Greenhouse', hint: 'Humid' },
        { word: 'Dock', hint: 'Weathered' },
        { word: 'Elevator', hint: 'Confined' },
        { word: 'Treehouse', hint: 'Secret' },
        { word: 'Cave', hint: 'Echo' },
        { word: 'Volcano', hint: 'Rumble' },
        { word: 'Waterfall', hint: 'Mist' },
        { word: 'Oasis', hint: 'Relief' },
        { word: 'Igloo', hint: 'Shelter' },
        { word: 'Dungeon', hint: 'Below' }
      ]
    },
    activities: {
      name: 'Activities',
      words: [
        { word: 'Camping', hint: 'Rustic' },
        { word: 'Cooking', hint: 'Mess' },
        { word: 'Dancing', hint: 'Rhythm' },
        { word: 'Painting', hint: 'Messy' },
        { word: 'Fishing', hint: 'Patient' },
        { word: 'Gardening', hint: 'Nurture' },
        { word: 'Hiking', hint: 'Summit' },
        { word: 'Yoga', hint: 'Breathe' },
        { word: 'Photography', hint: 'Frame' },
        { word: 'Ice Skating', hint: 'Glide' },
        { word: 'Horseback Riding', hint: 'Gallop' },
        { word: 'Knitting', hint: 'Loop' },
        { word: 'Scuba Diving', hint: 'Below' },
        { word: 'Bungee Jumping', hint: 'Leap' },
        { word: 'Rock Climbing', hint: 'Grip' },
        { word: 'Bird Watching', hint: 'Quiet' },
        { word: 'Whittling', hint: 'Whittle' },
        { word: 'Pottery', hint: 'Shape' },
        { word: 'Canoeing', hint: 'Drift' },
        { word: 'Juggling', hint: 'Toss' },
        { word: 'Origami', hint: 'Crease' },
        { word: 'Meditation', hint: 'Still' },
        { word: 'Sledding', hint: 'Rush' },
        { word: 'Skydiving', hint: 'Freefall' },
        { word: 'Scrapbooking', hint: 'Preserve' },
        { word: 'Trivia', hint: 'Obscure' },
        { word: 'Stargazing', hint: 'Wonder' },
        { word: 'Rollerblading', hint: 'Coast' },
        { word: 'Treasure Hunt', hint: 'Hidden' },
        { word: 'Arm Wrestling', hint: 'Contest' },
        { word: 'Trampolining', hint: 'Bounce' },
        { word: 'Volunteering', hint: 'Give' },
        { word: 'Woodworking', hint: 'Grain' },
        { word: 'Parkour', hint: 'Urban' },
        { word: 'Composting', hint: 'Cycle' },
        { word: 'Beekeeping', hint: 'Buzz' },
        { word: 'Calligraphy', hint: 'Elegant' },
        { word: 'Tai Chi', hint: 'Slow' },
        { word: 'Geocaching', hint: 'Seek' },
        { word: 'Astronomy', hint: 'Vast' }
      ]
    },
    jobs: {
      name: 'Jobs',
      words: [
        { word: 'Firefighter', hint: 'Brave' },
        { word: 'Pilot', hint: 'Altitude' },
        { word: 'Chef', hint: 'Heat' },
        { word: 'Dentist', hint: 'Dreaded' },
        { word: 'Astronaut', hint: 'Frontier' },
        { word: 'Detective', hint: 'Shadow' },
        { word: 'Lifeguard', hint: 'Watch' },
        { word: 'Journalist', hint: 'Deadline' },
        { word: 'Mechanic', hint: 'Grease' },
        { word: 'Magician', hint: 'Misdirect' },
        { word: 'Plumber', hint: 'Under' },
        { word: 'Electrician', hint: 'Current' },
        { word: 'Veterinarian', hint: 'Gentle' },
        { word: 'Carpenter', hint: 'Measure' },
        { word: 'Archaeologist', hint: 'Patience' },
        { word: 'Florist', hint: 'Arrange' },
        { word: 'Barista', hint: 'Foam' },
        { word: 'Librarian', hint: 'Shh' },
        { word: 'Surgeon', hint: 'Precise' },
        { word: 'Farmer', hint: 'Dawn' },
        { word: 'Photographer', hint: 'Moment' },
        { word: 'Taxi Driver', hint: 'Navigate' },
        { word: 'Zookeeper', hint: 'Routine' },
        { word: 'Blacksmith', hint: 'Glow' },
        { word: 'DJ', hint: 'Transition' },
        { word: 'Translator', hint: 'Bridge' },
        { word: 'Locksmith', hint: 'Trust' },
        { word: 'Sommelier', hint: 'Nose' },
        { word: 'Referee', hint: 'Neutral' },
        { word: 'Cartographer', hint: 'Detail' },
        { word: 'Beekeeper', hint: 'Calm' },
        { word: 'Auctioneer', hint: 'Fast' },
        { word: 'Stunt Double', hint: 'Risk' },
        { word: 'Midwife', hint: 'Arrival' },
        { word: 'Taxidermist', hint: 'Preserve' },
        { word: 'Jeweler', hint: 'Loupe' },
        { word: 'Tailor', hint: 'Fit' },
        { word: 'Butler', hint: 'Discreet' },
        { word: 'Gondolier', hint: 'Sing' },
        { word: 'Puppeteer', hint: 'Control' }
      ]
    },
    sports: {
      name: 'Sports',
      words: [
        { word: 'Basketball', hint: 'Dribble' },
        { word: 'Soccer', hint: 'Pitch' },
        { word: 'Tennis', hint: 'Rally' },
        { word: 'Baseball', hint: 'Inning' },
        { word: 'Swimming', hint: 'Lap' },
        { word: 'Golf', hint: 'Quiet' },
        { word: 'Hockey', hint: 'Fast' },
        { word: 'Boxing', hint: 'Corner' },
        { word: 'Volleyball', hint: 'Sand' },
        { word: 'Wrestling', hint: 'Grip' },
        { word: 'Gymnastics', hint: 'Grace' },
        { word: 'Cricket', hint: 'Patience' },
        { word: 'Rugby', hint: 'Muddy' },
        { word: 'Table Tennis', hint: 'Spin' },
        { word: 'Badminton', hint: 'Light' },
        { word: 'Polo', hint: 'Elite' },
        { word: 'Lacrosse', hint: 'Cradle' },
        { word: 'Curling', hint: 'Sweep' },
        { word: 'Rowing', hint: 'Rhythm' },
        { word: 'Archery', hint: 'Focus' },
        { word: 'Fencing', hint: 'Lunge' },
        { word: 'Softball', hint: 'Underhand' },
        { word: 'Dodgeball', hint: 'Duck' },
        { word: 'Marathon', hint: 'Endure' },
        { word: 'Surfing', hint: 'Ride' },
        { word: 'Skiing', hint: 'Carve' },
        { word: 'Snowboarding', hint: 'Edge' },
        { word: 'Kayaking', hint: 'Current' },
        { word: 'Triathlon', hint: 'Switch' },
        { word: 'Figure Skating', hint: 'Elegant' },
        { word: 'Water Polo', hint: 'Tread' },
        { word: 'Sumo', hint: 'Tradition' },
        { word: 'Javelin', hint: 'Release' },
        { word: 'High Jump', hint: 'Clear' },
        { word: 'Bobsled', hint: 'Narrow' },
        { word: 'Shot Put', hint: 'Power' },
        { word: 'Hurdles', hint: 'Stride' },
        { word: 'Darts', hint: 'Aim' },
        { word: 'Skateboarding', hint: 'Grind' },
        { word: 'Handball', hint: 'Quick' }
      ]
    },
    movies: {
      name: 'Movies & TV',
      words: [
        { word: 'Star Wars', hint: 'Saga' },
        { word: 'Harry Potter', hint: 'Wand' },
        { word: 'Jurassic Park', hint: 'Roar' },
        { word: 'The Lion King', hint: 'Circle' },
        { word: 'Finding Nemo', hint: 'Lost' },
        { word: 'Spider-Man', hint: 'Swing' },
        { word: 'Frozen', hint: 'Sister' },
        { word: 'Shrek', hint: 'Layers' },
        { word: 'Batman', hint: 'Dark' },
        { word: 'Toy Story', hint: 'Alive' },
        { word: 'The Matrix', hint: 'Choice' },
        { word: 'Titanic', hint: 'Doomed' },
        { word: 'Jaws', hint: 'Summer' },
        { word: 'Indiana Jones', hint: 'Relic' },
        { word: 'Ghostbusters', hint: 'Call' },
        { word: 'Back to the Future', hint: 'Flux' },
        { word: 'The Wizard of Oz', hint: 'Home' },
        { word: 'Aladdin', hint: 'Wish' },
        { word: 'Rocky', hint: 'Underdog' },
        { word: 'Pinocchio', hint: 'Truth' },
        { word: 'Breaking Bad', hint: 'Empire' },
        { word: 'Game of Thrones', hint: 'Power' },
        { word: 'Stranger Things', hint: 'Vanish' },
        { word: 'The Office', hint: 'Mundane' },
        { word: 'Friends', hint: 'Hangout' },
        { word: 'Squid Game', hint: 'Eliminate' },
        { word: 'The Simpsons', hint: 'Family' },
        { word: 'SpongeBob', hint: 'Absurd' },
        { word: 'Scooby-Doo', hint: 'Unmasked' },
        { word: 'Willy Wonka', hint: 'Golden' },
        { word: 'The Godfather', hint: 'Offer' },
        { word: 'E.T.', hint: 'Glow' },
        { word: 'Despicable Me', hint: 'Adopt' },
        { word: 'The Incredibles', hint: 'Hidden' },
        { word: 'Ratatouille', hint: 'Unlikely' },
        { word: 'Avatar', hint: 'World' },
        { word: 'Pokémon', hint: 'Collect' },
        { word: 'Mario', hint: 'Jump' },
        { word: 'Hunger Games', hint: 'Survive' },
        { word: 'Jumanji', hint: 'Trapped' }
      ]
    },
    countries: {
      name: 'Countries & Cities',
      words: [
        { word: 'Paris', hint: 'Romance' },
        { word: 'Tokyo', hint: 'Neon' },
        { word: 'New York', hint: 'Hustle' },
        { word: 'Egypt', hint: 'Ancient' },
        { word: 'Brazil', hint: 'Rhythm' },
        { word: 'Australia', hint: 'Vast' },
        { word: 'London', hint: 'Fog' },
        { word: 'Italy', hint: 'Charm' },
        { word: 'Hawaii', hint: 'Paradise' },
        { word: 'Mexico', hint: 'Vibrant' },
        { word: 'India', hint: 'Colorful' },
        { word: 'Canada', hint: 'Polite' },
        { word: 'China', hint: 'Scale' },
        { word: 'Jamaica', hint: 'Chill' },
        { word: 'Greece', hint: 'Cradle' },
        { word: 'Switzerland', hint: 'Neutral' },
        { word: 'Russia', hint: 'Vast' },
        { word: 'Las Vegas', hint: 'Neon' },
        { word: 'Iceland', hint: 'Contrast' },
        { word: 'Dubai', hint: 'Excess' },
        { word: 'Venice', hint: 'Sinking' },
        { word: 'Amsterdam', hint: 'Liberal' },
        { word: 'Morocco', hint: 'Spice' },
        { word: 'Thailand', hint: 'Warm' },
        { word: 'Kenya', hint: 'Wild' },
        { word: 'Norway', hint: 'Northern' },
        { word: 'Peru', hint: 'Altitude' },
        { word: 'Cuba', hint: 'Classic' },
        { word: 'Seoul', hint: 'Wave' },
        { word: 'Ireland', hint: 'Green' },
        { word: 'Hollywood', hint: 'Dream' },
        { word: 'Antarctica', hint: 'Pristine' },
        { word: 'Singapore', hint: 'Orderly' },
        { word: 'Nashville', hint: 'Twang' },
        { word: 'Bermuda', hint: 'Vanish' },
        { word: 'Monaco', hint: 'Glamour' },
        { word: 'Vatican', hint: 'Smallest' },
        { word: 'Transylvania', hint: 'Legend' },
        { word: 'Area 51', hint: 'Classified' },
        { word: 'Atlantis', hint: 'Lost' }
      ]
    },
    technology: {
      name: 'Technology',
      words: [
        { word: 'Smartphone', hint: 'Addictive' },
        { word: 'Robot', hint: 'Uncanny' },
        { word: 'Wi-Fi', hint: 'Invisible' },
        { word: 'Laptop', hint: 'Portable' },
        { word: 'GPS', hint: 'Pinpoint' },
        { word: 'Bluetooth', hint: 'Pair' },
        { word: 'Drone', hint: 'Hover' },
        { word: 'Virtual Reality', hint: 'Immersive' },
        { word: 'Selfie', hint: 'Vanity' },
        { word: 'Emoji', hint: 'Express' },
        { word: 'Hashtag', hint: 'Pound' },
        { word: 'Password', hint: 'Forget' },
        { word: 'Algorithm', hint: 'Pattern' },
        { word: 'Bitcoin', hint: 'Volatile' },
        { word: 'Podcast', hint: 'Niche' },
        { word: 'Meme', hint: 'Spread' },
        { word: 'Firewall', hint: 'Barrier' },
        { word: 'Cloud', hint: 'Abstract' },
        { word: 'Pixel', hint: 'Tiny' },
        { word: 'USB', hint: 'Wrong way' },
        { word: 'Satellite', hint: 'Distant' },
        { word: 'Hologram', hint: 'Illusion' },
        { word: 'Printer', hint: 'Jam' },
        { word: 'Microchip', hint: 'Hidden' },
        { word: 'Solar Panel', hint: 'Harvest' },
        { word: 'Webcam', hint: 'Watching' },
        { word: 'Joystick', hint: 'Retro' },
        { word: 'Hard Drive', hint: 'Spin' },
        { word: 'Router', hint: 'Blink' },
        { word: 'Touchscreen', hint: 'Smudge' },
        { word: 'Smartwatch', hint: 'Glance' },
        { word: 'QR Code', hint: 'Square' },
        { word: 'Streaming', hint: 'Buffer' },
        { word: '3D Printer', hint: 'Build' },
        { word: 'Deepfake', hint: 'Uncanny' },
        { word: 'Chatbot', hint: 'Mimic' },
        { word: 'Cybersecurity', hint: 'Shield' },
        { word: 'Fiber Optic', hint: 'Pulse' },
        { word: 'NFC', hint: 'Bump' },
        { word: 'LED', hint: 'Efficient' }
      ]
    },
    music: {
      name: 'Music',
      words: [
        { word: 'Guitar', hint: 'Strum' },
        { word: 'Piano', hint: 'Grand' },
        { word: 'Drums', hint: 'Pulse' },
        { word: 'Violin', hint: 'Weep' },
        { word: 'Trumpet', hint: 'Announce' },
        { word: 'Microphone', hint: 'Amplify' },
        { word: 'Cello', hint: 'Rich' },
        { word: 'Concert', hint: 'Live' },
        { word: 'Jazz', hint: 'Improvise' },
        { word: 'Opera', hint: 'Dramatic' },
        { word: 'Rap', hint: 'Bars' },
        { word: 'Ukulele', hint: 'Cheerful' },
        { word: 'Harmonica', hint: 'Pocket' },
        { word: 'Banjo', hint: 'Twang' },
        { word: 'Flute', hint: 'Breathy' },
        { word: 'Choir', hint: 'Together' },
        { word: 'Lullaby', hint: 'Gentle' },
        { word: 'Tambourine', hint: 'Jangle' },
        { word: 'Orchestra', hint: 'Grand' },
        { word: 'Jukebox', hint: 'Nostalgic' },
        { word: 'Vinyl', hint: 'Warm' },
        { word: 'Karaoke', hint: 'Brave' },
        { word: 'Bagpipe', hint: 'Drone' },
        { word: 'Metronome', hint: 'Steady' },
        { word: 'Encore', hint: 'Demand' },
        { word: 'Duet', hint: 'Pair' },
        { word: 'Remix', hint: 'Twist' },
        { word: 'Bassoon', hint: 'Unusual' },
        { word: 'Xylophone', hint: 'Bright' },
        { word: 'Acapella', hint: 'Pure' }
      ]
    },
    abstract: {
      name: 'Abstract / Hard',
      words: [
        { word: 'Nostalgia', hint: 'Bittersweet' },
        { word: 'Déjà Vu', hint: 'Familiar' },
        { word: 'Karma', hint: 'Return' },
        { word: 'Gravity', hint: 'Pull' },
        { word: 'Time', hint: 'Fleeting' },
        { word: 'Dream', hint: 'Vivid' },
        { word: 'Freedom', hint: 'Open' },
        { word: 'Luck', hint: 'Random' },
        { word: 'Silence', hint: 'Heavy' },
        { word: 'Shadow', hint: 'Follow' },
        { word: 'Echo', hint: 'Linger' },
        { word: 'Chaos', hint: 'Spiral' },
        { word: 'Irony', hint: 'Twist' },
        { word: 'Adrenaline', hint: 'Surge' },
        { word: 'Instinct', hint: 'Primal' },
        { word: 'Infinity', hint: 'Loop' },
        { word: 'Paradox', hint: 'Both' },
        { word: 'Illusion', hint: 'Seem' },
        { word: 'Momentum', hint: 'Rolling' },
        { word: 'Taboo', hint: 'Unspoken' },
        { word: 'Ego', hint: 'Inflate' },
        { word: 'Entropy', hint: 'Fade' },
        { word: 'Empathy', hint: 'Walk' },
        { word: 'Sarcasm', hint: 'Dry' },
        { word: 'Conscience', hint: 'Nag' },
        { word: 'Vertigo', hint: 'Edge' },
        { word: 'Wanderlust', hint: 'Restless' },
        { word: 'Serendipity', hint: 'Stumble' },
        { word: 'Euphoria', hint: 'Peak' },
        { word: 'Dread', hint: 'Creep' }
      ]
    },
    brainrot: {
      name: 'Brain Rot',
      words: [
        { word: 'Skibidi', hint: 'Absurd' },
        { word: 'Rizz', hint: 'Smooth' },
        { word: 'Gyatt', hint: 'Shook' },
        { word: 'Sigma', hint: 'Lone' },
        { word: 'Mewing', hint: 'Silent' },
        { word: 'Fanum Tax', hint: 'Grab' },
        { word: 'Ohio', hint: 'Wild' },
        { word: 'Edging', hint: 'Brink' },
        { word: 'Gooning', hint: 'Locked in' },
        { word: 'Bussin', hint: 'Fire' },
        { word: 'No Cap', hint: 'Real' },
        { word: 'Slay', hint: 'Serve' },
        { word: 'Bet', hint: 'Done' },
        { word: 'Ick', hint: 'Cringe' },
        { word: 'Simp', hint: 'Down bad' },
        { word: 'NPC', hint: 'Blank' },
        { word: 'Main Character', hint: 'Spotlight' },
        { word: 'Delulu', hint: 'Fantasy' },
        { word: 'Ate', hint: 'Left none' },
        { word: 'Snatched', hint: 'Tight' },
        { word: 'Era', hint: 'Current' },
        { word: 'Rent Free', hint: 'Stuck' },
        { word: 'Gaslighting', hint: 'Dizzy' },
        { word: 'Beige Flag', hint: 'Hmm' },
        { word: 'Understood the Assignment', hint: 'Perfect' },
        { word: 'Cheugy', hint: 'Over' },
        { word: 'Yeet', hint: 'Launch' },
        { word: 'Vibe Check', hint: 'Read' },
        { word: 'Lowkey', hint: 'Quiet' },
        { word: 'Highkey', hint: 'Loud' },
        { word: 'Caught in 4K', hint: 'Receipts' },
        { word: 'Touch Grass', hint: 'Log off' },
        { word: 'L + Ratio', hint: 'Clapped' },
        { word: 'Based', hint: 'Unapologetic' },
        { word: 'Copium', hint: 'Inhale' },
        { word: 'Aura', hint: 'Glow' },
        { word: 'Mog', hint: 'Tower' },
        { word: 'Looksmaxxing', hint: 'Level up' },
        { word: 'Oomfie', hint: 'Bestie' },
        { word: 'Bop', hint: 'Certified' },
        { word: 'Sus', hint: 'Side eye' },
        { word: 'Ghosting', hint: 'Vanish' },
        { word: 'Parasocial', hint: 'Screen' },
        { word: 'Unhinged', hint: 'Feral' },
        { word: 'Roman Empire', hint: 'Daily' }
      ]
    },
    internet: {
      name: 'Internet & Memes',
      words: [
        { word: 'Rickroll', hint: 'Classic' },
        { word: 'Doomscrolling', hint: 'Endless' },
        { word: 'Ratio', hint: 'Numbers' },
        { word: 'Cancel Culture', hint: 'Pile on' },
        { word: 'Influencer', hint: 'Sponsored' },
        { word: 'Clout', hint: 'Chase' },
        { word: 'Stan', hint: 'Devoted' },
        { word: 'FOMO', hint: 'Scroll' },
        { word: 'Catfish', hint: 'Pretend' },
        { word: 'Troll', hint: 'Stir' },
        { word: 'Clickbait', hint: 'Gotcha' },
        { word: 'Viral', hint: 'Overnight' },
        { word: 'Karen', hint: 'Demand' },
        { word: 'Florida Man', hint: 'Bizarre' },
        { word: 'Shitpost', hint: 'Random' },
        { word: 'Copypasta', hint: 'Wall' },
        { word: 'Stonks', hint: 'Up' },
        { word: 'Wojak', hint: 'Mood' },
        { word: 'Pepe', hint: 'Rare' },
        { word: 'Doge', hint: 'Much' },
        { word: 'Amogus', hint: 'Everywhere' },
        { word: 'POV', hint: 'Imagine' },
        { word: 'ASMR', hint: 'Whisper' },
        { word: 'Mukbang', hint: 'Feast' },
        { word: 'Speedrun', hint: 'Skip' },
        { word: 'Rage Bait', hint: 'Obvious' },
        { word: 'Deep Fried Meme', hint: 'Cooked' },
        { word: 'Hot Take', hint: 'Spicy' },
        { word: 'Lore', hint: 'Deep' },
        { word: 'AFK', hint: 'Gone' }
      ]
    },
    fashion: {
      name: 'Fashion & Style',
      words: [
        { word: 'Sneakers', hint: 'Drop' },
        { word: 'Hoodie', hint: 'Cozy' },
        { word: 'Windbreaker', hint: 'Layer' },
        { word: 'Denim', hint: 'Rugged' },
        { word: 'Flannel', hint: 'Cozy' },
        { word: 'Crocs', hint: 'Divisive' },
        { word: 'Tie-Dye', hint: 'Swirl' },
        { word: 'Bucket Hat', hint: 'Shade' },
        { word: 'Choker', hint: 'Snug' },
        { word: 'Fanny Pack', hint: 'Hands free' },
        { word: 'Platform Shoes', hint: 'Elevate' },
        { word: 'Beanie', hint: 'Slouch' },
        { word: 'Leather Jacket', hint: 'Edge' },
        { word: 'Overalls', hint: 'Retro' },
        { word: 'Turtleneck', hint: 'Sleek' },
        { word: 'Hawaiian Shirt', hint: 'Loud' },
        { word: 'Cargo Pants', hint: 'Utility' },
        { word: 'Uggs', hint: 'Comfort' },
        { word: 'Birkenstocks', hint: 'Earthy' },
        { word: 'Scrunchie', hint: 'Bounce' },
        { word: 'Athleisure', hint: 'Blur' },
        { word: 'Vintage', hint: 'Hunt' },
        { word: 'Corset', hint: 'Cinch' },
        { word: 'Jumpsuit', hint: 'Commit' },
        { word: 'Mom Jeans', hint: 'Relaxed' },
        { word: 'Mullet', hint: 'Daring' },
        { word: 'Man Bun', hint: 'Gather' },
        { word: 'Acrylic Nails', hint: 'Click' },
        { word: 'Face Tattoo', hint: 'Statement' },
        { word: 'Drip', hint: 'Fresh' }
      ]
    }
  };

  // Custom packs loaded from storage, keyed by "custom_<index>"
  let customPacks = {};

  function loadCustomPacks(packs) {
    customPacks = {};
    if (!packs || !packs.length) return;
    packs.forEach((pack, i) => {
      const id = 'custom_' + i;
      customPacks[id] = {
        name: pack.name,
        words: pack.words // each: { word, hint }
      };
    });
  }

  // Preferred display order (most fun/interesting first)
  const categoryOrder = [
    'brainrot', 'internet', 'movies', 'music', 'activities',
    'sports', 'food', 'animals', 'fashion', 'places',
    'countries', 'technology', 'jobs', 'objects', 'abstract'
  ];

  function getCategories() {
    const ordered = categoryOrder.filter(id => data[id]);
    // Append any categories not in the preferred order
    Object.keys(data).forEach(id => {
      if (!ordered.includes(id)) ordered.push(id);
    });
    const built = ordered.map(id => ({
      id,
      name: data[id].name,
      count: data[id].words.length,
      custom: false
    }));
    const custom = Object.keys(customPacks).map(id => ({
      id,
      name: customPacks[id].name,
      count: customPacks[id].words.length,
      custom: true
    }));
    return built.concat(custom);
  }

  function getAllData() {
    return { ...data, ...customPacks };
  }

  function getRandomWord(categoryIds, usedWords) {
    const all = getAllData();
    const pool = [];
    const ids = categoryIds && categoryIds.length > 0
      ? categoryIds
      : Object.keys(all);

    ids.forEach(id => {
      if (!all[id]) return;
      all[id].words.forEach(w => {
        pool.push({ ...w, category: all[id].name, categoryId: id });
      });
    });

    // Filter out recently used words
    const used = usedWords || [];
    let available = pool.filter(w => !used.includes(w.word));

    // If all used, reset
    if (available.length === 0) {
      available = pool;
    }

    // Pick random
    const pick = available[Math.floor(Math.random() * available.length)];
    return pick;
  }

  function getTotalWordCount() {
    const all = getAllData();
    let count = 0;
    Object.values(all).forEach(cat => { count += cat.words.length; });
    return count;
  }

  function getRandomHintFromCategory(categoryId, excludeWords) {
    var all = getAllData();
    var cat = all[categoryId];
    if (!cat) return null;
    var exclude = excludeWords || [];
    var candidates = cat.words.filter(function(w) {
      return exclude.indexOf(w.word) === -1;
    });
    if (candidates.length === 0) candidates = cat.words;
    var pick = candidates[Math.floor(Math.random() * candidates.length)];
    return pick.hint;
  }

  function getSampleWords(categoryId, excludeWord, count) {
    var all = getAllData();
    var cat = all[categoryId];
    if (!cat) return [];
    var pool = cat.words.filter(function(w) { return w.word !== excludeWord; });
    // Shuffle and take N
    var shuffled = pool.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }
    return shuffled.slice(0, count || 5).map(function(w) { return w.word; });
  }

  return { getCategories, getRandomWord, getRandomHintFromCategory, getSampleWords, getTotalWordCount, loadCustomPacks };
})();

// Node.js compat for testing
if (typeof module !== 'undefined') module.exports = Words;
