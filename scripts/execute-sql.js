const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

async function executeSQL() {
  const schemaPath = path.join(__dirname, '../supabase/schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf8')
  
  // Extract project ref from URL
  const projectRef = SUPABASE_URL.split('//')[1].split('.')[0]
  
  console.log('🔄 Attempting to execute SQL via Supabase API...\n')
  
  try {
    // Try using Supabase Management API
    // Note: This requires a different authentication method
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ SQL executed successfully!')
      console.log(result)
      return
    } else {
      const errorText = await response.text()
      console.log('⚠️  Management API response:', response.status, errorText)
    }
  } catch (error) {
    console.log('⚠️  API method not available:', error.message)
  }

  // Fallback: Use Supabase client to execute via RPC (if available)
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Split SQL into statements and execute via RPC
    const statements = sql.split(';').filter(s => s.trim().length > 0 && !s.trim().startsWith('--'))
    
    for (const statement of statements) {
      if (statement.trim().length === 0) continue
      
      // Try executing via a custom RPC function (would need to be created first)
      // For now, we'll provide manual instructions
      console.log('📝 Direct SQL execution not available via Supabase JS client')
      break
    }
  } catch (error) {
    console.log('⚠️  Client method failed:', error.message)
  }

  // Final fallback: Manual instructions
  console.log('\n📋 Since automatic execution isn\'t available, please run this SQL manually:\n')
  console.log('═'.repeat(70))
  console.log(sql)
  console.log('═'.repeat(70))
  console.log('\n📝 Steps:')
  console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef)
  console.log('2. Click "SQL Editor"')
  console.log('3. Click "New query"')
  console.log('4. Paste the SQL above')
  console.log('5. Click "Run"\n')
}

executeSQL()

