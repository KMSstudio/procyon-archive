export function getUserInfo(session) {
    if (!session) {
        return {
            do_user_login: false,
            user_email: null,
            is_user_admin: false,
        };
    }
  
    const isAdmin = session.user.email === "zizonms@snu.ac.kr";
  
    return {
        do_user_login: true,
        user_email: session.user.email,
        is_user_admin: isAdmin,
    };
}