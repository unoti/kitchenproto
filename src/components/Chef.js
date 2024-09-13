export default function Chef({player, items, availableActions, station, canPut, dispatch}) {
    function putItem(itemId) {
        dispatch({ type: "PUT_ITEM", fromPersonId: player.id, itemId: itemId});
    }

    return <div className="attached-player">
        <div className="player-actions">
            {availableActions.map(action => (
                <button key={action.name}>{action.name}</button>
            ))}
        </div>
        <h3>Carrying</h3>
        <div>
            {Object.entries(player.inventory).map(([itemId, qty]) => (
                <div key={itemId} className="station-item">
                    <span className="item-name">{items[itemId].name}</span>
                    {qty > 1 && <span className="item-qty"> x {qty}</span>}
                    {canPut(items, itemId, station) &&
                        <button className="item-put" onClick={() => putItem(itemId)}>Put</button>}
                </div>
            ))}
        </div>
    </div>
}
