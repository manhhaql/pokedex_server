
import {Storage} from '@google-cloud/storage';
import path from 'path';

import config from '../../config';

export const storage = new Storage({
    projectId: config.firebase.projectId,
    keyFilename: path.join(__dirname, '../../../ServiceAccountKey.json')
});

export const bucket = storage.bucket(config.firebase.storageBucket);
