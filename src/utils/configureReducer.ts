export const wrapActionDefinitions = <AD extends ActionDefinitions<S, AD>, S = ActionDefinitionsState<AD>>(actionDefinitions: AD) => actionDefinitions;

const configureReducer = <AD extends ActionDefinitions<S, AD>, S = ActionDefinitionsState<AD>>(actionDefinitions: AD) => {
  const types = Object.keys(actionDefinitions);

  const { actions, reducers }: ReducerAccumulator<AD, S> = types.reduce(
    (accumulator, type) => {
      const key = type as keyof AD;
      const actionDefinition = actionDefinitions[key] as unknown;
      if (typeof actionDefinition === 'function') {
        accumulator.actions[key] = createAction(type);
        accumulator.reducers[key] = actionDefinition as ActionReducer<S>;
      }
      else {
        accumulator.actions[key] = createAction(type, (actionDefinition as ActionReducerWithPreparer<S>).prepare);
        accumulator.reducers[key] = (actionDefinition as ActionReducerWithPreparer<S>).reduce;
      }
      return accumulator;
    },
    { actions: {}, reducers: {} } as ReducerAccumulator<AD, S>
  );

  const reducer = (action: any, state: S) => action && action.type && reducers[action.type as keyof AD] ? reducers[action.type as keyof AD](action, state) : state;

  reducer.actions = actions;

  return reducer;
}

export default configureReducer;

const createAction = (type: string, loader?: ActionPreparer) =>
  loader
    ? (...args: any[]) => ({
      type,
      ...loader(...args)
    })
    : () => ({type})
;

export type ActionDefinitions<S extends any, T = ActionDefinitions<S, unknown>> = {
  [K in keyof T]: ActionDefinition<S, T[K]>;
}
type ActionDefinitionsState<AD = ActionDefinitions<any>> = AD extends ActionDefinitions<infer S> ? S : never;

export type ActionDefinition<S extends any, R = ActionReducerWithPreparer<S> | ActionReducer<S>> = R extends ActionReducerWithPreparer<S> ? ActionReducerWithPreparer<S> : ActionReducer<S>;
type ActionDefinitionState<R, AD = ActionDefinition<any, R>> = AD extends ActionDefinition<infer S> ? S : never;

export type ActionReducerWithPreparer<S extends any> = {
  reduce: ActionReducer<S>;
  prepare: ActionPreparer;
}
type ActionReducerWithPreparerState<ARWP extends ActionReducerWithPreparer<any>> = ARWP extends ActionReducerWithPreparer<infer S> ? S : never;

export type ActionReducer<S extends any> = (action: any, state: S) => S;
type ActionReducerState<AR extends ActionReducer<any>> = AR extends ActionReducer<infer S> ? S : never;

type ActionPreparer = (...args: any[]) => Omit<Action, 'type'>;
export interface Action {
  type: string;
  payload?: any;
  meta?: any;
  error?: boolean;
}

type ReducerMap<AD, S> = {
  [K in keyof AD]: ActionReducer<S>;
}
type CreatorMap<AD> = {
  [K in keyof AD]: (...args: any[]) => Action;
}
type ReducerAccumulator<AD, S> = {
  actions: CreatorMap<AD>;
  reducers: ReducerMap<AD, S>;
};
