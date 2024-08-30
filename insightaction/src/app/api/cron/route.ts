import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
 

  try {
    // Call the /api/bulknoti route
    const response = await fetch(`https://insightaction.pureapps.tech/api/bulknoti`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary headers here
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Bulk notification result:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Bulk notification sent successfully',
      result 
    });

  } catch (error) {
    console.error("Error sending bulk notification:", error);
    return NextResponse.json({ success: false, message: "Error sending bulk notification" }, { status: 500 });
  }
}