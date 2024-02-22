import { Chunk, Effect, Queue, Ref, SubscriptionRef, SynchronizedRef, identity } from "effect";
import { SpoolQueue } from "./spool-queue.service";


export const makeSpoolQueue = () => Effect.gen(function* (_) {
    const refQueue = yield* _(SynchronizedRef.make(Queue.unbounded<string>()));

    return SpoolQueue.of({
        offer(item) {
            return Effect.gen(function* (_) {
                yield* _(SynchronizedRef.updateEffect(refQueue,
                    (queueEff) => queueEff
                        .pipe(
                            Effect.tap(queue => Queue.offer(queue, item)
                                .pipe(
                                    Effect.tap(
                                        result => Effect.log(`Offer result: ${result}`)
                                    ),
                                    Effect.flatMap(_ => Queue.size(queue)), //queue comes from closure... previous tap..
                                    Effect.flatMap(size => Effect.log(`Size inside offer. ${size}`)),
                                )
                            ),
                            Effect.map(Effect.succeed), //lift.. not eval.. 
                        )
                ))
            });
        },
        takeAll() {
            return Effect.gen(this, function* (_) {
                let outputItems: string[] = [];
                yield* _(SynchronizedRef.updateEffect(refQueue, (queueEff) => Effect.gen(this, function* (_) {
                    const queue = yield* _(queueEff);
                    outputItems = yield* _(Queue.takeAll(queue), Effect.map(Chunk.toArray));
                    return Effect.succeed(queue);
                })));

                return outputItems;
            });
        },
        get size() {
            return Effect.gen(this, function* (_) {
                return yield* _(
                    SynchronizedRef.get(refQueue),
                    Effect.flatMap(queueEff => queueEff.pipe(Effect.flatMap(queue => Queue.size(queue))))
                )
            });
        }
    });
});