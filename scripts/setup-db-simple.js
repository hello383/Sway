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

async function setupDatabase() {
  console.log('📝 Supabase Database Setup\n')
  console.log(`🔗 Project: ${SUPABASE_URL}\n`)

  // Read SQL schema
  const schemaPath = path.join(__dirname, '../supabase/schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf8')

  console.log('📋 SQL Schema to Execute:')
  console.log('═'.repeat(70))
  console.log(sql)
  console.log('═'.repeat(70))
  
  console.log('\n⚠️  Supabase requires manual SQL execution for security reasons.')
  console.log('\n📝 Please follow these steps:\n')
  console.log('1. Open your Supabase dashboard:')
  console.log(`   https://supabase.com/dashboard/project/${SUPABASE_URL.split('//')[1].split('.')[0]}\n`)
  console.log('2. Click on "SQL Editor" in the left sidebar\n')
  console.log('3. Click "New query"\n')
  console.log('4. Copy and paste the SQL shown above\n')
  console.log('5. Click "Run" (or press Cmd/Ctrl + Enter)\n')
  console.log('6. Verify tables were created in "Table Editor"\n')
  console.log('✅ Once done, your database will be ready to use!\n')
}

setupDatabase()

