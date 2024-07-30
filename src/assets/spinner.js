import React from 'react';

const Spinner = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
    <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
  </div>
);

export default Spinner;
