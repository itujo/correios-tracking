import { utils, writeFile } from 'xlsx';

export default function Download() {
  const filename = 'test.xlsx';

  const wsName = 'sro';

  const wb = utils.book_new();
  // const ws = utils.aoa_to_sheet(data);
  const ws = utils.json_to_sheet(
    [
      { S: 1, h: 2, e: 3, e_1: 4, t: 5, J: 6, S_1: 7 },
      { S: 2, h: 3, e: 4, e_1: 5, t: 6, J: 7, S_1: 8 },
    ],
    { header: ['S', 'h', 'e', 'e_1', 't', 'J', 'S_1'] }
  );

  utils.book_append_sheet(wb, ws, wsName);

  writeFile(wb, filename);

  return <div>hi</div>;
}
