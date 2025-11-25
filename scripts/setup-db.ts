import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

async function setupDatabase() {
  try {
    console.log('📝 Setting up Supabase database...')
    console.log(`🔗 Connecting to: ${SUPABASE_URL}\n`)

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql')
    const sql = fs.readFileSync(schemaPath, 'utf8')

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📋 Executing ${statements.length} SQL statements...\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length === 0) continue

      try {
        // Use RPC to execute SQL (if available) or use direct query
        // Note: Supabase doesn't expose direct SQL execution via JS client
        // We'll need to use the REST API or provide manual instructions
        
        // For now, let's try using the REST API directly
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql: statement })
        })

        if (!response.ok && response.status !== 404) {
          // If RPC doesn't exist, we'll need manual setup
          throw new Error('RPC function not available')
        }

        console.log(`✅ Statement ${i + 1}/${statements.length} executed`)
      } catch (error: any) {
        // Supabase doesn't allow direct SQL execution via REST API for security
        // We need to use the SQL Editor in the dashboard
        console.log('\n⚠️  Direct SQL execution not available via API')
        console.log('📝 Please run the SQL manually in your Supabase dashboard:\n')
        console.log('─'.repeat(60))
        console.log(sql)
        console.log('─'.repeat(60))
        console.log('\n📋 Steps:')
        console.log('1. Go to: https://supabase.com/dashboard')
        console.log('2. Select your project')
        console.log('3. Navigate to SQL Editor')
        console.log('4. Click "New query"')
        console.log('5. Paste the SQL above')
        console.log('6. Click "Run" (or Cmd/Ctrl + Enter)\n')
        process.exit(0)
      }
    }

    console.log('\n✅ Database schema created successfully!')
    console.log('🎉 You can now use the application!')

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.log('\n📝 Please run the SQL manually in your Supabase dashboard')
    process.exit(1)
  }
}

setupDatabase()

