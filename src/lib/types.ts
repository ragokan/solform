export type BetterFormError<Values> = { [key in keyof Values]?: string };

export type BetterFormValidator<T> = (value: T) => string | void;

export type BetterFormValidatorsOption<Values> = {
  [key in keyof Partial<Values>]:
    | BetterFormValidator<Values[key]>
    | Array<BetterFormValidator<Values[key]>>;
};

export interface BetterFormOptions<Values> {
  validators?: BetterFormValidatorsOption<Values>;
  onSubmit?: (values: Values) => void | Promise<void>;
}
