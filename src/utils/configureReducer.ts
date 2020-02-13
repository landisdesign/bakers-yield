export const wrapActionDefinitions = <AD extends ActionDefinitions<S, AD>, S = ActionDefinitionsState<AD>>(actionDefinitions: AD) => actionDefinitions;

const configureReducer = <AD extends ActionDefinitions<S, AD>, S = ActionDefinitionsState<AD>>(actionDefinitions: AD) => {
  const types = Object.keys(actionDefinitions);

  const {
    actions,
    reducers
  } = types.reduce(
    collectCreatorsAndReducers<S, AD>(actionDefinitions),
    { actions: {}, reducers: {} } as ReducerAccumulator<S, AD>
  );

  const reducer = (action: any, state: S) => action && action.type && reducers[action.type as keyof AD] ? reducers[action.type as keyof AD](action, state) : state;

  reducer.actions = actions;

  return reducer;
}

export default configureReducer;

const collectCreatorsAndReducers = <S, AD extends ActionDefinitions<S, AD>>(actionDefinitions: AD) =>
  (accumulator: ReducerAccumulator<S, AD>, type: string) => {
    const actionDefinition = actionDefinitions[type as keyof AD] as unknown;
    if (typeof actionDefinition === 'function') {
      accumulator.actions[type as keyof AD] = createAction(type);
      accumulator.reducers[type as keyof AD] = actionDefinition as ActionReducer<S>;
    }
    else {
      accumulator.actions[type as keyof AD] = createAction(type, (actionDefinition as ActionReducerWithPreparer<S>).prepare);
      accumulator.reducers[type as keyof AD] = (actionDefinition as ActionReducerWithPreparer<S>).reduce;
    }
    return accumulator;
  }
;

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
type ActionDefinitionsState<A extends ActionDefinitions<any, T>, T = A> = A extends ActionDefinitions<infer S, T> ? S : never;

export type ActionDefinition<S extends any, Reducer = ActionReducerWithPreparer<S> | ActionReducer<S>> = Reducer extends ActionReducerWithPreparer<S> ? ActionReducerWithPreparer<S> : ActionReducer<S>;

export type ActionReducerWithPreparer<S extends any> = {
  reduce: ActionReducer<S>;
  prepare: ActionPreparer;
}

export type ActionReducer<S> = (action: any, state: S) => S;
type ActionPreparer = (...args: any[]) => Omit<Action, 'type'>;
export interface Action {
  type: string;
  payload?: any;
  meta?: any;
  error?: boolean;
}

type ReducerMap<S, AD> = {
  [K in keyof AD]: ActionReducer<S>;
}
type CreatorMap<AD> = {
  [K in keyof AD]: (...args: any[]) => Action;
}
interface ReducerAccumulator<S, AD> {
  actions: CreatorMap<AD>;
  reducers: ReducerMap<S, AD>
};
