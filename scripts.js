document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billForm');
    const billsList = document.getElementById('billsList');
    const totalAmountElement = document.getElementById('totalAmount');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Load and display existing bills and update total
    loadBills();
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const bill = {
        name: document.getElementById('name').value,
        amount: parseFloat(document.getElementById('amount').value),
        dueDate: document.getElementById('dueDate').value,
        id: Date.now()
    };

    // Validate input
    if (!bill.name || !bill.amount || !bill.dueDate) {
        alert('Please fill in all fields');
        return;
    }

    // Save bill to localStorage
    saveBill(bill);
    
    // Clear form
    document.getElementById('name').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('dueDate').value = '';
    
    // Update display and total
    loadBills();
    updateTotalAmount();
}

function saveBill(bill) {
    let bills = JSON.parse(localStorage.getItem('bills') || '[]');
    bills.push(bill);
    localStorage.setItem('bills', JSON.stringify(bills));
}

function loadBills() {
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    const billsList = document.getElementById('billsList');
    
    billsList.innerHTML = '';
    
    bills.forEach(bill => {
        const billCard = createBillCard(bill);
        billsList.appendChild(billCard);
    });
    
    // Update total amount after loading bills
    updateTotalAmount();
}

function createBillCard(bill) {
    const card = document.createElement('div');
    card.className = 'bill-card';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteBill(bill.id);
    
    const billInfo = document.createElement('div');
    billInfo.innerHTML = `
        <div class="bill-name">${bill.name}</div>
        <div class="amount">$${bill.amount.toFixed(2)}</div>
        <div class="due-date">Due: ${new Date(bill.dueDate).toLocaleDateString()}</div>
    `;
    
    card.appendChild(billInfo);
    card.appendChild(deleteBtn);
    
    return card;
}

function updateTotalAmount() {
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    const total = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
    const totalAmountElement = document.getElementById('totalAmount');
    
    if (totalAmountElement) {
        totalAmountElement.textContent = `$${total.toFixed(2)}`;
    }
}

function deleteBill(id) {
    if (!confirm('Are you sure you want to delete this bill?')) {
        return;
    }
    
    let bills = JSON.parse(localStorage.getItem('bills') || '[]');
    bills = bills.filter(bill => bill.id !== id);
    
    localStorage.setItem('bills', JSON.stringify(bills));
    loadBills();
    updateTotalAmount();
}
