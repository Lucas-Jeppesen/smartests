'use client';
import { login } from "@/app/login/actions";
import { signInWithGoogle } from "@/app/utils/actions";

export default function AuthForm() {
    return (
        <div className="relative p-2 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow-md">
                <div className="px-5 sm:px-12 py-12">
                    <div className="text-center">
                        <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                            Login to your account
                        </p>
                        <p className="mt-2 text-sm leading-4 text-slate-600">
                            You must be logged in to perform this action.
                        </p>
                    </div>

                    <form className="mt-7 flex flex-col gap-2">
                        <button
                            formAction={signInWithGoogle}
                            className="cursor-pointer inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none disabled:cursor-not-allowed disabled:opacity-100"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                                alt="Google"
                                className="h-[18px] w-[18px] "
                            />  
                            Continuar con Google
                        </button>
                    </form>

                    <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                        <div className="h-px w-full bg-slate-200"></div>
                        O
                        <div className="h-px w-full bg-slate-200"></div>
                    </div>

                    <form className="w-full">
                        <label htmlFor="email" className="sr-only">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 text-gray-950 focus:ring-1 focus:ring-gray-300"
                            placeholder="Correo Electrónico"
                        />

                        <label htmlFor="password" className="sr-only">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 text-gray-950 focus:ring-1 focus:ring-gray-300"
                            placeholder="Contraseña"
                        />

                        <p className="mb-3 mt-2 text-sm text-gray-500">
                            <a
                                href="/forgot-password"
                                className="text-blue-800 hover:text-blue-600"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </p>

                        <button
                            formAction={login}
                            className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        ¿No tienes cuenta?{" "}
                        <a href="/signup" className="font-medium text-[#4285f4]">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
