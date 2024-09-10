export default function Chef({player}) {
    return <div className="attached-player">
        <h3>Carrying</h3>
        <ul className="station-items">
            {player.inventory.map((item) => (
                <div key={item.id} className="station-item">
                    {item.name}
                </div>
            ))}
        </ul>
    </div>
}