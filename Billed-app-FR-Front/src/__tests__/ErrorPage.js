/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import ErrorPage from "../views/ErrorPage.js";

// Tests liés au rendu de la page d'erreur
describe("Given I am connected on app (as an Employee or an HR admin)", () => {
  // Test du rendu de la page d'erreur (ErrorPage on views file) sans message d'erreur dans sa signature
  describe("When ErrorPage is called without and error in its signature", () => {
    test("Then, it should render ErrorPage with no error message", () => {
      // Appel de ErrorPage sans message d'erreur
      const html = ErrorPage();
      document.body.innerHTML = html;
      // Vérification de l'affichage du texte "Erreur" sur la page
      expect(screen.getAllByText("Erreur")).toBeTruthy();
      // Vérification que la balise contenant le message d'erreur est vide (longueur égale à 0)
      expect(screen.getByTestId("error-message").innerHTML.trim().length).toBe(
        0
      );
    });
  });
  // Test du rendu de la page d'erreur avec un message d'erreur dans sa signature
  describe("When ErrorPage is called with error message in its signature", () => {
    test("Then, it should render ErrorPage with its error message", () => {
      // Message d'erreur à afficher dans la page
      const error = "Erreur de connexion internet";
      // Appel de ErrorPage avec le message d'erreur
      const html = ErrorPage(error);
      document.body.innerHTML = html;
      // Vérification de l'affichage du message d'erreur sur la page
      expect(screen.getAllByText(error)).toBeTruthy();
    });
  });
});
