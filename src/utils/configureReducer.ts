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

export interface ActionDefinitions<S> {
  [index: string]: ActionDefinition<S>;
}
export type ActionDefinition<S> = ActionReducer<S> | {
  reduce: ActionReducer<S>;
  prepare: ActionPreparer;
};
type ActionReducer<S> = (action: Action, state: S) => S;
type ActionPreparer = (...args: any[]) => Omit<Action, 'type'>;
interface Action {
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
