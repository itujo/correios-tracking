import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { ApiResponse } from '../../@types';
import { Track } from '../track/Track';

interface PropTypes {
  description: string;
  arr: ApiResponse[];
}

function TrackAccordion({ description, arr }: PropTypes) {
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              <strong>{description}</strong> - {arr.length}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        {arr?.map((deliv) => (
          <AccordionPanel key={deliv.id + Math.random()} pb={4}>
            <Track key={deliv.id + Math.random()} obj={deliv} />
          </AccordionPanel>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export { TrackAccordion };
