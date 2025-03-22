import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 