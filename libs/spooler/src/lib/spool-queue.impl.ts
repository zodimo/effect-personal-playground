import { Chunk, Effect, Queue } from "effect";

export class SpoolQueueImpl {
    private queue: Effect.Effect<Queue.Queue<string>>;
    constructor() {
        this.queue = Queue.unbounded<string>();
    }

    offer(item: string): Effect.Effect<boolean> {
        return Effect.gen(this, function* (_) {
            const q = yield* _(this.queue);
            return yield* _(Queue.offer(q, item));
        });
    }
    takeAll(): Effect.Effect<string[]> {
        return Effect.gen(this, function* (_) {
            const q = yield* _(this.queue);
            return yield* _(Queue.takeAll(q), Effect.map(Chunk.toArray));
        });
    }
    get size(): Effect.Effect<number> {
        return Effect.gen(this, function* (_) {
            const q = yield* _(this.queue);
            return yield* _(Queue.size(q));
        });
    }
}