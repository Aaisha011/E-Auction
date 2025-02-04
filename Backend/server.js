const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');


const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bidRoutes = require('./routes/bidRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const chartRoutes = require('./routes/chartRoutes');

const { Server } = require('socket.io'); 

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.none()); 

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'Images')));

// Routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api', bidRoutes);
app.use('/api/auction', auctionRoutes);
// app.use('/api', adminRoutes);
app.use('/api/chart', chartRoutes);

const PORT = process.env.PORT || 3002;

sequelize
  .sync({ alter:true})  
  .then(() => {
    console.log('Database connected successfully');
    console.log("Database synced successfully");

    // Start HTTP and WebSocket server
    server.listen(PORT, () => {
     
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = {io};
