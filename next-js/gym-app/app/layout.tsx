import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './css/globals.css';

// nextjs font implementation to remove external network requests
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  preload: false,
})

export const metadata: Metadata = {
  title: {
    template: '%s | Diversus',
    default: 'Diversus',
  },
  description: 'AI-Personalized Fitness & Nutrition Platform.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={roboto.className}>
      <body className='flex justify-center items-center h-auto antialiased'>
        {children}
      </body>
    </html>
  );
}
