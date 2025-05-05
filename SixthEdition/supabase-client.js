// Supabase client for database operations
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase configuration
const SUPABASE_URL = "https://oqfsqjkseksfftquoged.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZnNxamtzZWtzZmZ0cXVvZ2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY4OTI4NCwiZXhwIjoyMDU2MjY1Mjg0fQ.oCflgsG6mtj9_p-EffwcjydfaZKG2whXo3HS6KI9nBM";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CV submission function
async function submitCV(cvData) {
    try {
        const { data, error } = await supabase
            .from('cv_submit')
            .insert([cvData]);
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error submitting CV to Supabase:', error);
        return { success: false, error: error.message || 'Failed to submit CV' };
    }
}

// Get all CVs
async function getAllCVs() {
    try {
        const { data, error } = await supabase
            .from('cv_submit')
            .select('*');
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching CVs from Supabase:', error);
        return { success: false, error: error.message || 'Failed to fetch CVs' };
    }
}

// Get CVs with filters
async function getCVsWithFilters(filters = {}) {
    try {
        let query = supabase.from('cv_submit').select('*');
        
        // Apply cv_type filter if provided
        if (filters.cvType && filters.cvType !== 'all') {
            query = query.eq('cv_type', filters.cvType);
        }
        
        // Apply skills filter if provided
        if (filters.skills && filters.skills.trim() !== '') {
            // This is a simple implementation - for more complex skill matching
            // you might need a more sophisticated approach
            const skillsArray = filters.skills.split(',').map(s => s.trim().toLowerCase());
            
            // This assumes skills are stored as comma-separated values
            // For each skill, check if it's contained in the skills column
            skillsArray.forEach(skill => {
                query = query.ilike('skills', `%${skill}%`);
            });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error filtering CVs from Supabase:', error);
        return { success: false, error: error.message || 'Failed to filter CVs' };
    }
}

export { supabase, submitCV, getAllCVs, getCVsWithFilters };
