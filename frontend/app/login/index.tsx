
import { useAuthSession } from "@/providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string
  password: string
}

export default function Login(): ReactNode {
  const { signIn } = useAuthSession();
  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (data: Inputs) => signIn(data.username, data.password),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched"
  })
  const onSubmit: SubmitHandler<Inputs> = (data) => mutateAsync(data)

  return (
    <div className="flex items-center justify-center h-full">
      {isError && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>Error! Task failed successfully.</span>
        </div>
      )}
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Nombre de usuario</legend>
          <input type="text" className={`input ${errors.username ? 'input-error' : ''}`} placeholder="minabodekiev" {...register("username", { required: true })} />
          {errors.username && <span className="fieldset-label italic text-error">El nombre de usuario es obligatorio</span>}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Contraseña</legend>
          <input type="password" className={`input ${errors.password ? 'input-error' : ''}`} placeholder="Type here" {...register("password", { required: true })} />
          {errors.password && <span className="fieldset-label italic text-error">La contraseña es obligatoria</span>}
        </fieldset>

        <button type="submit" className="btn btn-primary w-full">{isPending && <span className="loading loading-spinner"></span>}Iniciar sesión</button>
      </form>
    </div>
  );
}