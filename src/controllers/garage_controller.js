// Importa a classe Controller de "@hotwired/stimulus"
import { Controller } from "@hotwired/stimulus"

// Define a classe como uma extensão do Controlador Stimulus
export default class extends Controller {

  // Define os alvos estáticos para 'carsList' e 'form'
  static targets = ["carsList", 'form']

  // Método que é executado quando o controlador é conectado à página
  connect() {
    // Define a URL da API de carros
    this.url = `https://wagon-garage-api.herokuapp.com/carangascar/cars`
    // Chama o método listCars para obter a lista de carros
    this.listCars()
  }

  // Método para listar todos os carros
  listCars() {
    // Faz uma requisição GET para a API de carros
    fetch(this.url)
      .then(response => response.json())
      .then((data) => {
        // Limpa o conteúdo atual da lista de carros
        this.carsListTarget.innerHTML = ''
        // Para cada carro retornado pela API
        data.forEach((car) => {
          // Insere o carro na lista de carros
          this.carsListTarget.insertAdjacentHTML('beforeend', this.carTemplate(car))
        })
      })
  }

  // Método para criar o template HTML de um carro
  carTemplate(car) {
    // Retorna a string do template HTML
    return `
      <div class="car">
        <div class="car-image">
          <img src="http://loremflickr.com/280/280/${car.brand.replace(' ','-')}-${car.model.replace(' ','-')}" />
        </div>
        <div class="car-info">
          <h4>${car.brand} ${car.model}</h4>
          <p><strong>Owner:</strong> ${car.owner}</p>
          <p><strong>Plate:</strong> ${car.plate}</p>
          <button class='btn btn-danger' data-action='click->garage#destroy' data-garage-id-param='${car.id}'>Remove</button>
        </div>
      </div>`
  }

  // Método para deletar um carro
  destroy({params}) {
    // Define a URL da API para deletar um carro
    const url = `https://wagon-garage-api.herokuapp.com/cars/${params.id}`
    // Faz uma requisição DELETE para a API
    fetch(url, { method: "DELETE" })
      .then(response => response.json())
      .then((data) => {
        // Recarrega a lista de carros após a exclusão
        this.listCars()
      })
  }

  // Método para criar um novo carro
  createCar(event) {
    // Impede o comportamento padrão do evento de submissão de formulário
    event.preventDefault()
    // Cria um novo objeto de carro a partir do formulário
    const newCar = Object.fromEntries(new FormData(this.formTarget))
    // Faz uma requisição POST para a API para criar um novo carro
    fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCar)
    })
      .then(response => response.json())
      .then((data) => {
        // Recarrega a lista de carros após a criação de um novo carro
        this.listCars()
      })
    }

  }
