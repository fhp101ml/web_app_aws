import { LRUCache } from 'lru-cache'

type Options = {
    uniqueTokenPerInterval?: number
    interval?: number
}

export default function rateLimit(options?: Options) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    })

    return {
        check: (res: Response, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0]
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount)
                }
                tokenCount[0] += 1

                const currentUsage = tokenCount[0]
                const isRateLimited = currentUsage >= limit
                // We can't easily set headers on the Response object passed from API types in Next 13+ App Router 
                // typically we return a response. But this helper is designed for checking logic.

                if (isRateLimited) {
                    reject()
                } else {
                    resolve()
                }
            }),
    }
}
