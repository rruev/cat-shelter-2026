import http from 'http';
import fs from 'fs/promises';

const server = http.createServer(async (req, res) => {
	
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
			htmlContent = await fs.readFile('./src/views/home/index.html', 'utf-8');
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