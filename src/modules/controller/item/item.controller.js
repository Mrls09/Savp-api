const {response, Router} = require('express');
const {findAll, findById, findAllByStatus, save, update, remove, changeStatus} = require('./item.gateway');

const getAll = async(req, res = Response) => {
    try {
        const items = await findAll();
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}
const getById = async(req, res = Response) => {
    try {
        const {id} = req.params;
        const item = await findById(id);
        res.status(200).json(item);
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}
const getAllByStatus = async(req, res = Response) => {
    try {
        const {status} = req.params;
        const items = await findAllByStatus(status);
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({error});
    }
}
const insert = async(req, res = Response) => {
    try {
        const { estado, descripcion,productoId, plataformaId , status} = req.body;
        const item = await save({descripcion, estado, status, productoId, plataformaId});
        res.status(200).json(item);
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}
const actualize = async(req, res = Response) => {
    try {
        const { descripcion, estado, estatus, productoId, plataformaId } = req.body;
        const {id} = res.params;
        const item = await update({descripcion, estado, estatus, productoId, plataformaId}, id);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({error});
    }
}
const eliminate = async(req, res = Response) => {
    try {
        const {id} = req.params;
        const result = await remove(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error});
    }
}
const statusChange = async(req, res = Response) => {
    try {
        const {id} = req.params;
        const result = await changeStatus(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error});
    }
}

const itemRouter = Router();

itemRouter.get('/', getAll);
itemRouter.get('/:id', getById);
itemRouter.get('/status/:status', getAllByStatus);
itemRouter.post('/', insert);
itemRouter.put('/:id', actualize);
itemRouter.delete('/:id', eliminate);
itemRouter.delete('/status/:id', statusChange);

module.exports = {
    itemRouter
}