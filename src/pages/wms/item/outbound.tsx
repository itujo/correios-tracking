import { Box, Button, FormControl, Input } from '@chakra-ui/react';
import { FormEvent, ReactElement, useRef, useState } from 'react';
import useSWR from 'swr';
import Layout from '../../../components/Layout';
import api from '../../../services/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);
export default function Outbound() {
  const { data, error } = useSWR('/order/outbound', fetcher);

  const [boxNo, setBoxNo] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [items, setItems] = useState<any>(null);
  const boxNoRef = useRef<HTMLInputElement>(null);
  const itemCodeRef = useRef<HTMLInputElement>(null);

  if (!data) return <Box>Loading data</Box>;
  if (error) {
    return <Box>Erro querying data</Box>;
  }

  if (data.length < 1) {
    return (
      <Box mt={2} p={2} textAlign='center'>
        no orders to pick
      </Box>
    );
  }

  const streetsWithOrders = data.map(
    (order: any) => order.box.boxNo.split('-')[0]
  );

  const formSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!boxNo) {
      alert('please insert box no');
    }

    const box = await api
      .post(`/box/list`, { boxNo })
      .then((res) => res.data.box);

    if (!box) {
      if (boxNoRef.current) {
        setBoxNo('');
        boxNoRef.current.focus();
      }
      return alert('box not found');
    }

    if (box) {
      if (itemCodeRef.current) {
        itemCodeRef.current.focus();
      }
      setItems(box.items);
    }

    if (items) {
      console.log(items);
      await api
        .post('/item/outbound', {
          boxNo,
          itemCode,
        })
        .then((res) => {
          alert(res.data.message);

          // console.table(
          //   items!.filter((item) => item.itemCode !== item.res.data.itemCode)
          // );
        })
        .catch(() => {
          alert('wrong item code or item already picked');
        });
    }

    return 1;
  };

  return (
    <Box mt={2} p={2}>
      <form onSubmit={formSubmit}>
        <FormControl>
          <Input
            id='boxNo'
            placeholder='box number'
            value={boxNo}
            disabled={!!items}
            onChange={(e) => setBoxNo(e.target.value)}
            ref={boxNoRef}
          />
        </FormControl>

        <FormControl mt={2}>
          <Input
            id='itemCode'
            placeholder='item code'
            disabled={!items}
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            ref={itemCodeRef}
          />
        </FormControl>
        <Button hidden type='submit'>
          Submit
        </Button>
      </form>

      {items && (
        <Box textAlign='center' mt={2}>
          {items?.map((item: any) => (
            <Box key={item.id}>{item.itemCode}</Box>
          ))}
        </Box>
      )}

      <Box textAlign='center' mt={2}>
        {streetsWithOrders.map((street: string) => (
          <Box key={street + Math.random()}>{street}</Box>
        ))}
      </Box>
    </Box>
  );
}

Outbound.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
