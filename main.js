// Show cookies consent modal on page load
$(document).ready(function() {
    $('#cookiesConsentModal').modal('show');
});

// Accept cookies
document.getElementById('acceptCookies').addEventListener('click', function() {
    $('#cookiesConsentModal').modal('hide');
});

document.getElementById('loanForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve form data
    var netIncome = parseFloat(document.getElementById('netIncome').value);
    var currentLoans = parseFloat(document.getElementById('currentLoans').value);
    // Retrieve other input data

    // Perform calculations
    // Implement loan eligibility criteria (DSTI, DTI, LTV, etc.)

    // Dummy calculation
    var loanAmount = 200000;
    var monthlyPayment = 800;

    // Display calculated results
    document.getElementById('loanAmount').textContent = loanAmount;
    document.getElementById('monthlyPayment').textContent = monthlyPayment;
});
