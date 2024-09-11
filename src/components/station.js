import PosButton from "./PosButton"

export default function Station({ name, items, occupiedBy, canGet, onMoveClicked, dispatch }) {
    function getItem(item) {
        dispatch({ type: "GET_ITEM", stationName: name, personId: occupiedBy.id, qty: 1, item})
    }

    return <div className="station">
        <PosButton occupiedBy={occupiedBy} onClick={onMoveClicked}/>
        <div className="station-title">{name}</div>
        <ul className="station-items">
            {items.map((item) => (
                <div key={item.id} className="station-item">
                    <span className="item-name">{item.name}</span>
                    {canGet && <button className="item-grab-button" onClick={() => getItem(item)}>Get</button>}
                </div>
            ))}
        </ul>
    </div>
}