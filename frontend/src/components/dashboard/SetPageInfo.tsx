'use client';
import { useEffect } from 'react';
import usePage from '@/hooks/usePage';

const SetPageInfo = ({ pageName, iconPage, breadCrumb }: any) => {
    const { setBreadCrumb, setIconPage, setPageName } = usePage();

    useEffect(() => {
        setPageName(pageName);
        setIconPage(iconPage);
        setBreadCrumb(breadCrumb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default SetPageInfo;
