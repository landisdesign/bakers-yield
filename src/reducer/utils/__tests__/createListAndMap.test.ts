import { Identified, ListAndMap } from "../../state";
import createListAndMap from '../createListAndMap';

test('Map created properly', () => {
  const list: Identified[] = [
    { id: 1 },
    { id: 3 },
    { id: 6 }
  ];

  const expected: ListAndMap<Identified> = {
    list: [...list],
    map: {
      1: list[0],
      3: list[1],
      6: list[2]
    },
    indices: {
      1: 0,
      3: 1,
      6: 2
    }
  };

  const actual = createListAndMap(list);
  expect(actual).toEqual(expected);
});
