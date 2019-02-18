import dotenv from "dotenv";
import { schedule } from "node-cron";

dotenv.config();

const { CRON_SCHEDULE } = process.env;

schedule(
  CRON_SCHEDULE as string,
  async () => {
    console.log("job is running");
  },
  {}
);
