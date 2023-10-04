import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';

const SetupLayout = async ({ children }: { children: React.ReactNode}) => {
    const { userId } = auth();
    if(!userId) return redirect('/sign-in');

    // find fist store that our user has.
    // rootlayout does not have store id.
    // so there's no specific store we have to load.
    // we are just attempt to load first one.
    // that how we are going to check we are going to redirect user to the dashboard route or keep the user inside root and the show the modal to create first store.
    const store = await prismadb.store.findFirst({ where: { userId } });
    if(store) return redirect(`/${store.id}`);
    
    return (<>
        {children}
    </>)
}

export default SetupLayout