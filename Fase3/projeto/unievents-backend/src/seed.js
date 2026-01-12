require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');

const events = [
    {
        title: "Torneio de Futsal Inter-Cursos",
        titleEn: "Inter-Course Futsal Tournament",
        description: "Vem apoiar o teu curso no maior torneio de futsal do ano! Prémios para os 3 primeiros classificados.",
        descriptionEn: "Come support your course in the biggest futsal tournament of the year! Prizes for the top 3 teams.",
        date: new Date(Date.now() + 86400000 * 5), // +5 days
        location: "Pavilhão Desportivo IPVC",
        category: "Desporto",
        price: 0,
        isFree: true,
        image: "https://images.unsplash.com/photo-1518605348400-437731df48d6?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Workshop de Fotografia Digital",
        titleEn: "Digital Photography Workshop",
        description: "Aprende os básicos da fotografia, edição e composição com profissionais da área. Equipamento não incluído.",
        descriptionEn: "Learn the basics of photography, editing and composition with professionals. Equipment not included.",
        date: new Date(Date.now() + 86400000 * 2), // +2 days
        location: "ESA - Sala 12",
        category: "Cultura",
        price: 15,
        isFree: false,
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Hackathon IPVC 2026",
        titleEn: "IPVC Hackathon 2026",
        description: "48 horas de código, inovação e café! Junta-te a nós para desenvolver soluções para cidades inteligentes.",
        descriptionEn: "48 hours of code, innovation and coffee! Join us to develop solutions for smart cities.",
        date: new Date(Date.now() + 86400000 * 10), // +10 days
        location: "ESTG - Biblioteca",
        category: "Academico",
        price: 5,
        isFree: false,
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855463?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Concerto de Abertura do Ano",
        titleEn: "Year Opening Concert",
        description: "Celebra o início do ano letivo com as melhores tunas e bandas da região.",
        descriptionEn: "Celebrate the start of the academic year with the best acoustic groups and bands in the region.",
        date: new Date(Date.now() - 86400000 * 2), // -2 days (PAST)
        location: "Centro Cultural de Viana",
        category: "Cultura",
        price: 8,
        isFree: false,
        image: "https://images.unsplash.com/photo-1459749411177-0473ef48ee5f?q=80&w=2670&auto=format&fit=crop",
        goingCount: 124 // Fake stats for past event
    },
    {
        title: "Aula Aberta de Yoga",
        titleEn: "Open Yoga Class",
        description: "Relaxa e recarrega energias antes dos exames. Traz o teu tapete!",
        descriptionEn: "Relax and recharge before exams. Bring your mat!",
        date: new Date(Date.now() + 86400000 * 1), // +1 day
        location: "Jardins da ESE",
        category: "Desporto",
        price: 0,
        isFree: true,
        image: "https://images.unsplash.com/photo-1544367563-12123d8966bf?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Seminário: Futuro da IA",
        titleEn: "Seminar: Future of AI",
        description: "Palestra com convidados da Google e Microsoft sobre o impacto da IA na sociedade.",
        descriptionEn: "Lecture with guests from Google and Microsoft about the impact of AI on society.",
        date: new Date(Date.now() - 86400000 * 10), // -10 days (PAST)
        location: "Auditório Lima de Carvalho",
        category: "Academico",
        price: 0,
        isFree: true,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2670&auto=format&fit=crop",
        goingCount: 89
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // Find an organizer or admin
        let organizer = await User.findOne({ type: { $in: ['organizer', 'admin'] } });

        if (!organizer) {
            console.log('No organizer found. Finding ANY user...');
            organizer = await User.findOne({});
        }

        if (!organizer) {
            console.log('No users found. Creating a temporary organizer...');
            const hashedPassword = await require('bcrypt').hash('123456', 10);
            organizer = await User.create({
                name: "IPVC Events",
                email: "events@ipvc.pt",
                password: hashedPassword,
                type: "organizer",
                validated: true,
                photo: ""
            });
        }

        console.log(`Using user: ${organizer.name} (${organizer._id})`);

        console.log('Deleting old events...');
        await Event.deleteMany({});

        console.log('Inserting new events...');
        const eventsWithUser = events.map(e => ({ ...e, organizerId: organizer._id }));
        await Event.insertMany(eventsWithUser);

        console.log('Seed completed successfully! 🌱');
        process.exit(0);

    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();
