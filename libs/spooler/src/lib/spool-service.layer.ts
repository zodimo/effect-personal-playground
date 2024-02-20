import { Layer } from "effect";
import { SpoolService } from "./spool-service.service";
import { SpoolServiceImpl } from "./spool-service.impl";

export const spoolServiceLayer = Layer.sync(SpoolService, () => new SpoolServiceImpl());
