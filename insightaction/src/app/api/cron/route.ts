import { NextRequest, NextResponse } from "next/server";



export default async function handler(request: NextRequest) {
    // Check if the request is a cron job
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      // Call the /api/bulknoti route
      const response = await fetch(`/api/bulknoti`, {
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
      return NextResponse.json({ success: false, message: "Error sending bulk notification" });
    }
  }