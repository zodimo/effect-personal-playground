import { Context, Effect, Layer } from "effect";

export class SpoolQueue extends Context.Tag("SpoolQueue")<SpoolQueue, {
    offer(item: string): Effect.Effect<boolean>;
    takeAll(): Effect.Effect<string[]>;
    get size(): Effect.Effect<number>;
}>() { }


