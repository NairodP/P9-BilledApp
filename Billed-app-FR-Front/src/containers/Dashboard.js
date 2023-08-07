import { formatDate } from "../app/format.js";
import DashboardFormUI from "../views/DashboardFormUI.js";
import BigBilledIcon from "../assets/svg/big_billed.js";
import { ROUTES_PATH } from "../constants/routes.js";
import USERS_TEST from "../constants/usersTest.js";
import Logout from "./Logout.js";

// Fonction filteredBills : filtre les factures en fonction de leur statut
export const filteredBills = (data, status) => {
  return data && data.length
    ? data.filter((bill) => {
        let selectCondition;

        // Vérifier si l'environnement est Jest (pour les tests) ou la production
        if (typeof jest !== "undefined") {
          selectCondition = bill.status === status; // Dans l'environnement Jest, sélectionner les factures ayant le même statut que celui fourni en paramètre
        } else {
          /* istanbul ignore next */
          // Dans l'environnement de production, obtenir l'e-mail de l'utilisateur connecté à partir du localStorage
          const userEmail = JSON.parse(localStorage.getItem("user")).email;
          // Sélectionner les factures ayant le même statut que celui fourni en paramètre, mais exclure les factures ayant l'e-mail de l'utilisateur connecté
          selectCondition =
            bill.status === status &&
            ![...USERS_TEST, userEmail].includes(bill.email);
        }

        return selectCondition; // Retourner les factures filtrées selon la condition sélectionnée
      })
    : []; // Retourner un tableau vide si les données ou le tableau de factures est vide
};

// Fonction card : génère le code HTML pour afficher une carte de facture
export const card = (bill) => {
  // Découper l'e-mail de la facture pour obtenir le prénom et le nom de l'utilisateur
  const firstAndLastNames = bill.email.split("@")[0];
  const firstName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[0]
    : "";
  const lastName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[1]
    : firstAndLastNames;

  // Retourner le code HTML pour afficher la carte de facture avec les données fournies
  return `
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `;
};

// Fonction cards : génère le code HTML pour afficher plusieurs cartes de factures
export const cards = (bills) => {
  return bills && bills.length
    ? bills.map((bill) => card(bill)).join("")
    : ""; // Retourner un code HTML vide si le tableau de factures est vide
};

// Fonction getStatus : retourne le statut en fonction de l'index fourni
export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending";
    case 2:
      return "accepted";
    case 3:
      return "refused";
    default:
      return ""; // Retourner une chaîne vide si l'index n'est pas reconnu
  }
};

// Classe Dashboard : gère les interactions et le rendu de la page Dashboard
export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;

    // Gestion des clics sur les icônes fléchées pour afficher les factures selon leur statut
    $("#arrow-icon1").click((e) => this.handleShowTickets(e, bills, 1));
    $("#arrow-icon2").click((e) => this.handleShowTickets(e, bills, 2));
    $("#arrow-icon3").click((e) => this.handleShowTickets(e, bills, 3));

    // Initialisation du composant Logout pour gérer la déconnexion
    new Logout({ localStorage, onNavigate });
  }

  // Méthode handleClickIconEye : gère le clic sur l'icône de l'œil pour afficher une facture en grand
  handleClickIconEye = () => {
    const billUrl = $("#icon-eye-d").attr("data-bill-url");
    const imgWidth = Math.floor($("#modaleFileAdmin1").width() * 0.8);
    $("#modaleFileAdmin1")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;'><img style='width: 100%;' src=${billUrl} alt="Bill"/></div>`
      );
    if (typeof $("#modaleFileAdmin1").modal === "function")
      $("#modaleFileAdmin1").modal("show");
  };

  // Méthode handleEditTicket : gère l'édition d'une facture lors du clic sur une carte de facture
  handleEditTicket(e, bill, bills) {
    // Gestion du compteur pour afficher le formulaire ou l'icône BigBilledIcon
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0;
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id;
    if (this.counter % 2 === 0) {
      // Affichage du formulaire d'édition de la facture
      bills.forEach((b) => {
        $(`#open-bill${b.id}`).css({ background: "#0D5AE5" });
      });
      $(`#open-bill${bill.id}`).css({ background: "#2A2B35" });
      $(".dashboard-right-container div").html(DashboardFormUI(bill));
      $(".vertical-navbar").css({ height: "150vh" });
      this.counter++;
    } else {
      // Affichage de l'icône BigBilledIcon
      $(`#open-bill${bill.id}`).css({ background: "#0D5AE5" });
      $(".dashboard-right-container div").html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `);
      $(".vertical-navbar").css({ height: "120vh" });
      this.counter++;
    }
    $("#icon-eye-d").click(this.handleClickIconEye); // Gestion du clic sur l'icône de l'œil pour afficher une facture en grand
    $("#btn-accept-bill").click((e) => this.handleAcceptSubmit(e, bill)); // Gestion du clic sur le bouton "Accepter" pour valider une facture
    $("#btn-refuse-bill").click((e) => this.handleRefuseSubmit(e, bill)); // Gestion du clic sur le bouton "Refuser" pour rejeter une facture
  }

  // Méthode handleAcceptSubmit : gère la validation d'une facture
  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "accepted",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill); // Appel à la méthode updateBill pour mettre à jour la facture dans le store
    this.onNavigate(ROUTES_PATH["Dashboard"]); // Redirection vers la page Dashboard après validation
  };

  // Méthode handleRefuseSubmit : gère le rejet d'une facture
  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "refused",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill); // Appel à la méthode updateBill pour mettre à jour la facture dans le store
    this.onNavigate(ROUTES_PATH["Dashboard"]); // Redirection vers la page Dashboard après rejet
  };

  // Méthode handleShowTickets : gère l'affichage des factures selon leur statut lors du clic sur une icône fléchée
  handleShowTickets(e, bills, index) {
    if (this.counter === undefined || this.index !== index) this.counter = 0;
    if (this.index === undefined || this.index !== index) this.index = index;
    if (this.counter % 2 === 0) {
      // Affichage des factures ayant le statut correspondant
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(0deg)" });
      $(`#status-bills-container${this.index}`).html(
        cards(filteredBills(bills, getStatus(this.index)))
      );
      this.counter++;
    } else {
      // Masquage des factures ayant le statut correspondant
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(90deg)" });
      $(`#status-bills-container${this.index}`).html("");
      this.counter++;
    }

    // Gestion du clic sur les cartes de factures pour éditer une facture
    let currentFilteredBills = filteredBills(bills, getStatus(this.index));
    currentFilteredBills.forEach((bill) => {
      $(`#open-bill${bill.id}`).click((e) =>
        this.handleEditTicket(e, bill, bills)
      );
    });

    return bills;
  }

  // Méthode getBillsAllUsers : récupère toutes les factures de tous les utilisateurs depuis le store
  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => ({
            id: doc.id,
            ...doc,
            date: doc.date,
            status: doc.status,
          }));
          return bills;
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  // Méthode updateBill : met à jour une facture dans le store
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .then((bill) => bill)
        .catch(console.log);
    }
  };
}
