import dotenv from "dotenv";

dotenv.config();

interface Config {
  appName: string;
  port: string;
  firebaseConfig: string;
}

const config: Config = {
  appName: process.env.APP_NAME!!,
  port: process.env.PORT!!,
  firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG!!),
};

export default config;
