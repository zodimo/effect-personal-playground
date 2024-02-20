import { Layer } from "effect";
import { ExpressService } from "./express.service";
import express from "express";

export const ExpressServiceImpl = Layer.sync(ExpressService, () => express()); 