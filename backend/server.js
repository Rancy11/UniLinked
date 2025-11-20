const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const postRoutes = require('./routes/posts.js');
const opportunityRoutes = require('./routes/opportunityRoutes');
const communityRoutes = require('./routes/communityRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use('/api/posts', postRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/events', eventRoutes);

// connect mongodb
mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));


// routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));