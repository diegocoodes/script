"use client";

import { useActionState } from "react";
import { LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { message: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="space-y-5">
      {state.message && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue="administrador@admin.com"
            autoComplete="username"
            className="h-12 pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            className="h-12 pl-10"
            required
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="h-12 w-full" disabled={pending}>
        {pending ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <LogIn aria-hidden="true" className="size-4" />
        )}
        {pending ? "Entrando…" : "Entrar no sistema"}
      </Button>
    </form>
  );
}
