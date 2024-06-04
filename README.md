# Credit Calculator

**Name:** Your Name  
**Student ID:** Your Student ID

## Project Description
This project is a web-based credit calculator that helps users determine the maximum available mortgage loan amount based on their net income, current loans, monthly payments, interest rate, and property details. The calculator follows the regulations set by the law regarding DSTI and DTI ratios, loan-to-value (LTV) ratios, and property types.

## Features
- Input fields for net income, current loans, monthly payments, interest rate, and property details
- Checkbox to indicate if the property is A class
- Dropdown to select the property type
- Calculation of maximum loan amount, maximum monthly payment, and maximum LTV ratio
- Responsive design using Bootstrap
- About page with additional information and resources

## Instructions
To set up and run the project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/credit-calculator.git
    cd credit-calculator
    ```

2. Set up a virtual environment and install dependencies:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. Run the Flask application:
    ```bash
    python app.py
    ```

## Deployment
To deploy the application using Heroku:

1. Create a Heroku app:
    ```bash
    heroku create
    ```

2. Create a `Procfile` with the following content:
    ```
    web: gunicorn app:app
    ```

3. Push the code to Heroku:
    ```bash
    git push heroku main
    ```

4. Open the app in your browser:
    ```bash
    heroku open
    ```
