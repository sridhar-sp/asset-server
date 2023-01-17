import dotenv from "dotenv";

dotenv.config();

interface Config {
  appName: string;
  port: string;
  firebaseConfig: string;
  firebaseStorageRootBucketPath: string;
  fileNameSizeLimit: number;
  fileSizeLimitInBytes: number;
}

const config: Config = {
  appName: process.env.APP_NAME!!,
  port: process.env.PORT!!,
  firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG!!),
  firebaseStorageRootBucketPath: process.env.FIREBASE_STORAGE_ROOT_BUCKET_PATH!!,
  fileNameSizeLimit: parseInt(process.env.FILE_NAME_SIZE_LIMIT!!, 10),
  fileSizeLimitInBytes: parseInt(process.env.FILE_SIZE_LIMIT_IN_BYTES!!, 10),
};

export default config;
