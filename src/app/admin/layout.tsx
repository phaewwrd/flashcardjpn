import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import Nav from "@/components/Nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!session.user.isAdmin) redirect("/home");

  return (
    <div className="min-h-screen bg-paper">
      <Nav isAdmin userImage={session.user.image} />
      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="flex items-center gap-4 mb-6 text-sm">
          <Link href="/admin" className="font-medium text-ink">
            Admin
          </Link>
          <Link href="/admin/categories" className="text-muted hover:text-ink">
            Categories
          </Link>
          <Link href="/admin/words" className="text-muted hover:text-ink">
            Words
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
