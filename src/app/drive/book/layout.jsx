// @/app/drive/book/layout.js

// Component
import NoAdminComponent from "@/app/drive/no-admin";
// Utils
import { getUserv2 } from "@/utils/auth";

export default async function BookLayout({ children }) {
  if (process.env.BOOKPAGE_PUBLIC === "TRUE") {
    return <>{children}</>;
  } else {
    const userData = await getUserv2();
    return (!userData?.admin && !userData?.prestige)
      ? <NoAdminComponent />
      : <>{children}</>;
  }  
}