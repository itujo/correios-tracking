import { Box } from '@chakra-ui/react';
import { ReactElement } from 'react';
import useSWR from 'swr';
import Layout from '../../../components/Layout';
import api from '../../../services/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);
export default function Outbound() {
  const { data, error } = useSWR('/order/outbound', fetcher);
  if (!data) return <Box>Loading data</Box>;
  if (error) {
    return <Box>Erro querying data</Box>;
  }
  console.log(data);

  if (data.length > 0) {
    const streetsWithOrders = data.map(
      (order) => order.box.boxNo.split('-')[0]
    );

    console.log(streetsWithOrders);

    return (
      <Box textAlign='center' mt={2}>
        {streetsWithOrders.map((street) => (
          <Box>{street}</Box>
        ))}
      </Box>
    );
  }

  return (
    <Box mt={2} p={2} textAlign='center'>
      no orders to pick
    </Box>
  );
}

Outbound.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
