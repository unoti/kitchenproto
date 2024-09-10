import Station from "./Station"
import React, { useReducer } from 'react';

const initialState = {
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
        case "MOVE_TO_STATION":
            // Find the person and update their station.
            const updatedPeople = state.people.map(person =>
                person.id === action.personId
                    ? { ...person, station: action.stationName }
                    : person
            );
            // Update stations to be occupied by person.
            const updatedStations = state.stations.map(station => {
                // If moving into a station, mark it as occupied
                if (station.name === action.stationName) {
                    return { ...station, occupiedBy: updatedPeople.find(person => person.id === action.personId)};
                }
                // If leaving a station, mark it as unoccupied.
                if (station.occupiedBy && station.occupiedBy.id === action.personId) {
                    return { ...station, occupiedBy: null};
                }
                return station;
            })
            const newState = { ...state, people: updatedPeople, stations: updatedStations};
            console.log(newState);
            return { ...state, people: updatedPeople, stations: updatedStations};
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
                        occupiedBy={station.occupiedBy}
                        onMoveClicked={() => onMoveClicked(station.name)}
                    />
                ))}
            </div>
        </div>
    </>
}