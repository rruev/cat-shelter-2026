import cats from './cats.js';
import breeds from './breeds.js';
import { findBreedById } from './breedService.js';

export function getAllCats() {
    return cats;
}

export function addCat(catData) {
    const breedName = findBreedById(catData.breedId)?.name || 'Unknown Breed';
    const newCat = {
        id: (cats.length + 1).toString(),
        ...catData,
        breed: breedName
    };
    cats.push(newCat);
    return newCat;
}