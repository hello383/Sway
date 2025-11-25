const fs = require('fs')
const path = require('path')

// Read environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

async function setupDatabase() {
  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql')
    const sql = fs.readFileSync(schemaPath, 'utf8')

    console.log('📝 Setting up Supabase database...')
    console.log(`🔗 Connecting to: ${SUPABASE_URL}`)

    // Use Supabase REST API to execute SQL
    // Note: Supabase doesn't have a direct SQL execution endpoint via REST
    // We'll need to use the PostgREST API or provide instructions
    
    // For now, we'll create a script that outputs the SQL for manual execution
    // OR we can use the Supabase Management API if available
    
    console.log('\n📋 SQL Schema to execute:')
    console.log('─'.repeat(50))
    console.log(sql)
    console.log('─'.repeat(50))
    
    console.log('\n⚠️  Supabase doesn\'t allow direct SQL execution via REST API.')
    console.log('📝 Please copy the SQL above and run it in your Supabase dashboard:')
    console.log('   1. Go to: https://supabase.com/dashboard/project/' + SUPABASE_URL.split('//')[1].split('.')[0])
    console.log('   2. Navigate to SQL Editor')
    console.log('   3. Click "New query"')
    console.log('   4. Paste the SQL above')
    console.log('   5. Click "Run"')
    
    // Alternative: Try using the Supabase Management API
    // This requires the project ref which we can extract from the URL
    const projectRef = SUPABASE_URL.split('//')[1].split('.')[0]
    
    console.log('\n🔄 Attempting to execute via Management API...')
    
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: sql
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Database schema created successfully!')
      console.log(result)
    } else {
      const error = await response.text()
      console.log('⚠️  Management API not available or requires different authentication')
      console.log('📝 Please use the manual method above')
    }

  } catch (error) {
    console.error('❌ Error setting up database:', error.message)
    console.log('\n📝 Please run the SQL manually in your Supabase dashboard')
    process.exit(1)
  }
}

setupDatabase()

