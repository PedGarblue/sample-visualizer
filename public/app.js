(() => {
  const SamplesContainer = document.getElementById('samples');
  const LoadingButton = document.getElementsByClassName('loading')[0];


  function createPatientSampleElement(data) {
    // create the container
    const container = document.createElement('div');
    container.classList.add('sample');
    container.innerHTML = `
      <div class="sample__medications"></div>
    `;

    // add medications data
    data.CurrentMedications.forEach(medication => {
      const medicationElement = createMedicationElement(medication);
      container.insertAdjacentElement('beforeend', medicationElement);
    });

    return container;
  }

  function createMedicationElement(data) {
    const medicationStatuses = {
      'Decreased Efficacy': 'poor',
      'Normal Response': 'normal',
    }
    const status = medicationStatuses[data.GroupPhenotype];
    const medicationElementContainer = document.createElement('div');

    medicationElementContainer.classList.add('medication');
    // add state classes according to element status
    medicationElementContainer.classList.add('medication--closed');
    medicationElementContainer.classList.add(`medication--${status}`);

    // data parsing
    const theraputicArea = data.TheraputicArea.join(',');
    const medicationActions = data.Action.join(',');

    medicationElementContainer.innerHTML = `
      <h3 class="medication__title">${theraputicArea}</h3>
      <div class="medication__info">
        <div class="medication__drugs">
        </div>
        <div class="medication__geneInfo">
          <table cellspacing="0" cellspan="0">
            <thead>
              <th>Gene</th>
              <th>Genotype</th>
              <th>Phenotypes/Patient impact</th>
            </thead>
            <tbody>
              <tr class="medication__status">
                <td colspan="2">
                  ${medicationActions}
                </td>
                <td>
                  ${data.GroupPhenotype}
                </td>
              <tr>
            </tbody>
          </table>
        </div>
        <div class="medication__recommendation">
          ${data.Recommendation}
        </div>
      </div>
    `;
    
    // Now we are going to add Drug and Gene data 

    const DrugsContainer = medicationElementContainer.getElementsByClassName('medication__drugs')[0];
    const GeneTableBody = medicationElementContainer.getElementsByTagName('tbody')[0];
    
    // Add Drug data in the DrugsContainer 
    data.Drugs.forEach(drugData => {
      const drugElement = document.createElement('div');

      drugElement.classList.add('medication__drug');
      drugElement.innerHTML = `
        <div>${drugData.Generic}</div>
        <div>(${drugData.Trade})</div>
      `;
      
      DrugsContainer.insertAdjacentElement('beforeend', drugElement);
    });

    /* 
    * Add gene data in the GeneTableBody.
    * We will insert every GeneRow in the begin of the TableBody.
    * Reversing the gene list puts in correct order the table display (ascending).
    */
    const getPhenotypeStatus = phenotype => {
      const statuses = {
        'Normal Metabolizer': 'normal',
        'Poor Metabolizer': 'poor',
      };
      return statuses[phenotype];
    }

    data.GeneInfo.reverse().forEach(geneData => {
      const GeneRow = document.createElement('tr');
      const status = getPhenotypeStatus(geneData.Phenotype);
      
      GeneRow.classList.add('medication__gene');
      GeneRow.classList.add(`medication__gene--${status}`);

      GeneRow.innerHTML = `
        <td>${geneData.Gene}</td>
        <td>${geneData.Genotype}</td>
        <td>${geneData.Phenotype}</td>
      `;
      
      GeneTableBody.insertAdjacentElement('afterbegin', GeneRow);
    })

    /* 
      * GeneInfo, Recommendation, and Title are hidden by default
      * they should appear when DrugsContainer is clicked
    */

    const toogleContainerStatus = () => {
      if(medicationElementContainer.classList.contains('medication--closed')){
        medicationElementContainer.classList.remove('medication--closed');
        medicationElementContainer.classList.add('medication--open');
      } else {
        medicationElementContainer.classList.remove('medication--open');
        medicationElementContainer.classList.add('medication--closed');
      }
    }

    DrugsContainer.addEventListener('click', () => {
      toogleContainerStatus();
    });

    return medicationElementContainer;
  }

  function onInit() {
    // get the JSON
    fetch('./assets/FakeSample.json')
      .then(data => data.json())
      .then(json => {
        // create and insert PatientSampleElement
        const PatientSampleElement = createPatientSampleElement(json);
        SamplesContainer.insertAdjacentElement('afterbegin', PatientSampleElement);
        // remove loading button
        LoadingButton.remove();
      })
  }

  onInit();
})();
