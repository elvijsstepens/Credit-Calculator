$(document).ready(function() {
    if (!localStorage.getItem('cookiesAccepted')) {
        $('#cookiesConsentModal').modal('show');
    }

    $('#hasExistingLoans').on('change', function() {
        $('#existingLoansFields').toggle(this.checked);
    });

    $('#acceptCookies').on('click', function() {
        localStorage.setItem('cookiesAccepted', true);
        $('#cookiesConsentModal').modal('hide');
    });

    $('#loanAmountForm').on('submit', function(event) {
        event.preventDefault();

        var netIncome = parseFloat($('#netIncome').val());
        var hasExistingLoans = $('#hasExistingLoans').is(':checked');
        var currentLoans = hasExistingLoans ? parseFloat($('#currentLoans').val()) : 0;
        var currentMonthlyPayments = hasExistingLoans ? parseFloat($('#currentMonthlyPayments').val()) : 0;
        var propertyType = $('#propertyType').val();
        var energyEfficiency = $('#energyEfficiency').val();
        var interestRate = 5.0; // Fixed interest rate
        var euriborRate = 0.0; // Fixed Euribor rate

        var maxDsti = energyEfficiency === 'Aclass' ? 0.45 : 0.40;
        var maxDti = energyEfficiency === 'Aclass' ? netIncome * 96 : netIncome * 72;
        var maxLtv = propertyType === 'rental' ? 0.70 : (propertyType === 'stateSupport' ? 0.95 : 0.90);

        var maxLoanAmount = maxDti - currentLoans;
        var maxMonthlyPayment = netIncome * maxDsti - currentMonthlyPayments;

        var actualLoanAmount = maxLoanAmount * maxLtv;
        var monthlyPayment = (actualLoanAmount * ((interestRate + euriborRate) / 100)) / 12;

        if (monthlyPayment > maxMonthlyPayment) {
            actualLoanAmount = (maxMonthlyPayment * 12) / ((interestRate + euriborRate) / 100);
            monthlyPayment = maxMonthlyPayment;
        }

        $('#loanAmount').text(actualLoanAmount.toFixed(2));
        $('#monthlyPayment').text(monthlyPayment.toFixed(2));
        $('#loanAmountResult').show();
    });

    $('#monthlyPaymentForm').on('submit', function(event) {
        event.preventDefault();

        var loanAmount = parseFloat($('#loanAmountInput').val());
        var loanTerm = parseFloat($('#loanTerm').val());
        var interestRate = parseFloat($('#interestRateInput').val());
        var euriborRate = parseFloat($('#euriborRateInput').val());

        var monthlyInterestRate = (interestRate + euriborRate) / 100 / 12;
        var numberOfPayments = loanTerm * 12;

        var monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

        $('#calculatedMonthlyPayment').text(monthlyPayment.toFixed(2));
        $('#monthlyPaymentResult').show();
    });
});
