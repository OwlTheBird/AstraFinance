from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS for all routes

# File to store tax deduction data
TAX_DEDUCTION_FILE = 'tax_deductions.json'

# Initialize the tax deduction file if it doesn't exist
if not os.path.exists(TAX_DEDUCTION_FILE):
    with open(TAX_DEDUCTION_FILE, 'w') as f:
        json.dump([], f)

def read_tax_deductions():
    """Read tax deductions from the file"""
    try:
        with open(TAX_DEDUCTION_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_tax_deductions(deductions):
    """Write tax deductions to the file"""
    with open(TAX_DEDUCTION_FILE, 'w') as f:
        json.dump(deductions, f, indent=2)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/save_tax_deduction', methods=['POST'])
def save_tax_deduction():
    """Save tax deduction data to the file"""
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('user_id'):
            return jsonify({"success": False, "error": "User ID is required"}), 400
        
        # Read existing deductions
        deductions = read_tax_deductions()
        
        # Create new deduction record
        new_deduction = {
            "id": len(deductions) + 1,
            "user_id": data.get("user_id"),
            "deduction_name": data.get("deduction_name", ""),
            "deduction_amount": float(data.get("deduction_amount", 0)),
            "annual_income": float(data.get("annual_income", 0)),
            "social_security_contributions": float(data.get("social_security_contributions", 0)),
            "tax_credits": float(data.get("tax_credits", 0)),
            "calculation_date": data.get("calculation_date", datetime.now().isoformat()),
            "tax_amount": float(data.get("tax_amount", 0)),
            "is_monthly": data.get("is_monthly", False),
            "monthly_income": float(data.get("monthly_income", 0)),
            "monthly_deduction": float(data.get("monthly_deduction", 0)),
            "monthly_social_security": float(data.get("monthly_social_security", 0)),
            "monthly_tax_amount": float(data.get("monthly_tax_amount", 0))
        }
        
        # Add to deductions list
        deductions.append(new_deduction)
        
        # Save to file
        write_tax_deductions(deductions)
        
        return jsonify({"success": True, "data": new_deduction})
    
    except Exception as e:
        print(f"Error saving tax deduction: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/get_tax_deductions', methods=['GET'])
def get_tax_deductions():
    """Get tax deductions for a user"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"success": False, "error": "User ID is required"}), 400
        
        # Read deductions from file
        deductions = read_tax_deductions()
        
        # Filter by user_id
        user_deductions = [d for d in deductions if d.get('user_id') == user_id]
        
        # Sort by calculation_date (newest first)
        user_deductions.sort(key=lambda x: x.get('calculation_date', ''), reverse=True)
        
        return jsonify({"success": True, "data": user_deductions})
    
    except Exception as e:
        print(f"Error getting tax deductions: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Astra Financial web server...")
    print("Open http://localhost:5000 in your browser")
    print(f"Tax deductions will be saved to {os.path.abspath(TAX_DEDUCTION_FILE)}")
    app.run(debug=True, port=5000)
