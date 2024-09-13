import { availableActions } from "./Kitchen"

const knife = 3;
const half_lime = 7;
const lime = 6;

const withKnife = {
    [knife]: 1,
};

const withLimes = {
    [lime]: 2,
};

function makePerson(inventory) {
    return { id: 1, name: 'Chef', inventory};
}

function makeStation(inventory) {
    const station = {
        name: "CuttingBoard",
        inventory: inventory,
        occupiedBy: null,
        actions: [
            { name: "Cut", consumeId: lime, provideId: half_lime, usingId: knife},
        ]
    }
    return station;
}

test('Should not show action if do not have limes', () => {
    const station = makeStation({}); // No inventory in cutting board.
    const person = makePerson(withKnife);
    const actions = availableActions(station, person);
    expect(actions).toEqual([]); 
});

test('Should be able to cut limes if limes present', () => {
    const station = makeStation(withLimes);
    const person = makePerson(withKnife);
    const actions = availableActions(station, person);
    expect(actions).toEqual([ { name: "Cut", consumeId: lime, provideId: half_lime, usingId: knife } ]); 
});

test('Should not show action if lime present but no knife', () => {
    const station = makeStation(withLimes); // No inventory in cutting board.
    const person = makePerson({}); // No knife
    const actions = availableActions(station, person);
    expect(actions).toEqual([]); 
});