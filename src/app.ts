import config from "./config";
import express, { Response } from "express";
import bodyParser from "body-parser";
import logger from "./logger";

const TAG = "APP";

const app: express.Application = express();

app.use(bodyParser.json());

app.get("/", async (req: any, res: Response) => {
  res.status(200).json({ status: "Success" });
});

app.listen(config.port, () => {
  logger.logInfo(TAG, `${config.appName} running on port ${config.port}`);
});
