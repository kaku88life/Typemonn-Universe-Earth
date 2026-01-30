-- Create Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  coordinates JSONB NOT NULL, -- Format: { "lat": number, "lng": number, "alt": number }
  type TEXT NOT NULL, -- 'City', 'MagicAssociation', 'Organization', 'Landmark'
  world_lines TEXT[] DEFAULT '{}', -- ['Fate', 'UBW', 'HF', 'Zero', 'GrandOrder', 'Tsukihime']
  year_start INTEGER,
  year_end INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create Policy: Allow public read access
CREATE POLICY "Public locations are viewable by everyone" 
ON locations FOR SELECT 
TO anon
USING (true);

-- Seed Data (The Akashic Records)
INSERT INTO locations (name, description, coordinates, type, world_lines, year_start, year_end)
VALUES
  (
    'Fuyuki City (冬木市)', 
    'The stage of the Holy Grail War. A seaside city with a long history of magical rituals.', 
    '{"lat": 34.68, "lng": 135.18}', 
    'City', 
    ARRAY['Fate', 'UBW', 'HF', 'Zero'], 
    1990, 
    2004
  ),
  (
    'Clock Tower (時鐘塔)', 
    'Headquarters of the Mages Association. Located beneath the British Museum in London.', 
    '{"lat": 51.50, "lng": -0.12}', 
    'MagicAssociation', 
    ARRAY['Fate', 'UBW', 'HF', 'Zero', 'GrandOrder', 'Tsukihime'], 
    1800, 
    NULL
  ),
  (
    'Spirit Tomb Albion (靈墓阿爾比昂)', 
    'A massive underground labyrinth beneath the Clock Tower, the corpse of a Dragon that failed to reach the Reverse Side.', 
    '{"lat": 51.50, "lng": -0.12, "alt": -0.1}', 
    'Landmark', 
    ARRAY['Fate', 'GrandOrder'], 
    0, 
    NULL
  ),
  (
    'Chaldea (迦勒底)', 
    'Organization for the Preservation of Human Order. Located 6000 meters above sea level in Antarctica.', 
    '{"lat": -82.86, "lng": 135.00, "alt": 1.5}', 
    'Organization', 
    ARRAY['GrandOrder'], 
    2015, 
    NULL
  ),
  (
    'Misaki Town (三咲市)', 
    'Setting of Mahoutsukai no Yoru and Tsukihime. A city with a deep connection to the root.', 
    '{"lat": 35.68, "lng": 139.76}', 
    'City', 
    ARRAY['Tsukihime', 'Mahoyo'], 
    1980, 
    NULL
  ),
  (
    'Mifune City (觀布子市)', 
    'Setting of Kara no Kyoukai. A city where the boundary between normal and abnormal is thin.', 
    '{"lat": 35.65, "lng": 139.50}', 
    'City', 
    ARRAY['KaraNoKyoukai'], 
    1998, 
    NULL
  ),
  (
    'Atlas Institute (阿特拉斯院)', 
    'One of the three major branches of the Mages Association. Located in the Atlas Mountains of Egypt.', 
    '{"lat": 30.00, "lng": 30.00}', 
    'MagicAssociation', 
    ARRAY['MeltyBlood', 'GrandOrder'], 
    0, 
    NULL
  ),
  (
    'Wandering Sea (徬徨海)', 
    'One of the three major branches. A moving mountain range floating in the Northern European seas.', 
    '{"lat": 65.00, "lng": 0.00}', 
    'MagicAssociation', 
    ARRAY['GrandOrder'], 
    0, 
    NULL
  ),
  (
    'Uruk (烏魯克)', 
    'The first city of humanity. Ruled by the King of Heroes, Gilgamesh.', 
    '{"lat": 31.32, "lng": 45.64}', 
    'City', 
    ARRAY['GrandOrder'], 
    -2600, 
    -2600
  ),
  (
    'Camelot (卡美洛)', 
    'The legendary castle of King Arthur. Its location is spiritually linked to Tintagel.', 
    '{"lat": 50.66, "lng": -4.75}', 
    'Landmark', 
    ARRAY['Fate', 'GrandOrder'], 
    500, 
    500
  );
