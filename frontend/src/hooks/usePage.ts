import { useContext } from 'react';
import PageContext, { PageContextType } from '@/contexts/PageProvider';

const usePage = () => useContext(PageContext) as PageContextType;
export default usePage;
