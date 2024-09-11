export default function Chef({player}) {
    return <div className="attached-player">
        <h3>Carrying</h3>
        <div>
            {player.inventory.map((item) => (
                <div key={item.id} className="station-item">
                    <span className="item-name">{item.name}</span>
                    {item.qty > 1 && <span className="item-qty"> x {item.qty}</span>} 
                </div>
            ))}
        </div>
    </div>
}