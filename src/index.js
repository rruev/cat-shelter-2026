import http from 'http';
import fs from 'fs/promises';
import cats from './cats.js';
import { addBreed } from './breedService.js';
import breeds from './breeds.js';
import { addCat, findCatById, editCat } from './catsService.js';

const server = http.createServer(async (req, res) => {
	if (req.method === 'POST' && req.url === '/cats/add-breed') {
		let breed = '';
		req.on('data', chunk => {
			breed += chunk;
		});
		req.on('end', async () => {
			const breedName = new URLSearchParams(breed).get('breed');
			await addBreed(breedName);
		});

		return res.writeHead(302, { 'Location': '/' }).end();
	}

	if (req.method === 'POST' && req.url === '/cats/add-cat') {
		let catData = '';
		req.on('data', chunk => {
			catData += chunk;
		});
		req.on('end', async () => {
			const formData = new URLSearchParams(catData);
			const newCat = {
				name: formData.get('name'),
				breedId: formData.get('breed'),
				description: formData.get('description'),
				imageUrl: formData.get('imageUrl')
			};
			await addCat(newCat);
		});

		return res.writeHead(302, { 'Location': '/' }).end();
	}

	if (req.method === 'POST' && req.url.startsWith('/cats/editCat/')) {
		let catData = '';
		req.on('data', chunk => {
			catData += chunk;
		});
		req.on('end', async () => {
			const catId = req.url.split('/').pop();
			const formData = new URLSearchParams(catData);
			const updatedCat = {
				name: formData.get('name'),
				breedId: formData.get('breed'),
				description: formData.get('description'),
				imageUrl: formData.get('imageUrl')
			};
			await editCat(catId, updatedCat);
		});

		return res.writeHead(302, { 'Location': '/' }).end();
	}
	
	if (req.url === '/styles/site.css') {
		const cssFile = await fs.readFile('./src/styles/site.css', 'utf-8');
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.write(cssFile);
		return res.end();
	}
	
	let htmlContent;
	res.writeHead(200, {'Content-Type': 'text/html'});

	if (req.url === '/') {
		htmlContent = await renderHomePage();
	} else if (req.url === '/cats/add-cat') {
		htmlContent = await renderBreedOptions();
	} else if (req.url === '/cats/add-breed') {
		htmlContent = await fs.readFile('./src/views/addBreed.html', 'utf-8');
	} else if (req.url.startsWith('/cats/editCat/')) {
		const catId = req.url.split('/').pop();
		htmlContent = await renderEditCatPage(catId);
	} else {
		htmlContent = '<h1>404 Not Found</h1>';
	}

	res.write(htmlContent);
	res.end();
});


server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

async function renderHomePage() {
	const htmlContent = await fs.readFile('./src/views/home/index.html', 'utf-8');

	const catTemplate = (cat) => 
		` 		 <li>
                    <img src="${cat.imageUrl}" alt="${cat.name}">
                    <h3>${cat.name}</h3>
                    <p><span>Breed: </span>${cat.breed}</p>
                    <p><span>Description: </span>${cat.description}</p>
                    <ul class="buttons">
                        <li class="btn edit"><a href="/cats/editCat/${cat.id}">Change Info</a></li>
                        <li class="btn delete"><a href="/cats/newHome/${cat.id}">New Home</a></li>
                    </ul>
                </li>`;
	

	const catsContent = `<ul>${cats.map(cat => catTemplate(cat)).join('\n')}</ul>`;
	const result = htmlContent.replace('{{cats}}', catsContent);

	return result;
}

async function renderBreedOptions() {
	const htmlContent = await fs.readFile('./src/views/addCat.html', 'utf-8');

	const breedOptions = replaceBreedOptions();

	const result = htmlContent.replace('{{breedOptions}}', breedOptions);
	return result;
}

async function renderEditCatPage(catId) {
	const htmlContent = await fs.readFile('./src/views/editCat.html', 'utf-8');
	const cat = findCatById(catId);
	const result = htmlContent.replace('{{name}}', cat.name)
		.replace('{{description}}', cat.description)
		.replace('{{imageUrl}}', cat.imageUrl)
		.replace('{{breedOptions}}', replaceBreedOptions(cat.breed));
	return result;
}


function replaceBreedOptions(breedName) {
	const breedOptions = breeds.map(breed => `<option value="${breed.id}"${breed.name === breedName ? 'selected' : ''}>${breed.name}</option>`).join('\n');
	return breedOptions;
}