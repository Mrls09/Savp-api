const { query } = require("../../../utils/mysql");

const findAll = async() => {
    const sql = `SELECT * FROM Renta`;
    return await query(sql,[]);
}
const findAllByUser = async(idUser) => {
    if(Number.isNaN(idUser)) throw Error("Wrong type");
    if(!idUser) throw Error("Missing Fields");
    const sql = `
    SELECT R.*, I.*, P.titulo AS producto_titulo, P.imagen AS producto_imagen
    FROM Renta R
    JOIN Item I ON R.item_fk = I.id
    JOIN Producto P ON I.producto_fk = P.id
    WHERE R.user_fk = ?
`;
    return await query(sql, [idUser]);
}
const findById = async(id) => {
    if(Number.isNaN(id)) throw Error("Wrong type");
    if(!id) throw Error("Missing Fields");
    const sql = `SELECT * FROM Renta WHERE id = ? `;
    return await query(sql, [id]);
}
const save = async(renta) => {
    if(!renta.userId || !renta.itemId || !renta.cajeroId) throw Error("Missing fields");
    const sql = `INSERT INTO Renta (user_fk, item_fk,fecha, cajero_id) VALUES(?,?,?,?)`;
    let fecha = new Date();
    const {insertedId} = await query(sql, [
        renta.userId,
        renta.itemId,
        fecha,
        renta.cajeroId
    ]);
    return {...renta, id: insertedId};
}
const remove = async(id) => {
    if(Number.isNaN(id)) throw Error("Wrong TYpe");
    if(!id) throw Error("Missing fields");
    const sql = `DELETE FROM Renta WHERE id=?`;
    await query(sql, []);
    return {idDeleted: id};
}
module.exports = {
    findAll,
    findAllByUser,
    findById,
    save,
    remove
};