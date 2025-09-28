function weightAndHoursCalculator(){
    const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
    const altura = parseInt(document.getElementById('altura').value);
    const horas_diarias = parseInt(document.getElementById('horas_diarias').value);
    let peso = 0;
    let horas_semanales = 0;

    if (sexo === "femenino") {
        peso = (altura - 100) * 0.85;
    } else if (sexo === "masculino") {
        peso = (altura - 100) * 0.9;
    }

    if (!isNaN(horas_diarias)) {
        horas_semanales = horas_diarias * 7;
        document.getElementById('horas_semanales').value = horas_semanales.toFixed(1);
    }

    if (!isNaN(peso)) {
        document.getElementById('peso').value = peso.toFixed(1);
    }
}

window.onload = function(){
    const form_contacto = document.getElementById('form-contacto');
    form_contacto.addEventListener("input", weightAndHoursCalculator);
    form_contacto.addEventListener("change", weightAndHoursCalculator);
}
