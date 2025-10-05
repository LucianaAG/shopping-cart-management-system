const product_controller = require('../controllers/product_controller');
const product = require('../models/product');
const {validationResult} = require('express-validator');

// ------------------ MOCKS ------------------
jest.mock('../models/product.js');
jest.mock('express-validator');

describe('product_controller', () => { // Agrupa todos los tests relacionados a product_controller
    let req, res; // simula el request y response de Express

    beforeEach(() => { // se ejecuta antes de cada test para limpiar los mocks anteriores
        req = { // simula los datos enviado en el body, los parametros, la imagen y los mensajes de error enviados en la request
            body: {},
            params: {},
            file: null,
            flash: jest.fn()
        };

        res = {
            render: jest.fn(),
            redirect: jest.fn()
        };

        validationResult.mockClear();
        product.create.mockClear();
        product.update.mockClear();
        product.destroy.mockClear();
    });

    // ---------------- CREATE TEST ----------------
    describe('create_product', () => { // agrupa todos los tests relacionados con 'create_product'
        it('debería renderizar los errores si la validación falla', async () => {
            validationResult.mockReturnValue({ // simula el resultado de la validacion de los datos
                isEmpty: () => false,
                array: () => [{ msg: 'Error' }]
            });

            req.body = { name: '', price: '', stock: '', minimum_stock: '', category: '' }; // contiene datos vacios para simular errores

            await product_controller.create_product(req, res); // ejecuta el controlador

            expect(res.render).toHaveBeenCalledWith('product/create', expect.objectContaining({ // simula la renderización de la vista 
                errors: [{ msg: 'Error' }],                                                     // con los errores de validación
                product: expect.any(Object)
            }));
        });

        it('Debería crear un producto si los datos son validos', async () => {
            validationResult.mockReturnValue({ isEmpty: () => true }); // simula el resultado de la validación de los datos

            req.body = { name: 'Producto 1', price: 100, stock: 10, minimum_stock: 1, category: 1 }; // simula datos correctos

            await product_controller.create_product(req, res); // ejecuta el controlador

            expect(product.create).toHaveBeenCalledWith(expect.objectContaining({ // verifica que el producto se cree con los datos correctos
                name: 'Producto 1',
                price: 100,
                stock: 10,
                minimum_stock: 1,
                category: 1,
                image: null
            }));

            expect(req.flash).toHaveBeenCalledWith('success_msg', expect.any(String)); // verifica que se envie un mensaje de exito
            expect(res.redirect).toHaveBeenCalledWith('/product/create'); // verifica que se redireccione al usuario
        });
    });

    // ---------------- UPDATE TEST ----------------
    describe('update_product', () => {
        it('debería renderizar los errores si la validación falla', async () => {
            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => [{ msg: 'Error' }]
            });
 
            req.params.product_id = 1; 
            req.body = { name: '', price: '', stock: '', minimum_stock: '' };

            await product_controller.update_product(req, res);

            expect(res.render).toHaveBeenCalledWith('product/edit', expect.objectContaining({
                errors: [{ msg: 'Error' }],
                product: expect.objectContaining({ product_id: 1 })
            }));
        });

        it('debería actualizar el producto si la validación es exitosa', async () => {
            validationResult.mockReturnValue({ isEmpty: () => true });
            req.params.product_id = 1;
            req.body = { name: 'Producto 2', price: 200, stock: 5, minimum_stock: 1, category: 3 };
            req.file = { filename: 'img.jpg' };

            await product_controller.update_product(req, res);

            expect(product.update).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Producto 2',
                price: 200,
                stock: 5,
                minimum_stock: 1,
                category: 3,
                image: 'img.jpg'
            }), { where: { product_id: 1 } });

            expect(req.flash).toHaveBeenCalledWith('success_msg', expect.any(String));
            expect(res.redirect).toHaveBeenCalledWith('/product/list');
        });
    });

    // ---------------- DELETE TEST ----------------
    describe('delete_product', () => {
        it('should delete the product', async () => {
            req.params.product_id = 1;

            await product_controller.delete_product(req, res);

            expect(product.destroy).toHaveBeenCalledWith({ where: { product_id: 1 } });
            expect(req.flash).toHaveBeenCalledWith('success_msg', expect.any(String));
            expect(res.redirect).toHaveBeenCalledWith('/product/list');
        });
    });
});



