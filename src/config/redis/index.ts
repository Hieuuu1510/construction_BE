import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL as string,
});

client.on("error", (err) => {
  console.log("Redis error:", err);
});

await client.connect();

export default client;
