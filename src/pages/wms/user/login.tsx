import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../contexts/AuthContext';

export default function Login() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const { signIn } = useContext(AuthContext);

  async function onSubmit(values: any) {
    try {
      await signIn(values);
    } catch (error: any) {
      setError('username', {
        message: error.message,
      });
      setError('password', {
        message: error.message,
      });
    }
  }

  return (
    <>
      <Head>
        <title>login</title>
      </Head>

      <Center>
        <Heading>WMS</Heading>
      </Center>

      <Center height='60vh'>
        <Box p={10} w='lg' borderWidth={1} borderRadius={8} boxShadow='lg'>
          <Text mb={10} fontSize={25}>
            login
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.username}>
              <FormLabel htmlFor='username'>Usuário</FormLabel>
              <Input
                id='username'
                placeholder='usuário'
                {...register('username', {
                  required: 'Este campo é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'o usuário deve conter 3 ou mais caracteres',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor='password'>Senha</FormLabel>
              <Input
                id='password'
                placeholder='senha'
                type='password'
                {...register('password', {
                  required: 'Este campo é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'a senha deve conter 3 ou mais caracteres',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              mt={4}
              colorScheme='teal'
              isLoading={isSubmitting}
              type='submit'
            >
              Submit
            </Button>
          </form>
        </Box>
      </Center>
    </>
  );
}
