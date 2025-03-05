document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('teacherRegistrationForm');
    const addAcademicBtn = document.getElementById('addAcademicEntry');
    const addExperienceBtn = document.getElementById('addExperienceEntry');
    const academicContainer = document.getElementById('academicContainer');
    const experienceContainer = document.getElementById('experienceContainer');

    // Configuración de Google Sheets
    const GOOGLE_SHEET_URL = 'TU_URL_DE_GOOGLE_SCRIPT_WEB_APP';

    // Función para crear botón de eliminar
    const createRemoveButton = () => {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.innerHTML = '✕';
        removeBtn.classList.add('btn-remove');
        removeBtn.addEventListener('click', function() {
            this.closest('.academic-entry, .experience-entry').remove();
        });
        return removeBtn;
    };

    // Validaciones avanzadas
    const validateForm = (formData) => {
        const errors = [];

        // Validación de nombres
        const nombreCompleto = formData.get('firstName') + ' ' + 
                                formData.get('paternalSurname') + ' ' + 
                                formData.get('maternalSurname');
        
        if (!nombreCompleto.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,50}$/)) {
            errors.push('El nombre debe contener entre 5 y 50 caracteres y solo letras');
        }

        // Validación de correo electrónico
        const email = formData.get('email');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.push('Ingrese un correo electrónico válido');
        }

        // Validación de DNI
        const documentId = formData.get('documentId');
        if (!documentId.match(/^\d{8,10}$/)) {
            errors.push('El documento de identidad debe tener entre 8 y 10 números');
        }

        // Validación de teléfono
        const phone = formData.get('phone');
        if (!phone.match(/^(\+?51)?[9]\d{8}$/)) {
            errors.push('Ingrese un número de teléfono válido (9 dígitos)');
        }

        return errors;
    };

    // Función de envío seguro
    const sendToGoogleSheets = async (formData) => {
        try {
            const response = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para evitar problemas de CORS
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    // Añadir entrada académica
    addAcademicBtn.addEventListener('click', () => {
        const newEntry = academicContainer.querySelector('.academic-entry').cloneNode(true);
        
        // Limpiar valores
        newEntry.querySelectorAll('input').forEach(input => input.value = '');
        
        // Remover botón de eliminar existente si hay alguno
        const existingRemoveBtn = newEntry.querySelector('.btn-remove');
        if (existingRemoveBtn) {
            existingRemoveBtn.remove();
        }
        
        // Añadir botón de eliminar
        const removeBtn = createRemoveButton();
        newEntry.insertBefore(removeBtn, newEntry.firstChild);
        
        academicContainer.appendChild(newEntry);
    });

    // Añadir experiencia laboral
    addExperienceBtn.addEventListener('click', () => {
        const newEntry = experienceContainer.querySelector('.experience-entry').cloneNode(true);
        
        // Limpiar valores
        newEntry.querySelectorAll('input').forEach(input => input.value = '');
        
        // Remover botón de eliminar existente si hay alguno
        const existingRemoveBtn = newEntry.querySelector('.btn-remove');
        if (existingRemoveBtn) {
            existingRemoveBtn.remove();
        }
        
        // Añadir botón de eliminar
        const removeBtn = createRemoveButton();
        newEntry.insertBefore(removeBtn, newEntry.firstChild);
        
        experienceContainer.appendChild(newEntry);
    });

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            alert('Por favor, corrija los siguientes errores:\n' + validationErrors.join('\n'));
            return;
        }

        try {
            const result = await sendToGoogleSheets(formData);
            if (result) {
                alert('Registro enviado exitosamente');
                form.reset();
            } else {
                alert('Hubo un problema al enviar el registro');
            }
        } catch (error) {
            console.error('Error de envío:', error);
            alert('Error en el envío del formulario');
        }
    });

    // Añadir estilos para el botón de eliminación
    const style = document.createElement('style');
    style.textContent = `
        .btn-remove {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
        }
        .academic-entry, .experience-entry {
            position: relative;
            margin-bottom: 20px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);
        // Añadir banner informativo
        const createInfoBanner = () => {
            const banner = document.createElement('div');
            banner.classList.add('info-banner');
            banner.innerHTML = `
                <div class="banner-content">
                    <img src="/api/placeholder/50/50" alt="Ícono Universidad">
                    <div>
                        <h3>Registro de Docentes</h3>
                        <p>Ingrese cuidadosamente sus datos profesionales</p>
                    </div>
                </div>
            `;
            document.querySelector('.form-container').insertBefore(banner, document.querySelector('.form-header'));
        };
    
        // Añadir estilos para el banner
        const bannerStyle = document.createElement('style');
        bannerStyle.textContent = `
            .info-banner {
                background-color: #2196f3;
                color: white;
                padding: 15px;
                text-align: center;
                margin-bottom: 20px;
                border-radius: 8px;
            }
            .banner-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
            }
            .banner-content img {
                border-radius: 50%;
            }
            .banner-content h3 {
                margin: 0;
                font-size: 1.2rem;
            }
            .banner-content p {
                margin: 5px 0 0;
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(bannerStyle);
    
        // Llamar a crear banner al cargar
        createInfoBanner();
});