import React, { useReducer } from 'react';

import Chef from "./Chef"
import Station from "./Station"


const initialState = {
    people: [], // We'll seed this with a first player by submitting an action below.
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
        case "PLAYER_JOINED":
            // If player is already there then ignore. Happens in dev mode with events firing twice.
            if (state.people.find(person => person.id === action.player.id)) {
                return state;
            }
            // Find the first unoccupied station.
            const firstEmptyStation = state.stations.find(station => !station.occupiedBy);
            if (firstEmptyStation) {
                const updatedPeople = [...state.people, {...action.player, station: firstEmptyStation.name}];
                const updatedStations = state.stations.map(station =>
                    station.name === firstEmptyStation.name
                    ? { ...station, occupiedBy: action.player}
                    : station
                );
                return {...state, people: updatedPeople, stations: updatedStations};
            }
            console.log('No empty stations available for new player')
            return state;
            
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

export default function Kitchen({playerId}) {
    const [state, dispatch] = useReducer(kitchenReducer, initialState);

    // On startup, load the first player.
    React.useEffect(() => {
        dispatch({ type: "PLAYER_JOINED", player: { id: 1, name: 'Chef 1', station: null, inventory: [] }});
        //dispatch({ type: "PLAYER_JOINED", player: { id: 2, name: 'Kanara', station: null, inventory: [] }});
    }, [playerId]);

    function onMoveClicked(stationName) {
        dispatch({ type: "MOVE_TO_STATION", personId: playerId, stationName}, [playerId]);
    }

    // Find the attached player by their playerId.
    const player = state.people.find(person => person.id === playerId);

    return <>
        <div className="kitchen">
            <h3>Kitchen</h3>
            <div className="stations-container">
                {state.stations.map((station) => (
                    <Station key={station.name}
                        name={station.name}
                        items={station.items}
                        canGet={station.occupiedBy && station.occupiedBy.id === playerId}
                        occupiedBy={station.occupiedBy}
                        onMoveClicked={() => onMoveClicked(station.name)}
                    />
                ))}
            </div>

            {player && <Chef player={player} />}
        </div>
    </>
}