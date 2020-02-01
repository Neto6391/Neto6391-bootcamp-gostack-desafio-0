const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let url_visits = {
	GET: [],
	POST: [],
	PUT: [],
	DELETE: []
};

server.use((req, res, next) => {
	let exists = [];
	if (url_visits[req.method].length === 0) {
		url_visits[req.method].push({ url: req.url, counter: 0 });
	} else {
		exists = url_visits[req.method].filter(item => item.url === req.url);
		if (exists.length === 1) {
			url_visits[req.method].forEach(item =>
				item.url === req.url
					? (item.counter = item.counter + 1)
					: (item.counter = item.counter)
			);
		} else {
			url_visits[req.method].push({ url: req.url, counter: 0 });
		}
	}

	Object.keys(url_visits).map(verb => {
		url_visits[verb].map(item => {
			console.log(`Método: ${verb} URL: ${item.url} Contador: ${item.counter}`);
		});
	});

	next();
});

function checkProjectInArray(req, res, next) {
	const project = projects[req.params.id];
	if (!project) {
		return res.status(400).json({ error: "Project does not Exists" });
	}
	req.projects = project;
	return next();
}

server.post("/projects", (req, res) => {
	const { id, title } = req.body;
	const task = [];

	projects.push({ id, title, task });
	return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	projects[id].task.push(title);
	return res.json(projects[id]);
});

server.get("/projects", (req, res) => {
	return res.json(projects);
});

server.get("/projects/:id", checkProjectInArray, (req, res) => {
	return res.json(req.projects);
});

server.put("/projects/:id", (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	projects[id].title = title;
	return res.json(projects[id]);
});

server.delete("/projects/:id", (req, res) => {
	const { id } = req.params;
	projects.splice(id, 1);
	return res.send();
});

server.listen(3000);
