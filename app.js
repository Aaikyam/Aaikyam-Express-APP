const express = require('express');
const app = express();
const hostname = '127.0.0.1'; // Your server ip address
const port = 3000;

const version = '1,000,00';

app.get('/', (req, res) => {
    // set response content    
        res.send(`<html>
                    <body>
                        <h1>Welcome to Aaikyam Backend Server!!!!</h1>
                        </div>
                    </body>
                   </html>`);
 

})

app.listen(port, () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
})
