
import {Storage} from '@google-cloud/storage';
import path from 'path';

import config from '../../config';

export const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID  || config.firebase.projectId,
    credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    keyFilename: path.join(__dirname, '../../../ServiceAccountKey.json')
});

export const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET || config.firebase.storageBucket);
