import React from 'react';
import AppLayout from '@/components/AppLayout';

/**
 * The Index component serves as the default landing page.
 * It is kept minimal and relies on the parent component (App.tsx)
 * to provide necessary contexts (like Firebase, Wallet, and Theme).
 */
const Index: React.FC = () => {
  return <AppLayout />;
};

export default Index;
