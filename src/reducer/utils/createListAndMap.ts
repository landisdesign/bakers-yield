import { ListAndMap } from "../state";
import { Identified, NumberMap } from "../../utils/types";

const createListAndMap = <T extends Identified>(list: T[]): ListAndMap<T> => ({
  list: [...list],
  map: list.reduce((map, item) => {
    map[item.id] = item;
    return map;
  },
  {} as NumberMap<T>)
});

export default createListAndMap;
