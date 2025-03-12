
import { useAuthSession } from "@/providers/AuthProvider";
import Uuid from "expo-modules-core/src/uuid";
import { ReactNode } from "react";

import '../../global.css';

export default function Login(): ReactNode {
  const { signIn } = useAuthSession();

  const login = (): void => {
    const random: string = Uuid.v4();
    signIn(random);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Nombre de usuario</legend>
        <input type="text" className="input" placeholder="Type here" />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Contraseña</legend>
        <input type="text" className="input" placeholder="Type here" />
      </fieldset>

      <button className="btn btn-primary" onClick={() => login()}>Iniciar sesión</button>
    </div>
  );
}