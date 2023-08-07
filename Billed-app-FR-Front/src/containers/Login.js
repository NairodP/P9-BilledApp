import { ROUTES_PATH } from "../constants/routes.js";
export let PREVIOUS_LOCATION = "";

// Classe Login : gère l'authentification et la connexion des utilisateurs
export default class Login {
  constructor({
    document,
    localStorage,
    onNavigate,
    PREVIOUS_LOCATION,
    store,
  }) {
    this.document = document;
    this.localStorage = localStorage;
    this.onNavigate = onNavigate;
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION;
    this.store = store;

    // Ajout d'écouteurs d'événements pour les formulaires d'employé et d'administrateur
    const formEmployee = this.document.querySelector(
      `form[data-testid="form-employee"]`
    );
    formEmployee.addEventListener("submit", this.handleSubmitEmployee);

    const formAdmin = this.document.querySelector(
      `form[data-testid="form-admin"]`
    );
    formAdmin.addEventListener("submit", this.handleSubmitAdmin);
  }

  // Méthode handleSubmitEmployee : gère la soumission du formulaire d'employé
  handleSubmitEmployee = (e) => {
    e.preventDefault();

    // Récupérer les valeurs saisies dans le formulaire d'employé
    const user = {
      type: "Employee",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`)
        .value,
      password: e.target.querySelector(
        `input[data-testid="employee-password-input"]`
      ).value,
      status: "connected",
    };

    // Sauvegarder les informations de l'utilisateur dans le localStorage
    this.localStorage.setItem("user", JSON.stringify(user));

    // Effectuer la connexion de l'utilisateur en appelant la méthode login
    this.login(user)
      .catch((err) => this.createUser(user)) // Si la connexion échoue, créer un nouvel utilisateur
      .then(() => {
        // Redirection vers la page "Bills" après la connexion réussie
        this.onNavigate(ROUTES_PATH["Bills"]);
        this.PREVIOUS_LOCATION = ROUTES_PATH["Bills"];
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
        this.document.body.style.backgroundColor = "#fff";
      });
  };

  // Méthode handleSubmitAdmin : gère la soumission du formulaire d'administrateur
  handleSubmitAdmin = (e) => {
    e.preventDefault();

    // Récupérer les valeurs saisies dans le formulaire d'administrateur
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`)
        .value,
      password: e.target.querySelector(
        `input[data-testid="admin-password-input"]`
      ).value,
      status: "connected",
    };

    // Sauvegarder les informations de l'utilisateur dans le localStorage
    this.localStorage.setItem("user", JSON.stringify(user));

    // Effectuer la connexion de l'utilisateur en appelant la méthode login
    this.login(user)
      .catch((err) => this.createUser(user)) // Si la connexion échoue, créer un nouvel utilisateur
      .then(() => {
        // Redirection vers la page "Dashboard" après la connexion réussie
        this.onNavigate(ROUTES_PATH["Dashboard"]);
        this.PREVIOUS_LOCATION = ROUTES_PATH["Dashboard"];
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION;
        document.body.style.backgroundColor = "#fff";
      });
  };

  // Pas besoin de tester la fonction
  // Méthode login : effectue la connexion de l'utilisateur
  /* istanbul ignore next */
  login = (user) => {
    if (this.store) {
      return this.store
        .login(JSON.stringify({ email: user.email, password: user.password }))
        .then(({ jwt }) => {
          localStorage.setItem("jwt", jwt);
        });
    } else {
      return null;
    }
  };

  // Pas besoin de tester la fonction
  // Méthode createUser : crée un nouvel utilisateur dans le store
  /* istanbul ignore next */
  createUser = (user) => {
    if (this.store) {
      return this.store
        .users()
        .create({
          data: JSON.stringify({
            type: user.type,
            name: user.email.split("@")[0],
            email: user.email,
            password: user.password,
          }),
        })
        .then(() => {
          console.log(`User with ${user.email} is created`);
          return this.login(user);
        });
    } else {
      return null;
    }
  };
}
