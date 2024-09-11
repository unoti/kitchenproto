export default function Chef({player}) {
    return <div className="attached-player">
        <h3>Carrying</h3>
        <div>
            {player.inventory.map((item) => (
                <div key={item.id} className="station-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">{item.qty}</span>
                </div>
            ))}
        </div>
    </div>
}