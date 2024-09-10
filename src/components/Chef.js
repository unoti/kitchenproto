export default function Chef({player}) {
    return <div className="attached-player">
        <h3>Carrying</h3>
        <div>
            {player.inventory.map((item) => (
                <div key={item.id} className="station-item">
                    {item.name}
                </div>
            ))}
        </div>
    </div>
}