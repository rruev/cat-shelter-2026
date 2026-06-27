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

export function findCatById(catId) {
    return cats.find(cat => cat.id === catId);
}

export function editCat(catId, updatedData) {
    const cat = findCatById(catId);
    if (cat) {
        const breedName = findBreedById(updatedData.breedId)?.name || 'Unknown Breed';
        cat.name = updatedData.name;
        cat.breedId = updatedData.breedId;
        cat.breed = breedName;
        cat.description = updatedData.description;
        cat.imageUrl = updatedData.imageUrl;
    }
    return cat;
}

export function deleteCat(catId) {
    const catIndex = cats.findIndex(cat => cat.id === catId);
    if (catIndex !== -1) {
        cats.splice(catIndex, 1);
        return true;
    }
    return false;
}