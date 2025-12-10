import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
}
