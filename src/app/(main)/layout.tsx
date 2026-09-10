import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Nav from "@/components/Nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-paper">
      <Nav isAdmin={session.user.isAdmin} userImage={session.user.image} />
      <div className="max-w-3xl mx-auto px-5 py-8">{children}</div>
    </div>
  );
}
