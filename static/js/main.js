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
        var dependants = parseInt($('#dependants').val());
        var hasExistingLoans = $('#hasExistingLoans').is(':checked');
        var currentLoans = hasExistingLoans ? parseFloat($('#currentLoans').val()) : 0;
        var currentMonthlyPayments = hasExistingLoans ? parseFloat($('#currentMonthlyPayments').val()) : 0;
        var energyEfficiency = $('#energyEfficiency').val();
        var interestRate = 1.99; // Fixed base interest rate
        var euriborRate = 3.735; // 6 months Euribor rate as of 7 June, 2024

        var stateMinSalary = 700;
        var incomeRatio = netIncome / stateMinSalary;
        var dependantsReserve = dependants * stateMinSalary * 0.30;

        var maxDsti;
        if (incomeRatio <= 0.7) {
            maxDsti = 0.10;
        } else if (incomeRatio > 0.7 && incomeRatio <= 1) {
            maxDsti = 0.20;
        } else if (incomeRatio > 1 && incomeRatio < 1.8) {
            maxDsti = 0.30;
        } else if (incomeRatio >= 1.8 && incomeRatio <= 2.5) {
            maxDsti = 0.35;
        } else if (incomeRatio > 2.5) {
            maxDsti = energyEfficiency === 'Aclass' ? 0.45 : 0.40;
        }

        var maxMonthlyPayment = (netIncome - dependantsReserve) * maxDsti;
        var remainingIncome = netIncome - currentMonthlyPayments - maxMonthlyPayment;

        if (remainingIncome < netIncome * 0.8) {
            maxMonthlyPayment = (netIncome * 0.8) - currentMonthlyPayments;
        }

        var maxDti = energyEfficiency === 'Aclass' ? netIncome * 96 : netIncome * 72;
        var maxLoanAmount = maxDti - currentLoans;

        var actualLoanAmount = maxLoanAmount;
        var totalInterestRate = interestRate + euriborRate;
        var monthlyPayment = (actualLoanAmount * (totalInterestRate / 100)) / 12;

        if (monthlyPayment > maxMonthlyPayment) {
            actualLoanAmount = (maxMonthlyPayment * 12) / (totalInterestRate / 100);
            monthlyPayment = maxMonthlyPayment;
        }

        if (monthlyPayment <= 0 || actualLoanAmount <= 0) {
            alert("Check information provided");
            return false;
        } else {
            $('#loanAmount').text(actualLoanAmount.toFixed(2));
            $('#monthlyPayment').text(monthlyPayment.toFixed(2));
            $('#loanAmountResult').show();
        }
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

        if (monthlyPayment <= 0) {
            alert("Check information provided");
            return false;
        } else {
            $('#calculatedMonthlyPayment').text(monthlyPayment.toFixed(2));
            $('#monthlyPaymentResult').show();
        }
    });
});
