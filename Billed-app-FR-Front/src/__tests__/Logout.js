/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import Logout from "../containers/Logout.js";
import "@testing-library/jest-dom/extend-expect";
import { localStorageMock } from "../__mocks__/localStorage.js";
import DashboardUI from "../views/DashboardUI.js";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes";

const bills = [
  {
    id: "47qAXb6fIm2zOKkLzMro",
    vat: "80",
    fileUrl:
      "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
    status: "pending",
    type: "Hôtel et logement",
    commentary: "séminaire billed",
    name: "encore",
    fileName: "preview-facture-free-201801-pdf-1.jpg",
    date: "2004-04-04",
    amount: 400,
    commentAdmin: "ok",
    email: "a@a",
    pct: 20,
  },
];

// Test de la déconnexion
describe("Given I am connected", () => {
  describe("When I click on disconnect button", () => {
    test("Then, I should be sent to login page", () => {
      // Mock de la fonction de navigation pour les tests
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      // Mock de localStorage avec l'utilisateur connecté (Admin)
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      // Affichage de la page du tableau de bord (DashboardUI) avec une facture
      document.body.innerHTML = DashboardUI({ bills });

      // Création d'une instance du composant Logout
      const logout = new Logout({ document, onNavigate, localStorage });

      // Mock de la fonction handleClick du composant Logout
      const handleClick = jest.fn(logout.handleClick);

      // Simulation de click sur le bouton de déconnexion
      const disco = screen.getByTestId("layout-disconnect");
      disco.addEventListener("click", handleClick);
      userEvent.click(disco);
      // Vérification que la fonction handleClick a été appelée
      expect(handleClick).toHaveBeenCalled();
      // Vérification que la page de connexion (Login) est affichée après la déconnexion
      expect(screen.getByText("Administration")).toBeTruthy();
    });
  });
});
