require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function resetPasswords() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const hashedPassword = await bcrypt.hash("123456", 10);

        await User.updateMany(
            { email: { $in: ["admin@unievents.pt", "organizer@unievents.pt"] } },
            { password: hashedPassword }
        );

        console.log("✅ Passwords reset to '123456' for admin and organizer.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

resetPasswords();
