import { useForm } from "@/use-form-example/hooks/useForm";

const initialValues = {
  age: 0,
  password: "",
  username: "",
};

export function Form() {
  const { append, values, errors } = useForm<typeof initialValues>(initialValues, {
    resolver: {
      age(value) {
        if (value < 18) return { message: "Você precisa ter mais de 18 anos." };
        return null;
      },
      username(value) {
        if (value.length === 0) return { message: "Preencha este campo." };
        return null;
      },
    },
  });

  return (
    <form>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <input
        {...append("username")}
        placeholder="Usuário"
      />
      {errors?.username && <span>{errors.username.message}</span>}
      <input
        {...append("password")}
        placeholder="Senha"
        type="password"
      />
      {errors?.password && <span>{errors.password.message}</span>}
      <input
        {...append("age")}
        placeholder="Idade"
        type="number"
      />
      {errors?.age && <span>{errors.age.message}</span>}
    </form>
  );
}
