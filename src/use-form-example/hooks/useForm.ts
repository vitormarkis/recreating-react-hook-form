import React from "react";

type ValidationResponse = { message: string };
type Resolver<T extends any> = (value: T) => null | ValidationResponse;

interface Config<T extends Record<string, any>> {
  resolver?: {
    [K in keyof T]?: Resolver<T[K]>;
  };
  mode?: "onBlur" | "onChange";
}

export function useForm<T extends Record<string, any>>(initialValue: T = {} as T, config?: Config<T>) {
  type FormFieldMap<Schema> = Record<keyof T, Schema>;
  const [formFields, setFormFields] = React.useState<T>(initialValue);
  const [dirtyFields, setDirtyFields] = React.useState({} as FormFieldMap<true>);

  const { resolver, mode = "onChange" } = config ?? {};
  let errors = {} as Partial<FormFieldMap<ValidationResponse | null>>;

  const dirty = React.useCallback((fieldName: keyof T) => {
    setDirtyFields(df => ({ ...df, [fieldName]: true }));
  }, []);

  function append(fieldName: keyof T) {
    const fieldSetter = React.useCallback((newValue: string) => {
      setFormFields(prev => ({ ...prev, [fieldName]: newValue }));
    }, []);

    const onChange = React.useCallback(
      (e: any) => {
        if (mode === "onChange") dirty(fieldName);
        fieldSetter(e.target.value);
      },
      [fieldSetter],
    );

    const onBlur = React.useCallback(() => {
      if (mode === "onBlur") dirty(fieldName);
    }, []);

    return {
      value: formFields[fieldName],
      onChange,
      onBlur,
    };
  }

  if (resolver) {
    for (const formFieldKey in formFields) {
      const fieldResolver = resolver[formFieldKey];
      if (!fieldResolver) continue;
      const parseErrorMessage = fieldResolver(formFields[formFieldKey]);
      if (parseErrorMessage && formFieldKey in dirtyFields) {
        errors[formFieldKey] = parseErrorMessage;
      }
    }
  }

  return {
    append,
    values: formFields,
    errors,
  };
}
