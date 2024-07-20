import React from "react";

const PreLoader = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black"
      style={{ zIndex: 2147483647 }}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primaryOrange border-t-transparent"></div>
    </div>
  );
};

export default PreLoader;
