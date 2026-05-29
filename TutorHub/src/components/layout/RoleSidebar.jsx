import useAuthStore from '../../store/authStore';
import StudentSidebar from './StudentSidebar';
import TutorSidebar from './TutorSidebar';
import AdminSidebar from './AdminSidebar';

const RoleSidebar = () => {
  const { user } = useAuthStore();
  const role = user?.role;

  if (role === 'Tutor') return <TutorSidebar />;
  if (role === 'Admin') return <AdminSidebar />;
  if (role === 'Student' || role === 'Parent') return <StudentSidebar />;
  return null;
};

export default RoleSidebar;
