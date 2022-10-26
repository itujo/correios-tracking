import { Box, Button, Flex, FormControl, Textarea } from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';
import { ApiResponse, SroEvent } from '../@types';
import { BackToTop } from '../components/BackToTopButton/BackToTop';
import { SearchButton } from '../components/SearchButton/SearchButton';
import { TrackAccordion } from '../components/TrackAccordion/TrackAccordion';

export default function Index() {
  const splitRegex = /(\W+|[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2})/;
  const sroRegex = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;

  const endpoint = '/api/track';

  const [loading, setLoading] = useState(false);
  const [delivered, setDelivered] = useState<ApiResponse[]>([]);
  const [inTransit, setInTransit] = useState<ApiResponse[]>([]);
  const [noTracking, setNoTracking] = useState<ApiResponse[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [resSize, setResSize] = useState(0);

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

    setResSize(response.length);

    response.map((track) => {
      const lastStatus = track.rastro?.at(0)?.status;

      if (!lastStatus) {
        setNoTracking((old) => [...old, track]);
      } else if (lastStatus === 'Objeto entregue ao destinatário') {
        setDelivered((old) => [...old, track]);
      } else {
        setInTransit((old) => [...old, track]);
      }

      return 1;
    });

    setLoading(false);
  };

  const clickSearchButton = () => {
    setShowForm(true);
  };

  const downloadExcel = () => {
    const filename = 'test.xlsx';

    const wsName = 'sro';

    const wb = utils.book_new();
    // const ws = utils.aoa_to_sheet(data);

    const data = [];

    for (let index = 0; index < resSize; index += 1) {
      data.push({
        ENTREGUES: delivered[index] ? delivered[index].sro : null,
        'EM TRANSITO': inTransit[index] ? inTransit[index].sro : null,
        'SEM TRACKING': noTracking[index] ? noTracking[index].sro : null,
      });
    }

    const ws = utils.json_to_sheet(data, {
      header: ['ENTREGUES', 'EM TRANSITO', 'SEM TRACKING'],
    });

    utils.book_append_sheet(wb, ws, wsName);

    writeFile(wb, filename);
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

      <button type='button' onClick={downloadExcel}>
        download
      </button>

      <SearchButton onClick={clickSearchButton} />

      <BackToTop />
    </>
  );
}
