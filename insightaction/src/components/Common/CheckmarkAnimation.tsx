import React from "react";

const CheckmarkAnimation = () => {
  return (
    <div className="z-[9999] flex h-screen items-center justify-center">
      <div className="relative h-14 w-14 overflow-hidden rounded-full bg-green-500">
        <svg
          className="checkmark h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
        <div className="text-white">Stacked successfully</div>
      </div>
    </div>
  );
};

export default CheckmarkAnimation;
