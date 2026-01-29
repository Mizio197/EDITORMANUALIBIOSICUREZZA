// Variabile per salvare la planimetria caricata dall'utente
let planimetriaBase64 = null;

// Gestione del caricamento immagine Planimetria
const fileInput = document.getElementById('planimetriaFile');
if (fileInput) {
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                planimetriaBase64 = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Funzione principale chiamata dal bottone nell'HTML
function generaPDF() {
    // 1. Recuperiamo i dati inseriti nel form
    // Nota: Usiamo || (due stanghette) per dire "oppure usa la sede legale"
    const dati = {
        ragioneSociale: document.getElementById('ragioneSociale').value,
        codiceAziendale: document.getElementById('codiceAziendale').value,
        sedeLegale: document.getElementById('sedeLegale').value,
        sedeOperativa: document.getElementById('sedeOperativa').value || document.getElementById('sedeLegale').value,
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

    // --- TESTI MANUALI ---
    // Ho corretto la sintassi degli array che risultavano tagliati

    // POS 001: VISITATORI
    const POS_001_CONTENT = [
        { text: 'Procedura Operativa Standard 001: Gestione Visitatori', style: 'sectionHeader' },
        { ul: [
            'Ogni ingresso deve essere tracciato sul Registro Visitatori indicando data, nome, motivo visita e dichiarazione rischio.'
        ], style: 'listStyle' },
        { text: '4. Comportamento e Cartellonistica', style: 'subHeader' },
        { text: 'I visitatori devono essere sempre accompagnati e rispettare la "Marcia in Avanti" (dal pulito allo sporco). È vietato toccare animali se non autorizzati. All\'ingresso è affisso il cartello "ZONA A BIOSICUREZZA CONTROLLATA" (Vedi Allegati).', style: 'standardText' }
    ];

    // POS 002: QUARANTENA (Placeholder ricostruito)
    const POS_002_CONTENT = [
        { text: 'Procedura Operativa Standard 002: Quarantena', style: 'sectionHeader' },
        { text: 'Le procedure di quarantena prevedono l\'isolamento dei capi per il periodo stabilito dalla normativa vigente.', style: 'standardText' }
    ];

    // POS 003: PEST MANAGEMENT
    const POS_003_CONTENT = [
        { text: 'Procedura Operativa Standard 003: Pest Control', style: 'sectionHeader' },
        { text: `Frequenza controlli: ${testoFrequenza} (${numeroVisite} interventi annui).`, style: 'standardText' },
        { text: 'Disinfestazione Insetti: Trattamenti stagionali (Primavera-Estate) con piretroidi a bassa tossicità nelle aree esterne.', style: 'standardText' },
        { text: '4. Documentazione', style: 'subHeader' },
        { text: 'Tutta l\'attività è tracciata tramite Report di Intervento rilasciato da Studio Summit e Planimetria Dispositivi aggiornata.', style: 'standardText' }
    ];

    // POS 004: BENESSERE (Placeholder ricostruito)
    const POS_004_CONTENT = [
        { text: 'Procedura Operativa Standard 004: Benessere Animale', style: 'sectionHeader' },
        { text: 'Rispetto dei criteri di benessere animale secondo checklist CReNBA.', style: 'standardText' }
    ];

    // SEZIONE ALLEGATI
    const ALLEGATI_CONTENT = [
        { text: 'ALLEGATI', style: 'sectionHeader', pageBreak: 'before' },
        
        { text: '2. Planimetria Pest Control', style: 'subHeader', margin: [0, 10, 0, 5] },
        // Logica condizionale: se c'è l'immagine la usa, altrimenti mette il testo
        planimetriaBase64 ? 
            { image: planimetriaBase64, width: 500, alignment: 'center' } : 
            { text: 'Nessuna planimetria caricata.', italics: true, alignment: 'center', margin: [0, 20, 0, 20] },

        { text: '3. Infografica BCS (Body Condition Score)', style: 'subHeader', margin: [0, 10, 0, 5] },
        { text: '[Spazio per Infografica BCS]', alignment: 'center', color: 'gray' }
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
        pageMargins: [40, 60, 40, 60], // [sinistra, sopra, destra, sotto]

        // Intestazione (Header)
        header: function(currentPage, pageCount) {
            return {
                columns: [
                    { text: 'STUDIO SUMMIT S.R.L. - Manuale Operativo', alignment: 'center', color: 'gray', margin: [0, 20, 0, 0] }
                ]
            };
        },

        // Piè di pagina (Footer)
        footer: function(currentPage, pageCount) {
            return {
                columns: [
                    { text: `Pagina ${currentPage} di ${pageCount}`, alignment: 'right', fontSize: 8, margin: [0, 0, 40, 0] }
                ]
            };
        },

        // Contenuto vero e proprio
        content: [
            {
                text: 'MANUALE DI BIOSICUREZZA E BENESSERE',
                style: 'coverTitle',
                alignment: 'center',
                margin: [0, 100, 0, 20]
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
                    body: [
                        [{ text: 'Ragione Sociale', bold: true }, dati.ragioneSociale],
                        [{ text: 'Codice Aziendale', bold: true }, dati.codiceAziendale],
                        [{ text: 'Sede Legale', bold: true }, dati.sedeLegale],
                        [{ text: 'Sede Operativa', bold: true }, dati.sedeOperativa],
                        [{ text: 'P.IVA', bold: true }, dati.piva],
                        [{ text: 'Indirizzo Produttivo', bold: true }, dati.indirizzoProd],
                        [{ text: 'Veterinario Az.', bold: true }, dati.veterinario],
                        [{ text: 'Resp. Biosicurezza', bold: true }, dati.respBiosicurezza],
                        [{ text: 'Resp. Benessere', bold: true }, dati.respBenessere]
                    ]
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 20]
            },

            // INSERIAMO LE PROCEDURE
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
            sectionHeader: { fontSize: 16, bold: true, color: '#004d40', margin: [0, 10, 0, 10] },
            subHeader: { fontSize: 13, bold: true, color: '#00796b', margin: [0, 10, 0, 5] },
            standardText: { fontSize: 11, alignment: 'justify', margin: [0, 0, 0, 5] },
            listStyle: { margin: [0, 0, 0, 10] },
            tableExample: { margin: [0, 5, 0, 15] }
        },
        
        defaultStyle: {
            font: 'Roboto'
        }
    };

    // --- COMANDO FINALE FONDAMENTALE ---
    // Questo è quello che mancava: crea e scarica il PDF!
    pdfMake.createPdf(docDefinition).download('Manuale_Biosicurezza.pdf');
}
