#!/usr/bin/env node

/**
 * Sitemap Validator for iEdon-Net Frontend
 * 
 * This script validates the generated sitemap.xml file
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml')

function validateSitemap() {
  try {
    if (!fs.existsSync(SITEMAP_PATH)) {
      throw new Error('sitemap.xml not found')
    }

    const content = fs.readFileSync(SITEMAP_PATH, 'utf8')
    
    // Basic XML structure validation
    if (!content.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      throw new Error('Invalid XML declaration')
    }

    if (!content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
      throw new Error('Invalid urlset declaration')
    }

    if (!content.includes('</urlset>')) {
      throw new Error('Missing closing urlset tag')
    }

    // Count URLs
    const urlMatches = content.match(/<url>/g)
    const urlCount = urlMatches ? urlMatches.length : 0

    const stats = fs.statSync(SITEMAP_PATH)
    
    console.log('✅ Sitemap validation passed!')
    console.log(`📊 Total URLs: ${urlCount}`)
    console.log(`📁 File size: ${(stats.size / 1024).toFixed(2)} KB`)
    
    return true
  } catch (error) {
    console.error('❌ Sitemap validation failed:', error.message)
    return false
  }
}

if (validateSitemap()) {
  process.exit(0)
} else {
  process.exit(1)
}
