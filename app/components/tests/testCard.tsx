type TestCardProps = {
    name: string;
    created_at: string;
}

export default function TestCard({name, created_at} : TestCardProps) {

    const date: Date = new Date(created_at);

    const formattedDate: string = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(date);

    return(
        <div>
            <h3>{name}</h3>
            <a>Asignatura...</a>
            <p>{formattedDate}</p>
            <button></button>
        </div>
    );
}