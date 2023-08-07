/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import LoadingPage from "../views/LoadingPage.js";

// Test lié au rendu de la page de chargement (LoadingPage on views file)
describe("Given I am connected on app (as an Employee or an HR admin)", () => {
  // Test du rendu de la page de chargement
  describe("When LoadingPage is called", () => {
    test("Then, it should render Loading...", () => {
      // Appel de LoadingPage pour obtenir le HTML de la page de chargement
      const html = LoadingPage();
      document.body.innerHTML = html;
      // Vérification de l'affichage du texte "Loading..." sur la page
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
});
