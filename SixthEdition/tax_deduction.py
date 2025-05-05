from flask import Flask, request, jsonify
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from flask_cors import CORS
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Supabase PostgreSQL connection details
DB_HOST = "db.oqfsqjkseksfftquoged.supabase.co"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZnNxamtzZWtzZmZ0cXVvZ2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY4OTI4NCwiZXhwIjoyMDU2MjY1Mjg0fQ.oCflgsG6mtj9_p-EffwcjydfaZKG2whXo3HS6KI9nBM"
DB_PORT = "5432"

def get_db_connection():
    """Create a connection to the PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/api/save_tax_deduction', methods=['POST'])
def save_tax_deduction():
    """Save tax deduction data to the database"""
    try:
        data = request.json
        
        # Connect to the database
        conn = get_db_connection()
        if not conn:
            return jsonify({"success": False, "error": "Database connection failed"}), 500
        
        cur = conn.cursor()
        
        # Insert data into the tax_deduction table
        query = """
        INSERT INTO tax_deduction (
            user_id, deduction_name, deduction_amount, annual_income, 
            social_security_contributions, tax_credits, calculation_date, 
            tax_amount, is_monthly, monthly_income, monthly_deduction, 
            monthly_social_security, monthly_tax_amount
        ) VALUES (
            %(user_id)s, %(deduction_name)s, %(deduction_amount)s, %(annual_income)s,
            %(social_security_contributions)s, %(tax_credits)s, %(calculation_date)s,
            %(tax_amount)s, %(is_monthly)s, %(monthly_income)s, %(monthly_deduction)s,
            %(monthly_social_security)s, %(monthly_tax_amount)s
        ) RETURNING id;
        """
        
        # Set default values for optional fields
        params = {
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
        
        cur.execute(query, params)
        result = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"success": True, "data": result})
    
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
        
        # Connect to the database
        conn = get_db_connection()
        if not conn:
            return jsonify({"success": False, "error": "Database connection failed"}), 500
        
        cur = conn.cursor()
        
        # Get tax deductions for the user
        query = """
        SELECT * FROM tax_deduction 
        WHERE user_id = %s 
        ORDER BY calculation_date DESC;
        """
        
        cur.execute(query, (user_id,))
        results = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error getting tax deductions: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
