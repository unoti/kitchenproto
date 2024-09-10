import Station from "./Station"
import React, { useReducer } from 'react';

const initialState = {
    activeStation: 'Shelf',
    stations: [
        {
            name: "Shelf",
            items: [
                { id: 1, name: "Sugar" },
                { id: 2, name: "Salt" },        
            ],
        },{
            name: "Utensils",
            items: [
                { id: 3, name: "Knife" },
                { id: 4, name: "Bowl" },
                { id: 5, name: "Pot" },
            ]
        },{
            name: "Fridge",
            items: [
                { id: 6, name: "Limes" },
            ]
        },{
            name: "CuttingBoard",
            items: []
        },{
            name: "Juicer",
            items: []
        },{
            name: "Stove",
            items: []
        }
    ]
}

function kitchenReducer(state, action) {
    console.log(`reduce`);
    console.log(action);
    return state;
}

export default function Kitchen() {
    const [state, dispatch] = useReducer(kitchenReducer, initialState);

    function onMoveClicked(stationName) {
        dispatch({ type: "MOVE_TO_STATION", stationName});
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