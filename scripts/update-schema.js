const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

async function updateSchema() {
  console.log('🔄 Updating Supabase schema...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  
  // Read the SQL
  const sqlPath = path.join(__dirname, '../supabase/schema-update.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  
  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  console.log(`📋 Executing ${statements.length} SQL statements...\n`)
  
  // Execute each statement via RPC (if available) or direct query
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (!statement) continue
    
    try {
      // Try using the REST API to execute SQL
      // Note: Supabase doesn't support direct SQL via REST, so we'll need to use the SQL Editor
      // But let's try using the admin API
      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      console.log(statement.substring(0, 100) + '...\n')
      
      // Unfortunately, Supabase doesn't allow SQL execution via REST API
      // We need to use the SQL Editor in the dashboard
      console.log('⚠️  Supabase requires SQL execution through their dashboard.')
      console.log('\n📋 Please run this SQL in your Supabase SQL Editor:\n')
      console.log('═'.repeat(70))
      console.log(sql)
      console.log('═'.repeat(70))
      console.log('\n📝 Steps:')
      console.log('1. Go to: https://supabase.com/dashboard/project/jxfpbrahiaynzyifshpe')
      console.log('2. Click "SQL Editor"')
      console.log('3. Click "New query"')
      console.log('4. Paste the SQL above')
      console.log('5. Click "Run"\n')
      break
    } catch (error) {
      console.error(`❌ Error executing statement ${i + 1}:`, error.message)
    }
  }
}

updateSchema()

