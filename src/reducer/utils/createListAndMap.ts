import { ListAndMap, Identified } from "../state";

const createListAndMap = <T extends Identified>(list: T[]): ListAndMap<T> => ({
  list: [...list],
  ...list.reduce((mapAndIndices, item, index) => {
    mapAndIndices.map[item.id] = item;
    mapAndIndices.indices[item.id] = index;
    return mapAndIndices;
  }, {map:{}, indices:{}} as {map: {[index:number]: T}, indices: {[index: number]: number}})
});

export default createListAndMap;
