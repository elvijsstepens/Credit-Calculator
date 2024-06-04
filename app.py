from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    # Retrieve form data
    net_income = float(request.form['netIncome'])
    current_loans = float(request.form['currentLoans'])
    # Retrieve other input data

    # Perform calculations
    # Implement loan eligibility criteria (DSTI, DTI, LTV, etc.)

    # Pass calculated data to result.html
    return render_template('result.html')

if __name__ == '__main__':
    app.run(debug=True)
