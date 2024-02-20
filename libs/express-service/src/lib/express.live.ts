import { Layer } from "effect";
import { ExpressService } from "./express.service";
import express from "express";

export const ExpressServiceLive = Layer.sync(ExpressService, () => express()); 