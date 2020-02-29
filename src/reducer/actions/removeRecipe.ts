import { Recipe, ApplicationState } from "../state";

function prepare(recipe: Recipe) {

}

function reducer(action: {payload: number}, state: ApplicationState) : ApplicationState {
  return state;
}

export { prepare, reducer };
