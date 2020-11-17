
import {Storage} from '@google-cloud/storage';
import path from 'path';

import config from '../../config';

export const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID  || config.firebase.projectId,
    keyFilename: path.join(__dirname, process.env.GOOGLE_CREDENTIALS || '../../../ServiceAccountKey.json')
});

export const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET || config.firebase.storageBucket);
