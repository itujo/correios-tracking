import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useToast,
} from '@chakra-ui/react';
import { ApiResponse, CEvent } from '../../@types';

interface Props {
  obj: ApiResponse;
}

function Track({ obj }: Props) {
  const { rastro, sro, id } = obj;

  const toast = useToast();

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton
            onClick={async (e: { target: CEvent }) => {
              const text = e.target.firstChild?.nodeValue;
              if (text) {
                // eslint-disable-next-line no-return-await
                await navigator.clipboard.writeText(text).then(() => {
                  toast({
                    title: 'SRO copied to clipboard',
                    description: `${text} copied to clipboard`,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                  });
                });
              }
            }}
          >
            <Box flex='1' textAlign='left'>
              <strong id='description'>{sro}</strong>
              &nbsp;-&nbsp;
              {rastro?.at(-1)?.status ?? 'sem tracking nos correios'}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        {rastro?.map((tr) => (
          <AccordionPanel key={id + Math.random()} pb={4}>
            {`${tr.data} ${tr.hora} - ${tr.status}`}
            <br />
            {tr.local ? `Local: ${tr.local}` : null}

            {tr.origem ? `De: ${tr.origem}` : null}
            <br />
            {tr.destino ? `Para: ${tr.destino}` : null}
          </AccordionPanel>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export { Track };
