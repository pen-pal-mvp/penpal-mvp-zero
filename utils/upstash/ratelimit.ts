import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const redis = Redis.fromEnv()

// 1分間に5回までのリクエストを許可するレートリミット設定
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
})