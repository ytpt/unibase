document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.querySelector(".start");
    const closeBtn = document.querySelector(".close");
    const form = document.getElementById("form");
    const popup = document.querySelector(".hidden");
    const container = document.querySelector(".container");
    const overlay = document.querySelector(".overlay");
    let isPopupOpen = false;

    // Toggle popup
    function toggleVisibility() {
        popup.classList.toggle("hidden");
        overlay.style.display = isPopupOpen ? "none" : "block";
    }

    function resetLayoutOnPopupClose() {
        container.style.justifyContent = "center";
        popup.classList.remove("popup");
        startBtn.classList.remove("hidden");
    }

    function clickOutsidePopup(event) {
        const isOutsideClick = !popup.contains(event.target) && !startBtn.contains(event.target);
        if (!isPopupOpen) return;

        if (isOutsideClick) {
            closePopup();
        }
    }

    function showPopup() {
        resetForm(form);
        toggleVisibility();
        adjustLayoutOnPopupOpen();
        isPopupOpen = !isPopupOpen;
    }

    function adjustLayoutOnPopupOpen() {
        container.style.justifyContent = "flex-start";
        popup.classList.add("popup");
        startBtn.classList.add("hidden");
    }

    startBtn.addEventListener("click", showPopup);
    document.addEventListener("click", clickOutsidePopup);

    // Close popup
    const closePopup = () => {
        toggleVisibility();
        resetLayoutOnPopupClose();
        isPopupOpen = !isPopupOpen;
    }
    closeBtn.addEventListener("click", closePopup)

    // Upload logo
    const fileInput = document.querySelector(".file-input");
    const uploadedImage  = document.querySelector(".file-input__content-image");
    const contentBlock = document.querySelector(".file-input__content-block");
    const resetLogoBtn = document.querySelector(".popup__upload-close");

    const uploadLogo = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.borderRadius = "50%";
            uploadedImage.style.objectFit = "cover";
        };

        const logoInput = document.querySelector(".file-input");
        const uploadFileBlock = logoInput.parentNode;
        const errorLabel = uploadFileBlock.querySelector(".error-label");

        if (errorLabel) {
            errorLabel.remove();
            logoInput.classList.remove("error");
        }

        reader.readAsDataURL(file);
        contentBlock.classList.add("hidden");
    }

    fileInput.addEventListener("change", uploadLogo);

    // Reset logo
    const resetLogo = () => {
        fileInput.value = "";
        uploadedImage.src = "assets/test-photo.png";
        contentBlock.classList.remove("hidden");
    }

    resetLogoBtn.addEventListener("click", resetLogo);

    // Select option
    const selectContent = document.querySelector(".select__content");
    const selectOptionsBlock = document.querySelector(".select__options");
    const selectImage = document.querySelector(".select__button img");
    let isOptionsVisible = false;

    // Toggle options
    selectContent.addEventListener("click", function() {
        selectOptionsBlock.classList.toggle("active");
        selectImage.style.transform = isOptionsVisible ? "scaleY(1)" : "scaleY(-1)";
        isOptionsVisible = !isOptionsVisible;
    });

    // Option click effect
    selectOptionsBlock.addEventListener("click", function(event) {
        if (event.target.classList.contains("select__option")) {
            let optionValue = event.target.textContent;
            document.querySelector(".select__default").textContent = optionValue;
            selectOptionsBlock.classList.remove("active");
            selectImage.style.transform = "scaleY(1)";
            isOptionsVisible = false;
            event.stopPropagation();
        }
    });

    // Close options while click outside
    document.addEventListener("click", function(event) {
        if (!event.target.closest(".select")) {
            selectOptionsBlock.classList.remove("active");
            selectImage.style.transform = "scaleY(1)";
            isOptionsVisible = false;
        }
    });

    // Validate form
    const validateForm = (form) => {
        const requiredInputs = form.querySelectorAll("input[data-required]");
        let result = true;

        const createError = (input, text) => {
            const errorLabel = document.createElement("p");
            errorLabel.textContent = text;
            errorLabel.classList.add("error-label");

            const uploadFileBlock = input.parentNode;
            uploadFileBlock.appendChild(errorLabel);
            input.classList.add("error");
        }

        const removeError = (input) => {
            const uploadFileBlock = input.parentNode;
            const errorLabel = uploadFileBlock.querySelector(".error-label");

            if (errorLabel) {
                errorLabel.remove();
                input.classList.remove("error");
            }
        }

        requiredInputs.forEach(input => {
            const maxLength = input.dataset.maxLength;
            const minLength = input.dataset.minLength;

            if (input.dataset.required === "true" && input.type !== "file") {
                removeError(input);

                if (input.value === "") {
                    createError(input, "Поле не заполнено!");
                    result = false;
                }

                if (minLength) {
                    if (input.value && input.value.length < minLength) {
                        removeError(input);
                        createError(input, `Минимум символов: ${minLength}`);
                        result = false;
                    }
                }

                if (maxLength) {
                    if (input.value && input.value.length > maxLength) {
                        removeError(input);
                        createError(input, `Максимум символов: ${maxLength}`);
                        result = false;
                    }
                }
            }

            if (input.type === "file" && input.files.length === 0) {
                removeError(input);
                createError(input, "Логотип не загружен!");
                result = false;
            }
        })
        return result;
    }

    // Reset form
    const resetForm = (form) => {
        const inputs = form.querySelectorAll("input");
        document.querySelector(".select__default").textContent = "Экология";

        inputs.forEach(input => {
            if (input.type === "file") {
                resetLogo();
            } else {
                input.value = "";
            }
            input.classList.remove("error");
            const uploadFileBlock = input.parentNode;
            const errorLabel = uploadFileBlock.querySelector(".error-label");

            if (errorLabel) {
                errorLabel.remove();
            }
        });
    }

    // Send form
    const sendForm = (event) => {
        event.preventDefault();
        const isValid = validateForm(form);

        if (isValid) {
            const formValues = {};

            const inputs = form.querySelectorAll("input, select");
            inputs.forEach(input => {
                formValues[input.name] = input.value;
            });
            formValues["scope"] = document.querySelector(".select__default").textContent;

            console.log(formValues);
            closePopup();
            resetForm(form);
        }
    }

    form.addEventListener("submit", sendForm);
})