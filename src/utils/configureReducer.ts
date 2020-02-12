const configureReducer = <S>(actionDefinitions: ActionDefinitions<S>) => {
  const types = Object.keys(actionDefinitions) as string[];

  const {
    actions,
    reducers
  } = types.reduce(
    collectCreatorsAndReducers(actionDefinitions),
    { actions: {}, reducers: {} } as ReducerAccumulator<S>
  );

  const reducer = (action: any, state: S) => reducers[action.type](action, state);

  reducer.actions = actions;

  return reducer;
}

export default configureReducer;

const collectCreatorsAndReducers = <S>(actionDefinitions: ActionDefinitions<S>) =>
  (accumulator: ReducerAccumulator<S>, type: string) => {
    const actionDefinition = actionDefinitions[type];
    if (typeof actionDefinition === 'function') {
      accumulator.actions[type] = createAction(type);
      accumulator.reducers[type] = actionDefinition;
    }
    else {
      accumulator.actions[type] = createAction(type, actionDefinition.prepare);
      accumulator.reducers[type] = actionDefinition.reduce;
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

export type ActionDefinitions<S, T = _ActionDefinitions<S>> = {
  [K in keyof T]: ActionDefinition<S, T[K]>;
}
type _ActionDefinitions<S> = {
  [index: string]: ActionReducerWithPreparer<S> | ActionReducer<S>;
}

export type ActionDefinition<S, Reducer = ActionReducerWithPreparer<S> | ActionReducer<S>> = Reducer extends {
  prepare: ActionPreparer;
} ? ActionReducerWithPreparer<S> : ActionReducer<S>;


export type ActionReducerWithPreparer<S> = {
  reduce: ActionReducer<S>;
  prepare: ActionPreparer;
}
export type ActionReducer<S> = (action: Action, state: S) => S;
type ActionPreparer = (...args: any[]) => Omit<Action, 'type'>;
export interface Action {
  type: string;
  payload?: any;
  meta?: any;
  error?: boolean;
}

type ReducerMap<S> = {
  [K in keyof ActionDefinitions<S>]: ActionReducer<S>;
}
type CreatorMap<S> = {
  [K in keyof ActionDefinitions<S>]: (...args: any[]) => Action;
}
interface ReducerAccumulator<S> {
  actions: CreatorMap<S>;
  reducers: ReducerMap<S>
};
