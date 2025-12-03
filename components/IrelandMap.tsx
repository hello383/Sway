'use client'

import { useEffect, useRef } from 'react'
import { getTownCoordinates, latLngToSvgCoords } from '@/lib/geocoding'

// Accurate Ireland SVG map with all 32 counties
// Using the provided SVG file

interface LocationPin {
  town: string
  county: string
  count: number
}

interface IrelandMapProps {
  countyStats?: Record<string, number>
  userCounty?: string | null
  locationPins?: LocationPin[]
}

// Map county names to SVG path IDs
const COUNTY_ID_MAP: Record<string, string> = {
  'Antrim': 'GB-NIR', // Northern Ireland (shared path)
  'Armagh': 'GB-NIR',
  'Down': 'GB-NIR',
  'Fermanagh': 'GB-NIR',
  'Derry': 'GB-NIR',
  'Tyrone': 'GB-NIR',
  'Carlow': 'IE-CW',
  'Cavan': 'IE-CN',
  'Clare': 'IE-CE',
  'Cork': 'IE-CO',
  'Donegal': 'IE-DL',
  'Dublin': 'IE-D',
  'Galway': 'IE-G',
  'Kerry': 'IE-KY',
  'Kildare': 'IE-KE',
  'Kilkenny': 'IE-KK',
  'Laois': 'IE-LS',
  'Leitrim': 'IE-LM',
  'Limerick': 'IE-LK',
  'Longford': 'IE-LD',
  'Louth': 'IE-LH',
  'Mayo': 'IE-MO',
  'Meath': 'IE-MH',
  'Monaghan': 'IE-MN',
  'Offaly': 'IE-OY',
  'Roscommon': 'IE-RN',
  'Sligo': 'IE-SO',
  'Tipperary': 'IE-TA',
  'Waterford': 'IE-WD',
  'Westmeath': 'IE-WH',
  'Wexford': 'IE-WX',
  'Wicklow': 'IE-WW',
}

export default function IrelandMap({ 
  countyStats = {}, 
  userCounty = null,
  locationPins = []
}: IrelandMapProps) {
  const svgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Load and inject the SVG
    console.log('🔍 Loading Ireland SVG...')
    fetch('/ireland.svg')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load SVG: ${res.status}`)
        }
        return res.text()
      })
      .then((text) => {
        if (!svgRef.current) {
          console.warn('⚠️ svgRef.current is null')
          return
        }
        console.log('✅ SVG loaded, parsing...')

        // Parse the SVG
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(text, 'image/svg+xml')
        const svgElement = svgDoc.querySelector('svg')
        
        // Check for parsing errors
        const parserError = svgDoc.querySelector('parsererror')
        if (parserError) {
          console.error('❌ SVG parsing error:', parserError.textContent)
          return
        }

        if (!svgElement) {
          console.error('❌ No <svg> root element found in ireland.svg')
          return
        }

        // Remove any non-path elements that might create boxes (rect, polygon, etc.)
        // First, remove all non-path shape elements
        const shapesToRemove = ['rect', 'polygon', 'circle', 'ellipse', 'line', 'polyline']
        shapesToRemove.forEach((tagName) => {
          const elements = svgElement.querySelectorAll(tagName)
          elements.forEach((el) => {
            // Only remove if it's not part of a location pin
            if (!el.closest('.location-pin') && !el.getAttribute('class')?.includes('pin')) {
              el.remove()
            }
          })
        })
        
        // Remove any groups that don't contain paths
        const groups = Array.from(svgElement.querySelectorAll('g'))
        groups.forEach((group) => {
          const hasPaths = group.querySelector('path')
          const isLocationPin = group.classList.contains('location-pin')
          if (!hasPaths && !isLocationPin) {
            group.remove()
          }
        })
        
        // Ensure paths don't have any box-like styling
        const allPaths = svgElement.querySelectorAll('path')
        allPaths.forEach((path) => {
          path.removeAttribute('stroke-dasharray')
          path.removeAttribute('stroke-dashoffset')
        })

        // Get SVG dimensions from the original SVG
        const originalWidth = parseFloat(svgElement.getAttribute('width') || '605.68')
        const originalHeight = parseFloat(svgElement.getAttribute('height') || '775.40')
        const existingViewBox = svgElement.getAttribute('viewBox')
        
        // Use existing viewBox or create one from width/height
        const viewBox = existingViewBox || `0 0 ${originalWidth} ${originalHeight}`
        const [_, __, viewBoxWidth, viewBoxHeight] = viewBox.split(' ').map(parseFloat)
        const svgWidth = viewBoxWidth || originalWidth
        const svgHeight = viewBoxHeight || originalHeight

        // Set SVG to be responsive and ensure no background/border
        svgElement.setAttribute('width', '100%')
        svgElement.setAttribute('height', '100%')
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        svgElement.setAttribute('style', 'background: transparent; border: none; overflow: visible;')
        // Hide any potential box elements via CSS (but keep location pin circles)
        const style = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style')
        style.textContent = `
          rect, polygon, ellipse, line, polyline {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          circle:not(.location-pin circle):not([class*="pin"]) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          path {
            outline: none !important;
            border: none !important;
          }
          path:focus,
          path:focus-visible {
            outline: none !important;
          }
        `
        svgElement.insertBefore(style, svgElement.firstChild)
        if (!existingViewBox) {
          svgElement.setAttribute('viewBox', viewBox)
        }

        // Helper to get fill color for a county
        const getCountyFill = (countyName: string, pathId: string) => {
          if (pathId === 'GB-NIR') {
            // Northern Ireland - check if any NI county has stats or is user county
            const niCounties = ['Antrim', 'Armagh', 'Down', 'Fermanagh', 'Derry', 'Tyrone']
            const hasStats = niCounties.some(c => (countyStats[c] || 0) > 0)
            const isUserCounty = niCounties.includes(userCounty || '')
            
            if (isUserCounty) return 'rgba(217, 70, 239, 0.4)'
            if (hasStats) return 'rgba(147, 51, 234, 0.25)'
            return 'rgba(255,255,255,0.03)'
          }

          if (userCounty === countyName) {
            return 'rgba(217, 70, 239, 0.4)'
          }
          const count = countyStats[countyName] || 0
          if (count > 0) {
            return 'rgba(147, 51, 234, 0.25)'
          }
          return 'rgba(255,255,255,0.03)'
        }

        const getCountyStroke = (countyName: string, pathId: string) => {
          if (pathId === 'GB-NIR') {
            const niCounties = ['Antrim', 'Armagh', 'Down', 'Fermanagh', 'Derry', 'Tyrone']
            const isUserCounty = niCounties.includes(userCounty || '')
            return isUserCounty ? 'rgba(217, 70, 239, 0.6)' : 'rgba(255,255,255,0.15)'
          }
          
          if (userCounty === countyName) {
            return 'rgba(217, 70, 239, 0.6)'
          }
          return 'rgba(255,255,255,0.15)'
        }

        // Style all county paths
        const paths = svgElement.querySelectorAll('path')
        paths.forEach((path) => {
          const pathId = path.getAttribute('id') || ''
          const title = path.getAttribute('title') || ''
          
          // Find county name
          let countyName = title
          if (pathId === 'GB-NIR') {
            countyName = 'Northern Ireland'
          } else {
            countyName = Object.keys(COUNTY_ID_MAP).find(
              (name) => COUNTY_ID_MAP[name] === pathId
            ) || title
          }

          // Apply styling - ensure transparent fill for counties without stats
          path.setAttribute('fill', getCountyFill(countyName, pathId))
          path.setAttribute('stroke', getCountyStroke(countyName, pathId))
          path.setAttribute('stroke-width', userCounty === countyName ? '2.5' : '2')
          path.setAttribute('class', 'hover:opacity-100 transition-opacity cursor-pointer')
          path.setAttribute('tabindex', '-1')
          path.setAttribute('focusable', 'false')
          
          // Update title with count
          const count = countyStats[countyName] || 0
          if (count > 0 || userCounty === countyName) {
            path.setAttribute('title', `${countyName}: ${count} professional${count !== 1 ? 's' : ''}`)
          } else {
            path.setAttribute('title', countyName || 'County')
          }
        })

        // Extract geoViewBox from SVG (if available)
        const geoViewBox = svgElement.getAttribute('mapsvg:geoViewBox') || 
                          svgElement.getAttributeNS('http://mapsvg.com', 'geoViewBox') ||
                          '-10.617532 55.384216 -5.429631 51.419751'
        
        // Parse geoViewBox: "west north east south"
        const [west, north, east, south] = geoViewBox.split(' ').map(parseFloat)

        // Add anonymous location pins
        locationPins.forEach((pin) => {
          const coords = getTownCoordinates(pin.town, pin.county)
          if (!coords) return

          // Convert lat/lng to SVG coordinates using the geoViewBox
          const lngRange = east - west
          const latRange = north - south
          const x = ((coords.lng - west) / lngRange) * svgWidth
          const y = ((north - coords.lat) / latRange) * svgHeight
          const svgCoords = { x, y }
          
          // Create pin group
          const pinGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
          pinGroup.setAttribute('class', 'location-pin')
          pinGroup.setAttribute('transform', `translate(${svgCoords.x}, ${svgCoords.y})`)
          
          // Pin circle (outer glow)
          const glow = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'circle')
          glow.setAttribute('cx', '0')
          glow.setAttribute('cy', '0')
          glow.setAttribute('r', pin.count > 1 ? '8' : '6')
          glow.setAttribute('fill', 'rgba(147, 51, 234, 0.3)')
          glow.setAttribute('class', 'animate-pulse')
          pinGroup.appendChild(glow)
          
          // Pin circle (main)
          const circle = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'circle')
          circle.setAttribute('cx', '0')
          circle.setAttribute('cy', '0')
          circle.setAttribute('r', pin.count > 1 ? '6' : '4')
          circle.setAttribute('fill', pin.count > 1 ? '#9333ea' : '#a855f7')
          circle.setAttribute('stroke', 'rgba(255,255,255,0.8)')
          circle.setAttribute('stroke-width', '1.5')
          circle.setAttribute('class', 'cursor-pointer hover:opacity-80 transition-opacity')
          pinGroup.appendChild(circle)
          
          // Count label for clusters
          if (pin.count > 1) {
            const text = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'text')
            text.setAttribute('x', '0')
            text.setAttribute('y', '0')
            text.setAttribute('font-size', '10')
            text.setAttribute('fill', 'white')
            text.setAttribute('text-anchor', 'middle')
            text.setAttribute('dominant-baseline', 'central')
            text.setAttribute('font-weight', '700')
            text.setAttribute('class', 'pointer-events-none')
            text.textContent = String(pin.count)
            pinGroup.appendChild(text)
          }
          
          // Tooltip title
          pinGroup.setAttribute('title', `${pin.town}, ${pin.county}: ${pin.count} professional${pin.count !== 1 ? 's' : ''}`)
          
          svgElement.appendChild(pinGroup)
        })

        // Add text labels for counties with stats
        Object.entries(countyStats).forEach(([countyName, count]) => {
          if (count === 0) return

          const pathId = COUNTY_ID_MAP[countyName]
          if (!pathId) return

          const path = svgElement.querySelector(`path[id="${pathId}"]`)
          if (!path) return

          // Try to get bounding box
          try {
            const bbox = (path as any).getBBox?.()
            if (bbox) {
              const text = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'text')
              text.setAttribute('x', String(bbox.x + bbox.width / 2))
              text.setAttribute('y', String(bbox.y + bbox.height / 2))
              text.setAttribute('font-size', '18')
              text.setAttribute('fill', 'rgba(255,255,255,0.95)')
              text.setAttribute('text-anchor', 'middle')
              text.setAttribute('class', 'pointer-events-none font-bold')
              text.setAttribute('font-weight', '700')
              text.textContent = String(count)
              text.setAttribute('id', `label-${countyName}`)
              svgElement.appendChild(text)
            }
          } catch (e) {
            // getBBox might not work if SVG not rendered yet
            console.warn('Could not get bbox for', countyName)
          }
        })

        // Remove any simple shapes that might be boxes (paths with very short data)
        // Real county paths have complex path data (hundreds of characters)
        const simplePaths = Array.from(svgElement.querySelectorAll('path'))
        simplePaths.forEach(path => {
          const pathData = path.getAttribute('d') || ''
          // If path data is very short (< 100 chars), it's likely a simple shape/box, not a county
          if (pathData.length < 100 && !path.getAttribute('class')?.includes('location-pin')) {
            console.warn('Removing simple path (likely a box):', {
              id: path.getAttribute('id'),
              title: path.getAttribute('title'),
              dLength: pathData.length
            })
            path.remove()
          }
        })

        // Inject the styled SVG
        svgRef.current.innerHTML = new XMLSerializer().serializeToString(svgElement)
      })
      .catch((err) => {
        console.error('❌ Failed to load Ireland SVG:', err)
        if (svgRef.current) {
          svgRef.current.innerHTML = '<div style="color: red; padding: 20px;">Failed to load map</div>'
        }
      })
  }, [countyStats, userCounty, locationPins])

  return (
    <div 
      ref={svgRef}
      className="relative w-full h-full [&_rect]:hidden [&_polygon]:hidden [&_circle]:hidden [&_ellipse]:hidden [&_line]:hidden [&_polyline]:hidden"
      style={{ 
        background: 'transparent',
        overflow: 'visible'
      }}
    />
  )
}
