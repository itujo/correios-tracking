import { Box } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchButton({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
}) {
  return (
    <Box
      cursor='pointer'
      position='fixed'
      bottom='20px'
      left='20px'
      zIndex={1}
      onClick={onClick}
    >
      <FaSearch size={50} />
    </Box>
  );
}

export { SearchButton };
