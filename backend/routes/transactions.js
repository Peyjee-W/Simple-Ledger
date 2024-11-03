const express = require('express');
const Transaction = require('../models/Transaction');  // 引入模型

const router = express.Router();

// 添加新交易记录
router.post('/add', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 获取指定日期的交易记录
router.get('/', async (req, res) => {
    const { date } = req.query;
    try {
        const query = date ? { date: new Date(date) } : {};  // 如果有日期参数，按日期过滤
        const transactions = await Transaction.find(query);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// 删除交易记录
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Transaction.findByIdAndDelete(id);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取指定月份的交易记录
router.get('/monthly', async (req, res) => {
    const { year, month } = req.query;
    const startDate = new Date(year, month - 1, 1); // 月份减1
    const endDate = new Date(year, month, 1);

    try {
        const transactions = await Transaction.find({
            date: { $gte: startDate, $lt: endDate }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
