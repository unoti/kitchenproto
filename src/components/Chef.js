export default function Chef({player, dispatch}) {
    function putItem(item) {
        dispatch({ type: "PUT_ITEM", fromPersonId: player.id, item});
    }

    return <div className="attached-player">
        <h3>Carrying</h3>
        <div>
            {player.inventory.map((item) => (
                <div key={item.id} className="station-item">
                    <span className="item-name">{item.name}</span>
                    {item.qty > 1 && <span className="item-qty"> x {item.qty}</span>}
                    <button className="item-put" onClick={() => putItem(item)}>Put</button>
                </div>
            ))}
        </div>
    </div>
}