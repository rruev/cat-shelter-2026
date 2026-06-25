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

	if (req.url === '/') {
		htmlContent = await fs.readFile('./src/views/home/index.html', 'utf-8');
		res.write(htmlContent);
		return res.end();
	}

	if (req.url === '/cats/add-breed') {
		htmlContent = await fs.readFile('./src/views/addBreed.html', 'utf-8');
		res.write(htmlContent);
		return res.end();
	}


});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});