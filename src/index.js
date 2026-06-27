import http from 'http';
import fs from 'fs/promises';
import cats from './cats.js';
import { addBreed } from './breedService.js';
import breeds from './breeds.js';

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
	
	if (req.url === '/styles/site.css') {
		const cssFile = await fs.readFile('./src/styles/site.css', 'utf-8');
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.write(cssFile);
		return res.end();
	}
	
	let htmlContent;
	res.writeHead(200, {'Content-Type': 'text/html'});

	switch (req.url) {
		case '/':
			htmlContent = await renderHomePage();
			break;
		case '/cats/add-cat':
			htmlContent = await fs.readFile('./src/views/addCat.html', 'utf-8');
			break;
		case '/cats/add-breed':
			htmlContent = await fs.readFile('./src/views/addBreed.html', 'utf-8');
			break;	
		default:
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
                        <li class="btn edit"><a href="">Change Info</a></li>
                        <li class="btn delete"><a href="">New Home</a></li>
                    </ul>
                </li>`;
	

	const catsContent = `<ul>${cats.map(cat => catTemplate(cat)).join('\n')}</ul>`;
	const result = htmlContent.replace('{{cats}}', catsContent);

	return result;
}