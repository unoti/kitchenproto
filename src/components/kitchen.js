import Station from "./Station"

export default function Kitchen() {
    const itemsShelf = [
        { id: 1, name: "Sugar" },
        { id: 2, name: "Salt" },
    ];
    const itemsUtensils = [
        { id: 3, name: "Knife" },
        { id: 4, name: "Bowl" },
        { id: 5, name: "Pot" },
    ];
    const itemsFridge = [
        { id: 6, name: "Knife" },
    ];

    return <>
        <div className="kitchen">
            <h3>Kitchen</h3>
            <div className="station-container">
                <Station name="Shelf" items={itemsShelf} />
                <Station name="Utensils" items={itemsUtensils}/>
                <Station name="Fridge" items={itemsFridge}/>
            </div>
        </div>
    </>
}