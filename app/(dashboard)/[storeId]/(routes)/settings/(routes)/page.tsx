import { redirect } from 'next/navigation';
import { auth } from "@clerk/nextjs"
import prismadb from '@/lib/prismadb';
import SettingsForm from './components/settings-form';

interface SettingPageProps {
    params : { storeId: string }
}

const SettingPage = async ({ params }: SettingPageProps) => {
    const { userId } = auth();
    if(!userId) return redirect('/sign-in')

    const store = await prismadb.store.findFirst({
        where: { id: params.storeId, userId }
    });
    if(!store) return redirect('/');

    return (
        <div className='flex-col flex-1'>
            <div className='space-y-4 p-8 pt-6'>
                <SettingsForm initialData={store}/>
            </div>
        </div>
    )
}

export default SettingPage