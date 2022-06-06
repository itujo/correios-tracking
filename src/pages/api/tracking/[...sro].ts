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
      )[0] as unknown as RastreioEvent[];

      return {
        id: count,
        sro: enco,
        rastro: rastro.length > 1 ? rastro.reverse() : null,
      };
    })
  );

  return res.status(200).json(response);
}
