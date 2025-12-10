import { getConversationsCount, getMessagesCount, getUserProfilePicture } from '@/app/actions/chat';
import { getPlansCount } from '@/app/actions/plans';
import { Metadata } from 'next';
import { getUser } from '@/app/actions/auth';
import { auth } from '@/app/actions/credential-handler';
import ProfileCard from '@/app/ui/dashboard/profile/profile-card';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Page() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Missing user email.');
  const user = await getUser(email); // server side user fetch
  const userId = user ? user.id : '';
  const allUserPlans = await getPlansCount(userId);
  const allUserMessages = await getMessagesCount(userId);
  const allUserConversations = await getConversationsCount(userId);
  const userProfilePicture = await getUserProfilePicture(userId);

  return (
    <div className='flex justify-center items-center w-screen px-4 py-20'>
      <ProfileCard
        user={user}
        conversationCount={allUserConversations}
        profilePictureUrl={userProfilePicture}
        messagesCount={allUserMessages}
        plansCount={allUserPlans}
      />
    </div>
  );
}
