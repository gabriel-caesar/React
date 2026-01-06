import { Metadata } from 'next';
import SideBar from '../ui/dashboard/sidebar/sidebar-wrapper';

export const metadata: Metadata = {
  title: {
    template: '%s | Diversus',
    default: 'Diversus',
  },
  description: 'AI-Personalized Fitness & Nutrition Platform.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className='flex w-full'>
      <SideBar />
      {children}
    </div>
  );
}
