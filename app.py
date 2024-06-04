from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    property_class = request.form.get('property_class')
    current_loans = float(request.form.get('current_loans'))
    monthly_payments = float(request.form.get('monthly_payments'))
    net_income = float(request.form.get('net_income'))
    bank_interest_rate = float(request.form.get('bank_interest_rate'))
    euribor_rate = float(request.form.get('euribor_rate'))

    if property_class == 'A':
        max_dsti = 0.45
        max_dti = 8
    else:
        max_dsti = 0.40
        max_dti = 6

    max_loan_amount = min((net_income * max_dti), ((net_income * max_dsti) - monthly_payments) / ((bank_interest_rate + euribor_rate) / 1200))

    return render_template('index.html', max_loan_amount=max_loan_amount)

if __name__ == '__main__':
    app.run(debug=True)
