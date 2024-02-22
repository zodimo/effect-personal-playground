import { Layer, Effect, Runtime } from "effect"
import { ExpressService, ExpressServiceImpl } from "@effect-playground/express"
import { flushSpoolService, offerSpoolService } from "./services"
import { spoolQueueLayer, spoolServiceLayer } from "@effect-playground/spooler"

// Define the main route, IndexRouteLive, as a Layer
const IndexRouteLive = Layer.effectDiscard(
  Effect.gen(function* (_) {
    const app = yield* _(ExpressService)
    const runFork = Runtime.runFork(yield* _(Effect.runtime<never>()))

    app.get("/", (_, res) => {
      runFork(Effect.sync(() => res.send("Hello World!")))
    })
  })
)

// Server Setup
const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* (_) {
    const port = 3000;
    const host = 'localhost'
    const app = yield* _(ExpressService)
    yield* _(
      Effect.acquireRelease(
        Effect.sync(() =>
          app.listen(port, () =>
            console.log(`Example app listening http://${host}:${port}`)
          )
        ),
        (server) => Effect.sync(() => server.close())
      )
    )
  })
)


// Combine the layers
const AppLive = ServerLive.pipe(
  //these 2 service has a schedule attached to test the queue.
  //they dont work as expected.
  //they are blocking the thread
  Layer.provide(offerSpoolService),
  Layer.provide(flushSpoolService),

  Layer.provide(spoolServiceLayer),
  Layer.provide(spoolQueueLayer),
  Layer.provide(IndexRouteLive),
  Layer.provide(ExpressServiceImpl)
)

// Run the program
Effect.runFork(Layer.launch(AppLive))