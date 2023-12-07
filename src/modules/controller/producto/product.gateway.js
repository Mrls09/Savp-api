const { query } = require('../../../utils/mysql');

const findAll = async() => {
    const sql = "SELECT * FROM Producto";
    return await query(sql, []);
}

const findById = async(id) => {
    const sql = `SELECT * FROM Producto WHERE id = ?`
    return await query(sql, [id])
};

const save = async(producto) => {
    if(!producto.titulo || !producto.descripcion) throw Error("Missing Fileds");

    const sql = `INSERT INTO Producto (titulo,descripcion) VALUES(?,?)`;
    const { insertedId } = await query(sql, [
        producto.titulo,
        producto.descripcion
    ]);
    return {...producto, id: insertedId}
};

const update = async(producto, id) => {
    if(Number.isNaN(id)) throw Error("Wrong Type");
    if(!id) throw Error("Missing Fields -> id");
    if(!producto.titulo || !producto.descripcion) throw Error("Missing Fileds");

    const sql = `UPDATE Producto SET titulo = ? , descripcion=? WHERE id=?`;
    await query(sql, [
        producto.titulo,
        producto.descripcion,
        id
    ]);
    return {...producto, id: id}
};

const remove = async(id) => {
    if(Number.isNaN(id)) throw Error("Missing Fields");
    if(!id) throw Error("Missing Filds");
    const sql = `DELETE FROM Producto WHERE id=?`;
    await query(sql, [id]);
    return {idDeleted: id};
};


module.exports = {
    findAll,
    findById,
    save,
    update,
    remove
}