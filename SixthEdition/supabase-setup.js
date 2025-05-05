// Supabase setup and table creation
// This file handles the Supabase client setup and table creation

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Supabase configuration
        const SUPABASE_URL = "https://oqfsqjkseksfftquoged.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZnNxamtzZWtzZmZ0cXVvZ2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY4OTI4NCwiZXhwIjoyMDU2MjY1Mjg0fQ.oCflgsG6mtj9_p-EffwcjydfaZKG2whXo3HS6KI9nBM";

        // Check if Supabase is loaded
        if (typeof supabase !== 'undefined') {
            // Initialize Supabase client
            const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            
            // Make client available globally
            window.supabaseClient = supabaseClient;
            
            // Function to create the tax_deduction table
            async function createTaxDeductionTable() {
                try {
                    console.log('Checking if tax_deduction table exists...');
                    
                    // Try direct insert to check if table exists
                    try {
                        const { data, error } = await supabaseClient
                            .from('tax_deduction')
                            .select('id')
                            .limit(1);
                            
                        if (!error) {
                            console.log('tax_deduction table exists and is accessible');
                            return true;
                        }
                        
                        console.log('Error accessing table, may need to create it:', error);
                        
                        // Try to insert a test record to create the table
                        const { data: insertData, error: insertError } = await supabaseClient
                            .from('tax_deduction')
                            .insert({
                                user_id: 'test@example.com',
                                deduction_name: 'Test Deduction',
                                deduction_amount: 1000,
                                annual_income: 50000,
                                social_security_contributions: 2000,
                                tax_credits: 500,
                                calculation_date: new Date().toISOString(),
                                tax_amount: 5000
                            });
                            
                        if (insertError) {
                            console.error('Failed to create table via insert:', insertError);
                            return false;
                        }
                        
                        console.log('Successfully created/verified tax_deduction table');
                        return true;
                    } catch (error) {
                        console.error('Error checking/creating table:', error);
                        return false;
                    }
                } catch (error) {
                    console.error('Unexpected error in createTaxDeductionTable:', error);
                    return false;
                }
            }
            
            // Make function available globally
            window.createTaxDeductionTable = createTaxDeductionTable;
            
            // Run table creation on page load
            createTaxDeductionTable().then(result => {
                console.log('Initial table check result:', result);
            }).catch(error => {
                console.error('Error during initial table check:', error);
            });
        } else {
            console.error('Supabase library not loaded. Make sure the CDN script is included before this script.');
        }
    } catch (error) {
        console.error('Error in Supabase setup:', error);
    }
});
