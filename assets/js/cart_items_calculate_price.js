document.addEventListener('DOMContentLoaded', () => {
    const amount_input = document.getElementById('amount'); // selecciona el elemento cantidad del doc
    const price_input = document.getElementById('price'); // selecciona el elemento precio del doc
    const product_select = document.getElementById('product_id'); // selecciona el elemento product_id del doc

    function update_price() {
        const selected_option = product_select.selectedOptions[0]; // extrae el producto seleccionado por el usuario
        const product_price = parseFloat(selected_option.dataset.price); // convierte el precio a float
        const amount = parseInt(amount_input.value) || 0; // convierte la cantidad a int
        price_input.value = parseInt(amount * product_price); // calcula el precio de cart_items en base a la cantidad y el precio del producto
    }

    amount_input.addEventListener('input', update_price); // recalcula el precio cada que el usuario cambia la cantidad
    product_select.addEventListener('change', update_price); // recalcula el precio cada que el usuario cambia el producto

    update_price(); // Inicializa el precio al cargar
});
