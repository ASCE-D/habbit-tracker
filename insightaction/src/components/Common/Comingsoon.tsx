"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addInterested } from "@/actions/habit";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export default function ComingSoon({ feature }: { feature: string }) {
  const session: any = useSession();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (session.data?.user?.email) {
      setEmail(session.data.user.email);
    }
  }, [session.data?.user?.email]);

  console.log(feature);

  const onSubmitHandler = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    const result = await addInterested({
      email: email,
      features: feature,
    });

    console.log(result);
    if (result.success) {
      toast.success("We'll notify you");
    } else {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-white">
      <Card className="w-full max-w-md border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-primaryOrange">
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
            />
            <Button
              className="w-full bg-primaryOrange hover:bg-primaryOrange/90"
              onClick={onSubmitHandler}
            >
              Notify Me
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-400">
            We'll let you know when we launch.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
