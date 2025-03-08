import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      do_user_login: false,
      user_email: null,
      is_user_admin: false,
    });
  }

  const isAdmin = session.user.email === "zizonms@snu.ac.kr";

  return NextResponse.json({
    do_user_login: true,
    user_email: session.user.email,
    is_user_admin: isAdmin,
  });
}
