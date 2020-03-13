const getSearchResults = (searchValue: string | string[] | number | undefined, listText: string): SearchEntry[] | null => {

  if ((typeof searchValue !== 'string') || (searchValue === '')) {
    return null;
  }

  const sanitizedSearch = searchValue.replace(/([\\^$.|?*+()[{])/g, '\\$1');
  const regex = new RegExp(`^(.*)(${sanitizedSearch})(.*)$`, 'mgi');
  let resultEntries: SearchEntry[] = [];
  let result;
  while ((result = regex.exec(listText))) {
    const [
      entry,
      before,
      found,
      after
    ] = result;
    resultEntries.push({
      entry,
      before,
      found,
      after
    });
  }

  if (resultEntries.length === 0) {
    return null;
  }

  if (resultEntries.length === 1
    && (resultEntries[0].entry.toLowerCase() === searchValue.toLowerCase()
      || resultEntries[0].entry.toLowerCase() === (searchValue.toLowerCase() + ' 🥖')
    )
  ) {
    return null;
  }

  return resultEntries;
}

export default getSearchResults;

interface SearchEntry {
  entry: string;
  before: string;
  found: string;
  after: string;
};
