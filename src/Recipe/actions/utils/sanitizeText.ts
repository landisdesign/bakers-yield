const sanitizeText = (value: string) => isNaN(+value) ? 0 : +value;

export default sanitizeText;
