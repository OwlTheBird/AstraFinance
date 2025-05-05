// Test Supabase connection and create tax_deduction table if it doesn't exist
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase configuration
const SUPABASE_URL = "https://oqfsqjkseksfftquoged.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZnNxamtzZWtzZmZ0cXVvZ2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY4OTI4NCwiZXhwIjoyMDU2MjY1Mjg0fQ.oCflgsG6mtj9_p-EffwcjydfaZKG2whXo3HS6KI9nBM";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to test connection and create table
async function testSupabaseConnection() {
    try {
        console.log('Testing Supabase connection...');
        
        // Test connection by getting the current time from Supabase
        const { data, error } = await supabase.rpc('get_current_timestamp');
        
        if (error) {
            console.error('Connection error:', error);
            return;
        }
        
        console.log('Connected to Supabase successfully!');
        console.log('Current timestamp from Supabase:', data);
        
        // Check if tax_deduction table exists
        console.log('Checking if tax_deduction table exists...');
        
        // List all tables
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');
            
        if (tablesError) {
            console.error('Error listing tables:', tablesError);
            return;
        }
        
        console.log('Tables in database:', tables.map(t => t.table_name));
        
        const taxDeductionExists = tables.some(t => t.table_name === 'tax_deduction');
        
        if (!taxDeductionExists) {
            console.log('tax_deduction table does not exist, creating it...');
            
            // Create tax_deduction table
            const { error: createError } = await supabase.rpc('create_tax_deduction_table');
            
            if (createError) {
                console.error('Error creating tax_deduction table:', createError);
                
                // Try SQL approach if RPC fails
                console.log('Trying SQL approach to create table...');
                
                // Create the table using SQL
                const { error: sqlError } = await supabase.rpc('run_sql', {
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
                } else {
                    console.log('tax_deduction table created successfully with SQL!');
                }
            } else {
                console.log('tax_deduction table created successfully!');
            }
        } else {
            console.log('tax_deduction table already exists.');
            
            // Test inserting a record
            const testData = {
                user_id: 'test@example.com',
                deduction_name: 'Test Deduction',
                deduction_amount: 1000,
                annual_income: 50000,
                social_security_contributions: 2000,
                tax_credits: 500,
                calculation_date: new Date().toISOString(),
                tax_amount: 5000
            };
            
            console.log('Testing insert with data:', testData);
            
            const { data: insertData, error: insertError } = await supabase
                .from('tax_deduction')
                .insert([testData])
                .select();
                
            if (insertError) {
                console.error('Error inserting test record:', insertError);
            } else {
                console.log('Test record inserted successfully:', insertData);
            }
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Run the test
testSupabaseConnection();

// Export for use in HTML
window.testSupabaseConnection = testSupabaseConnection;
