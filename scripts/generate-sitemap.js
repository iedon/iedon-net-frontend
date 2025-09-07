#!/usr/bin/env node

/**
 * Sitemap Generator for iEdon-Net Frontend
 * 
 * This script fetches posts from the API and generates a sitemap.xml
 * file in the public directory during build time.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const SITE_URL = 'https://iedon.net'
const API_BASE_URL = 'https://api.iedon.com/dn42/peerapi'
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml')

// Static routes with their priorities and change frequencies
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/nodes', priority: '0.8', changefreq: 'monthly' },
  { path: '/signin', priority: '0.3', changefreq: 'monthly' }
]

/**
 * Fetch posts from the API
 */
async function fetchPosts() {
  try {
    console.log('📡 Fetching posts from API...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/list/posts`, {
      headers: {
        'Content-Type': 'application/json',
        'X-PeerAPI-Version': 'iedon-net/2.3.1',
        'User-Agent': 'iEdon-Net-Sitemap-Generator/1.0'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.code !== 0 || !data.data?.posts) {
      throw new Error(`API Error: ${data.message || 'Invalid response structure'}`)
    }

    console.log(`✅ Successfully fetched ${data.data.posts.length} posts`)
    return data.data.posts
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Request timeout while fetching posts')
    } else {
      console.error('❌ Error fetching posts:', error.message)
    }
    
    console.log('🔄 Proceeding with static routes only...')
    
    // Return empty array if API fails - sitemap will still be generated with static routes
    return []
  }
}

/**
 * Generate XML sitemap content
 */
function generateSitemap(posts) {
  const currentDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Add static routes
  console.log('📝 Adding static routes to sitemap...')
  STATIC_ROUTES.forEach(route => {
    xml += `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
  })

  // Add dynamic post routes
  console.log(`📝 Adding ${posts.length} post routes to sitemap...`)
  posts.forEach(post => {
    // Convert updatedAt to YYYY-MM-DD format
    let lastmod = currentDate
    try {
      if (post.updatedAt) {
        lastmod = new Date(post.updatedAt).toISOString().split('T')[0]
      }
    } catch (error) {
      console.warn(`⚠️  Invalid date for post ${post.postId}: ${post.updatedAt}`)
    }

    xml += `  <url>
    <loc>${SITE_URL}/post/${post.postId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
  })

  xml += `</urlset>`
  
  return xml
}

/**
 * Write sitemap to file
 */
function writeSitemap(content) {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_PATH)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(OUTPUT_PATH, content, 'utf8')
    console.log(`✅ Sitemap generated successfully: ${OUTPUT_PATH}`)
    
    // Display file stats
    const stats = fs.statSync(OUTPUT_PATH)
    console.log(`📊 Sitemap size: ${(stats.size / 1024).toFixed(2)} KB`)
  } catch (error) {
    console.error('❌ Error writing sitemap:', error.message)
    throw error
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting sitemap generation...')
  console.log(`🌐 Site URL: ${SITE_URL}`)
  console.log(`📡 API URL: ${API_BASE_URL}`)
  
  try {
    // Fetch posts from API
    const posts = await fetchPosts()
    
    // Generate sitemap XML
    const sitemapXML = generateSitemap(posts)
    
    // Write to file
    writeSitemap(sitemapXML)
    
    console.log('🎉 Sitemap generation completed successfully!')
    
    // Display summary
    const totalUrls = STATIC_ROUTES.length + posts.length
    console.log(`📈 Total URLs in sitemap: ${totalUrls}`)
    console.log(`   - Static routes: ${STATIC_ROUTES.length}`)
    console.log(`   - Dynamic post routes: ${posts.length}`)
    
    // If no posts were fetched, warn but don't fail
    if (posts.length === 0) {
      console.log('⚠️  Warning: No posts were fetched from API, only static routes included')
      console.log('   This may be due to API connectivity issues, but sitemap generation will continue')
    }
    
  } catch (error) {
    console.error('💥 Fatal error during sitemap generation:', error.message)
    
    // Try to generate a basic sitemap with static routes only
    try {
      console.log('🔄 Attempting to generate sitemap with static routes only...')
      const fallbackXML = generateSitemap([])
      writeSitemap(fallbackXML)
      console.log('✅ Fallback sitemap generated successfully with static routes only')
    } catch (fallbackError) {
      console.error('💀 Failed to generate even fallback sitemap:', fallbackError.message)
      process.exit(1)
    }
  }
}

// Run the script
main()
