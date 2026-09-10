import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginButton from "./LoginButton";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/home");

  return (
    <main className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm text-center animate-fadeUp">
        <div className="text-6xl font-jp mb-3">あ</div>
        <h1 className="text-2xl font-semibold text-ink mb-1">かな</h1>
        <p className="text-muted text-sm mb-10">
          Learn hiragana, one card at a time.
        </p>
        <LoginButton />
        <p className="text-xs text-muted mt-6">
          Sign in to save your progress across devices.
        </p>
      </div>
    </main>
  );
}
