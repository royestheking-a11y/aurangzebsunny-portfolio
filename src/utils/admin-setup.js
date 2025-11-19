/**
 * Admin Account Setup Helper
 * 
 * Copy and paste these functions into your browser console to set up admin account
 */

// STEP 1: Get Supabase configuration
// These values are already available in your app
async function getSupabaseInfo() {
  try {
    const module = await import('./supabase/info');
    console.log('Supabase Project ID:', module.projectId);
    console.log('Supabase Anon Key:', module.publicAnonKey);
    return {
      projectId: module.projectId,
      anonKey: module.publicAnonKey
    };
  } catch (error) {
    console.error('Error loading Supabase info:', error);
    console.log('\nPlease manually enter:');
    console.log('- Project ID from /utils/supabase/info.tsx');
    console.log('- Anon Key from /utils/supabase/info.tsx');
  }
}

// STEP 2: Create admin account
async function createAdminAccount(email, password, name) {
  const info = await getSupabaseInfo();
  
  if (!info) {
    console.error('Could not load Supabase info. Please set it manually.');
    return;
  }

  const url = `https://${info.projectId}.supabase.co/functions/v1/make-server-abd2a1f4/auth/signup`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${info.anonKey}`
      },
      body: JSON.stringify({
        email,
        password,
        name
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Error creating account:', data.error);
    } else {
      console.log('✅ Admin account created successfully!');
      console.log('Email:', email);
      console.log('You can now login at #admin');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// STEP 3: Quick test login
async function testAdminLogin(email, password) {
  const info = await getSupabaseInfo();
  
  if (!info) {
    console.error('Could not load Supabase info.');
    return;
  }

  const url = `https://${info.projectId}.supabase.co/functions/v1/make-server-abd2a1f4/auth/login`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${info.anonKey}`
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Login failed:', data.error);
    } else {
      console.log('✅ Login successful!');
      console.log('Access token:', data.access_token);
      localStorage.setItem('admin_token', data.access_token);
      console.log('Token saved to localStorage');
      console.log('Navigate to #admin to access admin panel');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// STEP 4: Add sample project (after login)
async function addSampleProject() {
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    console.error('❌ Not logged in. Please login first.');
    return;
  }

  const info = await getSupabaseInfo();
  const url = `https://${info.projectId}.supabase.co/functions/v1/make-server-abd2a1f4/projects`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "E-Commerce Platform Redesign",
        description: "Complete UI/UX redesign of a modern e-commerce platform with focus on conversion optimization and user experience. Implemented responsive design, improved navigation, and streamlined checkout process.",
        category: "UI/UX",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        projectUrl: "https://example.com"
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Error adding project:', data.error);
    } else {
      console.log('✅ Sample project added!');
      console.log('Refresh the page to see it');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// USAGE EXAMPLES:
console.log(`
=====================================
Admin Setup Helper Loaded
=====================================

Quick Start Guide:

1. Create Admin Account:
   createAdminAccount('your@email.com', 'YourPassword123!', 'Your Name')

2. Test Login:
   testAdminLogin('your@email.com', 'YourPassword123!')

3. Add Sample Project:
   addSampleProject()

4. Navigate to Admin:
   window.location.hash = '#admin'

=====================================

Example Complete Setup:

(async () => {
  // Create account
  await createAdminAccount('admin@example.com', 'SecurePass123!', 'Aurangzeb Sunny');
  
  // Wait 1 second
  await new Promise(r => setTimeout(r, 1000));
  
  // Login
  await testAdminLogin('admin@example.com', 'SecurePass123!');
  
  // Add sample project
  await addSampleProject();
  
  // Go to admin
  window.location.hash = '#admin';
})();

=====================================
`);

// Export functions for use
window.adminSetup = {
  getSupabaseInfo,
  createAdminAccount,
  testAdminLogin,
  addSampleProject
};
