const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

let allTools = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ message: "Welcome to Dev Tools!" }));

fillTools();

//POST
app.post('/tools', (req, res) => {
    const tool = {};
    tool.id = parseInt(req.body.id);
    tool.name = req.body.name;
    allTools.push(tool);
    res.status(200).json({ message: `Tool ${tool.name} was succesfully added to the app` });
});

//GET
app.get('/tools', (req, res) => {
    //if (allTools.length < 1)
    // fillTools();
    res.status(200).send(allTools);
});

//GET/id
app.get('/tools/:id', (req, res) => {
    // Reading id from the URL
    const id = parseInt(req.params.id);

    for (let tool of allTools) {
        if (tool.id === id) {
            res.status(200).send(tool);
            return;
        }
    }

    // Sending 404 when not found something is a good practice
    res.status(404).json({ message: `Tool with id ${id} not found` });
});

//DELETE/id
app.delete('/tools/:id', (req, res) => {
    // Reading id from the URL
    const id = parseInt(req.params.id);
    let desc;

    // Remove item from the tools array
    allTools = allTools.filter(i => {
        if (i.id !== id) {
            return true;
        }
        desc = i.name;
        return false;
    });
    if (desc == null)
        res.status(404).json({ message: `Tool with id ${id} not found` });
    else
        res.status(200).json({ message: `Tool ${desc} was deleted` });
});

//PUT/id
app.put('/tools/:id', (req, res) => {
    // Reading id from the URL
    const id = parseInt(req.params.id);
    const newTool = {};
    newTool.id = parseInt(req.body.id);
    newTool.name = req.body.name;
    let found = false;

    for (let i = 0; i < allTools.length; i++) {
        let tool = allTools[i]
        if (tool.id === id) {
            allTools[i] = newTool;
            found = true;
            break;
        }
    }
    if (found)
        res.status(200).json({ message: `Tool ${newTool.name} was successfully edited` });
    else
        res.status(404).json({ message: `Tool with an id value of ${newTool.id} not found` })
});

function fillTools() {
    let tool = {};
    tool.id = 1;
    tool.name = 'Jenkins';
    allTools.push({ ...tool });
    tool.id = 2;
    tool.name = 'Docker';
    allTools.push({ ...tool });
    tool.id = 3;
    tool.name = 'SonarQube';
    allTools.push({ ...tool });
    tool.id = 4;
    tool.name = 'Git';
    allTools.push({ ...tool });
    tool.id = 5;
    tool.name = 'Kubernetes';
    allTools.push({ ...tool });
}
app.listen(port, () => console.log(`DevOps tools app listening on port ${port}!`))