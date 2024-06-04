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
    income = float(request.form['income'])
    current_loans = float(request.form['current_loans'])
    monthly_payments = float(request.form['monthly_payments'])
    interest_rate = float(request.form['interest_rate'])
    is_a_class = request.form.get('is_a_class') == 'on'
    property_type = request.form['property_type']

    max_dti = 8 if is_a_class else 6
    max_dsti = 0.45 if is_a_class else 0.40

    max_loan = max_dti * income - current_loans
    max_monthly_payment = max_dsti * income - monthly_payments

    max_ltv = 0.95 if property_type == 'state_guarantee' else 0.90 if property_type == 'primary' else 0.70

    result = {
        'max_loan': max_loan,
        'max_monthly_payment': max_monthly_payment,
        'max_ltv': max_ltv
    }

    return render_template('index.html', result=result)

if __name__ == '__main__':
    app.run(debug=True)
