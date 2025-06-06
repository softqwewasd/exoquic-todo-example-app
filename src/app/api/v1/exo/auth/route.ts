import { NextRequest, NextResponse } from 'next/server';

// Get values from environment variables with fallbacks
const EXOQUIC_API_URL = process.env.EXOQUIC_API_URL || 'https://dev.exoquic.com/v3/authorize';
const API_KEY = process.env.EXOQUIC_API_KEY || 'PLACEHOLDER';

// CORS headers for allowing cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400',
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(EXOQUIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        "readableDestinations": "todos",
        "writableDestinations": "todos"
      })
    });
    
    if (!response.ok) {
      throw new Error(`Exoquic API responded with status: ${response.status}`);
    }
    
    const accessToken = await response.text();
    
    // Return response with CORS headers
    return new NextResponse(accessToken, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error fetching Exoquic token:', error);
    return new NextResponse('Error fetching token', { 
      status: 500,
      headers: corsHeaders
    });
  }
}
