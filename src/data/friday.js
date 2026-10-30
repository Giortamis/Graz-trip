import { at, visit, route, slot, leg, walk, status, makeBlock, JAKO, BUS_STOP, OPER, SCHWEDEN, LIFT, transportSource, grazSource } from './model.js'

export default [
  makeBlock('fri-graz', 'Graz · Ιστορικό κέντρο → Schlossberg → γεύμα', [
    visit('22','breakfast','08:30','09:30','meal','Πρωινό / καφές','Στο Motel One ή κοντά. Χαλαρή χειμερινή εκκίνηση.', ['motel-one'],{icon:'☕',category:'food',disableAutoNavigation:true,hideActions:true}),
    route('22','motel-hauptplatz','09:30','09:38','Motel One -> Hauptplatz','Από το Motel One περπατάμε προς την κεντρική πλατεία του Graz.', 'motel-one','graz-hauptplatz',[
      walk('Motel One Graz, Jakominiplatz 7, Graz','Hauptplatz, 8010 Graz, Austria','Περίπου 7–8′'),
    ]),
    visit('22','hauptplatz','09:38','09:53','activity','Hauptplatz','Η κεντρική ιστορική πλατεία με Rathaus και ιστορικές προσόψεις.', ['graz-hauptplatz'],{category:'sightseeing',hideMaps:true}),
    route('22','hauptplatz-landhaus','09:53','09:57','Hauptplatz -> Herrengasse / Landhaushof','Περπατάμε από το Hauptplatz μέσω Herrengasse προς το Landhaushof.', 'graz-hauptplatz','graz-landhaus',[
      walk('Hauptplatz, 8010 Graz, Austria','Landhaushof, Herrengasse 16, 8010 Graz, Austria','Περίπου 4′ με τα πόδια'),
    ]),
    visit('22','landhaus','09:57','10:13','activity','Herrengasse + Landhaushof','Περπατάμε στον βασικό ιστορικό δρόμο της πόλης και μπαίνουμε στην αναγεννησιακή αυλή. Κρατάμε σύντομη επίσκεψη για να συνεχίσουμε στην ώρα μας.', ['herrengasse','graz-landhaus'],{category:'sightseeing'}),
    route('22','landhaus-cathedral','10:13','10:18','Landhaushof -> Graz Cathedral','Από το Landhaushof πηγαίνουμε με τα πόδια προς τον καθεδρικό.', 'graz-landhaus','graz-dom',[
      walk('Landhaushof, Herrengasse 16, 8010 Graz, Austria','Grazer Dom, Bürgergasse 1, 8010 Graz, Austria','Περίπου 5′ με τα πόδια'),
    ]),
    visit('22','cathedral-quarter','10:18','10:48','activity','Graz Cathedral','Καθεδρικός, αυτοκρατορικό μαυσωλείο και διπλή ελικοειδής σκάλα της Burg. Σύντομο πέρασμα: τον Ιανουάριο το Mausoleum προβλέπεται εξωτερικά. Εσωτερική είσοδος απαιτεί προηγούμενη συνεννόηση.', ['graz-dom','graz-mausoleum','graz-staircase'],{category:'sightseeing',includedPlaces:['Mausoleum Ferdinand II','Double Spiral Staircase'],statuses:[status('VERIFY · MAUSOLEUM')],note:'Χειμερινό ωράριο Mausoleum: δεν υπάρχει κανονική λειτουργία. Δεν προσθέτουμε χρόνο ή άλλο αξιοθέατο.'}),
    route('22','to-lift','10:48','11:03','Graz Cathedral area -> Schloßbergplatz','Από την περιοχή του καθεδρικού κατεβαίνουμε προς την κάτω είσοδο του Schlossberglift.', 'graz-staircase',LIFT,[
      walk('Doppelwendeltreppe, Hofgasse 15, Graz',LIFT,'Περίπου 15′ με τα πόδια'),
    ]),
    route('22','lift-up','11:03','11:08','Schloßbergplatz -> Uhrturm','Ανεβαίνουμε στον Schlossberg με το ασανσέρ Schlossberglift — όχι από τις σκάλες.', LIFT,'graz-uhrturm',[
      leg('Schlossberglift','Uhrturm',LIFT,'Uhrturm, Am Schlossberg, Graz','Lift ~30″ + μικρή αναμονή / προσέγγιση','lift'),
    ],{icon:'⬆️'}),
    visit('22','schlossberg','11:08','11:43','activity','Schlossberg + Uhrturm','Το εμβληματικό σημείο του Graz με πανοραμική θέα. Μένουμε επάνω περίπου 35′.', ['graz-uhrturm'],{category:'sightseeing',icon:'⭐'}),
    route('22','lift-down','11:43','11:48','Uhrturm -> Schloßbergplatz','Κατεβαίνουμε ξανά με το ασανσέρ Schlossberglift.', 'graz-uhrturm',LIFT,[
      leg('Schlossberglift','Schloßbergplatz','Uhrturm, Am Schlossberg, Graz',LIFT,'Lift ~30″ + μικρή αναμονή / προσέγγιση','lift'),
    ],{icon:'⬇️'}),
    route('22','lift-murinsel','11:48','11:53','Schloßbergplatz -> Murinsel','Από την έξοδο του lift περπατάμε προς τη Murinsel.', LIFT,'murinsel',[
      walk(LIFT,'Murinsel, Lendkai 19, 8020 Graz, Austria','Περίπου 5′ με τα πόδια'),
    ]),
    visit('22','murinsel','11:53','12:13','activity','Murinsel','Μοντέρνα μεταλλική νησίδα μέσα στον Mur, σχεδιασμένη ως πλατφόρμα και χώρος εκδηλώσεων.', ['murinsel'],{category:'sightseeing',icon:'🌉'}),
    route('22','murinsel-kunsthaus','12:13','12:16','Murinsel -> Kunsthaus Graz','Περνάμε από τη Murinsel προς το Kunsthaus στην απέναντι όχθη.', 'murinsel','kunsthaus',[
      walk('Murinsel, Lendkai 19, 8020 Graz, Austria','Kunsthaus Graz, Lendkai 1, 8020 Graz, Austria','Περίπου 2–3′ με τα πόδια'),
    ]),
    visit('22','kunsthaus','12:16','12:31','activity','Kunsthaus Graz','Φουτουριστικό μουσείο σύγχρονης τέχνης. Στο κοινό πρόγραμμα βλέπουμε κυρίως το ιδιαίτερο κτίριο εξωτερικά.', ['kunsthaus'],{category:'sightseeing',icon:'🎨'}),
    route('22','steirer-buffer','12:31','13:00','Kunsthaus Graz -> Der Steirer','Πηγαίνουμε με τα πόδια προς το Der Steirer. Το υπόλοιπο slot λειτουργεί ως περιθώριο πριν από την κράτηση στις 13:00.', 'kunsthaus','der-steirer',[
      walk('Kunsthaus Graz, Lendkai 1, Graz','Der Steirer, Belgiergasse 1, Graz','Περίπου 10–12′ με τα πόδια· το υπόλοιπο διάστημα είναι buffer'),
    ],{durationLabel:'29′ μαζί με χρονικό περιθώριο'}),
    visit('22','steirer','13:00','13:40','meal','Der Steirer','Παραδοσιακή στυριακή κουζίνα. Επιλογή: Backhendl, το χαρακτηριστικό τραγανό τηγανητό κοτόπουλο. Απαραίτητη κράτηση και ενημέρωση ότι ακολουθεί τρένο.', ['der-steirer'],{category:'food',icon:'🍗',statuses:[status('RESERVE')]}),
    route('22','motel-return','13:40','13:50','Επιστροφή Motel One','Επιστρέφουμε για τις αποσκευές. Προτιμάμε περπάτημα για σταθερή διαδρομή, χωρίς αναμονή τραμ.', 'der-steirer','motel-one',[walk('Der Steirer, Belgiergasse 1, Graz','Motel One Graz, Jakominiplatz 7, Graz','Περίπου 10′· το slot είναι σύντομο')]),
    visit('22','luggage','13:50','14:00','activity','Αποσκευές / τελικό μάζεμα','Παραλαμβάνουμε τις αποσκευές και ελέγχουμε ότι είμαστε έτοιμοι για τον σταθμό.', ['motel-one'],{icon:'🧳',category:'hotel'}),
    visit('22','checkout','14:00',null,'activity','Late check-out — μόνο αν επιβεβαιωθεί','Το 14:00 ισχύει ΜΟΝΟ με επιβεβαίωση Motel One. Διαφορετικά: standard checkout έως 12:00, checkout από το πρωί και αποθήκευση αποσκευών στη reception· επιβεβαιώνουμε τους όρους φύλαξης με το ξενοδοχείο.', ['motel-one'],{icon:'✅',category:'hotel',durationLabel:'Σημείο ελέγχου',statuses:[status('CONFIRM')]}),
  ], 'START στο πρωινό. Πριν φύγουμε επιβεβαιώνουμε checkout/αποσκευές, ώστε να μη χρειαστεί επιστροφή στις 12:00.'),
  makeBlock('fri-train', 'Graz → Βιέννη · RJ 753', [
    route('22','to-hbf','14:05','14:20','Jakominiplatz → Graz Hbf','Κρατάμε το μεγάλο περιθώριο πριν από το τρένο. Περιλαμβάνεται η μικρή προσέγγιση στη στάση.', 'motel-one','graz-hbf',[leg('Tram 4','Reininghaus',JAKO,'Graz Hauptbahnhof, Europaplatz, Graz','15′ door-to-door διαθέσιμα')],{source:grazSource}),
    visit('22','station-buffer','14:20','14:50','activity','Graz Hbf — χρόνος ασφαλείας','Αποβάθρα, WC, καφές και έλεγχος πίνακα αναχωρήσεων. Μέχρι τις 14:50 είμαστε στην αποβάθρα· αναχώρηση 15:00.', ['graz-hbf'],{icon:'🚆',category:'train'}),
    route('22','rj753','15:00','17:36','RJ 753 — Graz Hbf → Wien Hbf','Απευθείας Railjet, το επιλεγμένο δρομολόγιο προς Βιέννη. Η ώρα διατηρείται από το πρόγραμμά σας· απαιτείται τελικός επανέλεγχος του timetable 2027.', 'graz-hbf','wien-hbf',[leg('RJ 753','Wien Hbf','Graz Hauptbahnhof, Graz','Wien Hauptbahnhof, Wien','2 ώρες 36′ · χωρίς αλλαγή')],{icon:'🚆',category:'train',typeLabel:'ΤΡΕΝΟ',fixedStart:at('22','15:00'),statuses:[status('TRAIN','info'),status('RECHECK TIMETABLE')],source:'https://www.oebb.at/'}),
    route('22','to-ananas','17:36','18:05','Wien Hbf → Hotel Ananas','Λεωφορείο χωρίς U-Bahn και χωρίς αλλαγή. Έξοδος από τον σταθμό, αναμονή και περίπου 3′ περπάτημα έως την είσοδο του ξενοδοχείου.', 'wien-hbf','ananas',[leg('13A','Alser Straße / Skodagasse','Hauptbahnhof, Wien',BUS_STOP,'Περίπου 16–17′ στο bus + αναμονή + ~3′ περπάτημα')],{icon:'🚌',source:transportSource}),
    visit('22','ananas-checkin','18:05','18:20','activity','Austria Trend Hotel Ananas Wien — Check-in','Κλειδωμένη διαμονή 22/01 → 24/01. Rechte Wienzeile 93–95, είσοδος Sonnenhofgasse 8–10.', ['ananas'],{icon:'🏨',category:'hotel',statuses:[status('BOOKED','success')]}),
  ], 'START στην έξοδο από το Motel One. Το RJ 753 στις 15:00 παραμένει σταθερό.'),
  makeBlock('fri-vienna', 'Βιέννη · Ringstrasse → παγωτό → ελεύθερος χρόνος', [
    route('22','to-oper','18:30','18:45','Hotel Ananas → Oper/Karlsplatz','Bus αντί U4 προς το κέντρο, λόγω της περιορισμένης προσβασιμότητας της Pilgramgasse.', 'ananas',OPER,[walk('Hotel Ananas, Sonnenhofgasse 8–10, Wien',BUS_STOP,'Σύντομη προσέγγιση στη στάση'),leg('59A','Oper / Karlsplatz',BUS_STOP,OPER,'Περίπου 9′ στο bus· 15′ συνολικό slot με περπάτημα/αναμονή')],{icon:'🚌',source:transportSource}),
    visit('22','ring','18:50','19:20','route','Ringstrasse με τραμ','Mini sightseeing χωρίς πολύ περπάτημα: Vienna State Opera, Hofburg, Parliament, Rathaus και Burgtheater. Διορθώνεται μόνο η γραμμή: 1 προς Prater Hauptallee, ώστε να περάσουμε από το δυτικό και βόρειο τόξο του Ring προς Schwedenplatz.', ['opera','hofburg','parliament','rathaus','burgtheater'],{icon:'🚋',category:'transport',typeLabel:'ΔΙΑΔΡΟΜΗ',origin:OPER,destination:SCHWEDEN,mode:'transit',statuses:[status('ΓΡΑΜΜΗ 1 · ΔΙΟΡΘΩΣΗ','info')],legs:[leg('Tram 1','Prater Hauptallee',OPER,SCHWEDEN,'Περίπου 18–20′ στο τραμ, μέσα στο 30λεπτο με αναμονή')],note:'Η 2 προς Friedrich-Engels-Platz, μετά την Oper, κινείται προς Schwarzenbergplatz / Stubentor και δεν περνά από Rathaus και Κοινοβούλιο. Ίδιο slot 18:50–19:20.',source:transportSource}),
    route('22','to-icecream','19:20','19:30','Schwedenplatz → Eis-Greissler','Σύντομη διαδρομή μέσα στο ιστορικό κέντρο.', SCHWEDEN,'eis-greissler',[walk(SCHWEDEN,'Eis-Greissler, Rotenturmstraße 14, Wien','Περίπου 5–7′')]),
    visit('22','icecream','19:30','19:50','meal','Eis-Greissler — Rotenturmstraße 14','Αυστριακό παγωτό με τοπικές γεύσεις. Το ακριβές χειμερινό ωράριο για 22/01/2027 δεν έχει επιβεβαιωθεί. Αν είναι κλειστό, περνάμε απευθείας σε ελεύθερο χρόνο, χωρίς αλλαγή του υπόλοιπου προγράμματος.', ['eis-greissler'],{icon:'🍨',category:'food',statuses:[status('VERIFY OPENING')]}),
    slot('22','free','19:50',null,'free','FREE TIME','Ποτό, φαγητό, βόλτα ή ξεκούραση. Επιστροφή στο ξενοδοχείο με U-Bahn/bus ανάλογα με το πού βρίσκεται ο καθένας.',{scheduleLabel:'μετά ~19:50',durationLabel:'Ελεύθερη διάρκεια',disableNavigation:true,category:'free'}),
  ], 'START όταν βγούμε από το Hotel Ananas. Οι χρόνοι συγκοινωνίας είναι εκτιμήσεις, όχι live αναχωρήσεις.'),
]

