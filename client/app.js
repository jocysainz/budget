const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');

const goalForm = document.getElementById('goal-form');
const goalAddForm = document.getElementById('goal-add-form');
const goalAmountEl = document.getElementById('goal-amount');
const goalAddAmountEl = document.getElementById('goal-add-amount');
const goalProgressEl = document.getElementById('goal-progress');
const goalBar = document.getElementById('goal-bar');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let goal = parseFloat(localStorage.getItem('goal')) || 0;
let savedAmount = parseFloat(localStorage.getItem('savedAmount')) || 0;

const pieChartCtx = document.getElementById('pieChart').getContext('2d');

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
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

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

    if (goal > 0) {
        const progress = Math.min((savedAmount / goal) * 100, 100);
        goalProgressEl.textContent = `${progress.toFixed(1)}%`;
        goalBar.style.width = `${progress}%`;
    } else {
        goalProgressEl.textContent = "No goal set";
        goalBar.style.width = "0%";
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;

    if (description === '' || isNaN(amount)) return;

    transactions.push({ description, amount, type });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    descriptionEl.value = '';
    amountEl.value = '';

    updateUI();
});

transactionList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateUI();
    }
});

function updateChart(income, expense) {
    pieChart.data.datasets[0].data = [income, expense];
    pieChart.update();
}

goalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(goalAmountEl.value);
    if (!isNaN(amount) && amount > 0) {
        goal = amount;
        localStorage.setItem('goal', goal);
        goalAmountEl.value = '';
        updateUI();
    }
});

goalAddForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(goalAddAmountEl.value);
    if (!isNaN(amount) && amount > 0) {
        savedAmount += amount;
        localStorage.setItem('savedAmount', savedAmount);
        goalAddAmountEl.value = '';
        updateUI();
    }
});

updateUI();
