import { Effect, Layer, Schedule } from "effect";
import { SpoolService } from "./spooler/spool-service.service";

export const logSpoolSize = (contextMessage: string) => Effect.gen(function* (_) {
    const spoolService = yield* _(SpoolService);
    const size = yield* _(spoolService.size);
    return yield* _(Effect.log(`queue size : ${size}, message: ${contextMessage}`));
});

export const offerSpoolService = Layer.scopedDiscard(Effect.gen(function* (_) {

    const work = Effect.gen(function* (_) {
        const spoolService = yield* _(SpoolService);
        const now = new Date();
        yield* _(spoolService.offer(`Item: ${now}`))
        yield* _(logSpoolSize('after spool'));
    }).pipe(Effect.repeat({ schedule: Schedule.spaced('1 seconds') }));

    yield* _(Effect.forkDaemon(work));

}));


export const flushSpoolService = Layer.scopedDiscard(Effect.gen(function* (_) {

    const work = Effect.gen(function* (_) {
        const spoolService = yield* _(SpoolService);
        yield* _(logSpoolSize('before spool flush'));
        yield* _(spoolService.flush())
    }).pipe(Effect.repeat({ schedule: Schedule.spaced('5 seconds') }));

    yield* _(Effect.forkDaemon(work));
}));