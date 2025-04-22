// @/app/drive/book/layout.js

// Component
import NoAdminComponent from "@/app/drive/no-admin";
// Utils
import { getUserv2 } from "@/utils/auth";

export default async function BookLayout({ children }) {
  const userData = await getUserv2();
  
  if (!userData?.admin && !userData?.prestige) { return <NoAdminComponent />; }
  return <>{children}</>;
}