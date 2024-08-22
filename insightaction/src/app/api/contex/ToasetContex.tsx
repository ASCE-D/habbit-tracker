"use client";

import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <div className="z-[999999] bg-white">
      <Toaster />
    </div>
  );
};

export default ToasterContext;
