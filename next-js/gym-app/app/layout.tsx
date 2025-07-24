import './css/globals.css';
import { Metadata } from 'next';
 
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
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='flex justify-center items-center h-auto antialiased'>
        {children}
      </body>
    </html>
  );
}
