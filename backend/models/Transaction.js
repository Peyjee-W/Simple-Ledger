const mongoose = require('mongoose');

// 定义 Transaction 模型的结构
const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },    // 金额
    category: { type: String, required: true },  // 类别，如"食品"、"交通"
    date: { type: Date, default: Date.now },     // 日期，默认是当前时间
    note: { type: String }                       // 备注
});

// 创建并导出模型
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
