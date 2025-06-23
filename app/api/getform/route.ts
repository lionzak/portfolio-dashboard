// /app/api/getform/route.ts

export async function GET(request: Request) {
  try {
    // Parse the URL to get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    
    // Build the API URL with pagination
    const apiUrl = `https://api.getform.io/v1/forms/byvymjra?token=GMZqeIUP4X6RSWztaqAj0d7xO6xCbjr3tLN9UCmHxszYJqRDOFgW2Km7fdTG&page=${page}`;
    
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Getform API response:', res.status, res.statusText);
      return new Response(
        JSON.stringify({ 
          error: "Getform fetch failed", 
          status: res.status,
          statusText: res.statusText 
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await res.json();
    
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('API route error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}