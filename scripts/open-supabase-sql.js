const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const projectRef = SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'jxfpbrahiaynzyifshpe'

const schemaPath = path.join(__dirname, '../supabase/schema.sql')
const sql = fs.readFileSync(schemaPath, 'utf8')

console.log('\n🚀 Opening Supabase SQL Editor...\n')

// Open the SQL Editor in browser
const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`
exec(`open "${sqlEditorUrl}"`, (error) => {
  if (error) {
    console.log('⚠️  Could not open browser automatically')
    console.log(`📝 Please open: ${sqlEditorUrl}\n`)
  } else {
    console.log('✅ Opened SQL Editor in your browser!\n')
  }
  
  console.log('📋 SQL to Execute (copy this):')
  console.log('═'.repeat(70))
  console.log(sql)
  console.log('═'.repeat(70))
  console.log('\n📝 Steps:')
  console.log('1. The SQL Editor should be open in your browser')
  console.log('2. Copy the SQL shown above')
  console.log('3. Paste it into the SQL Editor')
  console.log('4. Click "Run" (or press Cmd/Ctrl + Enter)')
  console.log('5. Verify success message')
  console.log('6. Check "Table Editor" to see your new tables\n')
  console.log('✅ Once done, your database is ready!\n')
})

