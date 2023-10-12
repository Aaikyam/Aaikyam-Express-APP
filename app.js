const express = require('express');
const app = express();
const hostname = '127.0.0.1'; // Your server ip address
const port = 3000;



app.get('/', (req, res) => {
    // set response content    
        res.send('Welcome to Aaikyam Backend Server');
 

})

app.listen(port, () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
})
