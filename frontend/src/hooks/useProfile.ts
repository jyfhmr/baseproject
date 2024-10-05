import { useContext } from 'react';
import ProfileContext, { ProfileContextType } from '@/contexts/ProfileProvider';

const useProfile = () => useContext(ProfileContext) as ProfileContextType;
export default useProfile;
