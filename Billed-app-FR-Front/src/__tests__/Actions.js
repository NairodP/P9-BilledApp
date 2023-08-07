/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
import Actions from "../views/Actions.js";

describe("Given I am connected as an Employee", () => {
  // Vérifie que l'icône d'œil est rendue lorsque l'utilisateur est connecté en tant qu'employé et qu'il y a des notes de frais disponibles sur la page.
  describe("When I am on Bills page and there are bills", () => {
    test("Then, it should render icon eye", () => {
      const html = Actions();
      document.body.innerHTML = html;
      expect(screen.getByTestId("icon-eye")).toBeTruthy();
    });
  });
  // Vérifie que l'URL du fichier est correctement enregistrée dans l'attribut data-bill-url de l'icône d'œil lorsque l'utilisateur est sur la page des notes de frais et qu'une URL de fichier est fournie.
  describe("When I am on Bills page and there are bills with url for file", () => {
    test("Then, it should save given url in data-bill-url custom attribute", () => {
      const url = "/fake_url";
      const html = Actions(url);
      document.body.innerHTML = html;
      expect(screen.getByTestId("icon-eye")).toHaveAttribute(
        "data-bill-url",
        url
      );
    });
  });
});
