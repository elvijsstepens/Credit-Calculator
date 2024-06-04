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
    var propertyType = document.getElementById('propertyType').
