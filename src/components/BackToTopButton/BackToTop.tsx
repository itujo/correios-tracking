import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';

function BackToTop() {
  const [showScroll, setShowScroll] = useState(false);
  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop, { passive: true });
  }, []);

  return (
    <Box
      cursor='pointer'
      position='fixed'
      display={showScroll ? 'flex' : 'none'}
      bottom='20px'
      right='20px'
      zIndex={1}
    >
      <FaArrowCircleUp
        size={50}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </Box>
  );
}

export { BackToTop };
