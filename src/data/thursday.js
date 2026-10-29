import { at, visit, route, slot, leg, walk, status, makeBlock, JAKO, STADIUM_STOP, grazSource } from './model.js'

export default [
  makeBlock('thu-arrival', 'Μετάβαση · Ηράκλειο → Βιέννη → Graz', [
    slot('21','flight','05:00','10:00','fixed','Ηράκλειο → Αθήνα','Πρώτο αεροπορικό σκέλος του ταξιδιού. Αναχώρηση 06:00 ώρα Ελλάδας από Ηράκλειο προς Αθήνα.', {
      icon:'✈️', category:'flight', fixedStart:'2027-01-21T06:00:00+02:00', timeZone:'Europe/Athens', scheduleLabel:'06:00 Ελλάδας', durationLabel:'1ο αεροπορικό σκέλος', disableNavigation:true,
      legs:[leg('Πτήση','Αθήνα','Heraklion Airport (HER)','Athens International Airport (ATH)','Ώρες σύμφωνα με το αεροπορικό εισιτήριο','flight')],
    }),
    visit('21','airport-arrival','10:00','12:02','activity','Αθήνα → Βιέννη','Δεύτερο αεροπορικό σκέλος του ταξιδιού. Άφιξη στη Βιέννη περίπου στις 10:00 ώρα Αυστρίας, παραλαβή αποσκευών και μετάβαση στον Flughafen Wien Bahnhof μέσα στο αεροδρόμιο.', ['vienna-airport'], {
      icon:'✈️', scheduleLabel:'Άφιξη ~10:00', durationLabel:'Περιθώριο έως 12:02 · αποσκευές + περπάτημα 5–10′',
      legs:[leg('Πτήση','Βιέννη','Athens International Airport (ATH)','Vienna Airport (VIE)','Ώρες σύμφωνα με το αεροπορικό εισιτήριο','flight'),walk('Vienna Airport arrivals, 1300 Schwechat','Flughafen Wien Bahnhof, 1300 Schwechat','Περίπου 5–10′ από τις αφίξεις· αποσκευές επιπλέον')],
    }),
    route('21','rj750','12:02','15:00','RJ 750 — Flughafen Wien Bahnhof → Graz Hbf','Απευθείας Railjet. FLEX / Standard Group ticket: άλλο επιτρεπόμενο ÖBB τρένο μόνο σύμφωνα με τους όρους του εισιτηρίου. Η κράτηση θέσεων ισχύει αποκλειστικά για RJ 750. Τελικός επανέλεγχος timetable πριν το ταξίδι.', 'Flughafen Wien Bahnhof, 1300 Schwechat','graz-hbf',[
      leg('RJ 750','Graz Hbf','Flughafen Wien Bahnhof, 1300 Schwechat','Graz Hauptbahnhof, Europaplatz 4, Graz','2 ώρες 58′ · χωρίς αλλαγή'),
    ],{icon:'🚆', category:'train', typeLabel:'ΤΡΕΝΟ', fixedStart:at('21','12:02'), statuses:[status('TRAIN / FLEX','info'),status('RECHECK TIMETABLE')], source:'https://www.oebb.at/'}),
  ], 'START στην αναχώρηση. Η ώρα της πτήσης είναι Ελλάδας· οι υπόλοιπες ώρες του προγράμματος είναι Αυστρίας.'),
  makeBlock('thu-match', 'Graz · Ξενοδοχείο → γεύμα → ΟΦΗ ⚽', [
    route('21','graz-transfer','15:00','15:20','Graz Hbf → Jakominiplatz','Κατευθείαν προς το ξενοδοχείο. Το slot περιλαμβάνει έξοδο από τον σταθμό, αναμονή και τραμ.', 'graz-hbf',JAKO,[leg('Tram 4','Liebenau/MURPARK','Graz Hauptbahnhof, Europaplatz, Graz',JAKO,'Περίπου 10′ στο τραμ + αναμονή / προσέγγιση')],{source:grazSource}),
    visit('21','motel-checkin','15:20','15:30','activity','Motel One Graz — Check-in','Κλειδωμένη διαμονή 21/01 → 22/01. Το ξενοδοχείο βρίσκεται πάνω στον συγκοινωνιακό κόμβο.', ['motel-one'],{icon:'🏨',category:'hotel',statuses:[status('BOOKED','success')],legs:[walk(JAKO,'Motel One Graz, Jakominiplatz 7, Graz','Περίπου 1–2′ από τη στάση, μέσα στο slot check-in')]}),
    visit('21','stainzerbauer','15:35','16:20','meal','Gasthaus Stainzerbauer','Παραδοσιακό αυστριακό/στυριακό Gasthaus. Πρόταση: Kürbiscremesuppe με στυριακό Kürbiskernöl. Κράτηση και γρήγορη εξυπηρέτηση, επειδή ακολουθεί ο αγώνας.', ['stainzerbauer'],{category:'food',statuses:[status('RESERVE')],origin:'Motel One Graz, Jakominiplatz 7, Graz',legs:[walk('Motel One Graz, Jakominiplatz 7, Graz','Gasthaus Stainzerbauer, Bürgergasse 4, Graz','Περίπου 5–6′ πριν το γεύμα')]}),
    visit('21','motel-change','16:20','16:35','activity','Επιστροφή Motel One / αλλαγή','Σύντομη προετοιμασία για τον αγώνα. Το 15λεπτο περιλαμβάνει επιστροφή και αλλαγή.', ['motel-one'],{icon:'🏨',category:'hotel',legs:[walk('Gasthaus Stainzerbauer, Bürgergasse 4, Graz','Motel One Graz, Jakominiplatz 7, Graz','Περίπου 5–6′ + αλλαγή')]}),
    route('21','stadium-tram','16:40','17:00','Αναχώρηση για Stadion Liebenau','Απευθείας από Jakominiplatz στο γήπεδο. Κρατάμε χρόνο για προσέγγιση και πιθανό συνωστισμό.', 'motel-one','stadium',[leg('Tram 4','Liebenau/MURPARK',JAKO,STADIUM_STOP,'Περίπου 12–15′ με αναμονή, συν τελική προσέγγιση')],{scheduleLabel:'~16:40–17:00',source:grazSource}),
    visit('21','stadium-arrival','17:00','18:45','activity','Άφιξη στο γήπεδο','Περίπου 1 ώρα και 45′ πριν τη σέντρα για έλεγχο εισιτηρίων, είσοδο και εύρεση θέσης. Θύρα και πρόσβαση φιλοξενούμενων: ακολουθούμε το εισιτήριο και τις οδηγίες της διοργάνωσης.', ['stadium'],{icon:'🏟️',category:'match',scheduleLabel:'~17:00',durationLabel:'Περιθώριο ~1 ώρα 45′ έως τη σέντρα'}),
    visit('21','ofi','18:45','20:45','fixed','STURM GRAZ – ΟΦΗ','ΠΡΩΤΗ ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΤΟΥ ΤΑΞΙΔΙΟΥ. Η ώρα έναρξης επιβεβαιώνεται από το δημοσιευμένο πρόγραμμα της Sturm Graz. Η λήξη και η έξοδος είναι κατά προσέγγιση.', ['stadium'],{icon:'⚽',category:'match',typeLabel:'ΑΓΩΝΑΣ',fixedStart:at('21','18:45'),scheduleLabel:'18:45',durationLabel:'≈2 ώρες · η πραγματική λήξη μπορεί να διαφέρει',statuses:[status('MAIN EVENT','main')]}),
    route('21','stadium-return','20:45','21:20','Επιστροφή στο Motel One','Μετά τον αγώνα επιστρέφουμε στο Jakominiplatz. Το slot περιλαμβάνει έξοδο από τις κερκίδες, αναμονή και περπάτημα έως το ξενοδοχείο.', 'stadium','motel-one',[leg('Tram 4','Reininghaus',STADIUM_STOP,JAKO,'Σύνολο περίπου 35′ με έξοδο από το γήπεδο και αναμονή')],{scheduleLabel:'~20:45–21:20',source:grazSource}),
    slot('21','free','21:20',null,'free','FREE TIME','Ποτό, φαγητό, βόλτα ή ξεκούραση. Δεν υπάρχει άλλο οργανωμένο πρόγραμμα.',{scheduleLabel:'μετά',durationLabel:'Ελεύθερη διάρκεια',disableNavigation:true,category:'free'}),
  ], 'START όταν βγούμε από το τρένο στο Graz. Κρατάμε τη σέντρα στις 18:45 ως αμετακίνητο σημείο.'),
]

