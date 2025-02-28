// Authentication state handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    // Update navigation based on authentication state
    updateNavigation(isLoggedIn);
    
    // Add logout functionality
    setupLogout();
    
    // Initialize notification system
    initNotifications();
    
    // Check authentication for protected features
    checkAuthForProtectedFeatures();
});

// Update navigation based on authentication state
function updateNavigation(isLoggedIn) {
    const navList = document.querySelector('nav ul');
    
    // If nav doesn't exist on this page, return
    if (!navList) return;
    
    // Check if login/logout items already exist
    const loginItem = Array.from(navList.children).find(item => 
        item.querySelector('a').href.includes('login.html'));
    const logoutItem = Array.from(navList.children).find(item => 
        item.querySelector('a').textContent === 'Logout');
    
    if (isLoggedIn) {
        // If logged in, show logout instead of login
        if (loginItem) {
            loginItem.innerHTML = '<a href="#" id="logout-link">Logout</a>';
        } else if (!logoutItem) {
            // Add logout if neither login nor logout exists
            const newItem = document.createElement('li');
            newItem.innerHTML = '<a href="#" id="logout-link">Logout</a>';
            navList.appendChild(newItem);
        }
        
        // Add user email display if not already present
        if (!document.getElementById('user-email-display')) {
            const userItem = document.createElement('li');
            userItem.innerHTML = `<span id="user-email-display" style="color: white; margin-left: 15px;">${localStorage.getItem('userEmail')}</span>`;
            navList.appendChild(userItem);
        }
    } else {
        // If not logged in, show login instead of logout
        if (logoutItem) {
            logoutItem.innerHTML = '<a href="login.html">Login</a>';
        } else if (!loginItem) {
            // Add login if neither login nor logout exists
            const newItem = document.createElement('li');
            newItem.innerHTML = '<a href="login.html">Login</a>';
            navList.appendChild(newItem);
        }
        
        // Remove user email display if present
        const userDisplay = document.getElementById('user-email-display');
        if (userDisplay && userDisplay.parentElement) {
            userDisplay.parentElement.remove();
        }
    }
}

// Setup logout functionality
function setupLogout() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear authentication data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('authToken');
            
            // Show notification
            showNotification('You have been logged out successfully.');
            
            // Update navigation
            updateNavigation(false);
            
            // Redirect to home page after logout
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Initialize notification system
function initNotifications() {
    // Add close button functionality
    const closeButton = document.getElementById('close-notification');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            document.getElementById('notification').style.display = 'none';
        });
    }
    
    // Hide the old notification element initially
    const oldNotification = document.getElementById('notification');
    if (oldNotification) {
        oldNotification.style.display = 'none';
    }
}

// Show notification
function showNotification(message, isError = false) {
    // Use the improved notification system instead
    showImprovedNotification(message, isError);
}

// Check authentication for protected features
function checkAuthForProtectedFeatures() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Get all auth-required message elements
    const authRequiredMessages = document.querySelectorAll('.auth-required-message');
    const forms = document.querySelectorAll('form');
    
    if (isLoggedIn) {
        // Hide auth required messages
        authRequiredMessages.forEach(message => {
            message.style.display = 'none';
        });
        
        // Enable forms
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, button, select, textarea');
            inputs.forEach(input => {
                input.disabled = false;
            });
        });
    } else {
        // Show auth required messages
        authRequiredMessages.forEach(message => {
            message.style.display = 'block';
        });
        
        // Disable forms in expense.html
        if (window.location.href.includes('expense.html')) {
            forms.forEach(form => {
                if (form.id === 'income-form' || 
                    form.id === 'annual-form' || 
                    form.id === 'monthly-form' || 
                    form.id === 'add-expense-form' || 
                    form.id === 'add-reminder-form') {
                    
                    const inputs = form.querySelectorAll('input, button, select, textarea');
                    inputs.forEach(input => {
                        input.disabled = true;
                    });
                }
            });
        }
        
        // Disable forms in cv.html
        if (window.location.href.includes('cv.html')) {
            const cvForm = document.getElementById('cv-form');
            if (cvForm) {
                const inputs = cvForm.querySelectorAll('input, button, select, textarea');
                inputs.forEach(input => {
                    input.disabled = true;
                });
                
                // Add auth required message if not exists
                if (!document.querySelector('.auth-required-message')) {
                    const authMessage = document.createElement('div');
                    authMessage.className = 'auth-required-message';
                    authMessage.innerHTML = '<p>Please <a href="login.html">login</a> to submit your CV.</p>';
                    cvForm.parentNode.insertBefore(authMessage, cvForm);
                }
            }
        }
    }
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Simple validation
            if (!email || !password) {
                showNotification('Please enter both email and password.', true);
                return;
            }
            
            // Simulate login (in a real app, this would call an API)
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Store authentication data
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('authToken', 'sample-auth-token');
                
                // Show success notification
                showNotification('Login successful! Redirecting...');
                
                // Update navigation
                updateNavigation(true);
                
                // Redirect to home page after login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showNotification('Login failed. Please try again.', true);
            }
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Simple validation
            if (!email || !password || !confirmPassword) {
                showNotification('Please fill in all fields.', true);
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match.', true);
                return;
            }
            
            // Simulate registration (in a real app, this would call an API)
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success notification
                showNotification('Registration successful! You can now login.');
                
                // Switch to login tab
                document.querySelector('.tab-button[onclick="showTab(\'login\')"]').click();
            } catch (error) {
                showNotification('Registration failed. Please try again.', true);
            }
        });
    }
    
    // Expense Management
    if (document.querySelector('.expense-options')) {
        // Monthly Income Calculation
        const incomeForm = document.getElementById('income-form');
        if (incomeForm) {
            incomeForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!isLoggedIn) {
                    showNotification('Please login to use this feature.', true);
                    return;
                }
                
                const income = parseFloat(document.getElementById('income').value);
                
                // Store income in localStorage
                localStorage.setItem('monthlyIncome', income);
                
                // Show expense tracker
                document.getElementById('expense-tracker').style.display = 'block';
                document.getElementById('monthly-income-form').style.display = 'none';
                
                // Update income display
                document.getElementById('tracker-income').textContent = `$${income.toFixed(2)}`;
                
                // Load existing transactions
                loadTransactions();
                
                // Show AI expense analysis section
                document.getElementById('ai-expense-analysis').style.display = 'block';
                
                // Show notification
                showNotification('Income saved successfully!');
            });
        }
        
        // Annual Tax Calculation
        const annualForm = document.getElementById('annual-form');
        if (annualForm) {
            annualForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!isLoggedIn) {
                    showNotification('Please login to use this feature.', true);
                    return;
                }
                
                const income = parseFloat(document.getElementById('annual-income').value);
                const deductions = parseFloat(document.getElementById('deductions').value) || 0;
                const deductionReason = document.getElementById('deduction-reason').value;
                const socialSecurity = parseFloat(document.getElementById('social-security').value) || 0;
                const taxCredits = parseFloat(document.getElementById('tax-credits').value) || 0;
                
                // Egyptian tax calculation based on 2024 tax brackets
                // Personal allowance of 20,000 EGP is exempt for everyone
                const personalAllowance = 20000;
                
                // Calculate taxable income after deductions, social security, and personal allowance
                const totalDeductions = deductions + socialSecurity;
                const taxableIncome = Math.max(0, income - totalDeductions - personalAllowance);
                
                // Progressive tax calculation based on Egyptian tax brackets
                let tax = 0;
                
                if (taxableIncome <= 20000) {
                    // First 40,000 EGP (after personal allowance) is taxed at 0%
                    tax = 0;
                } else if (taxableIncome <= 35000) {
                    // Income from 40,001 to 55,000 EGP is taxed at 10%
                    tax = (taxableIncome - 20000) * 0.10;
                } else if (taxableIncome <= 50000) {
                    // Income from 55,001 to 70,000 EGP is taxed at 15%
                    tax = (20000 * 0.10) + ((taxableIncome - 35000) * 0.15);
                } else if (taxableIncome <= 180000) {
                    // Income from 70,001 to 200,000 EGP is taxed at 20%
                    tax = (20000 * 0.10) + (15000 * 0.15) + ((taxableIncome - 50000) * 0.20);
                } else if (taxableIncome <= 380000) {
                    // Income from 200,001 to 400,000 EGP is taxed at 22.5%
                    tax = (20000 * 0.10) + (15000 * 0.15) + (130000 * 0.20) + ((taxableIncome - 180000) * 0.225);
                } else if (taxableIncome <= 1180000) {
                    // Income from 400,001 to 1,200,000 EGP is taxed at 25%
                    tax = (20000 * 0.10) + (15000 * 0.15) + (130000 * 0.20) + (200000 * 0.225) + ((taxableIncome - 380000) * 0.25);
                } else {
                    // Income above 1,200,000 EGP is taxed at 27.5%
                    tax = (20000 * 0.10) + (15000 * 0.15) + (130000 * 0.20) + (200000 * 0.225) + (800000 * 0.25) + ((taxableIncome - 1180000) * 0.275);
                }
                
                // Apply tax credits
                const finalTax = Math.max(0, tax - taxCredits);
                
                // Show result (using EGP currency)
                showNotification(`Your estimated annual tax is: ${finalTax.toFixed(2)} EGP`);
                
                // Store the tax calculation data in a global variable for the save button
                window.annualTaxData = {
                    income: income,
                    deductions: deductions,
                    deductionReason: deductionReason,
                    socialSecurity: socialSecurity,
                    taxCredits: taxCredits,
                    taxAmount: finalTax,
                    calculationDate: new Date().toISOString()
                };
                
                // Save tax deduction data to Supabase
                try {
                    const userId = localStorage.getItem('userEmail');
                    if (userId) {
                        const deductionData = {
                            user_id: userId,
                            deduction_name: deductionReason,
                            deduction_amount: deductions,
                            annual_income: income,
                            social_security_contributions: socialSecurity,
                            calculation_date: new Date().toISOString(),
                            tax_amount: finalTax
                        };
                        
                        // Import the saveTaxDeduction function from supabase-client.js
                        import('./supabase-client.js').then(async (module) => {
                            const result = await module.saveTaxDeduction(deductionData);
                            if (result.success) {
                                console.log('Tax deduction data saved successfully:', result.data);
                            } else {
                                console.error('Failed to save tax deduction data:', result.error);
                            }
                        }).catch(error => {
                            console.error('Error importing supabase-client.js:', error);
                        });
                    }
                } catch (error) {
                    console.error('Error saving tax deduction data:', error);
                }
                
                // Show AI tax optimization section
                const aiTaxOptimization = document.getElementById('ai-tax-optimization');
                if (aiTaxOptimization) {
                    aiTaxOptimization.style.display = 'block';
                    
                    // Get form data
                    const income = parseFloat(document.getElementById('annual-income').value);
                    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
                    const socialSecurity = parseFloat(document.getElementById('social-security').value) || 0;
                    const filingStatus = 'Individual'; // You might want to add this field to your form
                    const profession = 'Professional'; // You might want to add this field to your form
                    
                    // Show loading
                    document.getElementById('tax-optimization-loading').style.display = 'block';
                    document.getElementById('tax-optimization-results').innerHTML = '';
                    
                    try {
                        // Call AI service
                        const userData = {
                            income: income,
                            deductions: deductions,
                            socialSecurity: socialSecurity,
                            filingStatus: filingStatus,
                            profession: profession,
                            country: 'Egypt' // Add country information for the AI service
                        };
                        
                        try {
                            console.log('Calling AIService.analyzeTaxSituation with:', userData);
                            const suggestions = await AIService.analyzeTaxSituation(userData);
                            console.log('Tax optimization result:', suggestions);
                            
                            // Display results
                            document.getElementById('tax-optimization-results').innerHTML = 
                                `<div class="ai-content">${suggestions}</div>`;
                        } catch (aiError) {
                            console.error('AI Service error in tax optimization:', aiError);
                            document.getElementById('tax-optimization-results').innerHTML = 
                                `<p class="error">AI Service error: ${aiError.message || JSON.stringify(aiError)}</p>`;
                        }
                    } catch (error) {
                        console.error('Error in tax optimization:', error);
                        document.getElementById('tax-optimization-results').innerHTML = 
                            `<p class="error">Error getting suggestions: ${error.message || JSON.stringify(error)}</p>`;
                    } finally {
                        document.getElementById('tax-optimization-loading').style.display = 'none';
                    }
                }
            });
        }
        
        // Monthly Tax Calculation
        const monthlyForm = document.getElementById('monthly-form');
        if (monthlyForm) {
            monthlyForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!isLoggedIn) {
                    showNotification('Please login to use this feature.', true);
                    return;
                }
                
                const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
                const monthlyDeductions = parseFloat(document.getElementById('monthly-deductions').value) || 0;
                const monthlyDeductionReason = document.getElementById('monthly-deduction-reason').value;
                const monthlySocialSecurity = parseFloat(document.getElementById('monthly-social-security').value) || 0;
                
                // Convert monthly income and deductions to annual for tax calculation
                const annualIncome = monthlyIncome * 12;
                const annualDeductions = monthlyDeductions * 12;
                const annualSocialSecurity = monthlySocialSecurity * 12;
                
                // Egyptian tax calculation based on 2024 tax brackets
                // Personal allowance of 20,000 EGP is exempt for everyone
                const personalAllowance = 20000;
                
                // Calculate taxable income after personal allowance and social security
                const taxableIncome = Math.max(0, annualIncome - annualDeductions - annualSocialSecurity - personalAllowance);
                
                // Progressive tax calculation based on Egyptian tax brackets
                let annualTax = 0;
                
                if (taxableIncome <= 20000) {
                    // First 40,000 EGP (after personal allowance) is taxed at 0%
                    annualTax = 0;
                } else if (taxableIncome <= 35000) {
                    // Income from 40,001 to 55,000 EGP is taxed at 10%
                    annualTax = (taxableIncome - 20000) * 0.10;
                } else if (taxableIncome <= 50000) {
                    // Income from 55,001 to 70,000 EGP is taxed at 15%
                    annualTax = (20000 * 0.10) + ((taxableIncome - 35000) * 0.15);
                } else if (taxableIncome <= 180000) {
                    // Income from 70,001 to 200,000 EGP is taxed at 20%
                    annualTax = (20000 * 0.10) + (15000 * 0.15) + ((taxableIncome - 50000) * 0.20);
                } else if (taxableIncome <= 380000) {
                    // Income from 200,001 to 400,000 EGP is taxed at 22.5%
                    annualTax = (20000 * 0.10) + (15000 * 0.15) + (130000 * 0.20) + ((taxableIncome - 180000) * 0.225);
                } else if (taxableIncome <= 1180000) {
                    // Income from 400,001 to 1,200,000 EGP is taxed at 25%
                    annualTax = (20000 * 0.10) + (15000 * 0.15) + (130000 * 0.20) + (200000 * 0.225) + ((taxableIncome - 380000) * 0.25);
                } else {
                    // Income above 1,200,000 EGP is taxed at 27.5%
                    annualTax = (20000 * 0.10) + (15000 * 0.15) + (130000 * 0.20) + (200000 * 0.225) + (800000 * 0.25) + ((taxableIncome - 1180000) * 0.275);
                }
                
                // Calculate monthly tax
                const monthlyTax = annualTax / 12;
                
                // Show result (using EGP currency)
                showNotification(`Your estimated monthly tax is: ${monthlyTax.toFixed(2)} EGP`);
                
                // Store the tax calculation data in a global variable for the save button
                window.monthlyTaxData = {
                    monthlyIncome: monthlyIncome,
                    monthlyDeductions: monthlyDeductions,
                    deductionReason: monthlyDeductionReason,
                    monthlySocialSecurity: monthlySocialSecurity,
                    annualIncome: annualIncome,
                    annualDeductions: annualDeductions,
                    annualSocialSecurity: annualSocialSecurity,
                    taxAmount: annualTax,
                    monthlyTaxAmount: monthlyTax,
                    calculationDate: new Date().toISOString(),
                    isMonthly: true
                };
                
                // Save tax deduction data to Supabase
                try {
                    const userId = localStorage.getItem('userEmail');
                    if (userId) {
                        const deductionData = {
                            user_id: userId,
                            deduction_name: monthlyDeductionReason,
                            deduction_amount: monthlyDeductions,
                            annual_income: annualIncome,
                            social_security_contributions: annualSocialSecurity,
                            calculation_date: new Date().toISOString(),
                            tax_amount: annualTax,
                            is_monthly: true
                        };
                        
                        // Import the saveTaxDeduction function from supabase-client.js
                        import('./supabase-client.js').then(async (module) => {
                            const result = await module.saveTaxDeduction(deductionData);
                            if (result.success) {
                                console.log('Monthly tax deduction data saved successfully:', result.data);
                            } else {
                                console.error('Failed to save monthly tax deduction data:', result.error);
                            }
                        }).catch(error => {
                            console.error('Error importing supabase-client.js:', error);
                        });
                    }
                } catch (error) {
                    console.error('Error saving monthly tax deduction data:', error);
                }
            });
        }
        
        // Add Expense
        const addExpenseForm = document.getElementById('add-expense-form');
        if (addExpenseForm) {
            addExpenseForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!isLoggedIn) {
                    showNotification('Please login to use this feature.', true);
                    return;
                }
                
                const amount = parseFloat(document.getElementById('expense-amount').value);
                const category = document.getElementById('expense-category').value;
                const description = document.getElementById('expense-description').value || category;
                
                // Create transaction object
                const transaction = {
                    id: Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    amount: amount,
                    category: category,
                    description: description
                };
                
                // Get existing transactions from localStorage
                const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                
                // Add new transaction
                transactions.push(transaction);
                
                // Save to localStorage
                localStorage.setItem('transactions', JSON.stringify(transactions));
                
                // Add to table
                addTransactionToTable(transaction);
                
                // Update totals
                updateExpenseTotals();
                
                // Reset form
                addExpenseForm.reset();
                
                // Show notification
                showNotification('Expense added successfully!');
            });
        }
        
        // Add Bill Reminder
        const addReminderForm = document.getElementById('add-reminder-form');
        if (addReminderForm) {
            addReminderForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!isLoggedIn) {
                    showNotification('Please login to use this feature.', true);
                    return;
                }
                
                const title = document.getElementById('reminder-title').value;
                const amount = parseFloat(document.getElementById('reminder-amount').value);
                const dueDate = document.getElementById('reminder-date').value;
                
                // Create reminder object
                const reminder = {
                    id: Date.now(),
                    title: title,
                    amount: amount,
                    dueDate: dueDate,
                    status: 'pending'
                };
                
                // Get existing reminders from localStorage
                const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
                
                // Add new reminder
                reminders.push(reminder);
                
                // Save to localStorage
                localStorage.setItem('reminders', JSON.stringify(reminders));
                
                // Reload reminders
                loadReminders();
                
                // Reset form
                addReminderForm.reset();
                
                // Show notification
                showNotification('Reminder added successfully!');
            });
        }
        
        // AI Expense Analysis Integration
        const analyzeExpensesBtn = document.getElementById('analyze-expenses-btn');
        if (analyzeExpensesBtn) {
            analyzeExpensesBtn.addEventListener('click', async function() {
                // Show loading
                document.getElementById('expense-analysis-loading').style.display = 'block';
                document.getElementById('expense-analysis-results').innerHTML = '';
                
                try {
                    // Get transactions from local storage
                    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                    console.log('Transactions for AI analysis:', transactions);
                    
                    if (transactions.length === 0) {
                        document.getElementById('expense-analysis-results').innerHTML = 
                            `<p>No transactions found. Add some expenses first.</p>`;
                        document.getElementById('expense-analysis-loading').style.display = 'none';
                        return;
                    }
                    
                    // Call AI service
                    console.log('Calling AIService.analyzeExpenses with:', transactions);
                    try {
                        const analysis = await AIService.analyzeExpenses(transactions);
                        console.log('Analysis result:', analysis);
                        
                        // Display results
                        document.getElementById('expense-analysis-results').innerHTML = 
                            `<div class="ai-content">${analysis}</div>`;
                    } catch (aiError) {
                        console.error('AI Service error:', aiError);
                        document.getElementById('expense-analysis-results').innerHTML = 
                            `<p class="error">AI Service error: ${aiError.message || JSON.stringify(aiError)}</p>`;
                    }
                } catch (error) {
                    console.error('Error in expense analysis:', error);
                    document.getElementById('expense-analysis-results').innerHTML = 
                        `<p class="error">Error analyzing expenses: ${error.message || JSON.stringify(error)}</p>`;
                } finally {
                    document.getElementById('expense-analysis-loading').style.display = 'none';
                }
            });
        }
        
        // Save Expenses to Supabase
        const saveExpensesBtn = document.getElementById('save-expenses-btn');
        if (saveExpensesBtn) {
            saveExpensesBtn.addEventListener('click', async function() {
                if (!isLoggedIn) {
                    showNotification('Please login to use this feature.', true);
                    return;
                }
                
                // Get expenses from localStorage
                const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                
                if (transactions.length === 0) {
                    showNotification('No expenses to save.', true);
                    return;
                }
                
                // Show saving status
                const saveStatus = document.getElementById('save-expenses-status');
                saveStatus.innerHTML = '<p>Saving expenses to database...</p>';
                saveStatus.style.display = 'block';
                
                try {
                    const userId = localStorage.getItem('userEmail');
                    
                    // Import the saveExpense function from supabase-client.js
                    import('./supabase-client.js').then(async (module) => {
                        let successCount = 0;
                        let errorCount = 0;
                        
                        // Save each expense to Supabase
                        for (const transaction of transactions) {
                            const expenseData = {
                                user_id: userId,
                                date: transaction.date,
                                amount: transaction.amount,
                                category: transaction.category,
                                description: transaction.description
                            };
                            
                            const result = await module.saveExpense(expenseData);
                            if (result.success) {
                                successCount++;
                            } else {
                                errorCount++;
                                console.error('Failed to save expense:', result.error);
                            }
                        }
                        
                        // Update status
                        if (errorCount === 0) {
                            saveStatus.innerHTML = `<p class="success">Successfully saved ${successCount} expenses to the database.</p>`;
                            showNotification(`Successfully saved ${successCount} expenses to the database.`);
                        } else {
                            saveStatus.innerHTML = `<p class="warning">Saved ${successCount} expenses, but failed to save ${errorCount} expenses.</p>`;
                            showNotification(`Saved ${successCount} expenses, but failed to save ${errorCount} expenses.`, true);
                        }
                        
                        // Clear local storage after successful save
                        if (successCount > 0) {
                            // Keep only the expenses that failed to save
                            if (errorCount > 0) {
                                const failedTransactions = transactions.slice(-errorCount);
                                localStorage.setItem('transactions', JSON.stringify(failedTransactions));
                                // Refresh the expense table
                                document.getElementById('expenses-body').innerHTML = '';
                                failedTransactions.forEach(addTransactionToTable);
                                updateExpenseTotals();
                            } else {
                                localStorage.removeItem('transactions');
                                // Clear the expense table
                                document.getElementById('expenses-body').innerHTML = '';
                                updateExpenseTotals();
                            }
                        }
                    }).catch(error => {
                        console.error('Error importing supabase-client.js:', error);
                        saveStatus.innerHTML = `<p class="error">Error: ${error.message || 'Failed to save expenses'}</p>`;
                        showNotification('Failed to save expenses to the database.', true);
                    });
                } catch (error) {
                    console.error('Error saving expenses:', error);
                    saveStatus.innerHTML = `<p class="error">Error: ${error.message || 'Failed to save expenses'}</p>`;
                    showNotification('Failed to save expenses to the database.', true);
                }
            });
        }
    }
    
    // CV Submission
    if (document.querySelector('.cv-section')) {
        const cvForm = document.getElementById('cv-form');
        if (cvForm) {
            cvForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!isLoggedIn) {
                    showNotification('Please login to use this feature.', true);
                    return;
                }
                
                try {
                    // Get form data
                    const fullName = document.getElementById('full-name').value;
                    const age = document.getElementById('age').value;
                    const email = document.getElementById('email').value;
                    const phone = document.getElementById('phone').value;
                    const cvType = document.getElementById('cv-type').value;
                    const skills = document.getElementById('skills').value;
                    const description = document.getElementById('description').value;
                    
                    // Create CV data object
                    const cvData = {
                        full_name: fullName,
                        age: parseInt(age),
                        email: email,
                        phone: phone,
                        cv_type: cvType,
                        skills: skills,
                        description: description
                    };
                    
                    // Show loading indicator
                    const submitButton = document.querySelector('#cv-form button[type="submit"]');
                    const originalButtonText = submitButton.innerHTML;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                    submitButton.disabled = true;
                    
                    // Submit CV to Supabase
                    const response = await submitCVToSupabase(cvData);
                    
                    // Restore button state
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    
                    if (response.success) {
                        // Show success message
                        showNotification('CV submitted successfully!');
                        
                        // Reset form
                        cvForm.reset();
                        
                        // Switch to browse tab and refresh CV list after a short delay
                        showTab('browse-cvs');
                        
                        // Add a small delay to ensure Supabase has time to update
                        setTimeout(() => {
                            applyFilters(); // Refresh the CV list to show the newly submitted CV
                        }, 1000); // 1 second delay
                    } else {
                        showNotification('Error submitting CV: ' + response.error, true);
                    }
                } catch (error) {
                    console.error('Error submitting CV:', error);
                    showNotification('Error submitting CV: ' + (error.message || 'Unknown error'), true);
                }
            });
        }
        
        // Initialize CV list if on the browse tab
        if (document.getElementById('browse-cvs')) {
            // Load CVs when the browse tab is clicked
            document.querySelector('.tab-button[onclick="showTab(\'browse-cvs\')"]').addEventListener('click', function() {
                applyFilters(); // Load all CVs when tab is clicked
            });
        }
        
        // AI CV Analysis Integration
        const analyzeCvBtn = document.getElementById('analyze-cv-btn');
        if (analyzeCvBtn) {
            analyzeCvBtn.addEventListener('click', async function() {
                // Show loading
                document.getElementById('cv-analysis-loading').style.display = 'block';
                document.getElementById('cv-analysis-results').innerHTML = '';
                
                try {
                    // Get CV content from form
                    const fullName = document.getElementById('full-name').value;
                    const age = document.getElementById('age').value;
                    const email = document.getElementById('email').value;
                    const phone = document.getElementById('phone').value;
                    const cvType = document.getElementById('cv-type').value;
                    const skills = document.getElementById('skills').value;
                    const description = document.getElementById('description').value;
                    const targetRole = document.getElementById('target-role').value;
                    
                    if (!fullName || !skills || !description || !targetRole) {
                        document.getElementById('cv-analysis-results').innerHTML = 
                            `<p class="error">Please fill in all required fields including Target Role.</p>`;
                        return;
                    }
                    
                    // Construct CV content
                    const cvContent = `
                        Name: ${fullName}
                        Age: ${age}
                        Email: ${email}
                        Phone: ${phone}
                        CV Type: ${cvType}
                        Skills: ${skills}
                        Description: ${description}
                    `;
                    
                    // Call AI service
                    try {
                        console.log('Calling AIService.analyzeCVContent with:', { cvContent, targetRole });
                        const analysis = await AIService.analyzeCVContent(cvContent, targetRole);
                        console.log('CV Analysis result:', analysis);
                        
                        // Display results
                        document.getElementById('cv-analysis-results').innerHTML = 
                            `<div class="ai-content">${analysis}</div>`;
                    } catch (aiError) {
                        console.error('AI Service error in CV analysis:', aiError);
                        document.getElementById('cv-analysis-results').innerHTML = 
                            `<p class="error">AI Service error: ${aiError.message || JSON.stringify(aiError)}</p>`;
                    }
                } catch (error) {
                    console.error('Error in CV analysis:', error);
                    document.getElementById('cv-analysis-results').innerHTML = 
                        `<p class="error">Error analyzing CV: ${error.message || JSON.stringify(error)}</p>`;
                } finally {
                    document.getElementById('cv-analysis-loading').style.display = 'none';
                }
            });
        }
    }
    
    // AI Smart Notifications
    function setupSmartNotifications() {
        // Only run this if user is logged in
        if (!localStorage.getItem('isLoggedIn')) return;
        
        // Check if we should generate a new notification (once per day)
        const lastNotificationDate = localStorage.getItem('lastNotificationDate');
        const today = new Date().toDateString();
        
        if (lastNotificationDate !== today) {
            generateSmartNotification();
            localStorage.setItem('lastNotificationDate', today);
        }
    }
    
    async function generateSmartNotification() {
        try {
            // Get user context
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const income = parseFloat(localStorage.getItem('monthlyIncome')) || 3000; // Default value
            
            // Calculate remaining budget
            const totalExpenses = transactions
                .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            
            const remainingBudget = income - totalExpenses;
            
            // Get upcoming bills (simulated)
            const upcomingBills = [
                { amount: 100, description: 'Electricity' },
                { amount: 50, description: 'Internet' }
            ];
            
            // Recent spending pattern (simulated)
            const recentPattern = transactions.length > 5 ? 'Increased spending on Entertainment' : 'Normal spending';
            
            // Financial goals (simulated)
            const goals = ['Save for vacation', 'Pay off credit card'];
            
            // User context for AI
            const userContext = {
                remainingBudget,
                upcomingBills,
                recentPattern,
                goals
            };
            
            // Call AI service
            const notification = await AIService.generateSmartNotification(userContext);
            
            // Show notification
            showNotification(notification);
        } catch (error) {
            console.error('Error generating smart notification:', error);
        }
    }
    
    // Run smart notifications setup
    setupSmartNotifications();
    
    // Close notification
    const closeNotification = document.getElementById('close-notification');
    if (closeNotification) {
        closeNotification.addEventListener('click', function() {
            document.getElementById('notification').style.display = 'none';
        });
    }
});

// Apply CV Filters
function applyFilters() {
    try {
        const filterType = document.getElementById('filter-type').value;
        const filterSkills = document.getElementById('filter-skills').value;
        
        // Get all CV cards
        const cvList = document.querySelector('.cv-list');
        if (!cvList) {
            console.error('CV list container not found');
            return;
        }
        
        // Clear existing CV cards
        cvList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading CVs...</div>';
        
        // Fetch CVs from Supabase with filters
        fetchCVsFromSupabase({
            cvType: filterType,
            skills: filterSkills
        }).then(response => {
            // Clear loading spinner
            cvList.innerHTML = '';
            
            if (!response.success) {
                console.error('Error loading CVs:', response.error);
                cvList.innerHTML = `<div class="error-message">Error loading CVs: ${response.error}</div>`;
                return;
            }
            
            // If no CVs found
            if (!response.data || response.data.length === 0) {
                cvList.innerHTML = '<div class="no-results">No CVs found matching your criteria.</div>';
                return;
            }
            
            // Generate CV cards
            response.data.forEach(cv => {
                try {
                    const cvCard = createCVCard(cv);
                    cvList.appendChild(cvCard);
                } catch (cardError) {
                    console.error('Error creating CV card:', cardError, cv);
                    const errorCard = document.createElement('div');
                    errorCard.className = 'error-message';
                    errorCard.textContent = `Error displaying a CV: ${cardError.message}`;
                    cvList.appendChild(errorCard);
                }
            });
        }).catch(error => {
            console.error('Error in applyFilters:', error);
            cvList.innerHTML = `<div class="error-message">An unexpected error occurred: ${error.message}</div>`;
        });
    } catch (error) {
        console.error('Error in applyFilters:', error);
        const cvList = document.querySelector('.cv-list');
        if (cvList) {
            cvList.innerHTML = `<div class="error-message">An unexpected error occurred: ${error.message}</div>`;
        }
    }
}

// Create a CV card element from CV data
function createCVCard(cv) {
    if (!cv) {
        throw new Error('No CV data provided');
    }
    
    // Ensure we have an object with at least some properties
    if (typeof cv !== 'object') {
        throw new Error('Invalid CV data format');
    }
    
    const cvCard = document.createElement('div');
    cvCard.className = `cv-card ${cv.cv_type || ''}`;
    
    // Safely get values with fallbacks
    const name = cv.name || cv.full_name || 'Unnamed';
    const email = cv.email || 'N/A';
    const skills = cv.skills || 'None specified';
    const experience = cv.experience || 'None specified';
    const cvType = cv.cv_type || 'unknown';
    
    // Format the CV type for display
    const cvTypeDisplay = formatCVType(cvType);
    const cvTypeClass = getCVTypeClass(cvType);
    
    // Create the card HTML
    cvCard.innerHTML = `
        <div class="cv-header">
            <h3>${escapeHtml(name)}</h3>
            <div class="cv-tags">
                <span class="tag tag-${cvTypeClass}">${escapeHtml(cvTypeDisplay)}</span>
            </div>
        </div>
        <div class="cv-body">
            <p class="cv-contact"><strong>Contact:</strong> ${escapeHtml(email)}</p>
            <p class="cv-skills"><strong>Skills:</strong> ${escapeHtml(skills)}</p>
            <p class="cv-experience"><strong>Experience:</strong> ${escapeHtml(experience)}</p>
        </div>
        <div class="cv-footer">
            <button class="btn-secondary view-cv-btn">View Details</button>
            <button class="btn-contact contact-cv-btn" data-email="${escapeHtml(email)}">
                <i class="fas fa-envelope"></i> Contact
            </button>
        </div>
    `;
    
    // Add event listeners
    const viewBtn = cvCard.querySelector('.view-cv-btn');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => viewCVDetails(cv));
    }
    
    const contactBtn = cvCard.querySelector('.contact-cv-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            const emailAddr = contactBtn.getAttribute('data-email');
            if (emailAddr && emailAddr !== 'N/A') {
                contactCV(emailAddr);
            } else {
                showNotification('No email address available for this CV', true);
            }
        });
    }
    
    return cvCard;
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Format CV type for display
function formatCVType(cvType) {
    if (!cvType) return 'Unknown';
    
    // Convert snake_case or kebab-case to Title Case
    return cvType
        .replace(/[-_]/g, ' ')
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Get CSS class for CV type
function getCVTypeClass(cvType) {
    if (!cvType) return 'default';
    
    // Map CV types to CSS classes
    const typeMap = {
        'full_time': 'primary',
        'part_time': 'secondary',
        'contract': 'warning',
        'freelance': 'info',
        'internship': 'success'
    };
    
    return typeMap[cvType.toLowerCase()] || 'default';
}

// View CV details
function viewCVDetails(cv) {
    try {
        if (!cv || typeof cv !== 'object') {
            showNotification('Cannot display CV details: Invalid data', true);
            return;
        }
        
        // Safely get values with fallbacks
        const name = cv.name || cv.full_name || 'Unnamed';
        const email = cv.email || 'N/A';
        const phone = cv.phone || 'N/A';
        const cvType = cv.cv_type || 'unknown';
        const skills = cv.skills || 'None specified';
        const experience = cv.experience || 'None specified';
        const education = cv.education || 'None specified';
        const additionalInfo = cv.additional_info || 'None provided';
        
        // Create modal with CV details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${escapeHtml(name)}</h2>
                <div class="cv-details">
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
                    <p><strong>CV Type:</strong> ${escapeHtml(formatCVType(cvType))}</p>
                    <p><strong>Skills:</strong> ${escapeHtml(skills)}</p>
                    <h3>Experience</h3>
                    <p>${escapeHtml(experience)}</p>
                    <h3>Education</h3>
                    <p>${escapeHtml(education)}</p>
                    <h3>Additional Information</h3>
                    <p>${escapeHtml(additionalInfo)}</p>
                </div>
            </div>
        `;
        
        // Add modal to the page
        document.body.appendChild(modal);
        
        // Show the modal
        setTimeout(() => {
            modal.style.display = 'block';
        }, 10);
        
        // Close modal when clicking the × button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }
        
        // Close modal when clicking outside the modal content
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    } catch (error) {
        console.error('Error displaying CV details:', error);
        showNotification('Error displaying CV details: ' + error.message, true);
    }
}

// Contact CV via email
function contactCV(email) {
    if (email) {
        window.location.href = `mailto:${email}?subject=Regarding Your CV Submission`;
    } else {
        showNotification('No email address available for this CV', true);
    }
}

// Supabase Integration
async function submitCVToSupabase(cvData) {
    try {
        // Supabase configuration
        const SUPABASE_URL = "https://oqfsqjkseksfftquoged.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZnNxamtzZWtzZmZ0cXVvZ2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY4OTI4NCwiZXhwIjoyMDU2MjY1Mjg0fQ.oCflgsG6mtj9_p-EffwcjydfaZKG2whXo3HS6KI9nBM";
        
        console.log('Submitting CV data to Supabase:', cvData);
        
        // Create URL object
        const url = new URL(`${SUPABASE_URL}/rest/v1/cv_submit`);
        
        // Make the API request to Supabase
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(cvData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Supabase error response:', errorData);
            throw new Error(errorData.message || `HTTP error ${response.status}`);
        }
        
        console.log('CV submitted successfully to Supabase');
        return { success: true };
    } catch (error) {
        console.error('Error submitting CV to Supabase:', error);
        return { success: false, error: error.message || 'Failed to submit CV' };
    }
}

async function fetchCVsFromSupabase(filters = {}) {
    try {
        // Supabase configuration
        const SUPABASE_URL = "https://oqfsqjkseksfftquoged.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZnNxamtzZWtzZmZ0cXVvZ2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY4OTI4NCwiZXhwIjoyMDU2MjY1Mjg0fQ.oCflgsG6mtj9_p-EffwcjydfaZKG2whXo3HS6KI9nBM";
        
        // First, fetch all CVs without filtering
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cv_submit?select=*`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        // Parse the response
        let allCVs = await response.json();
        console.log('Fetched all CVs:', allCVs);
        
        // Apply filters in JavaScript instead of in the URL
        if (filters.cvType && filters.cvType !== 'all') {
            allCVs = allCVs.filter(cv => cv.cv_type === filters.cvType);
        }
        
        if (filters.skills && filters.skills.trim() !== '') {
            const skillsLower = filters.skills.trim().toLowerCase();
            allCVs = allCVs.filter(cv => 
                cv.skills && cv.skills.toLowerCase().includes(skillsLower)
            );
        }
        
        console.log('Filtered CVs:', allCVs);
        return { success: true, data: allCVs };
    } catch (error) {
        console.error('Error fetching CVs from Supabase:', error);
        return { success: false, error: error.message || 'Failed to fetch CVs' };
    }
}

// Load Transactions
async function loadTransactions() {
    // Get transactions from localStorage
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Clear existing transactions
    document.getElementById('expenses-body').innerHTML = '';
    
    // Add each transaction to the table
    transactions.forEach(addTransactionToTable);
    
    // Update totals
    updateExpenseTotals();
    
    // If user is logged in, also load transactions from Supabase
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userEmail');
    
    if (isLoggedIn && userId) {
        // Import the getExpenses function from supabase-client.js
        import('./supabase-client.js').then(async (module) => {
            try {
                const result = await module.getExpenses(userId);
                if (result.success && result.data && result.data.length > 0) {
                    // Show notification
                    showNotification(`Loaded ${result.data.length} expenses from the database.`);
                    
                    // Add a heading to separate database expenses
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td colspan="4" class="expense-separator">Expenses from Database</td>`;
                    document.getElementById('expenses-body').appendChild(tr);
                    
                    // Add each expense to the table
                    result.data.forEach(expense => {
                        const transaction = {
                            id: expense.id,
                            date: expense.date,
                            amount: expense.amount,
                            category: expense.category,
                            description: expense.description,
                            fromDatabase: true
                        };
                        addTransactionToTable(transaction);
                    });
                    
                    // Update totals
                    updateExpenseTotals();
                }
            } catch (error) {
                console.error('Error loading expenses from Supabase:', error);
            }
        }).catch(error => {
            console.error('Error importing supabase-client.js:', error);
        });
    }
}

// Add Transaction to Table
function addTransactionToTable(transaction) {
    const tbody = document.getElementById('expenses-body');
    const row = document.createElement('tr');
    
    const dateCell = document.createElement('td');
    dateCell.textContent = new Date(transaction.date).toLocaleDateString();
    
    const categoryCell = document.createElement('td');
    categoryCell.textContent = transaction.category;
    
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = transaction.description;
    
    const amountCell = document.createElement('td');
    amountCell.textContent = `$${transaction.amount.toFixed(2)}`;
    
    row.appendChild(dateCell);
    row.appendChild(categoryCell);
    row.appendChild(descriptionCell);
    row.appendChild(amountCell);
    
    // Add data attribute for transaction ID
    row.setAttribute('data-id', transaction.id);
    
    tbody.appendChild(row);
}

// Update Expense Totals
async function updateExpenseTotals() {
    try {
        const transactions = await API.Expense.getTransactions();
        
        let income = 0;
        let spent = 0;
        
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else if (transaction.type === 'expense') {
                spent += transaction.amount;
            }
        });
        
        const remaining = income - spent;
        
        // Update displays
        document.getElementById('tracker-income').textContent = `$${income.toFixed(2)}`;
        document.getElementById('tracker-spent').textContent = `$${spent.toFixed(2)}`;
        document.getElementById('tracker-remaining').textContent = `$${remaining.toFixed(2)}`;
    } catch (error) {
        console.error('Error updating totals:', error);
    }
}

// Load Reminders
async function loadReminders() {
    try {
        const notifications = await API.Notification.getNotifications();
        
        // Filter for bill reminders
        const reminders = notifications.filter(notification => 
            notification.type === 'bill_reminder'
        );
        
        // Clear existing reminders
        const tbody = document.getElementById('reminders-body');
        tbody.innerHTML = '';
        
        // Add reminders to table
        reminders.forEach(reminder => {
            const row = document.createElement('tr');
            
            const titleCell = document.createElement('td');
            titleCell.textContent = reminder.title;
            
            const amountCell = document.createElement('td');
            amountCell.textContent = `$${reminder.amount.toFixed(2)}`;
            
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(reminder.due_date).toLocaleDateString();
            
            const statusCell = document.createElement('td');
            statusCell.textContent = reminder.status || 'Pending';
            
            row.appendChild(titleCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading reminders:', error);
    }
}

// Show Tax Form
function showTaxForm(type) {
    if (type === 'annual') {
        document.getElementById('annual-tax-form').style.display = 'block';
        document.getElementById('monthly-tax-form').style.display = 'none';
        document.getElementById('monthly-income-form').style.display = 'none';
    } else if (type === 'monthly') {
        document.getElementById('annual-tax-form').style.display = 'none';
        document.getElementById('monthly-tax-form').style.display = 'none';
        document.getElementById('monthly-income-form').style.display = 'block';
    }
}

// Show Tab Content
function showTab(tabId) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected tab content
    document.getElementById(tabId).style.display = 'block';
    
    // Update active tab
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        // Check if this tab button is for the current tab
        // Extract tabId from onclick attribute which contains showTab('tabId')
        const onclickAttr = tab.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${tabId}'`)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Add CSS for the modal and notifications
function addDynamicStyles() {
    // Check if styles are already added
    if (document.getElementById('dynamic-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-styles';
    styleElement.textContent = `
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
            animation: fadeIn 0.3s ease-in-out;
        }
        
        .modal-content {
            background-color: #fff;
            margin: 10% auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease-in-out;
        }
        
        .close-modal {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close-modal:hover {
            color: #333;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            background-color: #4CAF50;
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            animation: slideDown 0.3s ease-in-out;
        }
        
        .notification.error {
            background-color: #f44336;
        }
        
        .notification-close {
            margin-left: 15px;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }
        
        @keyframes slideDown {
            from { transform: translate(-50%, -20px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        
        /* CV Card Styles */
        .cv-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            padding: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .cv-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .cv-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .cv-tags {
            display: flex;
            gap: 5px;
        }
        
        .tag {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .tag-primary { background-color: #007bff; color: white; }
        .tag-secondary { background-color: #6c757d; color: white; }
        .tag-success { background-color: #28a745; color: white; }
        .tag-warning { background-color: #ffc107; color: #212529; }
        .tag-info { background-color: #17a2b8; color: white; }
        .tag-default { background-color: #f8f9fa; color: #212529; }
        
        .cv-body {
            margin-bottom: 15px;
        }
        
        .cv-footer {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }
        
        .btn-secondary, .btn-contact {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        
        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }
        
        .btn-contact {
            background-color: #28a745;
            color: white;
        }
        
        .btn-secondary:hover {
            background-color: #5a6268;
        }
        
        .btn-contact:hover {
            background-color: #218838;
        }
        
        /* Loading and Error States */
        .loading-spinner {
            text-align: center;
            padding: 20px;
            font-size: 18px;
            color: #6c757d;
        }
        
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .no-results {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-style: italic;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Improved notification system
function showImprovedNotification(message, isError = false) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : ''}`;
    
    // Add close button
    const closeButton = document.createElement('span');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Set notification content
    notification.textContent = message;
    notification.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 5000);
}

// Initialize dynamic styles when the page loads
document.addEventListener('DOMContentLoaded', function() {
    addDynamicStyles();
    initNotifications();
    
    // Initialize other components
    // ...
});

// Save Annual Tax Data
const saveAnnualTaxBtn = document.getElementById('save-annual-tax-btn');
if (saveAnnualTaxBtn) {
    saveAnnualTaxBtn.addEventListener('click', async function() {
        if (!isLoggedIn) {
            showNotification('Please login to use this feature.', true);
            return;
        }
        
        if (!window.annualTaxData) {
            showNotification('Please calculate taxes first before saving.', true);
            return;
        }
        
        try {
            const userId = localStorage.getItem('userEmail');
            if (userId) {
                const deductionData = {
                    user_id: userId,
                    deduction_name: window.annualTaxData.deductionReason,
                    deduction_amount: window.annualTaxData.deductions,
                    annual_income: window.annualTaxData.income,
                    social_security_contributions: window.annualTaxData.socialSecurity,
                    tax_credits: window.annualTaxData.taxCredits,
                    calculation_date: window.annualTaxData.calculationDate,
                    tax_amount: window.annualTaxData.taxAmount
                };
                
                // Import the saveTaxDeduction function from supabase-client.js
                import('./supabase-client.js').then(async (module) => {
                    const result = await module.saveTaxDeduction(deductionData);
                    if (result.success) {
                        console.log('Annual tax deduction data saved successfully:', result.data);
                        showNotification('Data has been sent to records.');
                    } else {
                        console.error('Failed to save annual tax deduction data:', result.error);
                        showNotification('Failed to save annual tax data to the database.', true);
                    }
                }).catch(error => {
                    console.error('Error importing supabase-client.js:', error);
                    showNotification('Error saving annual tax data: ' + error.message, true);
                });
            }
        } catch (error) {
            console.error('Error saving annual tax deduction data:', error);
            showNotification('Error saving annual tax data: ' + error.message, true);
        }
    });
}

// Save Monthly Tax Data
const saveMonthlyTaxBtn = document.getElementById('save-monthly-tax-btn');
if (saveMonthlyTaxBtn) {
    saveMonthlyTaxBtn.addEventListener('click', async function() {
        if (!isLoggedIn) {
            showNotification('Please login to use this feature.', true);
            return;
        }
        
        if (!window.monthlyTaxData) {
            showNotification('Please calculate taxes first before saving.', true);
            return;
        }
        
        try {
            const userId = localStorage.getItem('userEmail');
            if (userId) {
                const deductionData = {
                    user_id: userId,
                    deduction_name: window.monthlyTaxData.deductionReason,
                    deduction_amount: window.monthlyTaxData.annualDeductions,
                    annual_income: window.monthlyTaxData.annualIncome,
                    social_security_contributions: window.monthlyTaxData.annualSocialSecurity,
                    calculation_date: window.monthlyTaxData.calculationDate,
                    tax_amount: window.monthlyTaxData.taxAmount,
                    is_monthly: true,
                    monthly_income: window.monthlyTaxData.monthlyIncome,
                    monthly_deduction: window.monthlyTaxData.monthlyDeductions,
                    monthly_social_security: window.monthlyTaxData.monthlySocialSecurity,
                    monthly_tax_amount: window.monthlyTaxData.monthlyTaxAmount
                };
                
                // Import the saveTaxDeduction function from supabase-client.js
                import('./supabase-client.js').then(async (module) => {
                    const result = await module.saveTaxDeduction(deductionData);
                    if (result.success) {
                        console.log('Monthly tax deduction data saved successfully:', result.data);
                        showNotification('Data has been sent to records.');
                    } else {
                        console.error('Failed to save monthly tax deduction data:', result.error);
                        showNotification('Failed to save monthly tax data to the database.', true);
                    }
                }).catch(error => {
                    console.error('Error importing supabase-client.js:', error);
                    showNotification('Error saving monthly tax data: ' + error.message, true);
                });
            }
        } catch (error) {
            console.error('Error saving monthly tax deduction data:', error);
            showNotification('Error saving monthly tax data: ' + error.message, true);
        }
    });
}
