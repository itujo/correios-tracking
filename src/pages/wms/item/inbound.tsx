import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FormEvent, ReactElement, useRef, useState } from 'react';
import Layout from '../../../components/Layout';
import api from '../../../services/api';

export default function Inbound() {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [itemCode, setItemCode] = useState('');
  const [boxNo, setBoxNo] = useState('');
  const [itemCodeHelper, setItemCodeHelper] = useState('');

  const clearForm = () => {
    setItemCode('');
    setBoxNo('');
    setItemCodeHelper('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await api
      .post('/item/inbound', {
        itemCode,
      })
      .then((res) => {
        if (res.data.status === 'success') {
          // "status": "success",
          // "message": "item GSV12346 addressed to box A01-07-23",
          // "boxNo": "A01-07-23"
          setBoxNo(res.data.boxNo);
          toast({
            title: 'success',
            description: res.data.message,
            status: 'success',
            duration: 1000,
            isClosable: true,
            position: 'top',
          });
          // alert(`item ${itemCode.value} successfuly received`);
        }
        setItemCodeHelper(itemCode);
        setItemCode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        clearForm();

        toast({
          title: 'error',
          description: `item ${itemCode} couldn't be received`,
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
      });
  };

  return (
    <Box mt={2} p={2} display={true ? 'box' : 'none'}>
      <form onSubmit={onSubmit}>
        <FormControl>
          Item inbound
          <Flex direction='column'>
            <Input
              autoFocus
              onFocus={clearForm}
              id='itemCode'
              placeholder='insert the item code'
              value={itemCode}
              onChange={(e) => {
                setItemCode(e.target.value);
                // console.log(e.target.value);
              }}
              ref={inputRef}
            />

            <Text textAlign='center' fontWeight='bold' fontSize={40}>
              {boxNo.split('-')[0]}
              <br />
              {boxNo}
              <br />
              {itemCodeHelper}
            </Text>

            <Button onClick={clearForm}>Clear</Button>
          </Flex>
        </FormControl>
      </form>
    </Box>
  );
}

Inbound.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
