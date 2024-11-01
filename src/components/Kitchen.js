import React, { useReducer } from 'react';

import Chef from "./Chef"
import Station from "./Station"
import { unlimitedQty, ItemTypes } from "./constants"

const initialState = {
    items: {
        1: { id: 1, name: 'Sugar', type: ItemTypes.ingredient, uom: 'volume' },
        2: { id: 2, name: 'Salt', type: ItemTypes.ingredient, uom: 'volume' },
        3: { id: 3, name: 'Knife', type: ItemTypes.tool },
        4: { id: 4, name: 'Bowl', type: ItemTypes.container },
        5: { id: 5, name: 'Pot', type: ItemTypes.container },
        6: { id: 6, name: 'Lime', type: ItemTypes.ingredient, uom: 'each'},
        7: { id: 7, name: 'Half Lime', type: ItemTypes.ingredient, uom: 'each' },
        8: { id: 8, name: 'Lime Juice', type: ItemTypes.ingredient, uom: 'ml' },
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
            holdTypes: [ItemTypes.ingredient],
        },
        'Utensils': {
            name: "Utensils",
            inventory: {
                3: 1, // Knife. This means there is qty 1 knife here.
                4: 1, // Bowl
                5: 1, // Pot
            },
            occupiedBy: null,
            holdTypes: [ItemTypes.container, ItemTypes.tool],
        },
        'Fridge': {
            name: "Fridge",
            inventory: {
                6: unlimitedQty, // Lime
            },
            occupiedBy: null,
            holdTypes: [ItemTypes.ingredient],
        },
        'CuttingBoard': {
            name: "CuttingBoard",
            inventory: {},
            occupiedBy: null,
            holdTypes: [ItemTypes.ingredient],
            operations: [
                { name: "Cut Lime", consumeId: 6, provideId: 7, provideQty: 2, usingId: 3}, // Cut limes into half limes using knife
            ],
        },
        'Juicer': {
            name: "Juicer",
            inventory: {},
            occupiedBy: null,
            holdTypes: [ItemTypes.ingredient],
            operations: [
                { name: "Juice", consumeId: 7, provideId: 8, },
            ],
        },
        'Stove': {
            name: "Stove",
            inventory: {},
            occupiedBy: null,
            holdTypes: [ItemTypes.container],
        }
    }
}

// Returns a list of action names that the given person can currently perform at the station.
export function availableOperations(station, person) {
    if (!station.operations) {
        return [];
    }
    const operations = station.operations.filter((action) => {
        const hasTool = action.usingId ? person.inventory[action.usingId] : true;
        const hasItem = station.inventory[action.consumeId] > 0;
        return hasTool && hasItem;
    });
    return operations;
}

function deleteKey(o, key) {
    // Copy object o with key removed.
    const { [key]: _removed, ...updatedItem } = o; // Destructring assignment which removes the key.
    return updatedItem;
}

function updateInventory(existingInventory, item, deltaQty) {
    // Update an inventory and return the updated inventory. deltaQty negative to reduce, positive to increase.
    const existingQty = existingInventory[item.id] ?? 0;
    const newQty = existingQty === unlimitedQty ? unlimitedQty : existingQty + deltaQty;
    if (newQty) {
        return { ...existingInventory, [item.id]: newQty };
    } else {
        return deleteKey(existingInventory, item.id);
    }
}

/** Immutably pulls inventory from fromInventory and puts it into toInventory.
 *  returns [fromInventory, toInventory].
 */ 
function transactInventory(item, deltaQty, fromInventory, toInventory) {
    const updatedFromInventory = updateInventory(fromInventory, item, deltaQty);
    const updatedToInventory = updateInventory(toInventory, item, -deltaQty);
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

function updateStationInventory(state, station, newInventory) {
    const newStation = { ...station, inventory: newInventory };
    const newStations = { ...state.stations, [station.name]: newStation };
    const newState = { ...state, stations: newStations };
    return newState;
}

// Perform an inventory transaction between a person and their station, returning the new state.
// qty: positive means take from station to player. Negative means take from player and add to station.
function transactState(state, itemId, qty, personId) {
    const person = getPerson(state, personId);
    const item = state.items[itemId];
    const stationName = person.station;
    const station = state.stations[stationName];
    const [newPersonInventory, newStationInventory] = transactInventory(
        item, qty, person.inventory, station.inventory);
    const newPerson = { ...person, inventory: newPersonInventory };
    const newStation = { ...station, inventory: newStationInventory };
    const newState = {
        ...state,
        people: { ...state.people, [newPerson.id]: newPerson },
        stations: { ...state.stations, [stationName]: newStation },
    };
    return newState;
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
            const newState = transactState(state, action.item.id, action.qty, action.personId);
            console.log(newState);
            return newState;
        }

        case "PUT_ITEM": {
            const qty = -1;
            const newState = transactState(state, action.itemId, qty, action.fromPersonId);
            console.log(newState);
            return newState;
        }

        case "STATION_OP": {
            const station = state.stations[action.stationName];
            const consumeItem = state.items[action.operation.consumeId];
            const provideItem = state.items[action.operation.provideId];
            const afterConsumeInv = updateInventory(station.inventory, consumeItem, -1);
            const provideQty = action.operation.provideQty ?? 1;
            const afterProvideInv = updateInventory(afterConsumeInv, provideItem, provideQty);
            const newState = updateStationInventory(state, station, afterProvideInv);
            return newState;
        }

        default:
            return state;
    }
}

function canPutItem(items, itemId, station) {
    const item = items[itemId];
    return station.holdTypes.includes(item.type);
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
                            <Chef player={player}
                                items={state.items}
                                station={station}
                                availableOperations={availableOperations(station, player)}
                                canPut={canPutItem}
                                dispatch={dispatch} />}
                    </div>
                ))}
            </div>
        </div>
    </>
}