// --- SELECT ELEMENTS ---
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const pieChartCtx = document.getElementById('pieChart').getContext('2d');

// --- LOAD TRANSACTIONS FROM LOCALSTORAGE ---
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// --- UPDATE UI ---
function updateUI() {
    transactionList.innerHTML = '';

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${tx.description} (${tx.type})</span>
            <span>$${tx.amount.toFixed(2)} <span class="delete-btn" data-index="${index}">x</span></span>
        `;
        transactionList.appendChild(li);

        if (tx.type === 'income') totalIncome += tx.amount;
        if (tx.type === 'expense') totalExpense += tx.amount;
    });

    const balance = totalIncome - totalExpense;
    balanceEl.textContent = `$${balance.toFixed(2)}`;
    incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    expensesEl.textContent = `$${totalExpense.toFixed(2)}`;

    updateChart(totalIncome, totalExpense);
}

// --- ADD TRANSACTION ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;

    if(description === '' || isNaN(amount)) return;

    transactions.push({ description, amount, type });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    descriptionEl.value = '';
    amountEl.value = '';
    updateUI();
});

// --- DELETE TRANSACTION ---
transactionList.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateUI();
    }
});

// --- PIE CHART ---
let pieChart = new Chart(pieChartCtx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            label: 'Finances',
            data: [0, 0],
            backgroundColor: ['#4caf50', '#f44336'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, //Allows CSS container to control size
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});

function updateChart(income, expense) {
    pieChart.data.datasets[0].data = [income, expense];
    pieChart.update();
}

// --- INITIAL LOAD ---
updateUI();
