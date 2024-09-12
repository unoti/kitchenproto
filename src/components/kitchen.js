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
                { id: 6, name: "Lime" },
            ],
            occupiedBy: null,
        },{
            name: "CuttingBoard",
            items: [],
            occupiedBy: null,
            actions: [
                { name: "Cut", consumeId: 6, provide: { id: 7, name: "Half Lime" }, usingId: 3}
            ]
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

// function updateInventory(people, personId, item, deltaQty) {
//     // Return a new people array with the given inventory increased (deltaQty>0) or decreased (deltaQty<0).
// }

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

        case "GET_ITEM": {
            const updatedPeople = state.people.map(person => {
                if (person.id === action.personId) {
                    const foundItemIndex = person.inventory.findIndex(item => item.id === action.item.id);

                    // If item exists in inventory, update its qty.
                    if (foundItemIndex !== -1) {
                        const updatedInventory = person.inventory.map((invItem, index) =>
                            index === foundItemIndex
                                ? { ...invItem, qty: invItem.qty + action.qty }
                                : invItem
                        );
                        return { ...person, inventory: updatedInventory };
                    }
                    // Item was not already in inventory, so add it.
                    return { ...person, inventory: [...person.inventory, { ...action.item, qty: action.qty}]};
                }
                return person;
            });
            return { ...state, people: updatedPeople };
        }

        // case "PUT_ITEM": {
        //     const updatedPeople = state.people.map(person => {
        //         if (person.id === action.fromPersonId) {
        //             const foundItemIndex = person.inventory.findIndex(item => item.id === action.item.id);
        //         }
        //         return person;
        //     });
        //     return state;
        // }

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
                    <div key={station.name} className="station-area">
                        <Station 
                            name={station.name}
                            items={station.items}
                            canGet={station.occupiedBy && station.occupiedBy.id === playerId}
                            occupiedBy={station.occupiedBy}
                            onMoveClicked={() => onMoveClicked(station.name)}
                            dispatch={dispatch}
                        />
                        {station.occupiedBy && station.occupiedBy.id === playerId &&
                            <Chef player={player} dispatch={dispatch} />}
                    </div>
                ))}
            </div>
        </div>
    </>
}