import { Box } from '@chakra-ui/react';
import { ReactElement } from 'react';
import Layout from '../../components/Layout';

export default function Index() {
  return <Box>wms</Box>;
}
Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
