export default function thousandFormatter(number) {
  const THOUSAND_FORMATTER = new RegExp(/\B(?=(\d{3})+(?!\d))/g);
  if (!Boolean(number)) {
    return;
  }
  const numberSplitter = ' ';
  if (number.includes(numberSplitter)) {
    const numberToFormat = number.split(numberSplitter);
    return [
      numberToFormat[0].replace(THOUSAND_FORMATTER, ' '),
      numberToFormat[1],
    ]
      .join(numberSplitter)
      .trim();
  }
  return number.replace(THOUSAND_FORMATTER, ' ');
}
