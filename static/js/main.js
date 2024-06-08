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
            dependantsReserve = 0.30 * stateMinSalary;
        } else if (dependants > 1) {
            dependantsReserve = 2 * 0.30 * stateMinSalary;
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

        // Adjust net income for dependants
        var adjustedNetIncome = Math.max(netIncome - dependantsReserve, 0);

        var maxMonthlyPayment = adjustedNetIncome * maxDsti;
        var maxDti = energyEfficiency === 'Aclass' ? netIncome * 96 : netIncome * 72;

        // Ensure the borrower has at least 80% of net income left after loan payments
        if ((incomeRatio > 1 && incomeRatio < 1.8) || (incomeRatio >= 1.8 && incomeRatio <= 2.5)) {
            var remainingIncome = netIncome - currentMonthlyPayments - maxMonthlyPayment;
            if (remainingIncome < netIncome * 0.8) {
                maxMonthlyPayment = (netIncome * 0.8) - currentMonthlyPayments;
            }
        }

        // Ensure maxMonthlyPayment is non-negative
        maxMonthlyPayment = Math.max(maxMonthlyPayment, 0);

        // Calculate the maximum loan amount considering the DSTI limit
        var maxLoanAmountByDst = (maxMonthlyPayment + currentMonthlyPayments) / (totalInterestRate / 100 / 12);

        // Ensure maxLoanAmountByDst is non-negative
        maxLoanAmountByDst = Math.max(maxLoanAmountByDst, 0);

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
