'use client';

import Loading from '@/components/Loading';
import { getOne } from '@/services';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, createContext, useEffect } from 'react';

export interface ProfileContextType {
    profile: any;
    actions: any;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

const ProfileProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { data } = useSession() as any;
    const [profile, setProfile] = useState(null) as any;
    const [actions, setActions] = useState([]) as any;
    const pathname = usePathname() as any;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data?.user?.profileId) {
            (async () => {
                const get = await getOne('config/profiles', data?.user?.profileId);
                setProfile(get);
            })();
        }
    }, [data]);

    useEffect(() => {
        profile && getActions();
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile, pathname]);

    const getActions = async () => {
        const cutoff = '/form';
        const index = pathname.indexOf(cutoff);
        const newPathname = pathname.substring(0, index);

        let profilePage = profile.profilePages?.find(
            (el: any) => el.page.route == pathname || el.page.route == newPathname,
        );

        if (profilePage) {
            let pageActions = profilePage.package.actions.map((el: any) => el.id);
            setActions(pageActions);
        }
    };

    const contextObject: ProfileContextType = {
        profile,
        actions,
    };

    return loading ? (
        <Loading />
    ) : (
        <ProfileContext.Provider value={contextObject}>{children}</ProfileContext.Provider>
    );
};

export { ProfileProvider };

export default ProfileContext;
