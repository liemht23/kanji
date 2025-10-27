export interface Option {
  value: string | number;
  label: string;
}

export const getLabel = (options: Option[], value: string | number): string => {
  const found = options.find((opt) => String(opt.value) === String(value));
  return found ? found.label : "";
};
