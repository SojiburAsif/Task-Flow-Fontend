import { getCurrentUser } from "@/lib/currentUser";
import Fooder from "@/components/shared/Fooder/Fooder";
import Navbar from "@/components/shared/Navbar/navbar";



export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();


  return (
    <div className="">
      <Navbar user={currentUser} />
      <main className="">
        {children}
      </main>
      <Fooder />
    </div>
  );
}
