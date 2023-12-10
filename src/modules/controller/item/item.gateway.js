const { query } = require("../../../utils/mysql")

const findAll = async () => {
    const sql = `
        SELECT Item.id, Item.status, Item.estado, Producto.titulo, Producto.descripcion , Plataforma.plataforma
        FROM Item
        JOIN Producto ON Item.producto_fk = Producto.id
        JOIN Plataforma ON Item.plataforma_fk = Plataforma.id
    `;
    return await query(sql, []);
}


const findById = async(id) => {
    const sql = `SELECT * FROM Item WHERE id = ?`
    return await query(sql, [id])
};

const findAllByStatus = async (status) => {
    const sql = `SELECT * FROM Items WHERE status = ?`;
    return await query(sql, [status]);
}
const save = async (item) => {
    if (!item.estado ||
        !item.descripcion ||
        !item.productoId ||
        !item.plataformaId ||
        !item.status)
        throw Error("Missing Fields");

    const sql = `INSERT INTO Item (estado, producto_fk, descripcion, plataforma_fk, status) VALUES(?,?,?,?,?)`;
    const { insertedId } = await query(sql, [
        item.estado,
        item.productoId,
        item.descripcion,
        item.plataformaId,
        item.status
    ]);
    return { ...item, id: insertedId };
}
const update = async (item, id) => {
    if (Number.isNaN(id)) throw Error("Wrong Type");
    if (!id) throw Error("Missing Fields");
    if (!item.estado ||
        !item.descripcion ||
        !item.productoId ||
        !item.plataformaId ||
        !item.status)
        throw Error("Missing Fields");

    const sql = `UPDATE Item SET estado=?, descripcion=?, producto_fk=?, plataforma_fk=?, status=? WHERE id=?`;
    await query(sql, [
        item.estado,
        item.descripcion,
        item.productoId,
        item.plataformaId,
        item.status,
        id
    ]);
    return {...item, id: id};
}

const remove = async (id) => {
    if (Number.isNaN(id)) throw Error("Missing Fields");
    if (!id) throw Error("Missing Fields");
    const sql = `DELETE FROM Item WHERE id=?`;
    await query(sql, [id]);
    return { isDelete: id };
}

const changeStatus = async (id) => {
    if (Number.isNaN(id)) throw Error("Missing Fields");
    if (!id) throw Error("Missing Fields");
  
    const update = await findById(id);
    if (!update) throw Error("Not found"); 
    const newStatus = !update[0].status;
  
    const sql = `UPDATE Item SET status = ? WHERE id = ?`;
    return await query(sql, [newStatus, id]);
};
  
module.exports = {
    findAll,
    findById,
    findAllByStatus,
    save,
    update,
    remove,
    changeStatus
};