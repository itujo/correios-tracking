import {
  rastrearEncomendas,
  RastreioEvent,
  RastreioResponse,
} from 'correios-brasil/dist';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sro }: { sro?: string[] } = req.query;
  let count = -1;
  const response = await Promise.all(
    sro!.map(async (enco) => {
      count += 1;
      const rastro = (
        (await rastrearEncomendas([enco])) as RastreioResponse
      )[0];

      return {
        id: count,
        sro: enco,
        rastro:
          (rastro as unknown as RastreioEvent[]).length > 1 ? rastro : null,
      };
    })
  );

  return res.status(200).json(response);
}
