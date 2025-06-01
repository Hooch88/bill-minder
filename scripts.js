document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('billForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        amount: document.getElementById('amount').value,
        dueDate: document.getElementById('dueDate').value
    };
    
    console.log('Form submitted:', formData);
    // Add your form submission logic here
}
