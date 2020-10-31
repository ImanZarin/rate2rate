import * as admin from 'firebase-admin';

//import { googleApplicationCredentials } from './settings'

const googleApplicationCredentials = "../rate2rate-290904-firebase-adminsdk-fd5h3-5bf16ff901.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(googleApplicationCredentials);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rate2rate-290904.firebaseio.com'
});

export const messaging = admin.messaging();