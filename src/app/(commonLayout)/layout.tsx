import Fooder from "@/components/shared/Fooder/Fooder";
import Navbar from "@/components/shared/Navbar/navbar";



export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <div className="">
      <Navbar />
      <main className="">
        {children}
      </main>
      <Fooder />
    </div>
  );
}
