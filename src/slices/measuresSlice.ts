import { createSlice } from '@reduxjs/toolkit';
import { Measure } from './state';

const recipeReducer = createSlice({
    name: 'measures',
    initialState: {} as { [index: string]: Measure },
    reducers: {
        set: {
            reducer(state, action) {
              const measure = action.payload;
              state[measure.recipeID] = measure;
            },
            prepare(payload: Measure) {
              return { payload };
            }
        },
        remove: {
            reducer(state, action) {
              delete state[action.payload];
            },
            prepare(measure: Measure) {
              return { payload: measure.recipeID };
            }
        }
    }
});

export default recipeReducer.reducer;
export const { set, remove } = recipeReducer.actions;
