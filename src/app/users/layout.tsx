import Sidebar from "@/components/sidebar/Sidebar";
import getCurrentUser from "@/actions/getCurrentUser";
import { User } from "@prisma/client";
import getUsers from "@/actions/getUsers";
import UserList from "@/components/UserList";

interface UsersLayoutProps {
  children: React.ReactNode;
}

const UsersLayout = async ({ children }: UsersLayoutProps) => {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  const users = await getUsers();

  return (
    // @ts-ignore
    <Sidebar>
      <div className="h-full">
        <UserList users={users} />
        {children}
      </div>
    </Sidebar>
  );
};

export default UsersLayout;
