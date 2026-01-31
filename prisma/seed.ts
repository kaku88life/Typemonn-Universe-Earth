import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LOCATIONS = [
    // ==================== JAPAN ====================
    {
        name: 'Fuyuki City (冬木市)',
        description: 'The stage of the Holy Grail War. A seaside city with a long history of magical rituals.',
        coordinates: { lat: 34.68, lng: 135.18 },
        type: 'City',
        world_lines: ['Fate', 'UBW', 'HF', 'Zero', 'GrandOrder'],
        year_start: 1990,
        year_end: 2004
    },
    {
        name: 'Misaki Town (三咲市)',
        description: 'Setting of Tsukihime and Mahoutsukai no Yoru. Home to the Tohno Mansion and Aoko Aozaki.',
        coordinates: { lat: 35.68, lng: 139.76 },
        type: 'City',
        world_lines: ['Tsukihime', 'Mahoyo'],
        year_start: 1980,
        year_end: 9999
    },
    {
        name: 'Mifune City (觀布子市)',
        description: 'Setting of Kara no Kyoukai. A city where the boundary between normal and abnormal is thin.',
        coordinates: { lat: 35.65, lng: 139.50 },
        type: 'City',
        world_lines: ['KaraNoKyoukai'],
        year_start: 1998,
        year_end: 9999
    },
    {
        name: 'Tohno Mansion (遠野邸)',
        description: 'Ancient mansion of the Tohno family. Shiki Tohno returns here after 8 years.',
        coordinates: { lat: 35.69, lng: 139.77 },
        type: 'Landmark',
        world_lines: ['Tsukihime'],
        year_start: 1800,
        year_end: 9999
    },
    {
        name: 'Einzbern Castle Japan (アインツベルン城)',
        description: 'The Einzbern family\'s castle in the forests outside Fuyuki. Base of operations during the Grail War.',
        coordinates: { lat: 34.72, lng: 135.10 },
        type: 'Landmark',
        world_lines: ['Fate', 'Zero'],
        year_start: 1900,
        year_end: 2004
    },
    {
        name: 'Ryuudou Temple (柳洞寺)',
        description: 'Buddhist temple atop a mountain in Fuyuki. One of the ley line convergence points.',
        coordinates: { lat: 34.70, lng: 135.20 },
        type: 'Landmark',
        world_lines: ['Fate', 'UBW', 'HF'],
        year_start: 800,
        year_end: 2004
    },
    {
        name: 'Homurahara Academy (穂群原学園)',
        description: 'High school attended by Shirou, Rin, and Sakura in Fuyuki City.',
        coordinates: { lat: 34.69, lng: 135.17 },
        type: 'Landmark',
        world_lines: ['Fate', 'UBW', 'HF'],
        year_start: 1960,
        year_end: 2004
    },
    {
        name: 'Ogawa Apartment (小川マンション)',
        description: 'The haunted apartment building in Mifune City. Site of supernatural incidents.',
        coordinates: { lat: 35.64, lng: 139.51 },
        type: 'Landmark',
        world_lines: ['KaraNoKyoukai'],
        year_start: 1995,
        year_end: 1999
    },
    {
        name: 'Garan no Dou (伽藍の堂)',
        description: 'Touko Aozaki\'s puppet workshop. Base of operations for the protagonists in KnK.',
        coordinates: { lat: 35.66, lng: 139.52 },
        type: 'Organization',
        world_lines: ['KaraNoKyoukai'],
        year_start: 1995,
        year_end: 9999
    },
    // ==================== EUROPE ====================
    {
        name: 'Clock Tower (時鐘塔)',
        description: 'Headquarters of the Mages Association. Located beneath the British Museum in London.',
        coordinates: { lat: 51.52, lng: -0.13 },
        type: 'MagicAssociation',
        world_lines: ['Fate', 'UBW', 'HF', 'Zero', 'GrandOrder', 'Tsukihime'],
        year_start: 1800,
        year_end: 9999
    },
    {
        name: 'Spirit Tomb Albion (靈墓阿爾比昂)',
        description: 'A massive underground labyrinth beneath the Clock Tower, the corpse of a Dragon.',
        coordinates: { lat: 51.50, lng: -0.12, alt: -0.1 },
        type: 'Landmark',
        world_lines: ['Fate', 'GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    {
        name: 'Einzbern Castle Germany (アインツベルン城)',
        description: 'The main castle of the Einzbern family in the German mountains.',
        coordinates: { lat: 47.50, lng: 11.00 },
        type: 'Landmark',
        world_lines: ['Fate', 'Zero'],
        year_start: 1000,
        year_end: 9999
    },
    {
        name: 'Camelot (卡美洛)',
        description: 'The legendary castle of King Arthur. Its location is spiritually linked to Tintagel.',
        coordinates: { lat: 50.66, lng: -4.75 },
        type: 'Landmark',
        world_lines: ['Fate', 'GrandOrder'],
        year_start: 500,
        year_end: 537
    },
    {
        name: 'Avalon (阿瓦隆)',
        description: 'The utopia where King Arthur rests. A place beyond the world, connected to the Reverse Side.',
        coordinates: { lat: 51.14, lng: -2.70 },
        type: 'ReverseSide',
        world_lines: ['Fate', 'GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    {
        name: 'Orleans (奧爾良)',
        description: 'The city where Jeanne d\'Arc was imprisoned. Site of FGO First Singularity.',
        coordinates: { lat: 47.90, lng: 1.90 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: 1431,
        year_end: 1431
    },
    {
        name: 'Rome (羅馬)',
        description: 'Eternal City. Capital of the Roman Empire. Site of FGO Second Singularity.',
        coordinates: { lat: 41.90, lng: 12.50 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: -753,
        year_end: 9999
    },
    {
        name: 'London 1888 (倫敦 1888)',
        description: 'Victorian London during the Jack the Ripper murders. FGO Fourth Singularity.',
        coordinates: { lat: 51.51, lng: -0.10 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: 1888,
        year_end: 1888
    },
    // ==================== MIDDLE EAST ====================
    {
        name: 'Uruk (烏魯克)',
        description: 'The first city of humanity. Ruled by King Gilgamesh. FGO Seventh Singularity.',
        coordinates: { lat: 31.32, lng: 45.64 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: -2600,
        year_end: -2600
    },
    {
        name: 'Babylon (巴比倫)',
        description: 'Ancient Mesopotamian city. Site of the Hanging Gardens.',
        coordinates: { lat: 32.54, lng: 44.42 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: -1894,
        year_end: -539
    },
    {
        name: 'Jerusalem (耶路撒冷)',
        description: 'Holy city contested in the Crusades. Site of FGO Sixth Singularity.',
        coordinates: { lat: 31.77, lng: 35.22 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: -1000,
        year_end: 9999
    },
    {
        name: 'Fuyuki (1945) - Holy Grail War Site',
        description: 'The site of the Third Holy Grail War during WWII. Origin of Angra Mainyu corruption.',
        coordinates: { lat: 34.67, lng: 135.19 },
        type: 'Landmark',
        world_lines: ['Fate', 'Zero'],
        year_start: 1945,
        year_end: 1945
    },
    // ==================== AMERICAS ====================
    {
        name: 'E Pluribus Unum (北米神話大戦)',
        description: 'American Civil War era. FGO Fifth Singularity featuring Celtic and American heroes.',
        coordinates: { lat: 38.89, lng: -77.03 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: 1783,
        year_end: 1783
    },
    {
        name: 'Agartha (アガルタ)',
        description: 'Underground hollow earth. FGO Epic of Remnant II.',
        coordinates: { lat: 0.00, lng: 0.00, alt: -0.5 },
        type: 'ReverseSide',
        world_lines: ['GrandOrder'],
        year_start: 2000,
        year_end: 2000
    },
    {
        name: 'Salem (セイレム)',
        description: 'Salem, Massachusetts during the witch trials. FGO Epic of Remnant IV.',
        coordinates: { lat: 42.52, lng: -70.90 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: 1692,
        year_end: 1693
    },
    // ==================== ATLANTIC / LOSTBELTS ====================
    {
        name: 'Lostbelt 1: Permafrost Empire (永久凍土帝国)',
        description: 'Russia 1570. Ivan the Terrible\'s frozen world.',
        coordinates: { lat: 55.75, lng: 37.62 },
        type: 'Lostbelt',
        world_lines: ['GrandOrder'],
        year_start: -1000,
        year_end: 2018
    },
    {
        name: 'Lostbelt 2: Eternal Ice Flame (無間氷焔世紀)',
        description: 'Norse mythology world ruled by Skadi.',
        coordinates: { lat: 64.00, lng: -21.00 },
        type: 'Lostbelt',
        world_lines: ['GrandOrder'],
        year_start: -1000,
        year_end: 2018
    },
    {
        name: 'Lostbelt 3: Synchronized Intellect Nation (人智統合真国)',
        description: 'China under the rule of Qin Shi Huang.',
        coordinates: { lat: 34.27, lng: 108.95 },
        type: 'Lostbelt',
        world_lines: ['GrandOrder'],
        year_start: -210,
        year_end: 2018
    },
    {
        name: 'Lostbelt 4: Saṃsāra of Genesis and Terminus (創世滅亡輪廻)',
        description: 'Indian Lostbelt ruled by the god Arjuna.',
        coordinates: { lat: 20.59, lng: 78.96 },
        type: 'Lostbelt',
        world_lines: ['GrandOrder'],
        year_start: -3000,
        year_end: 2018
    },
    {
        name: 'Lostbelt 5: Ocean in the Age of Titans (神代巨神海洋)',
        description: 'Greek mythology world dominated by Olympus.',
        coordinates: { lat: 37.97, lng: 23.73 },
        type: 'Lostbelt',
        world_lines: ['GrandOrder'],
        year_start: -1200,
        year_end: 2018
    },
    {
        name: 'Lostbelt 6: Fairy Britain (妖精円卓領域)',
        description: 'Alternate Britain where fairies rule instead of humans.',
        coordinates: { lat: 51.50, lng: -0.10 },
        type: 'Lostbelt',
        world_lines: ['GrandOrder'],
        year_start: 500,
        year_end: 2018
    },
    {
        name: 'Lostbelt 7: Golden Sea of Trees (黄金樹海紀行)',
        description: 'South American Lostbelt. Realm of ORT.',
        coordinates: { lat: -3.47, lng: -62.22 },
        type: 'Lostbelt',
        world_lines: ['GrandOrder'],
        year_start: -10000,
        year_end: 2018
    },
    // ==================== MAGES ASSOCIATION ====================
    {
        name: 'Atlas Institute (阿特拉斯院)',
        description: 'One of the three major branches of the Mages Association. Alchemists of Egypt.',
        coordinates: { lat: 30.00, lng: 30.00 },
        type: 'MagicAssociation',
        world_lines: ['MeltyBlood', 'GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    {
        name: 'Wandering Sea (彷徨海)',
        description: 'One of the three major branches. A moving mountain range floating in northern seas.',
        coordinates: { lat: 65.00, lng: 0.00 },
        type: 'MagicAssociation',
        world_lines: ['GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    // ==================== SPECIAL LOCATIONS ====================
    {
        name: 'Chaldea (迦勒底)',
        description: 'Organization for the Preservation of Human Order. 6000m altitude in Antarctica.',
        coordinates: { lat: -82.86, lng: 135.00, alt: 1.5 },
        type: 'Organization',
        world_lines: ['GrandOrder'],
        year_start: 2015,
        year_end: 9999
    },
    {
        name: 'Moon Cell (ムーンセル)',
        description: 'A massive photonic computer on the Moon. Stage of the Moon Holy Grail War.',
        coordinates: { lat: 0.00, lng: 0.00, alt: 10.0 },
        type: 'ReverseSide',
        world_lines: ['Extra'],
        year_start: -4500000000,
        year_end: 9999
    },
    {
        name: 'SE.RA.PH',
        description: 'A virtual reality within the Moon Cell where the Holy Grail War takes place.',
        coordinates: { lat: 0.00, lng: 0.00, alt: 10.0 },
        type: 'ReverseSide',
        world_lines: ['Extra', 'GrandOrder'],
        year_start: 2030,
        year_end: 2030
    },
    {
        name: 'The Root (根源)',
        description: 'The origin of all things and the goal of all mages. Outside of reality itself.',
        coordinates: { lat: 0.00, lng: 0.00, alt: 100.0 },
        type: 'ReverseSide',
        world_lines: ['Fate', 'Tsukihime', 'KaraNoKyoukai', 'Mahoyo'],
        year_start: -9999999,
        year_end: 9999999
    },
    {
        name: 'Reverse Side of the World (世界の裏側)',
        description: 'The realm where Phantasmal Species retreated from human civilization.',
        coordinates: { lat: 0.00, lng: 180.00 },
        type: 'ReverseSide',
        world_lines: ['Fate', 'Tsukihime', 'GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    {
        name: 'Shinjuku (新宿)',
        description: 'Tokyo\'s largest entertainment district. FGO Epic of Remnant I.',
        coordinates: { lat: 35.69, lng: 139.70 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: 1999,
        year_end: 1999
    },
    {
        name: 'Shimousa (下総国)',
        description: 'Edo period Japan with Heroic Spirit swordsmen. FGO Epic of Remnant III.',
        coordinates: { lat: 35.77, lng: 140.32 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: 1639,
        year_end: 1639
    },
    {
        name: 'Okeanos (オケアノス)',
        description: 'Age of Exploration seas. Drake, Blackbeard, and pirate Servants. FGO Third Singularity.',
        coordinates: { lat: 25.00, lng: -71.00 },
        type: 'Landmark',
        world_lines: ['GrandOrder'],
        year_start: 1573,
        year_end: 1573
    },
    {
        name: 'Troy (トロイア)',
        description: 'The legendary city besieged by Greek heroes. Home of Hector and Paris.',
        coordinates: { lat: 39.96, lng: 26.24 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: -1200,
        year_end: -1180
    },
    {
        name: 'Egypt - Age of Gods (エジプト神代)',
        description: 'Ancient Egypt during the time of Ozymandias and Nitocris.',
        coordinates: { lat: 25.69, lng: 32.64 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: -1300,
        year_end: -1200
    }
]


async function main() {
    console.log(`Start seeding ...`)
    for (const loc of LOCATIONS) {
        const location = await prisma.location.create({
            data: loc,
        })
        console.log(`Created location with id: ${location.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
