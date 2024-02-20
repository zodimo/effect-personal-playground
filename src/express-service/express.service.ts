import { Context } from "effect";
import { Application } from 'express';

// Define Express as a service
export class ExpressService extends Context.Tag("ExpressService")<
  ExpressService,
  Application
>() { }