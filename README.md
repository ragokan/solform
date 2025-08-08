# solform

Easily manage forms in SolidJS.

- Small, dependency-free form helper for Solid 1.x
- Register native inputs, validate, watch, and submit with a minimal API

## Install

```bash
pnpm add solform
```

Peer dependency:
- `solid-js` (1.x)

## Quick start

```tsx
import { createForm } from "solform";

function SignupForm() {
  type Values = { email: string; agree: boolean };

  const { register, submit, errors, loading } = createForm<Values>({
    validators: {
      email: (v) => (!v ? "Email required" : undefined),
      agree: (v) => (v ? undefined : "You must agree"),
    },
    onSubmit: async (values) => {
      await fetch("/api/signup", { method: "POST", body: JSON.stringify(values) });
    },
  });

  return (
    <form onSubmit={submit}>
      <input type="email" {...register("email")} />
      {errors.email && <span>{errors.email}</span>}

      <input type="checkbox" {...register("agree")} />
      {errors.agree && <span>{errors.agree}</span>}

      <button disabled={loading()}>Submit</button>
    </form>
  );
}
```

## API

- `createForm<Values>(options?)`
  - Returns `{ register, submit, errors, getValue, setValue, loading, watch, getAllValues }`
  - `register(key)` → `{ ref, name }` attach `ref` to your input
  - `submit(e?)` prevents default, validates, calls `onSubmit` when valid
  - `errors` Solid store keyed by field
  - `getValue(key)` / `setValue(key, value)` for programmatic access
  - `loading()` signal during async submit
  - `watch(key, fn, { callImmediately = true })` listens for input and internal updates
  - `getAllValues()` snapshots the form

### Options
- `initialValues?: Partial<Values>` applied on first register (supports falsy values like `""`, `0`, `false`)
- `validators?: { [K in keyof Values]?: Validator | Validator[] }`
- `onSubmit?: (values: Values) => void | Promise<void>`

## Validators

Included helpers:

```ts
import { requiredValidator, minLengthValidator, maxLengthValidator, emailValidator } from "solform";
```

Compose arrays per field to short-circuit on first error.

## Notes
- Number inputs: empty value becomes `undefined`, otherwise parsed with `Number()`
- Checkbox inputs use `checked`
- Programmatic updates dispatch a custom `set-manually` event so `watch` receives them

## Testing

This repo uses Vitest with a DOM environment.

- Run tests: `pnpm test`
- Coverage: `pnpm test:cov`

## Contributing
- Build: `pnpm build`
- Clean build: `pnpm clean && pnpm build`
- Prepare publish: `pnpm prepublishOnly`

## License
ISC
