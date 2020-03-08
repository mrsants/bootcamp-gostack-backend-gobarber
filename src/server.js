/* eslint-disable no-console */
import 'dotenv/config';
import app from './app';

app.listen(process.env.APP_PORT, () => {
  console.log(`servet running ${process.env.APP_PORT}`);
});
