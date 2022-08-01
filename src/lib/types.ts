export type SolFormError<Values> = { [key in keyof Values]?: string };

export type SolFormValidator<T> = (value: T) => string | void;

export type SolFormElement = HTMLInputElement | HTMLSelectElement;

export type SolFormValidatorsOption<Values> = {
  [key in keyof Partial<Values>]:
    | SolFormValidator<Values[key]>
    | Array<SolFormValidator<Values[key]>>;
};

export interface SolFormOptions<Values> {
  initialValues?: Partial<Values>;
  validators?: SolFormValidatorsOption<Values>;
  onSubmit?: (values: Values) => void | Promise<void>;
}
