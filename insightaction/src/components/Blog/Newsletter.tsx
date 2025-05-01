import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <div className="wow fadeInUp">
      <h3 className="mb-4 text-xl font-semibold text-white">Newsletter</h3>
      <p className="mb-5 text-gray-400">
        Subscribe to our newsletter to receive the latest updates and articles.
      </p>
      <form className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 text-white placeholder-gray-400 shadow-none outline-none focus:border-primaryOrange focus:ring-0"
        />
        <Button
          type="submit"
          className="w-full rounded-lg bg-primaryOrange px-6 py-3 text-base font-medium text-black shadow-md hover:bg-primaryOrange/90"
        >
          Subscribe Now
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
