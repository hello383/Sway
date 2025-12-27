#!/usr/bin/env node

/**
 * Code Quality Checker for Profile Redirect Issues
 * 
 * Scans the codebase for common patterns that could cause redirect bugs:
 * 1. Profile checks without visibility checks
 * 2. Redirects to /profile without checking profile_visibility
 * 3. Missing campaign_only handling
 */

const fs = require('fs');
const path = require('path');

const ISSUES = [];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function logIssue(file, line, severity, message, code) {
  ISSUES.push({ file, line, severity, message, code });
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Pattern 1: Check for profile.id without profile_visibility check
    if (trimmed.includes('profile') && trimmed.includes('.id') && !trimmed.includes('profile_visibility')) {
      // Check if this is part of a redirect pattern
      if (trimmed.includes('router.push') || trimmed.includes('redirect') || 
          (index > 0 && lines[index - 1].includes('router.push')) ||
          (index > 0 && lines[index - 1].includes('redirect'))) {
        logIssue(
          relativePath,
          lineNum,
          'WARNING',
          'Profile check without visibility check before redirect',
          trimmed.substring(0, 80)
        );
      }
    }

    // Pattern 2: Redirect to /profile without checking profile_visibility
    if (trimmed.includes('router.push') && trimmed.includes('/profile')) {
      // Check if previous lines check profile_visibility
      let hasVisibilityCheck = false;
      for (let i = Math.max(0, index - 10); i < index; i++) {
        if (lines[i].includes('profile_visibility') && 
            (lines[i].includes('visible') || lines[i].includes('email') || lines[i].includes('campaign_only'))) {
          hasVisibilityCheck = true;
          break;
        }
      }
      
      if (!hasVisibilityCheck) {
        logIssue(
          relativePath,
          lineNum,
          'WARNING',
          'Redirect to /profile without checking profile_visibility',
          trimmed.substring(0, 80)
        );
      }
    }

    // Pattern 3: Profile query without selecting profile_visibility
    if (trimmed.includes('.from(\'user_profiles\')') || trimmed.includes('.from("user_profiles")')) {
      // Check if select includes profile_visibility
      let hasVisibilityInSelect = false;
      for (let i = index; i < Math.min(lines.length, index + 5); i++) {
        if (lines[i].includes('.select') && lines[i].includes('profile_visibility')) {
          hasVisibilityInSelect = true;
          break;
        }
        if (lines[i].includes('.select(\'*\')') || lines[i].includes('.select("*")')) {
          hasVisibilityInSelect = true; // Select all includes it
          break;
        }
      }
      
      // Only warn if this is followed by a redirect check
      let isRedirectContext = false;
      for (let i = index; i < Math.min(lines.length, index + 15); i++) {
        if (lines[i].includes('router.push') || lines[i].includes('redirect') || 
            lines[i].includes('if (profile') || lines[i].includes('if(profile')) {
          isRedirectContext = true;
          break;
        }
      }
      
      if (isRedirectContext && !hasVisibilityInSelect) {
        logIssue(
          relativePath,
          lineNum,
          'INFO',
          'Profile query without profile_visibility in select (may need it for redirect logic)',
          trimmed.substring(0, 80)
        );
      }
    }

    // Pattern 4: Check for campaign_only handling
    if (trimmed.includes('campaign_only')) {
      // Check if it's properly handled in conditional
      if (trimmed.includes('if') || trimmed.includes('else')) {
        // This is likely fine, but we can note it
      } else if (trimmed.includes('profile_visibility') && !trimmed.includes('campaign_only')) {
        // Might be missing campaign_only handling
        logIssue(
          relativePath,
          lineNum,
          'INFO',
          'Profile visibility check - verify campaign_only is handled correctly',
          trimmed.substring(0, 80)
        );
      }
    }
  });
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules, .git, .next, etc.
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
      // Only scan app directory files
      if (fullPath.includes('/app/') || fullPath.includes('\\app\\')) {
        scanFile(fullPath);
      }
    }
  }
}

// Main execution
console.log(`${colors.cyan}🔍 Scanning codebase for profile redirect issues...${colors.reset}\n`);

const appDir = path.join(process.cwd(), 'app');
if (fs.existsSync(appDir)) {
  scanDirectory(appDir);
} else {
  console.log(`${colors.red}Error: app directory not found${colors.reset}`);
  process.exit(1);
}

// Report results
console.log(`${colors.cyan}📊 Scan Results:${colors.reset}\n`);

if (ISSUES.length === 0) {
  console.log(`${colors.green}✅ No issues found!${colors.reset}\n`);
} else {
  // Group by severity
  const warnings = ISSUES.filter(i => i.severity === 'WARNING');
  const infos = ISSUES.filter(i => i.severity === 'INFO');

  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠️  WARNINGS (${warnings.length}):${colors.reset}`);
    warnings.forEach(issue => {
      console.log(`  ${colors.yellow}${issue.file}:${issue.line}${colors.reset}`);
      console.log(`    ${issue.message}`);
      console.log(`    ${colors.blue}${issue.code}${colors.reset}\n`);
    });
  }

  if (infos.length > 0) {
    console.log(`${colors.blue}ℹ️  INFO (${infos.length}):${colors.reset}`);
    infos.forEach(issue => {
      console.log(`  ${colors.blue}${issue.file}:${issue.line}${colors.reset}`);
      console.log(`    ${issue.message}`);
      console.log(`    ${colors.blue}${issue.code}${colors.reset}\n`);
    });
  }

  console.log(`${colors.cyan}Total issues found: ${ISSUES.length}${colors.reset}\n`);
  
  // Exit with error code if warnings found
  if (warnings.length > 0) {
    process.exit(1);
  }
}

console.log(`${colors.green}✨ Scan complete!${colors.reset}\n`);

