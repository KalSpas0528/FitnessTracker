import { createClient } from '@supabase/supabase-js';

// Replace with your actual API URL and Key from Supabase
const supabaseUrl = 'https://pswsfndbnlpeqaznztss.supabase.co'; // Your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your API key

const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Fetch data from your Supabase database
async function fetchData() {
  const { data, error } = await supabase.from('your_table').select('*');
  console.log(data, error);
}

fetchData();
