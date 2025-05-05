// Tax API integration
// This file provides functions to interact with the Python tax_deduction.py API

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Save tax deduction data using the Python API
 * @param {Object} deductionData - The tax deduction data to save
 * @returns {Promise<Object>} - The API response
 */
async function saveTaxDeduction(deductionData) {
    try {
        console.log('Saving tax deduction data via Python API:', deductionData);
        
        const response = await fetch(`${API_BASE_URL}/save_tax_deduction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deductionData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Tax deduction saved successfully via API:', result.data);
            return { success: true, data: result.data };
        } else {
            console.error('API error saving tax deduction:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Error calling tax deduction API:', error);
        return { success: false, error: error.message || 'Failed to save tax deduction via API' };
    }
}

/**
 * Get tax deductions for a user using the Python API
 * @param {string} userId - The user ID to get tax deductions for
 * @returns {Promise<Object>} - The API response
 */
async function getTaxDeductions(userId) {
    try {
        console.log('Getting tax deductions via Python API for user:', userId);
        
        const response = await fetch(`${API_BASE_URL}/get_tax_deductions?user_id=${encodeURIComponent(userId)}`);
        const result = await response.json();
        
        if (result.success) {
            console.log('Tax deductions retrieved successfully via API:', result.data);
            return { success: true, data: result.data };
        } else {
            console.error('API error getting tax deductions:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Error calling tax deduction API:', error);
        return { success: false, error: error.message || 'Failed to get tax deductions via API' };
    }
}

export { saveTaxDeduction, getTaxDeductions };
