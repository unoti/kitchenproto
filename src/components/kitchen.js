import Station from "./Station"
import React, { useReducer } from 'react';

const initialState = {
    activeStation: 'Shelf',
    people: [
        { id: 1, name: 'Chef 1', station: null, inventory: [] },
    ],
    stations: [
        {
            name: "Shelf",
            items: [
                { id: 1, name: "Sugar" },
                { id: 2, name: "Salt" },        
            ],
            occupiedBy: null,
        },{
            name: "Utensils",
            items: [
                { id: 3, name: "Knife" },
                { id: 4, name: "Bowl" },
                { id: 5, name: "Pot" },
            ],
            occupiedBy: null,
        },{
            name: "Fridge",
            items: [
                { id: 6, name: "Limes" },
            ],
            occupiedBy: null,
        },{
            name: "CuttingBoard",
            items: [],
            occupiedBy: null,
    },{
            name: "Juicer",
            items: [],
            occupiedBy: null,
        },{
            name: "Stove",
            items: [],
            occupiedBy: null,
        }
    ]
}

function kitchenReducer(state, action) {
    console.log(`reduce`);
    console.log(action);
    switch (action.type) {
        // [ ] this needs to change to the new strategy of every person knows where they are,
        //     and every station knows who is in it
        case "MOVE_TO_STATION":
            return { ...state, activeStation: action.stationName };
        default:
            return state;
    }
}

export default function Kitchen() {
    const [state, dispatch] = useReducer(kitchenReducer, initialState);

    // On startup, move player to the shelf.
    React.useEffect(() => {
        dispatch({ type: "MOVE_TO_STATION", personId: 1, stationName: "Shelf"});
    }, []);

    function onMoveClicked(stationName) {
        dispatch({ type: "MOVE_TO_STATION", personId: 1, stationName});
    }

    return <>
        <div className="kitchen">
            <h3>Kitchen</h3>
            <div className="station-container">
                {state.stations.map((station) => (
                    <Station key={station.name}
                        name={station.name}
                        items={station.items}
                        active={state.activeStation === station.name}
                        onMoveClicked={() => onMoveClicked(station.name)}
                    />
                ))}
            </div>
        </div>
    </>
}