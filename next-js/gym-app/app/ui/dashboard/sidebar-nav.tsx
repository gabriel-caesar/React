import { Power } from 'lucide-react';
import { signUserOut } from '../../actions/auth';
import { AnimatePresence, motion } from 'motion/react';

export default function SideBarNav({ openSideBar }: { openSideBar: boolean }) {
  return (
    <nav
      id='sidebar'
      className={`h-screen bg-neutral-600 ${openSideBar ? 'w-100' : 'w-0'} relative transition-all`}
    >
      <form
        action={async () => await signUserOut()}
        className='absolute bottom-2 w-full'
      >
        <AnimatePresence>
          <motion.button
            className={`${openSideBar ? 'flex m-auto' : 'hidden'} items-center justify-between p-2 text-center text-lg w-11/12 rounded-md bg-transparent text-white hover:cursor-pointer hover:bg-neutral-900 transition-all duration-150 mt-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Sign Out
            <Power className='ml-5' size={20} />
          </motion.button>
        </AnimatePresence>
      </form>
    </nav>
  );
}
