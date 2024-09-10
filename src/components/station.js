import PosButton from "./PosButton"

export default function Station({ name, items, occupiedBy, onMoveClicked }) {
    return <div className="station">
        <PosButton occupiedBy={occupiedBy} onClick={onMoveClicked}/>
        <div className="station-title">{name}</div>
        <ul className="station-items">
            {items.map((item) => (
                <div key={item.id} className="station-item">
                    {item.name}
                    {occupiedBy && <button className="item-grab-button">Get</button>}
                </div>
            ))}
        </ul>
    </div>
}