// Variabile per salvare la planimetria caricata dall'utente
let planimetriaBase64 = null;

// Gestione del caricamento immagine Planimetria
document.getElementById('planimetriaFile').addEventListener('change', function(event) {
    const file = event.target.files;
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            planimetriaBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Quando clicchi su "Genera PDF"
document.getElementById('manualForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Ferma il ricaricamento della pagina
    generaPDF();
});

function generaPDF() {
    // 1. Recuperiamo i dati inseriti nel form
    const dati = {
        ragioneSociale: document.getElementById('ragioneSociale').value,
        codiceAziendale: document.getElementById('codiceAziendale').value,
        sedeLegale: document.getElementById('sedeLegale').value,
        sedeOperativa: document.getElementById('sedeOperativa').value |

| document.getElementById('sedeLegale').value,
        piva: document.getElementById('piva').value,
        indirizzoProd: document.getElementById('indirizzoProduttivo').value,
        numCapi: document.getElementById('numCapi').value,
        veterinario: document.getElementById('veterinario').value,
        respBiosicurezza: document.getElementById('respBiosicurezza').value,
        respBenessere: document.getElementById('respBenessere').value,
        dataCorso: document.getElementById('dataCorsoBenessere').value,
        freqPest: document.getElementById('freqPestControl').value
    };

    // 2. Calcolo logica dinamica per POS 003 (Pest Control)
    let numeroVisite;
    let testoFrequenza;
    
    switch(dati.freqPest) {
        case 'Mensile': numeroVisite = 12; testoFrequenza = "mensile"; break;
        case 'Bimestrale': numeroVisite = 6; testoFrequenza = "bimestrale"; break;
        case 'Trimestrale': numeroVisite = 4; testoFrequenza = "trimestrale"; break;
        case 'Quadrimestrale': numeroVisite = 3; testoFrequenza = "quadrimestrale"; break;
        default: numeroVisite = 3; testoFrequenza = "quadrimestrale";
    }

    // --- TESTI COMPLETI DEI MANUALI (NON TOCCARE SE NON NECESSARIO) ---

    // POS 001: VISITATORI (Testo completo da documento)
    const POS_001_CONTENT =, style: 'listStyle' },
        { text: 'Ogni ingresso deve essere tracciato sul Registro Visitatori indicando data, nome, motivo visita e dichiarazione rischio.', style: 'standardText' },

        { text: '4. Comportamento e Cartellonistica', style: 'subHeader' },
        { text: 'I visitatori devono essere sempre accompagnati e rispettare la "Marcia in Avanti" (dal pulito allo sporco). È vietato toccare animali se non autorizzati. All\'ingresso è affisso il cartello "ZONA A BIOSICUREZZA CONTROLLATA" (Vedi Allegati).', style: 'standardText' }
    ];

    // POS 002: QUARANTENA (Testo completo)
    const POS_002_CONTENT =;

    // POS 003: PEST MANAGEMENT (Testo con variabili dinamiche)
    const POS_003_CONTENT =, style: 'standardText' },
        { text: 'Disinfestazione Insetti: Trattamenti stagionali (Primavera-Estate) con piretroidi a bassa tossicità nelle aree esterne.', style: 'standardText' },

        { text: '4. Documentazione', style: 'subHeader' },
        { text: 'Tutta l\'attività è tracciata tramite Report di Intervento rilasciato da Studio Summit e Planimetria Dispositivi aggiornata.', style: 'standardText' }
    ];

    // POS 004: BENESSERE (Testo completo)
    const POS_004_CONTENT =;

    // SEZIONE ALLEGATI
    const ALLEGATI_CONTENT = },
        // Placeholder per immagine statica (dovresti convertire le tue immagini in base64 per vederle qui)
        { text: '', alignment: 'center', margin: , color: 'gray' },
        
        { text: '2. Planimetria Pest Control', style: 'subHeader', margin:  },
        // Qui inseriamo l'immagine caricata dall'utente, se c'è
        planimetriaBase64? { image: planimetriaBase64, width: 500, alignment: 'center' } : { text: 'Nessuna planimetria caricata.', italics: true, alignment: 'center' },

        { text: '3. Infografica BCS (Body Condition Score)', style: 'subHeader', margin:  },
        { text: '', alignment: 'center', color: 'gray' }
    ];

    // DEFINIZIONE DEL DOCUMENTO FINALE
    var docDefinition = {
        // Metadati PDF
        info: {
            title: `Manuale Biosicurezza - ${dati.ragioneSociale}`,
            author: 'Studio Summit SRL'
        },
        
        // Layout Pagina
        pageSize: 'A4',
        pageMargins: , // Margini

        // Intestazione (Header) con Logo
        header: function(currentPage, pageCount) {
            return {
                columns: }
                ]
            };
        },

        // Piè di pagina (Footer) con numerazione
        footer: function(currentPage, pageCount) {
            return {
                columns: },
                    { text: `Pagina ${currentPage} di ${pageCount}`, alignment: 'right', fontSize: 8, margin:  }
                ]
            };
        },

        // Contenuto vero e proprio
        content:
            },
            {
                text: dati.ragioneSociale.toUpperCase(),
                style: 'coverSubtitle',
                alignment: 'center',
                pageBreak: 'after' // Va a pagina nuova dopo la copertina
            },

            // PAGINA 1: ANAGRAFICA
            { text: 'Scheda Anagrafica Aziendale', style: 'sectionHeader' },
            {
                style: 'tableExample',
                table: {
                    widths: ['30%', '70%'],
                    body:,
                        [{ text: 'Codice Aziendale', bold: true }, dati.codiceAziendale],
                       ,
                       ,
                        [{ text: 'P.IVA', bold: true }, dati.piva],
                        [{ text: 'Indirizzo Produttivo', bold: true }, dati.indirizzoProd],
                        [{ text: 'Veterinario Az.', bold: true }, dati.veterinario],
                       ,
                       
                },
                layout: 'lightHorizontalLines',
                margin: 
            },

            // INSERIAMO LE PROCEDURE (Srotoliamo gli array creati prima)
           ...POS_001_CONTENT,
           ...POS_002_CONTENT,
           ...POS_003_CONTENT,
           ...POS_004_CONTENT,
           ...ALLEGATI_CONTENT
        ],

        // Stili (Font, Colori, Dimensioni)
        styles: {
            coverTitle: { fontSize: 22, bold: true, color: '#004d40' },
            coverSubtitle: { fontSize: 18, bold: true, color: 'black' },
            sectionHeader: { fontSize: 16, bold: true, color: '#004d40', margin:  },
            subHeader: { fontSize: 13, bold: true, color: '#00796b', margin:  },
            standardText: { fontSize: 11, alignment: 'justify', margin:  },
            boldText: { fontSize: 11, bold: true, margin:  },
            listStyle: { margin:  },
            tableExample: { margin:  }
        },
        
        // Font di default (usiamo Roboto che è integrato e sicuro)
        defaultStyle: {
            font: 'Roboto'
        }
    };

    // 3. Generazione e Download
    pdfMake.createPdf(docDefinition).download(`Manuale_${dati.codiceAziendale}.pdf`);
}
