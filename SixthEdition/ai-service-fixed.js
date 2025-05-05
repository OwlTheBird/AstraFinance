// ai-service.js - Dedicated module for Gemini AI functionality

const GEMINI_API_KEY = 'AIzaSyAqDIBlCDBJ7M_npYvBrO2W_-XhjVNnajo';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Basic function to call Gemini API
async function callGeminiAPI(prompt) {
    try {
        console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');
        
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        console.log('Gemini API response status:', response.status);
        
        if (!response.ok) {
            console.error('Gemini API error response:', data);
            throw new Error(data.error?.message || 'Error calling Gemini API');
        }
        
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            console.error('Unexpected Gemini API response format:', data);
            throw new Error('Unexpected response format from Gemini API');
        }
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

// AI Service Object with all Gemini-powered features
window.AIService = {
    // Tax-related AI functions
    analyzeTaxSituation: async (userData) => {
        if (!userData || typeof userData !== 'object') {
            throw new Error('User data is missing or invalid');
        }
        
        if (!userData.income || isNaN(parseFloat(userData.income))) {
            throw new Error('Income is required and must be a number');
        }
        
        const prompt = `
            Based on the following financial data:
            - Annual Income: $${userData.income}
            - Current Deductions: $${userData.deductions || 0}
            - Filing Status: ${userData.filingStatus || 'Not specified'}
            - Profession: ${userData.profession || 'Not specified'}
            
            Provide 3-5 specific, actionable tax optimization strategies that could help reduce tax liability.
            For each suggestion, include:
            1. The specific action to take
            2. The estimated tax savings
            3. Any requirements or limitations
            
            Format your response with clear headings for each suggestion.
        `;
        
        return await callGeminiAPI(prompt);
    },
    
    // Expense-related AI functions
    categorizeExpense: async (description, amount) => {
        const prompt = `
            Categorize this expense: "${description}" for $${amount}.
            
            Choose from these categories:
            - Food
            - Housing
            - Transportation
            - Entertainment
            - Utilities
            - Healthcare
            - Education
            - Shopping
            - Travel
            - Other
            
            Return ONLY the category name, nothing else.
        `;
        
        return await callGeminiAPI(prompt);
    },
    
    analyzeExpenses: async (transactions) => {
        if (!Array.isArray(transactions) || transactions.length === 0) {
            throw new Error('No valid transaction data provided');
        }
        
        // Ensure all transactions have the required properties
        const validTransactions = transactions.filter(t => 
            t && typeof t === 'object' && t.amount && t.description);
            
        if (validTransactions.length === 0) {
            throw new Error('No valid transactions found');
        }
        
        const transactionSummary = validTransactions.map(t => 
            `${t.date || 'No date'}: $${t.amount} for "${t.description}" (Category: ${t.category || 'Uncategorized'})`).join('\n');
        
        const prompt = `
            Analyze the following transaction history and provide insights:
            ${transactionSummary}
            
            Please provide:
            1. Top 3 spending categories
            2. Unusual spending patterns
            3. Potential savings opportunities
            4. Comparison to typical spending in similar demographics
            
            Format your response with clear headings for each section.
        `;
        
        return await callGeminiAPI(prompt);
    },
    
    // CV-related AI functions
    analyzeCVContent: async (cvContent, targetRole) => {
        if (!cvContent || typeof cvContent !== 'string' || cvContent.trim().length < 10) {
            throw new Error('CV content is missing or too short');
        }
        
        if (!targetRole || typeof targetRole !== 'string' || targetRole.trim().length === 0) {
            throw new Error('Target role is required');
        }
        
        const prompt = `
            Analyze this CV for a ${targetRole} position:
            ${cvContent}
            
            Provide:
            1. Overall assessment (strengths and weaknesses)
            2. 3-5 specific improvements to make the CV more competitive
            3. Key skills that are missing for this role
            4. Formatting and presentation suggestions
            
            Format your response with clear headings for each section.
        `;
        
        return await callGeminiAPI(prompt);
    },
    
    // Financial advice AI functions
    getPersonalizedAdvice: async (financialProfile) => {
        const prompt = `
            Based on this financial profile:
            - Income: $${financialProfile.income || 'Not specified'}
            - Savings: $${financialProfile.savings || 'Not specified'}
            - Debt: $${financialProfile.debt || 'Not specified'}
            - Financial Goals: ${financialProfile.goals || 'Not specified'}
            - Risk Tolerance: ${financialProfile.riskTolerance || 'Medium'}
            
            Provide personalized financial advice including:
            1. Investment recommendations
            2. Debt management strategies
            3. Savings plan
            4. Long-term financial planning
            
            Format your response with clear headings for each section.
        `;
        
        return await callGeminiAPI(prompt);
    },
    
    // Notification AI functions
    generateSmartNotification: async (userContext) => {
        const prompt = `
            Based on this user context:
            - Recent Transactions: ${userContext.recentTransactions || 'None'}
            - Upcoming Bills: ${userContext.upcomingBills || 'None'}
            - Financial Goals: ${userContext.goals || 'Not specified'}
            - Current Month: ${new Date().toLocaleString('default', { month: 'long' })}
            
            Generate a single, personalized financial notification that is:
            1. Actionable
            2. Specific
            3. Timely
            4. Helpful for financial well-being
            
            Keep the notification under 100 words.
        `;
        
        return await callGeminiAPI(prompt);
    }
};
