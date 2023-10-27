document.addEventListener("DOMContentLoaded", function() {
  var form = document.querySelector("form");

  form.addEventListener("submit", function(event) {
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("mail");
    var messageInput = document.getElementById("msg");

    var nameValue = nameInput.value.trim();
    var emailValue = emailInput.value.trim();
    var messageValue = messageInput.value.trim();

    // Verifica se o campo de nome está vazio
    if (nameValue === "") {
      alert("Por favor, preencha o campo de nome.");
      event.preventDefault();
    }

    // Verifica se o campo de e-mail está vazio ou não é um e-mail válido
    else if (emailValue === "" || !isValidEmail(emailValue)) {
      alert("Por favor, insira um endereço de e-mail válido.");
      event.preventDefault();
    }

    // Verifica se o campo de mensagem está vazio
    else if (messageValue === "") {
      alert("Por favor, preencha o campo de mensagem.");
      event.preventDefault();
    }
  });

  // Função para validar o formato do e-mail
  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});
