'use client';

import ModalTriggerButton from '../modals/modalTriggerButton';
import { QuizWithAsignatura } from '../Quiz/types';
import { formatDate } from '@/app/utils/general-helpers';

type TestCardProps = {
  item: QuizWithAsignatura;
};

const colorVariants = {
  red: 'bg-red-200 hover:bg-red-100 text-red-800',
  orange: 'bg-orange-200 hover:bg-orange-100 text-orange-800',
  amber: 'bg-amber-200 hover:bg-amber-100 text-amber-800',
  yellow: 'bg-yellow-200 hover:bg-yellow-100 text-yellow-800',
  lime: 'bg-lime-200 hover:bg-lime-100 text-lime-800',
  green: 'bg-green-200 hover:bg-green-100 text-green-800',
  emerald: 'bg-emerald-200 hover:bg-emerald-100 text-emerald-800',
  teal: 'bg-teal-200 hover:bg-teal-100 text-teal-800',
  cyan: 'bg-cyan-200 hover:bg-cyan-100 text-cyan-800',
  sky: 'bg-sky-200 hover:bg-sky-100 text-sky-800',
  blue: 'bg-blue-200 hover:bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-200 hover:bg-indigo-100 text-indigo-800',
  violet: 'bg-violet-200 hover:bg-violet-100 text-violet-800',
  purple: 'bg-purple-200 hover:bg-purple-100 text-purple-800',
  fuchsia: 'bg-fuchsia-200 hover:bg-fuchsia-100 text-fuchsia-800',
  pink: 'bg-pink-200 hover:bg-pink-100 text-pink-800',
  rose: 'bg-rose-200 hover:bg-rose-100 text-rose-800',
  slate: 'bg-slate-200 hover:bg-slate-100 text-slate-800',
};

export default function TestCard({ item } : TestCardProps) {
  
  const formatedDate = formatDate(item.created_at);
  console.log(item);

  let asignatura_name = "";
  let asignatura_color = "";
  if (item.asignatura_id) {
    asignatura_name = item.asignatura.name;
    asignatura_color = item.asignatura.color;
  } else {
    asignatura_name = "sin asignatura";
  }

  return (
    <div key={item.id} className={`flex justify-between items-center w-full border p-4 rounded transition-all duration-300 ease-in-out`}>
      <div className='flex flex-col gap-2'>
        <h2 className='font-bold'>{item.name}</h2>
        <p>{`Creado el: ${formatedDate}`}</p>
        <p>{`${item.num_questions} preguntas`}</p>
        <p className={`text-center border p-2 rounded ${colorVariants[asignatura_color]} transition-all duration-300 ease-in-out`}>{asignatura_name}</p>
      </div>
      <div className="my-2 flex gap-4">
      <a href={`/test/${item.id}`} className='bg-black text-white px-4 py-2 rounded cursor-pointer text-sm'>Ir al test</a>
        <ModalTriggerButton
          type="delete-test"
          className='text-red-600 px-4 py-2  rounded cursor-pointer text-sm underline' 
          data={{ id: item.id }}
        >
          Borrar
        </ModalTriggerButton>
      </div>
    </div>
  );
}














// type TestCardProps = {
//     name: string;
//     created_at: string;
// }

// export default function TestCard({name, created_at} : TestCardProps) {

//     const date: Date = new Date(created_at);

//     const formattedDate: string = new Intl.DateTimeFormat('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         timeZone: 'UTC'
//       }).format(date);

//     return(
//         <div>
//             <h3>{name}</h3>
//             <a>Asignatura...</a>
//             <p>{formattedDate}</p>
//             <button>Iniciar</button>
//             <button>Eliminar</button>
//         </div>
//     );
// }