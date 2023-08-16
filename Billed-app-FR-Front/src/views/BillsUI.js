import VerticalLayout from "./VerticalLayout.js";
import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";
import Actions from "./Actions.js";

const row = (bill) => {
  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `;
};

const rows = (data) => {
  // Vérification si 'data' existe (n'est pas null ou undefined)
  if (data) {
    // Si 'data' existe, tri des éléments du tableau en utilisant une fonction de comparaison
    data.sort((a, b) => {
      // Conversion des dates 'a.date' et 'b.date' en objets Date pour pouvoir les comparer
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      // Retourne la différence entre 'dateB' et 'dateA'
      // Si la différence est positive, 'dateB' est plus récent que 'dateA',
      // si elle est négative, 'dateA' est plus récent que 'dateB',
      // si elle est égale à zéro, les deux dates sont identiques.
      return dateB - dateA;
    });
  }

  // Retourne le résultat du traitement suivant :
  // - Si 'data' existe et a une longueur supérieure à 0 (c'est-à-dire contient des éléments),
  //   applique la fonction 'row' à chaque élément de 'data' et renvoie le résultat sous forme de chaîne.
  // - Sinon, renvoie une chaîne vide.
  return data && data.length ? data.map((bill) => row(bill)).join("") : "";
};

export default ({ data: bills, loading, error }) => {
  // New data-testid="close-bill-modal"
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-testid="close-bill-modal" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `;

  if (loading) {
    return LoadingPage();
  } else if (error) {
    return ErrorPage(error);
  }

  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`;
};
