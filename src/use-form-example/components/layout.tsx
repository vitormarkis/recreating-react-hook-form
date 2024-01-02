import { useForm } from "@/use-form-example/hooks/useForm";

const initialValues = {
  age: 0,
  password: "",
  username: "",
};

export function Form() {
  const { append, values } = useForm<typeof initialValues>(initialValues);

  return (
    <form>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <input
        {...append("username")}
        placeholder="Usuário"
      />
      <input
        {...append("password")}
        placeholder="Senha"
        type="password"
      />
      <input
        {...append("age")}
        placeholder="Idade"
        type="number"
      />
    </form>
  );
}
