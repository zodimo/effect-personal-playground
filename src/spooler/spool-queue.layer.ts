import { Layer } from "effect";
import { SpoolQueue } from "./spool-queue.service";
import { SpoolQueueImpl } from "./spool-queue.impl";

export const spoolQueueLayer = Layer.sync(SpoolQueue, () => new SpoolQueueImpl());