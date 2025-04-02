
import { useModal } from "@/app/components/modals/modalContext";


export default function AsignaturaCard() {

    const { openModal } = useModal();

    return(
        <div>
            <h2>Nombre</h2>
            <p>Fecha de creación</p>
            <p>Tests Asociados</p>
            <button>Editar</button>
            <button>Eliminar</button>
        </div>
    );
}