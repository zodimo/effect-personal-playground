import { Layer } from "effect";
import { SpoolQueue } from "./spool-queue.service";
import { makeSpoolQueue } from "./spool-queue.impl";

export const spoolQueueLayer = Layer.effect(SpoolQueue, makeSpoolQueue());