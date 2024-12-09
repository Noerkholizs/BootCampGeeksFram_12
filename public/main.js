function showUpdateForm(name, email, number) {
  fetch(
    `/contact/update-form?name=${encodeURIComponent(
      name
    )}&email=${encodeURIComponent(email)}&number=${encodeURIComponent(number)}`
  )
    .then((response) => response.text())
    .then((html) => {
      const updateFormContainer = document.getElementById(
        "updateFormContainer"
      );
      updateFormContainer.innerHTML = html;
      const oldNameInput = document.getElementById("oldName");
      oldNameInput.value = name; // Pre-fill the old name
    })
    .catch((error) => console.error("Error loading update form:", error));
}
