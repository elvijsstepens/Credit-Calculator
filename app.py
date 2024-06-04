$(document).ready(function() {
    $('#cookiesConsentModal').modal('show');
});

document.getElementById('acceptCookies').addEventListener('click', function() {
    $('#cookiesConsentModal').modal('hide');
});

document.getElementById('loanForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var netIncome = parseFloat(document.getElementById('netIncome').value);
    var currentLoans = parseFloat(document.getElementById('currentLoans').value);
    var propertyType = document.getElementById('propertyType').value;
    var energyEfficiency = document.getElementById('energyEfficiency').value;
    var interestRate = parseFloat(document.getElementById('interestRate').value);
    var euriborRate = parseFloat(document.getElementById('euriborRate').value);

    var maxDsti = energyEfficiency === 'Aclass' ? 0.45 : 0.40;
    var maxDti = energyEfficiency === 'Aclass' ? 8 : 6;
    var maxLtv = propertyType === 'rental' ? 0.70 : (propertyType === 'stateSupport' ? 0.95 : 0.90);

    var maxLoanAmount = (netIncome * maxDti - currentLoans) / (1 + (interestRate + euriborRate) / 100);
    var maxMonthlyPayment = netIncome * maxDsti;

    maxLoanAmount = maxLoanAmount * maxLtv;

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loan_amount: maxLoanAmount,
            monthly_payment: maxMonthlyPayment
        })
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = '/result?loan_amount=' + data.loan_amount + '&monthly_payment=' + data.monthly_payment;
    });
});
