const {response, Router} = require('express');
const {findAll, findById, savePersonal,findByUserId} = require('./personal.gateway');
const { auth, checkRoles } = require('../../../config/jwt');

const getAll = async(req, res = Response) => {
    try {
        const personals = await findAll();
        res.status(200).json(personals);
    } catch (error) {
        res.status(400).json({error});
    }
}
const getById = async(req, res=Response)=>{
    try {
        const {id} = req.params;
        const personal = await findById(id);
        res.status(200).json(personal);
    } catch (error) {
        res.status(400).json({error});
    }
}

const insert = async(req, res=Response)=>{
    try {
        const {name, birthday, address, status, user} = req.body;
        const personal = await savePersonal({name, birthday, address, status, user});
        res.status(200).json(personal);
    } catch (error) {
        res.status(400).json({error});
    }
}

const getByUserId = async(req, res=Response)=>{
    try {
        const {userId} = req.params;
        const personal = await findByUserId(userId);
        res.status(200).json(personal);
    } catch (error) {
        res.status(400).json({error});
    }
}



const personalRouter = Router();

personalRouter.get('/',[auth, checkRoles(['CAJERO'])],getAll);
personalRouter.get('/:id', getById);
personalRouter.post('/', insert);
personalRouter.get('/findByUserId/:userId', getByUserId);

module.exports = {
    personalRouter
}