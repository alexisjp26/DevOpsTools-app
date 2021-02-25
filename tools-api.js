const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

let allTools = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//POST
app.post('/tools', (req, res) => {
    const tool = req.body;
    const desc = tool.name;
    allTools.push(tool);
    res.send(`Tool ${desc} was added to the app`);
});

//GET
app.get('/tools', (req, res) => {
    res.json(allTools);
});

//GET/id
app.get('/tools/:id', (req, res) => {
    // Reading id from the URL
    const id = req.params.id;

    for (let tool of allTools) {
        if (tool.id === id) {
            res.json(tool);
            return;
        }
    }

    // Sending 404 when not found something is a good practice
    res.status(404).send(`Tool with id ${id} not found`);
});

//DELETE/id
app.delete('/tools/:id', (req, res) => {
    // Reading id from the URL
    const id = req.params.id;
    var desc;

    // Remove item from the tools array
    allTools = allTools.filter(i => {
        if (i.id !== id) {
            return true;
        }
        desc = i.name;
        return false;
    });
    if (desc == null)
        res.status(404).send(`Tool with id ${id} not found`);
    else
        res.send(`Tool ${desc} was deleted`);
});

//PUT/id
app.put('/tools/:id', (req, res) => {
    // Reading id from the URL
    const id = req.params.id;
    const newTool = req.body;

    // Remove item from the tools array
    for (let i = 0; i < allTools.length; i++) {
        let tool = allTools[i]
        if (tool.id === id) {
            allTools[i] = newTool;
        }
    }

    res.send('Tool is edited');
});


app.listen(port, () => console.log(`DevOps tools app listening on port ${port}!`))