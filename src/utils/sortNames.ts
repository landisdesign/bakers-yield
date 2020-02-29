import { Named } from "./types";

const sortNames = (a: Named, b: Named) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
};

export default sortNames;
