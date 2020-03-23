$(document).ready(function () {

  // Configuration Datatable
  var table = $('#memberlistTable').DataTable({
    // hauteur fixe
    "sScrollY": "480",
    "bScrollCollapse": false,
    //traduction
    "language": {
      "decimal": "",
      "emptyTable": "Aucune donnée disponible",
      "info": "Résultats _START_ à _END_ sur _TOTAL_ entrées",
      "infoEmpty": "0 résultats",
      "infoFiltered": "(filtré sur un total de _MAX_ entrées)",
      "infoPostFix": "",
      "thousands": ",",
      "lengthMenu": "Affichage _MENU_",
      "loadingRecords": "Loading...",
      "processing": "Processing...",
      "search": "Recherche:",
      "zeroRecords": "La recherche n'a retournée aucun résultat",
      "paginate": {
        "first": "First",
        "last": "Last",
        "next": "Suivant",
        "previous": "Précédent"
      },
      "aria": {
        "sortAscending": ": activate to sort column ascending",
        "sortDescending": ": activate to sort column descending"
      }
    }
  });




});//docReadyEnd
