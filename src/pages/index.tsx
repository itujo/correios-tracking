import { Box, Button, Flex, FormControl, Textarea } from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import { ApiResponse, SroEvent } from '../@types';
import { BackToTop } from '../components/BackToTopButton/BackToTop';
import { SearchButton } from '../components/SearchButton/SearchButton';
import { TrackAccordion } from '../components/TrackAccordion/TrackAccordion';

export default function Index() {
  const splitRegex = /(\W+|[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2})/;
  const sroRegex = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;

  const endpoint = '/api/tracking';

  const [loading, setLoading] = useState(false);
  const [delivered, setDelivered] = useState<ApiResponse[]>([]);
  const [inTransit, setInTransit] = useState<ApiResponse[]>([]);
  const [noTracking, setNoTracking] = useState<ApiResponse[]>([]);
  const [showForm, setShowForm] = useState(true);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setDelivered([]);
    setInTransit([]);
    setNoTracking([]);

    const { sro } = e.target as SroEvent;

    const sros = sro.value
      .split(splitRegex)
      .filter((line) => line.match(sroRegex))
      .toString()
      .replace(/,/g, '/');

    const response = (await (
      await fetch(`${endpoint}/${sros}`)
    ).json()) as ApiResponse[];

    // eslint-disable-next-line array-callback-return
    response.map((track) => {
      const lastStatus = track.rastro?.at(-1)?.status;

      if (!lastStatus) {
        setNoTracking((old) => [...old, track]);
      } else if (lastStatus === 'Objeto entregue ao destinatário') {
        setDelivered((old) => [...old, track]);
      } else {
        setInTransit((old) => [...old, track]);
      }
    });

    setLoading(false);

    // setTracking(response);
  };

  const clickSearchButton = () => {
    setShowForm(true);
  };

  useEffect(() => {
    if (delivered.length > 0 || inTransit.length > 0 || noTracking.length > 0) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, [delivered, inTransit, noTracking]);

  return (
    <>
      <Box mt='30vh' w='50%' ml='25%' display={showForm ? 'box' : 'none'}>
        <form onSubmit={submitForm}>
          <FormControl>
            <Flex direction='column'>
              <Textarea id='sro' placeholder='insert the tracking numbers' />
              <Button
                type='submit'
                isLoading={loading}
                p={4}
                mt={4}
                w='50%'
                left='50%'
              >
                search
              </Button>
            </Flex>
          </FormControl>
        </form>
      </Box>

      <Box>
        {delivered.length > 0 && (
          <TrackAccordion description='ENTREGUES' arr={delivered} />
        )}

        {inTransit.length > 0 && (
          <TrackAccordion description='EM TRANSITO' arr={inTransit} />
        )}

        {noTracking.length > 0 && (
          <TrackAccordion description='SEM TRACKING' arr={noTracking} />
        )}
      </Box>

      <Button onClick={clickSearchButton}>
        <SearchButton />
      </Button>
      <BackToTop />
    </>
  );
}
