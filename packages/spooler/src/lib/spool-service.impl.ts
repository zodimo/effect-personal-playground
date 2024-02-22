import { Effect } from "effect";
import { SpoolQueue } from "./spool-queue.service";

export class SpoolServiceImpl {
    offer(item: string): Effect.Effect<void, never, SpoolQueue> {
        return Effect.gen(this, function* (_) {
            const spoolQueue = yield* _(SpoolQueue);
            yield* _(spoolQueue.offer(item));
        });
    }
    takeAll(): Effect.Effect<string[], never, SpoolQueue> {
        return Effect.gen(function* (_) {
            const spoolQueue = yield* _(SpoolQueue);
            return yield* _(spoolQueue.takeAll());
        });
    }
    get size(): Effect.Effect<number, never, SpoolQueue> {
        return Effect.gen(function* (_) {
            const spoolQueue = yield* _(SpoolQueue);
            return yield* _(spoolQueue.size);
        });
    }
    doSomeWork(items: string[]) {
        return Effect.gen(function* (_) {
            for (const item of items) {
                yield* _(Effect.log(`processing item: ${item}`));
            }
        });
    }
    flush(): Effect.Effect<void, never, SpoolQueue> {
        return Effect.gen(this, function* (_) {
            const items = yield* _(this.takeAll());
            return yield* _(this.doSomeWork(items));
        });
    }
}
