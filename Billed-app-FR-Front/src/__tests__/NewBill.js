import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";

// Simulation du store via un mock
jest.mock("../app/store", () => mockStore);

// Début des tests
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    // Test vérifiant que l'icône de mail dans la mise en page verticale est mise en surbrillance
    test("Then mail icon in vertical layout should be highlighted", async () => {
      // Simulation du localStorage contenant un utilisateur de type "Employee"
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Création d'un élément div pour servir de racine à l'application
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      
      // Démarrage du router pour afficher la page NewBill
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      // Attend que l'icône de mail soit présente dans le DOM
      await waitFor(() => screen.getByTestId("icon-mail"));

      // Vérification que l'icône de mail est bien mise en surbrillance (a la classe "active-icon")
      const windowIcon = screen.getByTestId("icon-mail");
      const iconActivated = windowIcon.classList.contains("active-icon");
      expect(iconActivated).toBeTruthy();
    });

    // Test vérifiant que l'icône de fenêtre dans la mise en page verticale n'est pas mise en surbrillance
    test("Then window icon in vertical layout should not be highlighted", async () => {
      // Simulation du localStorage contenant un utilisateur de type "Employee"
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Création d'un élément div pour servir de racine à l'application
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      // Démarrage du router pour afficher la page NewBill
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      // Attend que l'icône de fenêtre soit présente dans le DOM
      await waitFor(() => screen.getByTestId("icon-window"));

      // Vérification que l'icône de fenêtre n'est pas mise en surbrillance (n'a pas la classe "active-icon")
      const windowIcon = screen.getByTestId("icon-window");
      const iconActivated = windowIcon.classList.contains("active-icon");
      expect(iconActivated).toBeFalsy();
    });

    // Test vérifiant que le formulaire pour ajouter une nouvelle facture est chargé avec tous ses champs
    test("Then the new bill's form should be loaded with its fields", () => {
      // Insertion du code HTML du formulaire dans le DOM
      document.body.innerHTML = NewBillUI();

      // Vérification de la présence de tous les champs du formulaire
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      expect(screen.getByTestId("expense-type")).toBeTruthy();
      expect(screen.getByTestId("expense-name")).toBeTruthy();
      expect(screen.getByTestId("datepicker")).toBeTruthy();
      expect(screen.getByTestId("amount")).toBeTruthy();
      expect(screen.getByTestId("vat")).toBeTruthy();
      expect(screen.getByTestId("pct")).toBeTruthy();
      expect(screen.getByTestId("commentary")).toBeTruthy();
      expect(screen.getByTestId("file")).toBeTruthy();
      expect(screen.getByRole("button")).toBeTruthy();
    });

    // Test vérifiant que l'utilisateur peut télécharger un fichier d'image
    test("Then I can upload an image file", () => {
      // Simulation du localStorage contenant un utilisateur de type "Employee"
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Insertion du code HTML du formulaire dans le DOM
      document.body.innerHTML = NewBillUI();

      // Création d'une instance de NewBill avec les paramètres nécessaires
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Définition d'une fonction pour gérer l'événement de changement de fichier
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");

      // Ajout de l'écouteur d'événement pour le changement de fichier
      inputFile.addEventListener("change", handleChangeFile);

      // Création d'un fichier d'image simulé
      const file = new File(["file"], "file.jpg", { type: "image/jpeg" });

      // Déclenchement de l'événement de changement de fichier avec le fichier simulé
      fireEvent.change(inputFile, { target: { files: [file] } });

      // Vérification que l'événement de changement de fichier a été appelé et que le fichier a été téléchargé
      expect(inputFile).toBeTruthy();
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files).toHaveLength(1);
      expect(inputFile.files[0].name).toBe("file.jpg");
    });

    // Test vérifiant que l'utilisateur ne peut pas sélectionner un fichier qui n'est pas une image
    test("Then I can't select upload a non-image file", () => {
      // Insertion du code HTML du formulaire dans le DOM
      document.body.innerHTML = NewBillUI();

      // Création d'une instance de NewBill avec les paramètres nécessaires
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        localStorage: window.localStorage,
        store: null,
      });

      // Définition d'une fonction pour gérer l'événement de changement de fichier
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      expect(inputFile).toBeTruthy();

      // Ajout de l'écouteur d'événement pour le changement de fichier
      inputFile.addEventListener("change", handleChangeFile);

      // Création d'un fichier PDF simulé (non-image)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["file.pdf"], "file.pdf", { type: "file/pdf" })],
        },
      });

      // Vérification que l'événement de changement de fichier a été appelé, mais que le fichier n'est pas une image
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).not.toBe("file.jpg");

      // Vérification que le message d'erreur est affiché pour informer que seul les images sont autorisées
      const errorMessage = screen.getByTestId("newbill-file-error-message");
      expect(errorMessage).toBeTruthy();
    });

    // Suite de tests vérifiant la soumission du formulaire complété pour créer une nouvelle facture
    describe("Then I can submit the form completed", () => {
      test("Then the bill is created", () => {
        // Insertion du code HTML du formulaire dans le DOM
        document.body.innerHTML = NewBillUI();

        // Simulation du localStorage contenant un utilisateur de type "Employee"
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a.com" })
        );

        // Création d'une instance de NewBill avec les paramètres nécessaires
        const newBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });

        // Définition d'une facture valide pour les tests
        const validBill = {
          type: "Restaurants et bars",
          name: "Vol Paris Montréal",
          date: "2022-02-15",
          amount: 200,
          vat: 70,
          pct: 30,
          commentary: "Commentaire",
          fileUrl: "../img/0.jpg",
          fileName: "test.jpg",
          status: "pending",
        };

        // Définition d'une facture valide alternative pour les tests
        const alternateValidBill = {
          type: "Restaurants et bars",
          name: "Vol Paris Montréal",
          date: "2022-02-15",
          amount: 200,
          vat: 70,
          pct: 30,
          commentary: "",
          fileUrl: "../img/0.jpg",
          fileName: "test.jpg",
          status: "pending",
        };

        // Remplissage des champs du formulaire avec les valeurs de la facture valide
        screen.getByTestId("expense-type").value = validBill.type;
        screen.getByTestId("expense-name").value = validBill.name;
        screen.getByTestId("datepicker").value = validBill.date;
        screen.getByTestId("amount").value = validBill.amount;
        screen.getByTestId("vat").value = validBill.vat;
        screen.getByTestId("pct").value = validBill.pct;
        screen.getByTestId("commentary").value = validBill.commentary;

        // Vérification que les champs ont bien été remplis avec les valeurs de la facture valide
        const inputType = screen.getByTestId("expense-type");
        fireEvent.change(inputType, {
          target: { value: validBill.type },
        });
        expect(inputType.value).toBe(validBill.type);

        const inputName = screen.getByTestId("expense-name");
        fireEvent.change(inputName, {
          target: { value: validBill.name },
        });
        expect(inputName.value).toBe(validBill.name);

        const inputDate = screen.getByTestId("datepicker");
        fireEvent.change(inputDate, {
          target: { value: validBill.date },
        });
        expect(inputDate.value).toBe(validBill.date);

        const inputAmount = screen.getByTestId("amount");
        fireEvent.change(inputAmount, {
          target: { value: validBill.amount },
        });
        expect(inputAmount.value).toBe(validBill.amount.toString());

        const inputVAT = screen.getByTestId("vat");
        fireEvent.change(inputVAT, {
          target: { value: validBill.vat },
        });
        expect(inputVAT.value).toBe(validBill.vat.toString());

        const inputPCT = screen.getByTestId("pct");
        fireEvent.change(inputPCT, {
          target: { value: validBill.pct },
        });
        expect(inputPCT.value).toBe(validBill.pct.toString());

        const inputCommentary = screen.getByTestId("commentary");
        fireEvent.change(inputCommentary, {
          target: { value: validBill.commentary },
        });
        expect(inputCommentary.value).toBe(validBill.commentary);

        // Remplissage du champ commentaire avec une valeur alternative (champ vide)
        const inputCommentaryEmpty = screen.getByTestId("commentary");
        fireEvent.change(inputCommentaryEmpty, {
          target: { value: alternateValidBill.commentary },
        });
        expect(inputCommentaryEmpty.value).toBe(alternateValidBill.commentary);

        // Configuration des propriétés fileName et fileUrl de newBill pour les tests
        newBill.fileName = validBill.fileName;
        newBill.fileUrl = validBill.fileUrl;

        // Mock de la méthode updateBill pour les tests
        newBill.updateBill = jest.fn();

        // Définition d'une fonction de soumission du formulaire
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        const button = screen.getByTestId("form-new-bill");
        button.addEventListener("submit", handleSubmit);

        // Déclenchement de l'événement de soumission du formulaire
        fireEvent.submit(button);

        // Vérification que la fonction de soumission a été appelée et que la méthode updateBill a été appelée
        expect(handleSubmit).toHaveBeenCalled();
        expect(newBill.updateBill).toHaveBeenCalled();
      });
    });

    // Suite de tests vérifiant la gestion des erreurs lors des appels à l'API
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Admin",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });

      // Test vérifiant que l'API retourne une erreur 500 lors de la soumission du formulaire
      test("fetches error from an API and fails with 500 error", async () => {
        jest.spyOn(mockStore, "bills");
        jest.spyOn(console, "error").mockImplementation(() => {});
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        Object.defineProperty(window, "location", {
          value: { hash: ROUTES_PATH["NewBill"] },
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee" })
        );
        document.body.innerHTML = `<div id="root"></div>`;
        router();
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        mockStore.bills = jest.fn().mockImplementation(() => {
          return {
            update: () => Promise.reject(new Error("Erreur 500")),
            list: () => Promise.reject(new Error("Erreur 500")),
          };
        });
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // Soumission du formulaire
        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        await new Promise(process.nextTick);

        // Vérification que l'erreur a été gérée et enregistrée dans la console
        expect(console.error).toBeCalled();
      });
    });
  });
});
