import React, { useReducer } from 'react';

import Chef from "./Chef"
import Station from "./Station"
import { unlimitedQty } from "./constants"


const initialState = {
    items: {
        1: { id: 1, name: 'Sugar', type: 'ingredient', uom: 'volume' },
        2: { id: 2, name: 'Salt', type: 'ingredient', uom: 'volume' },
        3: { id: 3, name: 'Knife', type: 'tool' },
        4: { id: 4, name: 'Bowl', type: 'container' },
        5: { id: 5, name: 'Pot', type: 'container'},
        6: { id: 6, name: 'Lime', type: 'ingredient', uom: 'each'},
        7: { id: 7, name: 'Half Lime', type: 'ingredient', uom: 'each' },
    },

    people: {}, // Key: playerId. We'll seed this with a first player by submitting an action below.
    stations: {
        'Shelf': {
            name: "Shelf",
            inventory: {
                1: unlimitedQty, // Sugar
                2: unlimitedQty, // Salt
            },
            occupiedBy: null,
        },
        'Utensils': {
            name: "Utensils",
            inventory: {
                3: 1, // Knife. This means there is qty 1 knife here.
                4: 1, // Bowl
                5: 1, // Pot
            },
            occupiedBy: null,
        },
        'Fridge': {
            name: "Fridge",
            inventory: {
                6: unlimitedQty, // Lime
            },
            occupiedBy: null,
        },
        'CuttingBoard': {
            name: "CuttingBoard",
            inventory: {},
            occupiedBy: null,
            actions: [
                { name: "Cut", consumeId: 6, provideId: 7, usingId: 3}, // Cut limes into half limes using knife
            ]
        },
        'Juicer': {
            name: "Juicer",
            inventory: {},
            occupiedBy: null,
        },
        'Stove': {
            name: "Stove",
            inventory: {},
            occupiedBy: null,
        }
    }
}

// function updateInventory(people, personId, item, deltaQty) {
//     // Return a new people array with the given inventory increased (deltaQty>0) or decreased (deltaQty<0).
// }

function deleteKey(o, key) {
    // Copy object o with key removed.
    const { [key]: _removed, ...updatedItem } = o; // Destructring assignment which removes the key.
    return updatedItem;
}

function updateInventory(existingInventory, item, deltaQty) {
    console.log(`updateInventory deltaQty=${deltaQty} follows: existingInventory, item`);
    console.log(existingInventory);
    console.log(item);
    // Update an inventory and return the updated inventory. deltaQty negative to reduce, positive to increase.
    const existingQty = existingInventory[item.id] ?? 0;
    const newQty = existingQty + deltaQty;
    if (newQty) {
        return { ...existingInventory, [item.id]: existingQty + deltaQty };
    } else {
        return deleteKey(existingInventory, item.id);
    }
}

/** Immutably pulls inventory from fromInventory and puts it into toInventory.
 *  returns [fromInventory, toInventory].
 */ 
function transactInventory(item, deltaQty, fromInventory, toInventory) {
    const updatedFromInventory = updateInventory(fromInventory, item, -deltaQty);
    const updatedToInventory = updateInventory(toInventory, item, deltaQty);
    console.log('transact');
    console.log(updatedFromInventory);
    console.log(updatedToInventory);
    return [updatedFromInventory, updatedToInventory];
}

function getPerson(state, personId) {
    const person = state.people[personId];
    if (!person) {
        console.log(`Person ${personId} not found`);
        return state;
    }
    return person;
}
    
function kitchenReducer(state, action) {
    console.log(`reduce`);
    console.log(action);
    switch (action.type) {
        case "PLAYER_JOINED": {
            // If player is already there then ignore. Happens in dev mode with events firing twice.
            if (action.player.id in state.people) {
                return state;
            }
            const firstEmptyStation = Object.values(state.stations).find(station => !station.occupiedBy);
            if (!firstEmptyStation) {
                console.log('No empty stations available for new player');
            }

            // Add new player to people object with the station name.
            const updatedPeople = {
                ...state.people,
                [action.player.id]: {...action.player, station: firstEmptyStation.name }
            };

            // Mark the station as occupied by the player.
            const updatedStations = {
                ...state.stations,
                [firstEmptyStation.name]: { ...firstEmptyStation, occupiedBy: action.player}
            };

            const newState = {
                ...state,
                people: updatedPeople,
                stations: updatedStations,
            };
            console.log(newState);
            return newState;
        }
            
        case "MOVE_TO_STATION": {
            const person = getPerson(state, action.personId);
            const newPerson = { ...person, station: action.stationName};
            const oldStation = state.stations[person.station];
            const newStation = state.stations[action.stationName];

            // Move the person to the new station.
            const updatedPeople = {
                ...state.people,
                [action.personId]: newPerson,
            };
            // Remove the person from the old station and add them to the new station.
            let updatedStations = {
                ...state.stations,
                [newStation.name]: { ...newStation, occupiedBy: newPerson },
            };
            if (oldStation) {
                updatedStations = {
                    ...updatedStations,
                    [oldStation.name]: { ...oldStation, occupiedBy: null },
                }
            }
            const newState = { ...state, people: updatedPeople, stations: updatedStations };
            console.log(newState);
            return newState;
        }

        case "GET_ITEM": {
            const person = getPerson(state, action.personId);
            // change this to use transact
            const newPersonInventory = updateInventory(person.inventory, action.item, action.qty);
            const newPerson = { ...person, inventory: newPersonInventory };
            const newState = {
                ...state,
                people: { ...state.people, [newPerson.id]: newPerson },
            };

            console.log(newState);
            return newState;
        }

        case "PUT_ITEM": {
            const person = getPerson(state, action.fromPersonId);
            const item = state.items[action.itemId];
            const stationName = person.station;
            const station = state.stations[stationName];
            const qty = 1;
            console.log('before put item: personInv, stationInv:');
            console.log(person.inventory);
            console.log(station.inventory);
            const [newPersonInventory, newStationInventory] = transactInventory(
                item, qty, person.inventory, station.inventory);
            console.log('put item: newPersonInv, newStationInv:');
            console.log(newPersonInventory);
            console.log(newStationInventory);
            const newPerson = { ...person, inventory: newPersonInventory };
            const newStation = { ...station, inventory: newStationInventory };
            const newState = {
                ...state,
                people: { ...state.people, [newPerson.id]: newPerson },
                stations: { ...state.stations, [stationName]: newStation },
            };
            console.log(newState);
            return newState;
        }

        default:
            return state;
    }
}

export default function Kitchen({playerId}) {
    const [state, dispatch] = useReducer(kitchenReducer, initialState);

    // On startup, load the first player.
    React.useEffect(() => {
        dispatch({ type: "PLAYER_JOINED", player: { id: 1, name: 'Chef 1', station: null, inventory: {} }});
        //dispatch({ type: "PLAYER_JOINED", player: { id: 2, name: 'Kanara', station: null, inventory: {} }});
    }, [playerId]);

    function onMoveClicked(stationName) {
        dispatch({ type: "MOVE_TO_STATION", personId: playerId, stationName}, [playerId]);
    }

    // Find the attached player by their playerId.
    const player = state.people[playerId];

    return <>
        <div className="kitchen">
            <h3>Kitchen</h3>
            <div className="stations-container">
                {Object.values(state.stations).map((station) => (
                    <div key={station.name} className="station-area">
                        <Station 
                            name={station.name}
                            items={state.items}
                            inventory={station.inventory}
                            canGet={station.occupiedBy && station.occupiedBy.id === playerId}
                            occupiedBy={station.occupiedBy}
                            onMoveClicked={() => onMoveClicked(station.name)}
                            dispatch={dispatch}
                        />
                        {station.occupiedBy && station.occupiedBy.id === playerId &&
                            <Chef player={player} items={state.items} dispatch={dispatch} />}
                    </div>
                ))}
            </div>
        </div>
    </>
}