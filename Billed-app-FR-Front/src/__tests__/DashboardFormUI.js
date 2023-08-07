/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import DashboardFormUI from "../views/DashboardFormUI.js";
import { formatDate } from "../app/format.js";

// Données d'une facture pour les tests
const bill = {
  id: "47qAXb6fIm2zOKkLzMro",
  vat: "80",
  fileUrl:
    "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  status: "accepted",
  type: "Hôtel et logement",
  commentAdmin: "ok",
  commentary: "séminaire billed",
  name: "encore",
  fileName: "preview-facture-free-201801-pdf-1.jpg",
  date: "2004-04-04",
  amount: 400,
  email: "a@a",
  pct: 20,
};

// Données de factures avec différents statuts pour les tests
const billAccepted = {
  ...bill,
  status: "accepted",
};

const billPending = {
  ...bill,
  status: "pending",
};

const billrefused = {
  ...bill,
  status: "refused",
};

// Tests liés à l'affichage des données de factures sur le formulaire
describe("Given I am connected as an Admin and I am on Dashboard Page", () => {
  // Test affichage des données de facture lorsque les données de facture sont passées au composant DashboardFormUI
  describe("When bill data is passed to DashboardUI", () => {
    test("Then, it should them in the page", () => {
      // Génération du code HTML du formulaire avec les données de la facture test
      const html = DashboardFormUI(bill);
      document.body.innerHTML = html;
      // Vérification de l'affichage des différentes informations de la facture
      // Vérifie la présence des éléments
      expect(screen.getByText(bill.vat)).toBeTruthy();
      expect(screen.getByText(bill.type)).toBeTruthy();
      expect(screen.getByText(bill.commentary)).toBeTruthy();
      expect(screen.getByText(bill.name)).toBeTruthy();
      expect(screen.getByText(bill.fileName)).toBeTruthy();
      expect(screen.getByText(formatDate(bill.date))).toBeTruthy();
      expect(screen.getByText(bill.amount.toString())).toBeTruthy();
      expect(screen.getByText(bill.pct.toString())).toBeTruthy();
    });
  });
  // Test affichage des boutons "Accepter" et "Refuser", ainsi que de la zone de texte pour une facture en attente
  describe("When pending bill is passed to DashboardUI", () => {
    test("Then, it should show button and textArea", () => {
      // Génération du code HTML du formulaire avec les données de la facture en attente
      const html = DashboardFormUI(billPending);
      document.body.innerHTML = html;
      // Vérification de l'affichage des boutons "Accepter" et "Refuser"
      expect(screen.getByText("Accepter")).toBeTruthy();
      expect(screen.getByText("Refuser")).toBeTruthy();
      // Vérification de la présence de la zone de texte pour le commentaire de l'admin
      expect(screen.getByTestId("commentary2")).toBeTruthy();
    });
  });
  // Test affichage du commentaire de l'admin pour une facture acceptée
  describe("When accepted bill is passed to DashboardUI", () => {
    test("Then, it should show admin commentary", () => {
      const html = DashboardFormUI(billAccepted);
      document.body.innerHTML = html;
      expect(screen.getByText(bill.commentAdmin)).toBeTruthy();
    });
  });
  // Test affichage du commentaire de l'admin pour une facture refusée
  describe("When refused bill is passed to DashboardUI", () => {
    test("Then, it should show admin commentary", () => {
      const html = DashboardFormUI(billrefused);
      document.body.innerHTML = html;
      expect(screen.getByText(bill.commentAdmin)).toBeTruthy();
    });
  });
});
