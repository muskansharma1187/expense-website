
// Get HTML elements
const expenseForm = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const totalElement = document.getElementById("total");
const expenseList = document.getElementById("expenseList");
const expenseCount = document.getElementById("expenseCount");

// Load saved expenses
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Set today's date by default
dateInput.value = new Date().toLocaleDateString("en-CA");

// Save expenses in LocalStorage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Calculate total expenses
function updateTotal() {
    const total = expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    totalElement.textContent = "₹" + total.toFixed(2);

    expenseCount.textContent =
        expenses.length + (expenses.length === 1 ? " Expense" : " Expenses");
}

// Display all expenses
function displayExpenses() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML =
            '<p class="empty">No expenses added yet.</p>';

        updateTotal();
        return;
    }

    expenses.forEach(function(expense) {

        const item = document.createElement("div");
        item.className = "expense-item";

        const info = document.createElement("div");
        info.className = "expense-info";

        const name = document.createElement("h3");
        name.textContent = expense.title;

        const details = document.createElement("p");
        details.textContent =
            expense.date + " • " + expense.category;

        info.appendChild(name);
        info.appendChild(details);

        const right = document.createElement("div");
        right.className = "expense-right";

        const price = document.createElement("span");
        price.className = "expense-amount";
        price.textContent = "₹" + expense.amount.toFixed(2);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteExpense(expense.id);
        });

        right.appendChild(price);
        right.appendChild(deleteButton);

        item.appendChild(info);
        item.appendChild(right);

        expenseList.appendChild(item);
    });

    updateTotal();
}

// Add new expense
expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!title || !category || !date || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid expense details!");
        return;
    }

    const newExpense = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    expenses.unshift(newExpense);

    saveExpenses();

    displayExpenses();

    expenseForm.reset();

    dateInput.value = new Date().toLocaleDateString("en-CA");
});

// Delete expense
function deleteExpense(id) {

    expenses = expenses.filter(function(expense) {
        return expense.id !== id;
    });

    saveExpenses();

    displayExpenses();
}

// Initial display
displayExpenses();
