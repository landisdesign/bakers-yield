const textToNumber = (value: string) => isNaN(+value) ? 0 : +value;

export default textToNumber;
