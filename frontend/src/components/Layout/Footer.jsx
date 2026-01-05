import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Arnica Connect. All rights reserved.</p>
          <p className="mt-1">Healthcare professional platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;