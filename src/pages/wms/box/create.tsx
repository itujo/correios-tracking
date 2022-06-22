import { Box, Flex, FormControl, Input } from '@chakra-ui/react';
import { FormEvent, ReactElement } from 'react';
import { CustomEvent } from '../../../@types';
import Layout from '../../../components/Layout';
import api from '../../../services/api';

export default function create() {
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { boxNo } = e.target as CustomEvent;

    await api
      .post('/box/create', {
        boxNo: boxNo.value,
      })
      .then((res) => {
        if (res.data.id) {
          alert(`box ${boxNo.value} successfuly inserted in system`);
        }
      })
      .catch(() => {
        alert(`box ${boxNo.value} cannot be inserted in system`);
      });
  };
  return (
    <Box mt={2} p={2} display={true ? 'box' : 'none'}>
      <form onSubmit={onSubmit}>
        <FormControl>
          Create box
          <Flex direction='column'>
            <Input id='boxNo' placeholder='insert the box code' />
          </Flex>
        </FormControl>
      </form>
    </Box>
  );
}

create.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
