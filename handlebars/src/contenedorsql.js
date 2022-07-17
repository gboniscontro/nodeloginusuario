const optionssql = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'mibase'
    }
}
const optionssqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: "./src/db/mydb.sqlite"
    },
    useNullasDefault: true,
}

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
        if (this.name == 'sql' || this.name == 'sqlite') {
            if (this.name == 'sql') {
                this.knex = require('knex')(optionssql);
            } else {
                this.knex = require('knex')(optionssqlite3)
            }

            this.knex.schema.hasTable('productos').then((existtable) => {
                if (!existtable) {
                    this.knex.schema.createTable('productos', table => {
                        table.increments('id').primary().notNull(),
                            table.string('title', 15).notNull(),
                            table.float('price'),
                            table.string('thumbnail')
                    }).then(console.log('creado')).catch(er => console.log(er))
                }
            }
            )


        }
        else
            try {

                this.productos = fs.readFileSync(name, '', 'utf-8')
                this.productos = JSON.parse(this.productos)
                console.log('archivo leido')

            } catch (error) {
                //console.log(error)  
                this.productos = []
                console.log('archivo no leido')
            }
    }
    async getAll() {
        if (this.name == 'sqlite' || this.name == 'sql') {
            try {

                const arts = await this.knex.from('productos').select('*');
                this.productos = [];
                for (let row of arts) {
                    this.productos.push(new Producto(row.title, row.price, row.thumbnail, row.id))
                    //console.log(`ID:${row.id} - NOMBRE:${row.nombre} - CODIGO:${row.codigo} - PRECIO:${row.precio} - STOCK:${row.stock}`)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        return this.productos
    }
    async getById(id) {
        if (this.name == 'sqlite' || this.name == 'sql') {
            try {
                const arts = await this.knex.from('productos').where('id', '=', id).select('*');
                return arts[0]
            } catch (error) {
                console.log('No funciono getbyid ', id)
            }
        }
        else {
            try {
                for (let i = 0; i < this.productos.length; i++)
                    if (this.productos[i].id == id)
                        return this.productos[i]
                return null
            } catch (error) {
                console.log('No funciono getbyid ', id)
            }
        }
    }

    async save(producto) {
        if (this.name == 'sqlite' || this.name == 'sql') {
            try {
                await this.knex.from('productos').insert(producto)
                // console.log(`El producto con ID ${producto.id} ha sido guardado`)


            } catch (error) {
                console.log(error)
            }
        }
        else
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
        if (this.name == 'sqlite' || this.name == 'sql') {
            try {
                await this.knex.from('productos').del()
                // console.log(`El producto con ID ${producto.id} ha sido guardado`)


            } catch (error) {
                console.log(error)
            }
        }
        else
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
        if (this.name == 'sqlite' || this.name == 'sql') {
            try {
                await this.knex.from('productos').where('id', '=', id).del()
                // console.log(`El producto con ID ${producto.id} ha sido guardado`)


            } catch (error) {
                console.log(error)
            }
        }
        else
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
class ContenedorMensaje {
    constructor(name) {
        this.name = name
        if (this.name == 'sql' || this.name == 'sqlite') {
            if (this.name == 'sql') {
                this.knex = require('knex')(optionssql);
            } else {
                this.knex = require('knex')(optionssqlite3)
            }

            this.knex.schema.hasTable('messages').then((existtable) => {
                if (!existtable) {
                    this.knex.schema.createTable('messages', table => {
                        table.increments('id').primary().notNull(),
                            table.string('message', 15).notNull(),
                            table.string('date'),
                            table.string('email')
                    }).then(console.log('creado')).catch(er => console.log(er))
                }
            })


        }
        else
            try {

                this.messages = fs.readFileSync(name, '', 'utf-8')
                this.messages = JSON.parse(this.messages)
                console.log('archivo leido')

            } catch (error) {
                //console.log(error)  
                this.messages = []
                console.log('archivo no leido')
            }
    }
    async getAll() {
        if (this.name == 'sqlite' || this.name == 'sql') {
            try {

                const arts = await this.knex.from('messages').select('*');
                this.messages = [];
                for (let row of arts) {
                    this.messages.push({ 'message': row.message, 'date': row.date, 'email': row.email, 'id': row.id })
                    //console.log(`ID:${row.id} - NOMBRE:${row.nombre} - CODIGO:${row.codigo} - PRECIO:${row.precio} - STOCK:${row.stock}`)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        return this.messages
    }


    async save(message) {
        if (this.name == 'sqlite' || this.name == 'sql') {
            try {
                await this.knex.from('messages').insert({ 'message': message.message, 'time': new Date().toLocaleString("es-AR"), 'email': message.email })
                // console.log(`El message con ID ${message.id} ha sido guardado`)


            } catch (error) {
                console.log(error)
            }
        }
        else
            try {
                let maxid = 0
                /* if (this.messages.length > 0) {
                     ids = this.messages.map(
                         ({ id }) => (id))
                     //console.log('ids', ids)
                     id = Math.max(...ids) + 1
                     //console.log('idmax', id)
                 }*/
                this.messages.forEach(
                    ({ id }) => (maxid = maxid > id ? maxid : id))
                message.id = maxid + 1
                this.messages.push(message)
                fs.promises.writeFile(this.name, JSON.stringify(this.messages, null, 2))
                    .then(
                        () =>
                            console.log(`El message con ID ${message.id} ha sido guardado`)
                    )
                    .catch(
                        (e) => console.log(e)
                    )

            } catch (error) {
                console.log('error funcion save')
            }
    }


}
module.exports = { Contenedor, Producto, ContenedorMensaje }