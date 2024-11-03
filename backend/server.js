const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 调试信息
console.log('Attempting to connect to MongoDB...');

// 连接到MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// 引入交易路由，并将路由前缀设为 `/api/transactions`
const transactionsRouter = require('./routes/transactions');
app.use('/api/transactions', transactionsRouter);

// 导出 Express 应用（Vercel 使用）
module.exports = app;
