const category_controller = require('../controllers/category_controller'); // importa el controlador al que se le haran los test
const category = require('../models/category'); // importa el modelo para poder mockearlo
const {validationResult} = require('express-validator'); // importa validationResult para simular los errores


// ------------------ Mocks ------------------
jest.mock('../models/category');
jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}));

// ------------------ Simulación de request y response ------------------
const mock_request = (body = {}) => ({
    body,
    flash: jest.fn() // simula flash para los mensajes de error
});

const mock_response = () => {
    const response = {};
    response.redirect = jest.fn(); // simula redirect
    response.render = jest.fn(); // simula render
    return response;
}

// ------------------ Test caso de exito ------------------
describe('create_category', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // limpia mocks entre tests
    });

    it('debería crear una category exitosamente', async () => { // test que valida el caso de registro exitoso
        const request = mock_request({name: 'Nueva categoria'});
        const response = mock_response();

        validationResult.mockReturnValue({ isEmpty: () => true }); // simula que no hay errores de validación
        category.create.mockResolvedValue({category_id: 1, name: 'Nueva categoria'}); // simula la creación de una category

        await category_controller.create_category(request, response); // ejecuta la funcion

        expect(category.create).toHaveBeenCalledWith({ name: 'Nueva categoria' }); // valida que se llame a la funcion con los paramas correctos
        expect(request.flash).toHaveBeenCalledWith('success_msg', 'El registro se efectuó con exito'); // valida que se envie el msg de exito
        expect(response.redirect).toHaveBeenCalledWith('/category/create'); // valida que se haya efectuado el redireccionamiento
    })
})

// ------------------ Test caso de error ------------------
it('Debería generar la vista creada con errores si falla la validación', async () => {
    const req = mock_request({ name: '' });
    const res = mock_response();

    validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'el nombre es obligatorio' }]
    });

    await category_controller.create_category(req, res);

    expect(res.render).toHaveBeenCalledWith('category/create', {
        errors: [{ msg: 'el nombre es obligatorio' }],
        category: { name: '' }
    });
});
