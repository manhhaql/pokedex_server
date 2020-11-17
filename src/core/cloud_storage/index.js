
import {Storage} from '@google-cloud/storage';
import path from 'path';

import config from '../../config';

let credentials;

if(process.env.NODE_ENV === "production") {
    credentials = {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
}

export const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID  || config.firebase.projectId,
    credentials: credentials,
    keyFilename: path.join(__dirname, '../../../ServiceAccountKey.json')
});

export const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET || config.firebase.storageBucket);
