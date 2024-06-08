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
        var totalInterestRate = interestRate + euriborRate;

        var stateMinSalary = 700;
        var incomeRatio = netIncome / stateMinSalary;

        // Calculate dependants reserve
        var dependantsReserve;
        if (dependants === 1) {
            dependantsReserve = 0.30 * netIncome;
        } else if (dependants > 1) {
            dependantsReserve = 2 * 0.30 * netIncome;
        } else {
            dependantsReserve = 0;
        }

        // Ensure dependantsReserve is non-negative
        dependantsReserve = Math.max(dependantsReserve, 0);

        // Calculate the maximum DSTI
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

        // Ensure the adjusted net income is positive
        var adjustedNetIncome = Math.max(netIncome - dependantsReserve, 0);

        var maxMonthlyPayment = adjustedNetIncome * maxDsti;
        var maxDti = energyEfficiency === 'Aclass' ? adjustedNetIncome * 96 : adjustedNetIncome * 72;

        // Calculate the maximum loan amount considering the DSTI limit
        var maxLoanAmountByDst = (maxMonthlyPayment + currentMonthlyPayments) / (totalInterestRate / 100 / 12);

        // Ensure the borrower has at least 80% of net income left after loan payments
        var remainingIncome = adjustedNetIncome - currentMonthlyPayments - maxMonthlyPayment;
        if (remainingIncome < adjustedNetIncome * 0.8) {
            maxMonthlyPayment = (adjustedNetIncome * 0.8) - currentMonthlyPayments;
            maxLoanAmountByDst = (maxMonthlyPayment + currentMonthlyPayments) / (totalInterestRate / 100 / 12);
        }

        // Ensure all values are positive
        maxMonthlyPayment = Math.max(maxMonthlyPayment, 0);
        maxLoanAmountByDst = Math.max(maxLoanAmountByDst, 0);

        // Calculate the final maximum loan amount considering both DSTI and DTI
        var maxLoanAmount = Math.min(maxLoanAmountByDst, maxDti - currentLoans);

        // Ensure all values are positive
        maxLoanAmount = Math.max(maxLoanAmount, 0);

        var actualLoanAmount = maxLoanAmount;
        var monthlyPayment = (actualLoanAmount * (totalInterestRate / 100)) / 12;

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
