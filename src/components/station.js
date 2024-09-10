import PosButton from "./PosButton"

export default function Station({ name, items }) {
    return <div className="station">
        <PosButton />
        <div className="station-title">{name}</div>
        <ul className="station-items">
            {items.map((item) => (
                <li key={item.id}>
                    {item.name}
                </li>
            ))}
        </ul>
    </div>
}