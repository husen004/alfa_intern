'use client';

import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Navbar from '@/components/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=''>
        <Provider store={store}>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
