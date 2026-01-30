import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LOCATIONS = [
    {
        name: 'Fuyuki City (冬木市)',
        description: 'The stage of the Holy Grail War. A seaside city with a long history of magical rituals.',
        coordinates: { lat: 34.68, lng: 135.18 },
        type: 'City',
        world_lines: ['Fate', 'UBW', 'HF', 'Zero'],
        year_start: 1990,
        year_end: 2004
    },
    {
        name: 'Clock Tower (時鐘塔)',
        description: 'Headquarters of the Mages Association. Located beneath the British Museum in London.',
        coordinates: { lat: 51.50, lng: -0.12 },
        type: 'MagicAssociation',
        world_lines: ['Fate', 'UBW', 'HF', 'Zero', 'GrandOrder', 'Tsukihime'],
        year_start: 1800,
        year_end: 9999
    },
    {
        name: 'Spirit Tomb Albion (靈墓阿爾比昂)',
        description: 'A massive underground labyrinth beneath the Clock Tower, the corpse of a Dragon that failed to reach the Reverse Side.',
        coordinates: { lat: 51.50, lng: -0.12, alt: -0.1 },
        type: 'Landmark',
        world_lines: ['Fate', 'GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    {
        name: 'Chaldea (迦勒底)',
        description: 'Organization for the Preservation of Human Order. Located 6000 meters above sea level in Antarctica.',
        coordinates: { lat: -82.86, lng: 135.00, alt: 1.5 },
        type: 'Organization',
        world_lines: ['GrandOrder'],
        year_start: 2015,
        year_end: 9999
    },
    {
        name: 'Misaki Town (三咲市)',
        description: 'Setting of Mahoutsukai no Yoru and Tsukihime. A city with a deep connection to the root.',
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
        name: 'Atlas Institute (阿特拉斯院)',
        description: 'One of the three major branches of the Mages Association. Located in the Atlas Mountains of Egypt.',
        coordinates: { lat: 30.00, lng: 30.00 },
        type: 'MagicAssociation',
        world_lines: ['MeltyBlood', 'GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    {
        name: 'Wandering Sea (徬徨海)',
        description: 'One of the three major branches. A moving mountain range floating in the Northern European seas.',
        coordinates: { lat: 65.00, lng: 0.00 },
        type: 'MagicAssociation',
        world_lines: ['GrandOrder'],
        year_start: 0,
        year_end: 9999
    },
    {
        name: 'Uruk (烏魯克)',
        description: 'The first city of humanity. Ruled by the King of Heroes, Gilgamesh.',
        coordinates: { lat: 31.32, lng: 45.64 },
        type: 'City',
        world_lines: ['GrandOrder'],
        year_start: -2600,
        year_end: -2600
    },
    {
        name: 'Camelot (卡美洛)',
        description: 'The legendary castle of King Arthur. Its location is spiritually linked to Tintagel.',
        coordinates: { lat: 50.66, lng: -4.75 },
        type: 'Landmark',
        world_lines: ['Fate', 'GrandOrder'],
        year_start: 500,
        year_end: 500
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
