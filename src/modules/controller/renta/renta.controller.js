const {Response, Router} = require('express');
const {findAll, findAllByUser, save, findById, remove} = require("./renta.gateway");

const getAll = async(req, res = Response) => {
    try {
        const rentas = await findAll();
        res.status(200).json(rentas);
    } catch (error) {
        res.status(400).json({error});
    }
}
const getAllByUser = async(req, res = Response) => {
    try {
        const {id} = req.params;
        const rentas = await findAllByUser(id)
        res.status(200).json(rentas);
    } catch (error) {
        res.status(400).json({error});
    }
}

const getById = async(req, res=Response)=>{
    try {
        const {id} = req.params;
        const renta = await findById(id);
        res.status(200).json(renta);
    } catch (error) {
        res.status(400).json({error});
    }
}

const insert = async(req, res=Response)=>{
    try {
        const {userId, itemId, cajeroId} = req.body;
        const renta = await save({userId, itemId , cajeroId});
        res.status(200).json(renta);
    } catch (error) {
        res.status(400).json({error});
    }
}

 const eliminate = async (req, res = Response) => {
    try {
       const{ id } =req.params;
       const renta = await remove(id);
       res.status(200).json(renta);
    } catch (error) {
       res.status(400).json({ error });
    }
 }
 const rentaRouter = Router();

 rentaRouter.get("/", getAll);
 rentaRouter.get("/:id", getById);
 rentaRouter.get("/user/:id", getAllByUser);
 rentaRouter.post("/", insert);
 rentaRouter.delete("/:id", eliminate);

 module.exports = {
    rentaRouter
 }