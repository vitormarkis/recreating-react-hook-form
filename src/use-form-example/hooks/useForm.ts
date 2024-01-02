import React from "react";

export function useForm<T extends Record<string, any>>(initialValue: T = {} as T) {
  const [formFields, setFormFields] = React.useState<T>(initialValue);

  function append(fieldName: keyof T) {
    const fieldSetter = React.useCallback((newValue: string) => {
      setFormFields(prev => ({ ...prev, [fieldName]: newValue }));
    }, []);

    const onChange = React.useCallback(
      (e: any) => {
        fieldSetter(e.target.value);
      },
      [fieldSetter],
    );

    const onBlur = React.useCallback(() => {}, []);

    return {
      value: formFields[fieldName],
      onChange,
      onBlur,
    };
  }

  return {
    append,
    values: formFields,
  };
}
