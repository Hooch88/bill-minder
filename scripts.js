document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billForm');
    const billsList = document.getElementById('billsList');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Load and display existing bills
    loadBills();
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const bill = {
        name: document.getElementById('name').value,
        amount: parseFloat(document.getElementById('amount').value),
        dueDate: document.getElementById('dueDate').value,
        id: Date.now() // Using timestamp as unique ID
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
    
    // Update display
    loadBills();
}

function saveBill(bill) {
    // Get existing bills from localStorage
    let bills = JSON.parse(localStorage.getItem('bills') || '[]');
    
    // Add new bill
    bills.push(bill);
    
    // Save back to localStorage
    localStorage.setItem('bills', JSON.stringify(bills));
}

function loadBills() {
    // Get bills from localStorage
    const bills = JSON.parse(localStorage.getItem('bills') || '[]');
    
    // Clear existing list
    billsList.innerHTML = '';
    
    // Add each bill to the list
    bills.forEach(bill => {
        const billCard = createBillCard(bill);
        billsList.appendChild(billCard);
    });
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

function deleteBill(id) {
    if (!confirm('Are you sure you want to delete this bill?')) {
        return;
    }
    
    // Get existing bills
    let bills = JSON.parse(localStorage.getItem('bills') || '[]');
    
    // Filter out the bill with the matching ID
    bills = bills.filter(bill => bill.id !== id);
    
    // Save updated list
    localStorage.setItem('bills', JSON.stringify(bills));
    
    // Update display
    loadBills();
}
