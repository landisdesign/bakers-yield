const sanitizeNumber = (value: string) => isNaN(+value) ? 0 : +value;

export default sanitizeNumber;
