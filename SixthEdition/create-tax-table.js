// Create tax_deduction table in Supabase
// Using CDN for Supabase client
const { createClient } = supabase;

// Supabase configuration
const SUPABASE_URL = "https://oqfsqjkseksfftquoged.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZnNxamtzZWtzZmZ0cXVvZ2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY4OTI4NCwiZXhwIjoyMDU2MjY1Mjg0fQ.oCflgsG6mtj9_p-EffwcjydfaZKG2whXo3HS6KI9nBM";

// Initialize Supabase client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to create the tax_deduction table
async function createTaxDeductionTable() {
    try {
        console.log('Checking if tax_deduction table exists...');
        
        // List all tables
        const { data: tables, error: tablesError } = await supabaseClient
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');
            
        if (tablesError) {
            console.error('Error listing tables:', tablesError);
            return false;
        }
        
        console.log('Tables in database:', tables.map(t => t.table_name));
        
        const taxDeductionExists = tables.some(t => t.table_name === 'tax_deduction');
        
        if (!taxDeductionExists) {
            console.log('tax_deduction table does not exist, creating it...');
            
            // Create the table using SQL
            const { error: sqlError } = await supabaseClient.rpc('run_sql', {
                sql: `
                CREATE TABLE IF NOT EXISTS public.tax_deduction (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    deduction_name TEXT,
                    deduction_amount NUMERIC,
                    annual_income NUMERIC,
                    social_security_contributions NUMERIC,
                    tax_credits NUMERIC,
                    calculation_date TIMESTAMP WITH TIME ZONE,
                    tax_amount NUMERIC,
                    is_monthly BOOLEAN DEFAULT FALSE,
                    monthly_income NUMERIC,
                    monthly_deduction NUMERIC,
                    monthly_social_security NUMERIC,
                    monthly_tax_amount NUMERIC,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                `
            });
            
            if (sqlError) {
                console.error('Error creating table with SQL:', sqlError);
                
                // Try direct insert as a fallback to create the table
                try {
                    console.log('Trying direct insert to create table...');
                    const { data, error } = await supabaseClient
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
                        
                    if (error) {
                        console.error('Direct insert also failed:', error);
                        return false;
                    }
                    
                    console.log('Table created via direct insert!');
                    return true;
                } catch (insertError) {
                    console.error('Insert attempt failed:', insertError);
                    return false;
                }
            } else {
                console.log('tax_deduction table created successfully with SQL!');
                return true;
            }
        } else {
            console.log('tax_deduction table already exists.');
            return true;
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return false;
    }
}

// Make the function available globally
window.createTaxDeductionTable = createTaxDeductionTable;
