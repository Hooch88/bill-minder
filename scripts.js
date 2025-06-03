document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billForm');
    const billsList = document.getElementById('billsList');
    const totalAmountElement = document.getElementById('totalAmount');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Load and display existing bills and update total
    loadBills();

    // Set current year in footer
    const yearSpan = document.getElementById('copyrightYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
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
    card.className = 'p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 mb-4'; // Added mb-4 for spacing if billsList doesn't have space-y

    // Bill Details Section (Name and Due Date)
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'flex-grow'; // Allows this section to take available space

    const nameElement = document.createElement('h3');
    nameElement.className = 'font-semibold text-slate-800 text-lg';
    nameElement.textContent = bill.name;

    const dueDateElement = document.createElement('p');
    dueDateElement.className = 'text-sm text-slate-500';
    // Ensure dueDate is treated as local date to avoid timezone issues
    const dateParts = bill.dueDate.split('-');
    const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    dueDateElement.textContent = `Due: ${localDate.toLocaleDateString()}`;

    detailsDiv.appendChild(nameElement);
    detailsDiv.appendChild(dueDateElement);

    // Action Section (Amount and Delete Button)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-3 sm:mt-0';

    const amountElement = document.createElement('span');
    amountElement.className = 'font-bold text-xl text-sky-600';
    amountElement.textContent = `$${parseFloat(bill.amount).toFixed(2)}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-md text-sm shadow-sm hover:shadow transition duration-150 ease-in-out';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteBill(bill.id);

    actionsDiv.appendChild(amountElement);
    actionsDiv.appendChild(deleteBtn);

    card.appendChild(detailsDiv);
    card.appendChild(actionsDiv);

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
