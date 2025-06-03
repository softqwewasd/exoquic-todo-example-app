# In-Memory Todos Next.js

This is a Next.js version of the In-Memory Todos application, converted from a Vite React app with an Express backend.

## Features

- Next.js App Router architecture
- Integrated API routes (serverless functions)
- Environment variable support
- CORS configuration
- Ready for Vercel deployment

## API Endpoints

### `/api/v1/exo/auth`

This endpoint communicates with the Exoquic service to get an access token. It's a direct replacement for the previous Express server endpoint.

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
EXOQUIC_API_URL=http://localhost:9098/v3/authorize/
EXOQUIC_API_KEY=YOUR_API_KEY
```

## Deployment to Vercel

1. Push this directory to a GitHub repository
2. Connect the repository to Vercel
3. Set the following environment variables in the Vercel dashboard:
   - `EXOQUIC_API_URL`: URL of your Exoquic authorization endpoint
   - `EXOQUIC_API_KEY`: Your Exoquic API key

## Migration Notes

This project has been migrated from a Vite React application to Next.js. The main changes include:

1. Moved from React Router to Next.js App Router
2. Converted Express server endpoint to Next.js API route
3. Added CORS support at both the API route and middleware level
4. Updated frontend to use the new API route path

## Dependencies

- Next.js for both frontend and API
- React and React DOM
- Tailwind CSS for styling
- Lucide React for icons
- Exoquic Browser SDK for real-time data
