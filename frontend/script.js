const apiBaseUrl = 'http://localhost:5000/transactions';

// 设置日期输入框默认值为今天
function setDefaultDate() {
    const dateInput = document.getElementById('datePicker');
    const today = new Date().toISOString().substr(0, 10);  // 格式为 "YYYY-MM-DD"
    dateInput.value = today;
}

// 获取指定日期的交易记录
async function getTransactionsByDate(date) {
    const response = await fetch(`${apiBaseUrl}?date=${date}`);
    return response.json();
}

// 更新交易记录列表并计算总金额
async function updateTransactionList(date) {
    const transactions = await getTransactionsByDate(date);
    const transactionList = document.getElementById('transactionList');
    const totalAmountElement = document.getElementById('totalAmount');
    
    transactionList.innerHTML = '';

    let totalAmount = 0; // 初始化总金额为 0

    transactions.forEach((transaction) => {
        totalAmount += transaction.amount; // 累加每笔交易的金额
        
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>💰 金额：</strong> ${transaction.amount} 元 |
            <strong>📂 分类：</strong> ${transaction.category} |
            <strong>📝 备注：</strong> ${transaction.note || '无'}
            <button onclick="handleDelete('${transaction._id}', '${date}')">删除❌</button>
        `;
        transactionList.appendChild(li);
    });

    // 更新总金额显示
    totalAmountElement.innerText = `总计金额：${totalAmount} 元`;
}

// 添加新交易记录
async function addTransaction(transaction) {
    const response = await fetch(`${apiBaseUrl}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    return response.json();
}

// 处理删除交易记录
async function handleDelete(id, date) {
    if (confirm("确定要删除这条记录吗？")) {
        await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
        updateTransactionList(date);
    }
}

// 初始化页面并设置事件监听器
document.addEventListener('DOMContentLoaded', () => {
    setDefaultDate();  // 默认选择今天
    const dateInput = document.getElementById('datePicker');

    // 当用户选择新日期时，加载该日期的交易记录
    dateInput.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        updateTransactionList(selectedDate);
    });

    // 表单提交事件监听器
    document.getElementById('transactionForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('datePicker').value;  // 使用当前选择的日期
        const note = document.getElementById('note').value;

        await addTransaction({ amount, category, date, note });
        document.getElementById('transactionForm').reset();
        alert("成功记下一笔！💸");
        updateTransactionList(date);  // 更新当前日期的列表
    });

    // 默认加载今天的交易记录
    updateTransactionList(dateInput.value);
});

// 获取指定月份的所有交易记录
async function getMonthlyTransactions(year, month) {
    const response = await fetch(`${apiBaseUrl}/monthly?year=${year}&month=${month}`);
    return response.json();
}

// 更新每月总结和消费分析
async function updateMonthlySummary(year, month) {
    const transactions = await getMonthlyTransactions(year, month);
    const monthlyTotalElement = document.getElementById('monthlyTotal');
    const categorySummaryList = document.getElementById('categorySummaryList');
    
    // 计算本月总支出
    let monthlyTotal = 0;
    const categorySummary = {};

    transactions.forEach((transaction) => {
        monthlyTotal += transaction.amount;

        // 按分类统计消费金额
        if (categorySummary[transaction.category]) {
            categorySummary[transaction.category] += transaction.amount;
        } else {
            categorySummary[transaction.category] = transaction.amount;
        }
    });

    // 更新本月总支出
    monthlyTotalElement.innerText = `本月总支出：${monthlyTotal} 元`;

    // 更新消费分析（按分类显示）
    categorySummaryList.innerHTML = '';
    for (const [category, amount] of Object.entries(categorySummary)) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${category}：</strong> ${amount} 元`;
        categorySummaryList.appendChild(li);
    }
}

// 添加月份选择事件监听器
document.getElementById('datePicker').addEventListener('change', (event) => {
    const selectedDate = new Date(event.target.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // getMonth() 返回 0-11
    updateMonthlySummary(year, month);
});

// 页面加载时默认显示当前月份的总结
const today = new Date();
updateMonthlySummary(today.getFullYear(), today.getMonth() + 1);
