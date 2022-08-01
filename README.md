# solform

### A form management library for SolidJS that is very lightweight and simple!

[![npm](https://img.shields.io/npm/v/solform?color=F53B02)](https://www.npmjs.com/package/solform)
[![GitHub Repo stars](https://img.shields.io/github/stars/ragokan/solform?label=github%20stars)](https://github.com/ragokan/solform)

### Why solform

- Very easy, fast, lightweight and powerful!
- It has built-in validation.
- You can easily customize it!
- Full type support

### Create form

```tsx
// Simplest
import { createForm } from "solform";

function App() {
    const { values, register } = createForm<{name: string}>();

    return <input {...register("name")}/>;
}
```

```tsx
// Next Level
import { createForm, requiredValidator, emailValidator } from "solform";

function App() {
  const { values, register, submit, errors } = createForm<{ email: string, 
  
  count: number }>({
    validators: {
      count: requiredValidator("Count is required"),
      email: [requiredValidator("This field is required"), emailValidator("Value should be email!")]
    },
    onSubmit: (values) => {
      // type safe values
      console.log(values);
    }
  });

  return (
    <div>
      <input {...register("email")} type="email" />
      {errors.email && <p class="error">{errors.email}</p>}

      {/* When you read count, it will be converted to number */}
      <input {...register("count")} type="number" />
      <button onClick={submit}>Submit</button>
    </div>
  );
}
```

```tsx
// Full
import { createForm, requiredValidator, emailValidator } from "solform";

function App() {
  const { values, register, submit, loading, getAllValues, getValue, setValue, errors, watch } = createForm<{ email: string, count: number }>({
    initialValues: {
      count: 0
    },
    validators: {
      count: requiredValidator("Count is required"),
      email: [requiredValidator("This field is required"), emailValidator("Value should be email!")]
    },
    onSubmit: async (values) => {
      await sleep(2000); // it will automatically set loading to true
      console.log(values);
      // loading is false again
    }
  });

  // will call the given function whenever the count changes
  watch("count", (updatedCount) => {
    console.log(updatedCount);
  })

  return (
    <div>
      <input {...register("email")} type="email" />
      {errors.email && <p class="error">{errors.email}</p>}
      {/* When you read count, it will be converted to number */}
      <input {...register("count")} type="number" />
      <button onClick={submit} disabled={loading()}>{loading() ? "Loading..." : "Submit"}</button>
    </div>
  )
}

function sleep(arg0: number) {
  throw new Error("Function not implemented.");
}

```

### Built-in validators

- minLengthValidator(minLength, errorMessage)
- maxLengthValidator(maxLength, errorMessage)
- requiredValidator(errorMessage)
- emailValidator(errorMessage)

### Creating new validators

```ts
const minimumNumberValidator =
  (minNumber: number, errorMessage: string): SolFormValidator<number> =>
  (val) =>
    val < minNumber ? errorMessage : undefined;
```

### Tactics

- Always use **watch** inside a component, because it will call **onMount** and **onCleanup**.
- More soon...

### What is next?

- Support for more fields, such as **radio group**
- Validate on change option.

### How to contribute?

- Get a fork of this package, do your changes and create a pull request.
- Found a bug? create an issue.
