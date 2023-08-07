/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import VerticalLayout from "../views/VerticalLayout";
import { localStorageMock } from "../__mocks__/localStorage.js";

// Test pour vérifier que les icônes sont rendues correctement pour un utilisateur connecté en tant qu'Employee
describe("Given I am connected as Employee", () => {
  test("Then Icons should be rendered", () => {
    // Définition d'un objet localStorageMock pour simuler le localStorage avec les données de l'utilisateur connecté
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    const user = JSON.stringify({
      type: "Employee",
    });
    window.localStorage.setItem("user", user);
    // Génération du code HTML pour le composant VerticalLayout avec une hauteur de 120 pixels
    const html = VerticalLayout(120);
    document.body.innerHTML = html;
    // Vérification que l'icône avec le testid "icon-window" est présente dans la page
    expect(screen.getByTestId("icon-window")).toBeTruthy();
    // Vérification que l'icône avec le testid "icon-mail" est présente dans la page
    expect(screen.getByTestId("icon-mail")).toBeTruthy();
  });
});
