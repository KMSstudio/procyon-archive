import { fetchUser } from '@/utils/userDB';

export async function getUserInfo(session) {
    if (!session) {
        return { 
            do_user_login: false, 
            user_email: null, 
            is_user_admin: false, 
            last_access: null, 
            last_contribute: null 
        };
    }
    const user = await fetchUser(session.user.email);
    return {
        do_user_login: true,
        user_email: session.user.email,
        is_user_admin: user?.isAdmin ?? false,
        last_access: user?.lastAccessDate ?? null,
        last_contribute: user?.lastContributionDate ?? null
    };
}