import dotenv from "dotenv";

dotenv.config();

interface Config {
  appName: string;
  port: string;
  firebaseConfig: string;
  firebaseStorageRootBucketPath: string;
}

const config: Config = {
  appName: process.env.APP_NAME!!,
  port: process.env.PORT!!,
  firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG!!),
  firebaseStorageRootBucketPath: process.env.FIREBASE_STORAGE_ROOT_BUCKET_PATH!!,
};

export default config;
