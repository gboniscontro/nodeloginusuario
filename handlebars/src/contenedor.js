const fs = require('fs')
class Producto {
    constructor(title, price, thumbnail, id = 0) {
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
        this.id = id
    }
}
class Contenedor {
    constructor(name) {
        this.name = name
        try {

            this.productos = fs.readFileSync(name,'', 'utf-8')
            this.productos = JSON.parse(this.productos)
            console.log('archivo leido')

        } catch (error) {
            //console.log(error)  
            this.productos = []
            console.log('archivo no leido')
        }
    }
    getAll() {
        return this.productos
    }
    getById(id) {
        try {
            for (let i = 0; i < this.productos.length; i++)
                if (this.productos[i].id == id)
                    return this.productos[i]
            return null
        } catch (error) {
            console.log('No funciono getbyid ', id)
        }
    }

    save(producto) {
        try {
            let maxid = 0
            /* if (this.productos.length > 0) {
                 ids = this.productos.map(
                     ({ id }) => (id))
                 //console.log('ids', ids)
                 id = Math.max(...ids) + 1
                 //console.log('idmax', id)
             }*/
            this.productos.forEach(
                ({ id }) => (maxid = maxid > id ? maxid : id))
            producto.id = maxid + 1
            this.productos.push(producto)
            fs.promises.writeFile(this.name, JSON.stringify(this.productos, null, 2))
                .then(
                    () =>
                        console.log(`El producto con ID ${producto.id} ha sido guardado`)
                )
                .catch(
                    (e) => console.log(e)
                )

        } catch (error) {
            console.log('error funcion save')
        }
    }
    async deleteAll() {
        try {
            await fs.promises.unlink(this.name).then(
                () => console.log('delete all')
            ).catch((e) => console.log('error deleteall', e))


        }
        catch (e) {
            console.log('No se pudo borrar ')
        }
        this.productos = []
    }
    async deleteById(id) {
        try {
            this.productos.forEach((element, index) => {
                if (element.id == id) this.productos.splice(index, 1)
            });
            console.log(`Eliminado id ${id}:`)
            await fs.promises.writeFile(this.name, JSON.stringify(this.productos, null, 2))
            console.log(`El producto con ID ${id} ha sido eliminado`)


        } catch (error) {
            console.log(`No se pudo borrar el  ${id}`)
        }
    }

}
module.exports = { Contenedor, Producto }