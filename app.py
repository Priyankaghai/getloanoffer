"""
GetLoanOffer - Flask Backend Application
Handles form submissions and serves static files
"""

from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime
import csv

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Configuration
DATA_FILE = 'leads.json'
CSV_FILE = 'leads.csv'

def save_lead(data):
    """Save lead data to JSON and CSV files"""
    # Add timestamp
    data['submitted_at'] = datetime.now().isoformat()
    
    # Save to JSON
    leads = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            try:
                leads = json.load(f)
            except json.JSONDecodeError:
                leads = []
    
    leads.append(data)
    
    with open(DATA_FILE, 'w') as f:
        json.dump(leads, f, indent=2)
    
    # Save to CSV
    csv_exists = os.path.exists(CSV_FILE)
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data.keys())
        if not csv_exists:
            writer.writeheader()
        writer.writerow(data)
    
    return True

# Routes for static HTML pages
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/index.html')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/about.html')
def about():
    return send_from_directory('.', 'about.html')

@app.route('/services.html')
def services():
    return send_from_directory('.', 'services.html')

@app.route('/contact.html')
def contact():
    return send_from_directory('.', 'contact.html')

@app.route('/privacy.html')
def privacy():
    return send_from_directory('.', 'privacy.html')

@app.route('/terms.html')
def terms():
    return send_from_directory('.', 'terms.html')

@app.route('/thankyou.html')
def thankyou():
    return send_from_directory('.', 'thankyou.html')

# Form submission endpoint
@app.route('/submit', methods=['POST'])
def submit_form():
    """Handle form submissions"""
    try:
        # Get form data
        data = {
            'name': request.form.get('name', ''),
            'email': request.form.get('email', ''),
            'phone': request.form.get('phone', ''),
            'loan_type': request.form.get('loan_type', ''),
            'amount': request.form.get('amount', ''),
            'employment': request.form.get('employment', ''),
            'income': request.form.get('income', ''),
            'city': request.form.get('city', ''),
            'message': request.form.get('message', ''),
            'source': request.referrer or 'direct'
        }
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'loan_type', 'amount']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Save the lead
        save_lead(data)
        
        # Redirect to thank you page
        return redirect('/thankyou.html')
    
    except Exception as e:
        print(f"Error processing form: {e}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

# API endpoint for AJAX form submission
@app.route('/api/submit', methods=['POST'])
def api_submit():
    """Handle AJAX form submissions"""
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'loan_type', 'amount']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Add source
        data['source'] = 'api'
        
        # Save the lead
        save_lead(data)
        
        return jsonify({
            'success': True,
            'message': 'Application submitted successfully!'
        })
    
    except Exception as e:
        print(f"Error processing API request: {e}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

# API endpoint for EMI calculation
@app.route('/api/calculate-emi', methods=['POST'])
def calculate_emi():
    """Calculate EMI based on loan parameters"""
    try:
        data = request.get_json()
        
        principal = float(data.get('principal', 0))
        rate = float(data.get('rate', 0)) / 100 / 12  # Monthly rate
        tenure = int(data.get('tenure', 0))  # Months
        
        if principal <= 0 or rate <= 0 or tenure <= 0:
            return jsonify({'error': 'Invalid parameters'}), 400
        
        # EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
        emi = principal * rate * pow(1 + rate, tenure) / (pow(1 + rate, tenure) - 1)
        total_amount = emi * tenure
        total_interest = total_amount - principal
        
        return jsonify({
            'emi': round(emi, 2),
            'total_amount': round(total_amount, 2),
            'total_interest': round(total_interest, 2),
            'principal': principal
        })
    
    except Exception as e:
        print(f"Error calculating EMI: {e}")
        return jsonify({'error': 'An error occurred calculating EMI'}), 500

# Admin endpoint to view leads (protected in production)
@app.route('/admin/leads')
def view_leads():
    """View all leads (should be protected in production)"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            try:
                leads = json.load(f)
                return jsonify(leads)
            except json.JSONDecodeError:
                return jsonify([])
    return jsonify([])

# Health check endpoint
@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return send_from_directory('.', 'index.html')

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
