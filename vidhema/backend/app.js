const express = require('express');
const cors = require('cors');
// const { setupMiddleware } = require('./middleware/api-middleware');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const path = require('path');

dotenv.config();

const app = express();

// const { upload, authenticateToken } = setupMiddleware(app);






// Middlewares
app.use(cors({   
    origin: ['http://localhost:3000', 'http://localhost:5174', 'http://localhost:5173'],
    credentials: true }
    
));
app.use(express.json());


// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// error handling middleware
app.use((err, req, res, next)=>{
    console.error(err.message);
    res.status(500).send('Something went wrong buddy');
});

const PORT = process.env.PORT || 8000;


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
