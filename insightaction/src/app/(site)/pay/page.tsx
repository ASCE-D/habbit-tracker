'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Choose Your Payment Method</CardTitle>
          <CardDescription className="text-center">Secure and easy payment options for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.open('https://rzp.io/l/03TJ4PmJ', '_blank')}
          >
            Pay with UPI / Indian Methods
          </Button>
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => window.open('https://insightaction.lemonsqueezy.com/checkout', '_blank')}
          >
            Pay with International Methods
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Powered by Razorpay and Lemon Squeezy
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;