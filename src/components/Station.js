import PosButton from "./PosButton"
import { unlimitedQty } from "./constants"

export default function Station({ name, items, inventory, occupiedBy, canGet, onMoveClicked, dispatch }) {
    function getItem(item) {
        dispatch({ type: "GET_ITEM", stationName: name, personId: occupiedBy.id, qty: 1, item})
    }

    console.log('render station');
    console.log(inventory);
    
    return <div className="station">
        <PosButton occupiedBy={occupiedBy} onClick={onMoveClicked}/>
        <div className="station-title">{name}</div>
        <div className="station-items">
            {Object.entries(inventory).map(([itemId, qty]) => (
                <div key={itemId} className="station-item">
                    <span className="item-name">{items[itemId].name}</span>
                    {qty > 1 && qty != unlimitedQty && <span className="item-qty"> x {qty}</span>}
                    {canGet && <button className="item-grab-button" onClick={() => getItem(items[itemId])}>Get</button>}
                </div>
            ))}
        </div>
    </div>
}
