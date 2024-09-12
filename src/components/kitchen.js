import React, { useReducer } from 'react';

import Chef from "./Chef"
import Station from "./Station"


const unlimitedQty = 9999;

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
            items: {
                1: unlimitedQty, // Sugar
                2: unlimitedQty, // Salt
            },
            occupiedBy: null,
        },
        'Utensils': {
            name: "Utensils",
            items: {
                3: 1, // Knife. This means there is qty 1 knife here.
                4: 1, // Bowl
                5: 1, // Pot
            },
            occupiedBy: null,
        },
        'Fridge': {
            name: "Fridge",
            items: {
                6: unlimitedQty, // Lime
            },
            occupiedBy: null,
        },
        'CuttingBoard': {
            name: "CuttingBoard",
            items: {},
            occupiedBy: null,
            actions: [
                { name: "Cut", consumeId: 6, provideId: 7, usingId: 3}, // Cut limes into half limes using knife
            ]
        },
        'Juicer': {
            name: "Juicer",
            items: {},
            occupiedBy: null,
        },
        'Stove': {
            name: "Stove",
            items: {},
            occupiedBy: null,
        }
    }
}

// function updateInventory(people, personId, item, deltaQty) {
//     // Return a new people array with the given inventory increased (deltaQty>0) or decreased (deltaQty<0).
// }

function kitchenReducer(state, action) {
    console.log(`reduce`);
    console.log(action);
    switch (action.type) {
        case "PLAYER_JOINED": {

            // If player is already there then ignore. Happens in dev mode with events firing twice.
            if (action.player.id in state.people) {
                return state;
            }
            const firstEmptyStation = Object.values(state.stations).find(station => station.occupiedBy);
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
                [firstEmptyStation.name]: { ...firstEmptyStation, occupiedBy: action.player.id}
            };

            return {
                ...state,
                people: updatedPeople,
                stations: updatedStations,
            }
        }
            
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