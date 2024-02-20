import { Effect, Layer, Schedule } from "effect";
import { SpoolService } from "@effect-playground/spooler";

export const logSpoolSize = (contextMessage: string) => Effect.gen(function* (_) {
    const spoolService = yield* _(SpoolService);
    const size = yield* _(spoolService.size);
    return yield* _(Effect.log(`queue size : ${size}, message: ${contextMessage}`));
});

export const offerSpoolService = Layer.scopedDiscard(Effect.gen(function* (_) {
    const spoolService = yield* _(SpoolService);
    const now = new Date();
    yield* _(spoolService.offer(`Item: ${now}`))
    return yield* _(logSpoolSize('after spool'));
}).pipe(Effect.fork, Effect.repeat({ schedule: Schedule.spaced('1 seconds') })));

export const flushSpoolService = Layer.scopedDiscard(Effect.gen(function* (_) {
    const spoolService = yield* _(SpoolService);
    yield* _(logSpoolSize('before spool flush'));
    yield* _(spoolService.flush())
}).pipe(Effect.repeat({ schedule: Schedule.spaced('5 seconds') })));