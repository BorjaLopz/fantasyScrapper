import { schedule } from 'node-cron';
import https from 'node:https';

export const getPlayersData = () => {
  console.log('running players data');
  schedule('*/5 * * * *', () => fetchPlayers());
};

const fetchPlayers = () => {
  https
    .get(
      'https://api-fantasy.llt-services.com/api/v4/players?x-lang=es',
      (res) => {
        let data: any = [];
        const headerDate =
          res.headers && res.headers.date
            ? res.headers.date
            : 'no response date';
        console.log('Status Code:', res.statusCode);
        console.log('Date in Response header:', headerDate);

        res.on('data', (chunk) => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log(
            'Response ended: ',
            JSON.parse(Buffer.concat(data).toString()),
          );
        });
      },
    )
    .on('error', (err) => {
      console.log('Error: ', err.message);
    });
};
