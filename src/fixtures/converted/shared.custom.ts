import { Assign, Diff, OmitByValue, PickByValue } from "utility-types";

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

const OMITTED: unique symbol = Symbol();
export type Omitted = typeof OMITTED;

type Model = { relationships: {} };

type Override<G extends object, O extends object> = Assign<
  Diff<G, PickByValue<O, Omitted>>,
  OmitByValue<O, Omitted>
>;

export type ModelOverride<G extends Model, O extends Model> = Expand<
  Omit<Override<G, O>, "relationships"> & {
    relationships: Expand<Override<G["relationships"], O["relationships"]>>;
  }
>;
