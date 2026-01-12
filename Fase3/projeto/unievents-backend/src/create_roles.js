require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createRoles() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // 1. Create Admin
        const adminEmail = "admin@unievents.pt";
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash("admin123", 10);
            admin = await User.create({
                name: "Administrador",
                email: adminEmail,
                password: hashedPassword,
                type: "admin",
                photo: "",
                validated: true
            });
            console.log("✅ Admin user created: admin@unievents.pt / admin123");
        } else {
            console.log("ℹ️ Admin user already exists.");
        }

        // 2. Create Organizer
        const orgEmail = "organizer@unievents.pt";
        let org = await User.findOne({ email: orgEmail });

        if (!org) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash("organizer123", 10);
            org = await User.create({
                name: "Organizador Eventos",
                email: orgEmail,
                password: hashedPassword,
                type: "organizer",
                photo: "",
                validated: true
            });
            console.log("✅ Organizer user created: organizer@unievents.pt / organizer123");
        } else {
            console.log("ℹ️ Organizer user already exists.");
        }

        process.exit(0);

    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

createRoles();
