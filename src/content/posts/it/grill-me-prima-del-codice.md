---
title: "Grill me: le domande da fare prima di scrivere codice con l’AI"
description: "Come usare un confronto guidato per chiarire requisiti, vincoli e scelte prima di affidare un’implementazione a un agente di coding."
pubDate: 2026-10-11
lang: it
translationKey: grill-me-before-coding
urlSlug: grill-me-prima-del-codice
tags: [ai, coding, agentic-engineering]
author: Code Geeks
draft: true
---
Quando affidiamo un’attività di coding a un assistente AI, spesso descriviamo il risultato che vogliamo ottenere, ma lasciamo implicite le scelte che per noi sono scontate. L’assistente deve quindi colmare quei vuoti con delle ipotesi, che possono portare a un’implementazione diversa da quella che avevamo in mente.
Una richiesta come «aggiungi una funzione per importare un CSV» può sembrare chiara, ma lascia aperte molte domande: quali colonne accettare, come gestire righe errate o duplicati, e dove salvare i dati. Fondamentalmente c'è un disallineamento tra la richiesta e le decisioni che l’implementazione richiede. Quindi, l'agente che non ha ricevuto tutte le istruzioni necessarie, sbaglia, o meglio lo costringiamo a fare delle ipotesi.
Quando lavoriamo con un agente AI dobbiamo cambiare prospettiva, noi non stiamo più scrivendo codice, ma abbiamo un "team" che dobbiamo guidare e a cui dobbiamo spiegare tutte le decisioni che vogliamo vengano prese. Ovviamente questa attività richiede tempo e attenzione, perché bisogna pensare a tutte le possibili decisioni e a come queste influenzano il risultato finale. In questo articolo esploreremo come strutturare un confronto guidato con l’assistente AI, noto come **grill me**, per chiarire requisiti, vincoli e scelte prima di affidare l’implementazione a un agente di coding.

## Che cosa significa “grill me”

L’espressione significa, in questo contesto, «mettimi alla prova con domande approfondite». Il compito iniziale dell’assistente diventa esaminare l’idea, trovare le ambiguità e aiutarmi a scegliere tra alternative concrete.

Nel [repository di skill di Matt Pocock](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), `grill-me` richiama la skill `grilling`. La [procedura di grilling](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) organizza il confronto in turni e tiene conto delle dipendenze tra le decisioni: alcune domande diventano sensate solo dopo aver risolto quelle precedenti. Per ogni domanda propone anche una risposta consigliata, che l’utente può accettare o discutere. Per il lavoro sul codice, la skill [`grill-with-docs`](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md) affianca al confronto la definizione del linguaggio del progetto e la documentazione delle decisioni.
Il concetto fondamentale è che l'agente ha la conoscenza del codice e della documentazione, mentre l'utente ha la conoscenza del prodotto e delle scelte di design. Il confronto serve a far emergere le decisioni che non sono ancora state prese, così da poterle discutere e chiarire prima di scrivere codice.

## Perché una richiesta breve lascia scelte aperte

Consideriamo questa richiesta:

> Aggiungi un’importazione CSV per caricare i contatti.

Un’implementazione potrebbe funzionare perfettamente con un file di esempio e comportarsi in modo inatteso con i dati reali. Prima di scriverla, ci sono almeno quattro decisioni da prendere:

| Decisione | Domanda da chiarire | Conseguenza sul codice |
| --- | --- | --- |
| Formato | Quali colonne sono obbligatorie? | Validazione dell’intestazione e dei campi |
| Duplicati | Come riconosciamo un contatto già presente? | Regole di confronto e aggiornamento |
| Errori | Una riga errata blocca tutto il file? | Salvataggio parziale o annullamento completo |
| Risultato | Come comunichiamo ciò che è stato importato? | Riepilogo e diagnostica per l’utente |

Il prompt di partenza può essere breve. Il passaggio decisivo è renderne esplicite le conseguenze prima di trasformarlo in codice.

## Un esempio di confronto prima dell’implementazione

Immaginiamo di scegliere l’indirizzo email come identificativo del contatto. A quel punto diventa utile una domanda successiva:

> Se nel CSV compare un’email già presente, vuoi aggiornare il contatto, ignorare la riga oppure segnalare un errore?

Se scegliamo di aggiornare il contatto, si apre un’altra decisione:

> Un campo vuoto nel CSV deve cancellare il valore esistente oppure lasciarlo invariato?

Quest’ultima domanda dipende dalla precedente. Se avessimo deciso di ignorare i duplicati, non sarebbe necessaria per quel percorso.

L’esempio è illustrativo: non rappresenta una sessione eseguita né un risultato misurato. Mostra come una richiesta apparentemente semplice possa nascondere scelte sul comportamento del prodotto.

## Un prompt da cui partire

Questo è un esempio di istruzioni per avviare il confronto, da adattare al progetto:

```text
Voglio aggiungere un’importazione CSV per i contatti.

Prima di scrivere codice, aiutami a chiarire il progetto con un confronto
in stile “grill me”.

Esamina il codice e la documentazione disponibili per ricavare i fatti
che puoi verificare da solo. Chiedimi le decisioni sul comportamento
desiderato e sui vincoli che non puoi dedurre dal repository.

Organizza le domande in turni brevi. Per ogni domanda spiega quale scelta
serve, quali conseguenze ha e quale risposta consigli, con una motivazione.
Aspetta le mie risposte prima di porre domande che dipendono da esse.

Metti in discussione le mie ipotesi quando trovi contraddizioni o casi
non coperti. Distingui i fatti verificati dalle ipotesi ancora aperte.

Alla fine riepiloga requisiti, esclusioni, decisioni e criteri di
accettazione. Attendi la mia conferma del riepilogo prima di implementare.
```

La parte sul repository è particolarmente utile con un agente che può leggere i file. Se la validazione del CSV esiste già, dovrebbe esaminarla. Le domande all’utente possono così concentrarsi sulle scelte ancora aperte.

## Installare le skill

Entriamo nella parte pratica. Per seguire questo percorso dobbiamo prima installare il plugin che raccoglie le skill di Matt Pocock. Una **skill** contiene istruzioni per svolgere un’attività; il **plugin** distribuisce l’insieme delle skill nell’agente di coding.

Con Claude Code, eseguiamo nel terminale:

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

Con Codex, registriamo prima il marketplace, cioè il catalogo da cui installare il plugin, e poi aggiungiamo il plugin:

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

Questi sono i comandi indicati nel [README del progetto](https://github.com/mattpocock/skills#installation-30-second-setup). Le due procedure sono alternative in base all’agente utilizzato. Terminata l’installazione, verifichiamo che le skill siano disponibili nella sessione con cui lavoreremo.

Negli esempi seguenti uso la notazione `/nome-skill` del progetto. In Codex possiamo richiamare esplicitamente una skill scrivendo `$nome-skill` o selezionandola dal menu delle skill, come descritto nella [documentazione ufficiale](https://developers.openai.com/codex/skills). Per esempio, l’equivalente di `/grill-with-docs` è `$grill-with-docs`.

## Configurare il repository una volta

Apriamo l’agente nella directory del progetto. Per configurare le skill usiamo `/setup-matt-pocock-skills`, passando direttamente la proposta di configurazione mostrata qui sotto.

La [skill di setup](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md) esamina il repository, concorda dove gestire le issue e configura le convenzioni per documenti e, se prevista, classificazione dei ticket. Propone le modifiche prima di scriverle. Le istruzioni vengono collegate dal file `CLAUDE.md` o `AGENTS.md` già usato dal progetto, con i dettagli in `docs/agents/`.

Un **ticket**, o issue, è una singola unità di lavoro: descrive cosa ottenere, come verificarlo e da quali altre attività dipende. Io suggerisco di scegliere **Local Markdown** per conservare anche questi documenti nel repository. È una preferenza pratica per questo flusso: possiamo leggere e modificare tutto con gli stessi strumenti del codice, e l’agente può trovare i requisiti senza passare da un servizio esterno.

La [convenzione locale proposta dalla skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md) usa `.scratch/`. Il nome richiama uno spazio per appunti temporanei, anche se la directory non viene cancellata automaticamente. Io preferisco conservare specifiche e ticket sotto **`docs/features/`**, perché descrivono il progetto e la sua evoluzione e voglio mantenerli insieme al codice.

Suggerisco quindi di avviare il setup inviando **il comando e queste istruzioni nello stesso messaggio**. Possiamo copiare direttamente questa proposta:

```text
/setup-matt-pocock-skills Usiamo il tracker Local Markdown, con una convenzione personalizzata:
salva specifiche e ticket in docs/features/<feature-slug>/ anziché
in .scratch/<feature-slug>/.

Per ogni funzionalità usa spec.md per la specifica e issues/ per i ticket,
con un file numerato per ciascun ticket. Mantieni stato, dipendenze
e criteri di accettazione nei singoli ticket.

Registra questi percorsi in docs/agents/issue-tracker.md e richiama
la convenzione dal file di istruzioni del repository già in uso.
Quando una skill propone .scratch/, applica invece questa convenzione.
```

In questo modo l’agente conosce la nostra preferenza fin dall’avvio del setup. Prima di confermare le modifiche proposte, controlliamo che `docs/agents/issue-tracker.md` riporti i percorsi sotto `docs/features/`.

Per l’importazione CSV, la struttura suggerita diventa:

```text
docs/
├── agents/
│   └── issue-tracker.md
├── adr/
│   └── 0001-confine-importazione-contatti.md
└── features/
    └── import-contatti-csv/
        ├── spec.md
        └── issues/
            ├── 01-importazione-base.md
            └── 02-gestione-duplicati.md
```

Il setup definisce le convenzioni; specifica, ticket ed eventuali ADR arriveranno nei passaggi successivi. `docs/agents/issue-tracker.md` spiega all’agente dove trovare e aggiornare il lavoro; `docs/features/` raccoglie specifiche e ticket per funzionalità; `docs/adr/` conserva le decisioni architetturali. Il glossario resta nel `GLOSSARY.md` del progetto.

Questa è una personalizzazione dei percorsi predefiniti: alcune istruzioni delle skill citano esplicitamente `.scratch/`, quindi conviene ribadire la convenzione nelle richieste successive e controllare i percorsi dei file generati. Non serve modificare il plugin installato. Versioniamo questi documenti in Git e conserviamo anche i ticket conclusi, aggiornandone lo stato: restano utili per ricostruire cosa è stato richiesto, deciso e realizzato.

Il vantaggio cresce man mano che registriamo e aggiorniamo le decisioni. L’agente può ricostruire più facilmente il progetto nelle sessioni successive: i documenti sono una memoria consultabile, che va mantenuta allineata al codice.

## Avviare il confronto e conservare le decisioni

Dopo il setup possiamo partire con:

```text
/grill-with-docs Voglio aggiungere un’importazione CSV per i contatti.
```

Questa skill combina `grilling` e `domain-modeling`: mentre discutiamo il comportamento desiderato, l’agente chiarisce anche il significato dei termini usati. Prima di passare alle fasi successive, facciamoci riepilogare le decisioni e confermiamo di aver raggiunto una comprensione condivisa.

### Il glossario: il ruolo del vecchio CONTEXT.md

In esempi precedenti del progetto si incontra `CONTEXT.md`; oggi il documento di riferimento si chiama **`GLOSSARY.md`**. Il [README segnala il cambio di nome](https://github.com/mattpocock/skills#2-the-agent-is-way-too-verbose).

Il glossario definisce il linguaggio del dominio. Nel nostro esempio potrebbe spiegare che cosa intendiamo per *contatto*, *duplicato* e *importazione*. Serve a usare gli stessi concetti nelle conversazioni, nei documenti e nei nomi del codice. Non contiene la trascrizione della chat o il piano tecnico. La [skill di domain modeling](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) lo crea o aggiorna quando viene chiarito un termine.

### Gli ADR: che cosa abbiamo deciso e perché

Un **ADR**, *Architecture Decision Record*, registra una decisione architetturale e le ragioni che l’hanno motivata. Si conserva normalmente in un file numerato sotto `docs/adr/`, per esempio `0001-confine-importazione-contatti.md`.

Il suo valore è spiegare una scelta a chi leggerà il codice mesi dopo. Un esempio ipotetico: «Conserviamo specifiche e ticket come file Markdown nel repository, invece di usare GitHub Issues. In questo modo chi scarica il progetto trova insieme codice, requisiti e decisioni, e l’agente può consultarli senza accedere a servizi esterni. Accettiamo di rinunciare alle funzioni di assegnazione e notifica offerte da GitHub Issues.». Se esistevano alternative, possiamo annotare perché le abbiamo scartate e quali conseguenze accettiamo.

Il [formato previsto dalla skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md) può essere breve: contesto, decisione e motivazione. Gli ADR vengono proposti con criterio, per scelte costose da cambiare, poco comprensibili senza contesto e nate da un confronto tra alternative reali.

Quindi la sessione può aggiornare un glossario esistente e produrre uno o più ADR quando servono. Non garantisce la creazione di esattamente due file alla fine di ogni confronto.

## Trasformare il confronto in una specifica

Confermate le decisioni, suggerisco un passaggio ulteriore prima dell’implementazione:

```text
/to-spec

Segui docs/agents/issue-tracker.md: salva la specifica in
docs/features/import-contatti-csv/spec.md.
```

La [skill `to-spec`](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md) sintetizza la conversazione e la conoscenza del codice in una specifica: problema, soluzione, esigenze degli utenti, decisioni di implementazione, verifiche previste ed esclusioni. Chiarisce anche dove verificare il comportamento con i test e chiede conferma su questi punti.

Con la convenzione locale concordata durante il setup, la specifica viene scritta in `docs/features/import-contatti-csv/spec.md`. Da questo momento abbiamo un riferimento da rileggere e correggere prima di assegnare il lavoro.

Per il CSV, una regola verificabile potrebbe essere: «Se una riga contiene un’email non valida, nessun nuovo contatto viene salvato e il risultato indica la riga errata». Una frase così permette di valutare l’implementazione.

## Dividere il lavoro in ticket

Una specifica può richiedere più lavoro di quanto sia ragionevole affidare a una singola sessione. In quel caso usiamo:

```text
/to-tickets docs/features/import-contatti-csv/spec.md

Segui docs/agents/issue-tracker.md: salva un file per ticket in
docs/features/import-contatti-csv/issues/.
```

La [skill `to-tickets`](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md) propone attività piccole, ciascuna con un comportamento completo e verificabile, criteri di accettazione e dipendenze esplicite. Prima di salvarle ci chiede di approvare la suddivisione. Con il tracker locale crea un file Markdown per ogni ticket.

Per esempio, una possibile suddivisione illustrativa è:

| Ticket | Risultato verificabile | Dipende da |
| --- | --- | --- |
| 01 — Importazione base | Un CSV valido crea contatti e restituisce un conteggio | Nessuno |
| 02 — Duplicati | I contatti esistenti vengono ignorati e le ripetizioni interne segnalate | 01 |
| 03 — Errori e annullamento | Un file non valido non lascia contatti salvati parzialmente | 01 |

Ogni ticket comprende le verifiche del proprio comportamento. L’agente deve valutare sul codice se 02 e 03 siano davvero indipendenti: potrebbero modificare gli stessi punti e richiedere un ordine diverso. Per una modifica molto piccola può bastare un solo ticket.

## Scegliere il modello e preparare il passaggio di consegne

Per la fase di progettazione io suggerisco un modello di frontiera con buone capacità di ragionamento: deve individuare ambiguità, discutere alternative e controllare la coerenza delle decisioni. Per implementare ticket circoscritti possiamo valutare un modello più piccolo e meno costoso, verificandone i risultati. La documentazione riduce le scelte lasciate implicite; la difficoltà del ticket resta il criterio per scegliere il modello.

Suggerisco di mantenere la **chat del grill-me come chat madre** anche durante l’implementazione. Qui l’agente principale conserva il quadro delle decisioni, coordina il lavoro e raccoglie i risultati. L’implementazione dei singoli ticket viene invece affidata a subagent dedicati, ciascuno con un proprio contesto separato. A ogni subagent passiamo il ticket e i riferimenti a specifica, glossario e ADR pertinenti, così può concentrarsi sul proprio compito mentre la chat madre mantiene la visione d’insieme.

## Implementare con subagent dedicati

Un **subagent** è un agente a cui l’agente principale delega un compito delimitato e che restituisce il proprio risultato. Il suo contesto è separato da quello della chat madre; questo non significa necessariamente che parta senza informazioni della conversazione, perché ciò che eredita dipende dall’ambiente e dalla modalità di avvio. Per questo flusso chiediamo di fornirgli le istruzioni e i documenti necessari al ticket, evitando di trasferire tutta la discussione del grill-me. La [documentazione ufficiale di Codex](https://developers.openai.com/codex/subagents) spiega come la delega possa tenere esplorazioni e output intermedi fuori dalla conversazione principale. Modello e capacità disponibili vanno verificati nell’ambiente usato.

Per delegare un singolo ticket, chiediamo esplicitamente alla chat madre di avviare un subagent. Possiamo usare questo messaggio, sostituendo il segnaposto con un modello disponibile:

```text
Avvia un subagent dedicato per implementare il ticket
docs/features/import-contatti-csv/issues/01-importazione-base.md
usando il modello <nome-modello>.

Assegnagli il ticket e i riferimenti alla specifica
docs/features/import-contatti-csv/spec.md, al glossario e agli ADR pertinenti.
Chiedigli di seguire la skill implement per quel ticket, inclusi i test
e la code review previsti. Non trasferire l’intera conversazione del grill-me.

Mantieni questa chat come coordinamento: attendi il risultato del subagent,
controlla che soddisfi i criteri di accettazione e riportami modifiche,
verifiche eseguite ed eventuali problemi aperti.
Se l’ambiente non supporta la delega, il modello richiesto o l’avvio senza
ereditare l’intera cronologia, segnalalo prima di procedere.
```

La richiesta «avvia un subagent» rende esplicita la delega. Scrivere soltanto `/implement docs/features/import-contatti-csv/issues/01-importazione-base.md` chiede invece all’agente corrente di usare la skill: quel comando, da solo, non assegna l’implementazione a un altro agente.

La [skill `implement`](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md) prevede sviluppo guidato dai test dove possibile, controlli durante il lavoro, suite completa e code review finale. Prevede anche un commit sul branch corrente: se vogliamo gestire i commit personalmente, specifichiamolo nella richiesta.

Per coordinare l’intera specifica esiste invece [`implement-spec`](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement-spec/SKILL.md). Legge le dipendenze tra ticket, usa subagent con branch e worktree separati e riunisce il lavoro in un branch di integrazione. Un **worktree** è una directory di lavoro Git separata: consente agli agenti di modificare i file senza usare la stessa copia di lavoro.

Nella stessa chat del grill-me possiamo dare un’istruzione di questo tipo, sostituendo il segnaposto con un modello disponibile:

```text
/implement-spec docs/features/import-contatti-csv/spec.md

Leggi la specifica, i ticket in docs/features/import-contatti-csv/issues/,
il glossario e gli ADR pertinenti.

Mantieni questa chat come coordinamento e delega ogni ticket a un subagent
dedicato, usando il modello <nome-modello>. Passa a ciascun subagent il ticket
e i documenti necessari, evitando di includere l’intera conversazione
del grill-me quando l’ambiente lo consente.

Se la delega o il modello richiesto non sono disponibili, segnalalo
prima di procedere.

Avvia in parallelo solo i ticket le cui dipendenze sono già risolte.
Integra i risultati, esegui le verifiche sull’insieme delle modifiche
e completa la code review prevista dalla skill, correggendo i problemi emersi.

Alla fine riporta i ticket conclusi, i test eseguiti e gli eventuali
problemi ancora aperti.
```

La skill coordina i ticket che possono partire, avviandone altri quando le dipendenze sono risolte. Il parallelismo aiuta quando il lavoro è separabile; l’integrazione deve comunque risolvere i conflitti e verificare il comportamento complessivo.

È preferibile richiamare queste skill esplicitamente: `implement` e `implement-spec` sono dichiarate come skill da invocare su richiesta dell’utente. Scrivere soltanto «implementa i vari ticket» non garantisce l’attivazione della procedura documentata.

## Code review e prova sul risultato reale

La [skill `code-review`](https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md) separa due controlli: il rispetto degli standard del repository e la corrispondenza tra codice e specifica. Per entrambi serve un riferimento chiaro delle modifiche da esaminare, per esempio il commit precedente all’implementazione, oltre alla specifica approvata.

**La review è già prevista nel flusso di implementazione:** `implement` richiama `code-review` al termine del lavoro, prima del commit; `implement-spec` la richiama sul branch di integrazione quando tutti i ticket sono completati e prevede la correzione dei problemi emersi. Non serve quindi avviarla di nuovo se è già stata eseguita sull’intero risultato.

Possiamo comunque richiamarla esplicitamente, per esempio per una revisione successiva. Nella chat madre scriviamo:

```text
/code-review

Esamina le modifiche tra <commit-prima-dell-implementazione> e HEAD.
Usa docs/features/import-contatti-csv/spec.md e i ticket associati
come riferimento per il comportamento richiesto.

Riporta separatamente le violazioni degli standard del repository
e le differenze rispetto alla specifica, indicando i punti del codice
coinvolti e il requisito o la regola di riferimento.
```

Sostituiamo `<commit-prima-dell-implementazione>` con l’identificativo Git annotato prima di iniziare il lavoro. Il confronto deve includere tutti i commit della funzionalità: usare soltanto quello precedente a `HEAD` potrebbe escludere parte dell’implementazione. Questo esempio riguarda le modifiche già presenti nei commit; se ci sono anche modifiche non committate, chiediamo esplicitamente di includerle nella review.

Prima di considerare concluso il lavoro dobbiamo leggere i risultati, far correggere i problemi emersi e provare la funzionalità. I test automatizzati devono già essere parte dell’implementazione; la nostra verifica sul prodotto completa quel lavoro.

Per l’importazione CSV, proviamo un file valido, un contatto già presente, email ripetute e una riga errata. Controlliamo sia il messaggio restituito sia i dati effettivamente salvati, verificando anche che un tentativo fallito non lasci modifiche parziali. La chiusura dei ticket deve corrispondere a un risultato che sappiamo osservare e accettare.

## Quando usarlo e quali limiti ha

Questo approccio è utile quando una modifica coinvolge regole di prodotto, gestione dei dati, integrazioni o scelte difficili da cambiare in seguito.
Per correggere un refuso o una modifica già definita nei dettagli, una richiesta diretta può essere sufficiente.

L’assistente può inoltre suggerire una scelta sbagliata, trascurare un requisito o presentare un’ipotesi con troppa sicurezza. Il confronto aiuta a rendere visibili le decisioni; la qualità del codice va comunque verificata con test, revisione e controlli appropriati al progetto.

Prima di chiedere all’AI di implementare una funzione, vale quindi la pena capire quali decisioni le stiamo affidando. Una sessione di “grill me” può trasformare un’idea ancora vaga in un insieme di scelte che sappiamo spiegare e verificare.
