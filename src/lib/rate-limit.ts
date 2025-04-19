import { LRUCache } from 'lru-cache';

export interface RateLimitOptions {
  interval: number;
  limit: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export default function rateLimit(options: RateLimitOptions) {
  const defaultResult = {
    success: true,
    limit: options.limit,
    remaining: 1,
    reset: Date.now() + options.interval,
  };

  let tokenCache: LRUCache<string, number> | null = null;
  
  try {
    tokenCache = new LRUCache<string, number>({
      max: 500,
      ttl: options.interval,
    });
  } catch (_e) {
    // Return a dummy implementation if cache initialization fails
    return {
      check: (_limit: RateLimitOptions, _identifier: string): RateLimitResult => defaultResult,
    };
  }

  // Safely store the cache in a final variable
  const cache = tokenCache;

  return {
    check: (limit: RateLimitOptions, identifier: string): RateLimitResult => {
      try {
        if (!cache) {
          return defaultResult;
        }

        const tokens = cache.get(identifier) ?? 0;
        
        if (tokens >= limit.limit) {
          return {
            success: false,
            limit: limit.limit,
            remaining: 0,
            reset: Date.now() + limit.interval,
          };
        }

        cache.set(identifier, tokens + 1);
        
        return {
          success: true,
          limit: limit.limit,
          remaining: limit.limit - tokens - 1,
          reset: Date.now() + limit.interval,
        };
      } catch (_e) {
        // Default to allowing the request on error
        return defaultResult;
      }
    },
  };
}

export function getIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  return forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
}

export class RateLimitError extends Error {
  status: number;
  reset: number;
  
  constructor(message: string, reset: number) {
    super(message);
    this.name = 'RateLimitError';
    this.status = 429;
    this.reset = reset;
  }
} 