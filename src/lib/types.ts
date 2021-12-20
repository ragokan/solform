export type BetterFormError<Values> = { [key in keyof Values]?: string };

export type BetterFormValidator<T> = (value: T) => string | void;

export interface BetterFormOptions<Values> {
  validators?: {
    [key in keyof Partial<Values>]:
      | BetterFormValidator<Values[key]>
      | Array<BetterFormValidator<Values[key]>>;
  };
  onSubmit?: (values: Values) => void | Promise<void>;
}
