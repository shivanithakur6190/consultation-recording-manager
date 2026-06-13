import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-background text-text-dark dark:text-textLight">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 px-4 lg:px-8 py-6 animate-fade-in">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;