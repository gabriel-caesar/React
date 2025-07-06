import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

// swipe-in component using framer motion
function SwipeIn({ children, direction }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2, // 20% visible to trigger
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: direction },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.8, ease: 'easeOut' },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default SwipeIn;