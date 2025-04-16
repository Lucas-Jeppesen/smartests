
import Asignaturas from "@/app/components/Asignaturas/asignaturas";
import ModalTriggerButton from "@/app/components/modals/modalTriggerButton";
import { ModalProvider } from "@/app/components/modals/modalContext";
import CreateAsigModal from "@/app/components/modals/createAsigModal";
import { createClient } from "@/app/utils/supabase/server";

export default async function misAsignaturas() {
  const clientSupa = await createClient();
  const { data: { user } } = await clientSupa.auth.getUser();
  return(
    <ModalProvider>
        <div className="flex flex-col gap-8 w-full">  
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-green-4">Asignaturas: </h1>
                    <ModalTriggerButton
                            type="create-asig"
                            className='bg-yellow-1 hover:bg-green-1 hover:text-yellow-1 text-green-2 font-medium text-sm px-6 py-1 rounded cursor-pointer border border-green-1 transition-all duration-300 ease-in-out'
                        >
                            Crear nueva
                    </ModalTriggerButton>
            </div>
            {user ? (
                <>
                    <Asignaturas userId={user.id} />
                    <CreateAsigModal userId={user.id} />
                </>
            ) : (
                <p className="text-red-500">Error: User not found.</p>
            )}
        </div>
    </ModalProvider>
  );
}