import { Box } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

function SearchButton() {
  return (
    <Box cursor='pointer' position='fixed' bottom='20px' left='20px' zIndex={1}>
      <FaSearch size={50} />
    </Box>
  );
}

export { SearchButton };
