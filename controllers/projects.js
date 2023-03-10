const utilities = require('../utilities/utilities')
const project = require("../models/projects");
const worker = require("../models/workers");
const bcrypt = require('bcrypt');

const getAllProjects = (req, res) => {
    project.find().then((result) => {
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(404).send('not found')
        }
    }).catch((err) => {
        res.status(400).send('error')
    })
}

const getOneProject = (req, res) => {
    project.findByIdAndDelete(req.params.id).then((result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).send('not found')
        }
    }).catch((err) => {
        res.status(400).send('error')
    })
}

const createProject = (req, res) => {    
    const projectToCreate = new project ({
        client_id: req.body.client_id,
        name: req.body.name,
        manager_id: req.body.manager_id,
        desc: req.body.desc,
    })

    project.find({name: req.body.name}, function (err, project) {
        if (err) {
            res.status(400).send(err); 
        }

        if( project.length > 0 ) {
            res.status(406).send("Duplicated project"); 
        } else {
            projectToCreate.save(function (err, newProject) {
                if (err) {
                    res.status(400).send(err); 
                }
                res.status(200).json("Registered Team"); 
            })
        }
    })
} 

const updateProject = (req, res) => {
    project.findByIdAndUpdate(req.params.id, req.body).then((result) => {
        if (result) {
            res.status(200).send(`team id:${req.params.id}: change made successfully`);
        }
        else {
            res.status(404).send('not found')
        }
    }).catch((error) => {
        res.status(400).send(error);
    })
}

const deleteProject = (req, res) => {
    project.findByIdAndDelete(req.params.id).then((result) => {
        if (result) {
            res.status(200).send(`team title:${req.params.id} successfully deleted`)
        } else {
            res.status(404).send('user not found');
        }
    }).catch((error) => {
        res.status(400).send(error);
    })
}

const addWorker = (req, res) => {
    project.findByIdAndUpdate(req.params.id, {$addToSet: { workers: req.body.worker_id}},{new: true}).then((result) => {
        if (result) {
            worker.findByIdAndUpdate(
                req.body.worker_id, 
                { $inc: { 
                    projectsInvolved: 1
                } }).then((result) => {
                if (result) {
                    res.status(200).send(`Worker added successfuly`);
                }
                else {
                    res.status(404).send('worker not found')
                }
            }).catch((error) => {
                res.status(400).send(error);
            })
        }
        else {
            res.status(404).send('Project not found')
        }
    }).catch((error) => {
        res.status(400).send(error);
    })
}

const removeWorker = (req, res) => {
    project.findByIdAndUpdate(req.params.id, {$pull: { workers : req.body.worker_id}}).then((result) => {
        if (result) {
            res.status(200).send(`project id:${req.params.id}: change made successfully`);
        }
        else {
            res.status(404).send('Project not found')
        }
    }).catch((error) => {
        res.status(400).send(error);
    })
}

const getSomeWorkers = (req, res) => {
    project.findById(req.params.id).select('workers')
    .then((result) => {
        if (result) {
            worker.find({
                _id: {
                    $in: result.workers
                }}).then((workers) => {
                if(workers) {
                    res.status(200).json(workers);
                } else {
                    res.status(404).send('not found')
                }
            }).catch((err) => {
                res.status(400).send('error')
            })
        } else {
            res.status(404).send('not found')
        }
    }).catch((err) => {
        res.status(400).send('error')
    })
}

exports.getAllProjects = getAllProjects;
exports.getSomeWorkers = getSomeWorkers; 
exports.addWorker = addWorker;
exports.removeWorker = removeWorker;
exports.getOneProject = getOneProject; 
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;