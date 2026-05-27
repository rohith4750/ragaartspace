import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
  // Server‑side session check
  const session = await getServerSession(authOptions);

  // Redirect non‑admin or unauthenticated users to login with callback URL
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect(`/admin/login?callbackUrl=${encodeURIComponent("/admin")}`);
  }

  // Placeholder admin dashboard – replace with real UI later
  return (
    <main className="min-h-[85vh] bg-background p-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-4">Admin Dashboard</h1>
      <p className="text-brand-dark/70">
        Welcome, administrator! Use this area to manage the site.
      </p>
      {/* TODO: Add admin management components here */}
    </main>
  );
}
