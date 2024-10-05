import { useState, createContext } from 'react';

export interface PageContextType {
    pageName: string;
    iconPage: string;
    breadCrumb: any;
    setPageName: any;
    setIconPage: any;
    setBreadCrumb: any;
}

const PageContext = createContext<PageContextType | null>(null);

const PageProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [pageName, setPageName] = useState('');
    const [iconPage, setIconPage] = useState('');
    const [breadCrumb, setBreadCrumb] = useState([]);

    const contextObject: PageContextType = {
        pageName,
        setPageName,
        iconPage,
        setIconPage,
        breadCrumb,
        setBreadCrumb,
    };

    return <PageContext.Provider value={contextObject}>{children}</PageContext.Provider>;
};

export { PageProvider };

export default PageContext;
