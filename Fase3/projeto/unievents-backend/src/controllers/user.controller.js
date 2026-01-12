const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        // Admin only
        if (req.user.type !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.banUser = async (req, res) => {
    try {
        // Admin only
        if (req.user.type !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent banning other admins for safety
        if (user.type === 'admin') return res.status(400).json({ message: 'Cannot ban admin' });

        // Toggle ban status
        user.isBanned = !user.isBanned;
        await user.save();

        res.json({ message: user.isBanned ? 'User banned' : 'User unbanned', isBanned: user.isBanned });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUserType = async (req, res) => {
    try {
        // Admin only
        if (req.user.type !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        const { type } = req.body;
        if (!['student', 'organizer', 'admin'].includes(type)) {
            return res.status(400).json({ message: 'Invalid role type' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Optional: Prevent removing last admin or editing self-role if critical
        // For now, allow simple toggle

        user.type = type;
        await user.save();

        res.json({ message: 'User role updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
