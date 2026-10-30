/* @/utils/database/redis.js */

import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();
