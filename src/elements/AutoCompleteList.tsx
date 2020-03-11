interface AutoCompleteProps {
  autoCompleteList: string[];
  searchValue: string | string[] | number | undefined;
  onChoose: (chosenIndex: number) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = props => {
  return null;
};

export default AutoComplete;
