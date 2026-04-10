const form = document.querySelector("#edit-inventory-form")

form.addEventListener("change", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
})