import { Recipe, ApplicationState } from "../state";

function prepare(recipe: Recipe) {
  return { payload: recipe };
}

function reducer(action: { payload: Recipe}, state: ApplicationState): ApplicationState {
  return state;
}

export { prepare, reducer };
