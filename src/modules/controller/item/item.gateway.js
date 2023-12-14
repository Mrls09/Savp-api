const { query } = require("../../../utils/mysql")

const findAll = async () => {
    const sql = `
        SELECT Item.id,Item.stock, Item.status, Item.descripcion, Item.estado, Producto.titulo, Plataforma.plataforma
        FROM Item
        JOIN Producto ON Item.producto_fk = Producto.id
        JOIN Plataforma ON Item.plataforma_fk = Plataforma.id
    `;
    return await query(sql, []);
}
const findById = async (id) => {
    const sql = `SELECT * FROM Item WHERE id = ?`
    return await query(sql, [id])
};
const findAllByProducto = async (productoId) => {
    const sql = `SELECT
    i.id,
    p.titulo AS producto_titulo,
    i.estado,
    pla.plataforma AS plataforma
FROM
    Item i
JOIN
    Producto p ON i.producto_fk = p.id
JOIN
    Plataforma pla ON i.plataforma_fk = pla.id
WHERE
    i.producto_fk = ? AND i.status = true
`
    return await query(sql, [productoId]);
}

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

    const sql = `INSERT INTO Item (estado, producto_fk, descripcion, plataforma_fk, status, stock) VALUES(?,?,?,?,?,?)`;
    const { insertedId } = await query(sql, [
        item.estado,
        item.productoId,
        item.descripcion,
        item.plataformaId,
        item.status,
        item.stock || 0
    ]);
    return { ...item, id: insertedId };
}
const update = async (item, id) => {
    if (Number.isNaN(id)) throw Error("Wrong Type");
    if (!id) throw Error("Missing Fields");
    if (!item.descripcion || !item.productoId || !item.plataformaId) {
        throw Error("Missing Fields");
    }

    const sql = `UPDATE Item SET descripcion=?, producto_fk=?, plataforma_fk=?, stock=? WHERE id=?`;
    await query(sql, [
        item.descripcion,
        item.productoId,
        item.plataformaId,
        item.stock || 0,
        id
    ]);

    return { ...item, id: id };
};


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
    await query(sql, [newStatus, id]);

    return { ...update[0], status: newStatus };
};

module.exports = {
    findAll,
    findById,
    findAllByStatus,
    save,
    update,
    remove,
    changeStatus,
    findAllByProducto
};