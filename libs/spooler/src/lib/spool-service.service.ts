import { Context, Effect } from "effect";
import { SpoolQueue } from "./spool-queue.service";

export class SpoolService extends Context.Tag("SpoolService")<SpoolService, {
    offer(item: string): Effect.Effect<void, never, SpoolQueue>
    takeAll(): Effect.Effect<string[], never, SpoolQueue>
    get size(): Effect.Effect<number, never, SpoolQueue>
    flush(): Effect.Effect<void, never, SpoolQueue>;
}>() { }
