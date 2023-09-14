// HTTP Methods
const http = require("http");
const url = require('node:url');
const { createLogger, transports, format} = require('winston');
const PORT = 3000;

const groceryList = [];

// create the logger
const logger = createLogger({
    level: 'info', // this will log only messages with the level 'info' and above
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
        new transports.File({ filename: 'grocery-list.log'}), // log to a file
    ]
})

const server = http.createServer((req, res) => {

    // GET
    if (req.method === 'GET' && req.url === '/grocery-list'){
        res.writeHead(200, { 'Content-Type': 'application/json'});
        //const data = {message: 'This is GET data'};
        res.end(JSON.stringify(groceryList));
        logger.info(`Read grocery list: ${JSON.stringify(data)}`)
    //POST
    }else if(req.method === 'POST' && req.url === '/grocery-list/add'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            // you are meant to store this data somewhere
            // maybe a database??
            groceryList.push(data);
            //console.log(data);
            //console.log(groceryList);

            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Added item to grocery list!'}));
            logger.info(`Added item to grocery list: ${JSON.stringify(data)}`)
        });

    }else if(req.method === "PUT" && req.url.startsWith('/grocery-list/edit/')){
        const id = parseInt(req.url.substring('/grocery-list/edit/'.length));
        if(!groceryList[id]) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify('Item not found'));
            logger.warn(`Grocery item not found for edit (ID ${id})`);
        } else {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                const data = JSON.parse(body);
                // you are meant to store this data somewhere
                // maybe a database??
                groceryList[id] = data; //replace with updated info
                //console.log(data);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Edited grocery item!'}));
                logger.info(`Edited item (ID: ${id}) with ${JSON.stringify(data)}`);
            });
    }
    }else if(req.method === "DELETE" && req.url.startsWith('/grocery-list/delete/')){
        const id = parseInt(req.url.substring('/grocery-list/delete/'.length));
        if(!groceryList[id]) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify('Item not found'));
            logger.warn(`Item not found for delete (ID ${id})`);
        } else {
            const toDelete = groceryList.splice(id,1);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Deleted'}));
            logger.info(`Deleted item (ID: ${id}) ${JSON.stringify(toDelete[0])}`);
        }
        // delete item
        //console.log(requestUrl);
        //res.writeHead(201, {'Content-Type': 'application/json'});
        //res.end(JSON.stringify({message: 'Resource Deleted Successfully!'}));
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify('Unsupported request'));
        logger.warn(`Got an unsupported request ${req.method} ${req.url}`);

    }

})

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})