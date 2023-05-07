import getCurrentUser from "@/actions/getCurrentUser";
import DeskSidebar from "./DeskSidebar";
import MobileFooter from "./MobileFooter";
import { User } from "@prisma/client";


interface SidebarProps {
    children: React.ReactNode; 
}

const Sidebar = async ({
    children
}: {children: React.ReactNode}) => {
    const currentUser = await getCurrentUser(); 
    return(
        <div className="h-full">
            <DeskSidebar currentUser={currentUser!} />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
            {children}

            </main>

        </div>
    )
}

export default Sidebar; 