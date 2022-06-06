import { Button, FormControl, Textarea } from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import { ApiResponse, SroEvent } from '../@types';
import { BackToTop } from '../components/BackToTopButton/BackToTop';
import { TrackAccordion } from '../components/TrackAccordion/TrackAccordion';

export default function Index() {
  const splitRegex = /(\W+|[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2})/;
  const sroRegex = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;

  const endpoint = '/api/tracking';

  const [delivered, setDelivered] = useState<ApiResponse[]>([]);
  const [inTransit, setInTransit] = useState<ApiResponse[]>([]);
  const [noTracking, setNoTracking] = useState<ApiResponse[]>([]);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

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

    // setTracking(response);
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <FormControl>
          <Textarea id='sro' placeholder='insert the sros' />
          <Button type='submit'>pesquisar</Button>
        </FormControl>
      </form>

      {delivered.length > 0 && (
        <TrackAccordion description='ENTREGUES' arr={delivered} />
      )}

      {inTransit.length > 0 && (
        <TrackAccordion description='EM TRANSITO' arr={inTransit} />
      )}

      {noTracking.length > 0 && (
        <TrackAccordion description='SEM TRACKING' arr={noTracking} />
      )}

      <BackToTop />
    </>
  );
}
