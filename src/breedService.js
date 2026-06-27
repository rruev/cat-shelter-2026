import breeds from './breeds.js';

export function getAllBreeds() {
    return breeds;
}

export function addBreed(breedName) {
    const newBreed = {
        id: (breeds.length + 1).toString(),
        name: breedName
    };
    breeds.push(newBreed);
    return newBreed;
}

export function findBreedById(breedId) {
    return breeds.find(breed => breed.id === breedId);
}