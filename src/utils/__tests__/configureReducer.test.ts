import configureReducer, { ActionDefinitions, wrapActionDefinitions } from '../configureReducer';

interface TestState {
  a: string;
  b: number;
};

const testReducerDescriptor = wrapActionDefinitions({
  foo(_, state: TestState) {
    state.b++;
    return state;
  }
});

const testFullDescriptor = wrapActionDefinitions({
  bar: {
    reduce(action, state: TestState) {
      state.a = action.payload;
      return state;
    },
    prepare(s: string) {
      return {
        payload: s
      };
    }
  }
});

const testMap = {
  ...testReducerDescriptor,
  ...testFullDescriptor
};

const initState = ():TestState => ({
  a: '',
  b: 0
});

test('descriptor without "prepare" returns action creator returning an action only containing type', () => {

  const testAction = {
    type: 'foo'
  }

  const testReducer = configureReducer(testReducerDescriptor);

  expect(testReducer.actions.foo).toBeDefined();
  const { foo } = testReducer.actions;

  const result = foo();
  expect(result).toEqual(testAction);
});

test('descriptor with "prepare" returns action creator returning populated action', () => {

  const testAction = {
    type: 'bar',
    payload: 'a'
  }

  const testReducer = configureReducer(testFullDescriptor);

  expect(testReducer.actions.bar).toBeDefined();
  const { bar } = testReducer.actions;

  const result = bar('a');
  expect(result).toEqual(testAction);
});

test('standalone reducer descriptor updates state with created action', () => {

  const testState: TestState = {
    ...initState(),
    b: 1
  };

  const testReducer = configureReducer(testReducerDescriptor);
  const { foo } = testReducer.actions;
  const action = foo();

  const result = testReducer(action, initState());
  expect(result).toEqual(testState);
});

test('reduce/prepare descriptor updates state with created action', () => {

  const testState: TestState = {
    ...initState(),
    a: 'b'
  };

  const testReducer = configureReducer(testFullDescriptor);
  const { bar } = testReducer.actions;
  const action = bar('b');

  const result = testReducer(action, initState());
  expect(result).toEqual(testState);
});

test('both mappings together both work', () => {

  const testFooState: TestState = {
    ...initState(),
    b: 1
  };

  const testBarState = {
    ...testFooState,
    a: 'b'
  }

  const testReducer = configureReducer(testMap);
  const { foo, bar } = testReducer.actions;

  const fooAction = foo();
  const resultFoo = testReducer(fooAction, initState());
  expect(resultFoo).toEqual(testFooState);

  const barAction = bar('b');
  const resultBar = testReducer(barAction, resultFoo);
  expect(resultBar).toEqual(testBarState);
});

test('unknown action does not touch state', () => {
  const testResult = initState();
  const testReducer = configureReducer(testMap);

  const resultNoAction = testReducer(null, initState());
  expect(resultNoAction).toEqual(testResult);

  const resultPrimitiveAction = testReducer('foo', initState());
  expect(resultPrimitiveAction).toEqual(testResult);

  const resultEmptyAction = testReducer({}, initState());
  expect(resultEmptyAction).toEqual(testResult);

  const resultWrongAction = testReducer({type:'baz'}, initState());
  expect(resultWrongAction).toEqual(testResult);
});
