/**
 * @jest-environment jsdom
 */

import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { screen } from "@testing-library/dom";

// Définition des données fictives pour les tests
const data = [];
const loading = false;
const error = null;

// Test de la navigation vers la page de connexion (Login)
describe("Given I am connected and I am on some page of the app", () => {
  describe("When I navigate to Login page", () => {
    test("Then, it should render Login page", () => {
    // Définition du chemin de la page de connexion (Login)
    const pathname = ROUTES_PATH["Login"];
    // Génération du code HTML pour la page de connexion avec les données de test
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      // Vérification que le texte "Administration" est présent dans la page (correspond à la page de connexion)
      expect(screen.getAllByText("Administration")).toBeTruthy();
    });
  });
  // Test de la navigation vers la page des notes de frais (Bills)
  describe("When I navigate to Bills page", () => {
    test("Then, it should render Bills page", () => {
      // Définition du chemin de la page des notes de frais (Bills)
      const pathname = ROUTES_PATH["Bills"];
      // Génération du code HTML pour la page des notes de frais avec les données de test
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      // Vérification que le texte "Mes notes de frais" est présent dans la page (correspond à la page des notes de frais)
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });
  // Test de la navigation vers la page de création d'une nouvelle note de frais (NewBill)
  describe("When I navigate to NewBill page", () => {
    test("Then, it should render NewBill page", () => {
      // Définition du chemin de la page de création d'une nouvelle note de frais (NewBill)
      const pathname = ROUTES_PATH["NewBill"];
      // Génération du code HTML pour la page de création d'une nouvelle note de frais avec les données de test
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      // Vérification que le texte "Envoyer une note de frais" est présent dans la page (correspond à la page de création d'une nouvelle note de frais)
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
  describe("When I navigate to Dashboard", () => {
    test("Then, it should render Dashboard page", () => {
      const pathname = ROUTES_PATH["Dashboard"];
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Validations")).toBeTruthy();
    });
  });
  // Test de la navigation vers n'importe quelle autre page qui n'est pas Login, Bills, NewBill, ou Dashboard
  describe("When I navigate to anywhere else other than Login, Bills, NewBill, Dashboard", () => {
    test("Then, it should render Loginpage", () => {
      // Définition d'un chemin de page fictif (n'importe quelle autre page)
      const pathname = "/anywhere-else";
      // Génération du code HTML pour la page fictive avec les données de test
      const html = ROUTES({
        pathname,
        data,
        loading,
        error,
      });
      document.body.innerHTML = html;
      // Vérification que le texte "Administration" est présent dans la page (correspond à la page de connexion)
      expect(screen.getAllByText("Administration")).toBeTruthy();
    });
  });
});
