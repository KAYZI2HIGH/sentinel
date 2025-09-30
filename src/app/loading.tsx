import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0c0414] text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading analysis...</p>
      </div>
    </div>
  );
};

export default Loading;
