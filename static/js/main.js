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
        var adjustedNetIncome = netIncome;

        // Adjust net income for dependants
        if (dependants === 1) {
            adjustedNetIncome = netIncome - (0.30 * stateMinSalary);
        } else if (dependants > 1) {
            adjustedNetIncome = netIncome - (0.60 * stateMinSalary);
        }

        // Ensure adjustedNetIncome is non-negative
        adjustedNetIncome = Math.max(adjustedNetIncome, 0);

        var incomeRatio = adjustedNetIncome / stateMinSalary;

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

        var maxMonthlyPayment = adjustedNetIncome * maxDsti;

        // Ensure the borrower has at least 80% of 700 EUR left after loan payments
        if ((incomeRatio > 1 && incomeRatio < 1.8) || (incomeRatio >= 1.8 && incomeRatio <= 2.5)) {
            var minimumRemainingIncome = 0.80 * stateMinSalary;
            var remainingIncome = adjustedNetIncome - currentMonthlyPayments - maxMonthlyPayment;
            if (remainingIncome < minimumRemainingIncome) {
                maxMonthlyPayment = adjustedNetIncome - currentMonthlyPayments - minimumRemainingIncome;
            }
        }

        // Ensure maxMonthlyPayment is non-negative
        maxMonthlyPayment = Math.max(maxMonthlyPayment, 0);

        // Calculate the maximum loan amount considering the DSTI limit
        var maxLoanAmountByDst = maxMonthlyPayment / (totalInterestRate / 100 / 12);

        // Ensure maxLoanAmountByDst is non-negative
        maxLoanAmountByDst = Math.max(maxLoanAmountByDst, 0);

        // Calculate the DTI limit
        var maxDti = energyEfficiency === 'Aclass' ? netIncome * 96 : netIncome * 72;

        // Calculate the final maximum loan amount considering both DSTI and DTI
        var maxLoanAmount = Math.min(maxLoanAmountByDst, maxDti - currentLoans);

        // Ensure maxLoanAmount is non-negative
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
});
