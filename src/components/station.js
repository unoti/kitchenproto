import PosButton from "./PosButton"

export default function Station({ name, items, active, onMoveClicked }) {
    return <div className="station">
        <PosButton active={active} stationName={name} onClick={onMoveClicked}/>
        <div className="station-title">{name}</div>
        <ul className="station-items">
            {items.map((item) => (
                <div key={item.id} className="station-item">
                    {item.name}
                    {active && <button className="item-grab-button">Get</button>}
                </div>
            ))}
        </ul>
    </div>
}