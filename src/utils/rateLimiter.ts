type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();

  constructor(private max: number, private windowMs: number) {}

  public check(ip: string): { allowed: boolean; remaining: number; resetInMs: number } {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || entry.resetAt <= now) {
      const resetAt = now + this.windowMs;
      this.store.set(ip, { count: 1, resetAt });
      return { allowed: true, remaining: this.max - 1, resetInMs: this.windowMs };
    }

    if (entry.count >= this.max) {
      return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now };
    }

    entry.count += 1;
    this.store.set(ip, entry);
    return { allowed: true, remaining: this.max - entry.count, resetInMs: entry.resetAt - now };
  }
}
