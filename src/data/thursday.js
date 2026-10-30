import { at, visit, route, slot, leg, walk, status, makeBlock, JAKO, STADIUM_STOP, grazSource } from './model.js'

export default [
  makeBlock('thu-pretrain', 'Ηράκλειο → Αθήνα → Βιέννη', [
    slot('21','home-airport','04:30',null,'route','Σπίτι -> Αεροδρόμιο Ηρακλείου','Αναχώρηση από το σπίτι στις 04:30 για το αεροδρόμιο Ηρακλείου.', {
      icon:'🚗', category:'transport', scheduleLabel:'04:30', durationLabel:'Αναχώρηση 04:30', origin:'Current location', destination:'Heraklion International Airport N. Kazantzakis (HER), Heraklion, Crete, Greece', mode:'driving', mapUrl:'https://www.google.com/maps/dir/?api=1&destination=Heraklion%20International%20Airport%20N.%20Kazantzakis%20(HER)%2C%20Heraklion%2C%20Crete%2C%20Greece&travelmode=driving',
    }),
    slot('21','flight','05:00','10:00','fixed','Ηράκλειο → Αθήνα','Πρώτο αεροπορικό σκέλος του ταξιδιού. Αναχώρηση 06:00 ώρα Ελλάδας από Ηράκλειο προς Αθήνα.', {
      icon:'✈️', category:'flight', fixedStart:'2027-01-21T06:00:00+02:00', timeZone:'Europe/Athens', scheduleLabel:'06:00 Ελλάδας', durationLabel:'1ο αεροπορικό σκέλος', hideMaps:true,
      legs:[leg('Πτήση','Αθήνα','Heraklion Airport (HER)','Athens International Airport (ATH)','Ώρες σύμφωνα με το αεροπορικό εισιτήριο','flight')],
    }),
    visit('21','airport-arrival','10:00','10:45','activity','Αθήνα → Βιέννη','Δεύτερο αεροπορικό σκέλος του ταξιδιού. Άφιξη στη Βιέννη περίπου στις 10:00 ώρα Αυστρίας και παραλαβή αποσκευών.', ['vienna-airport'], {
      icon:'✈️', scheduleLabel:'Άφιξη ~10:00', durationLabel:'~45′ για αποβίβαση / αποσκευές', hideMaps:true, hideActions:true,
      legs:[leg('Πτήση','Βιέννη','Athens International Airport (ATH)','Vienna Airport (VIE)','Ώρες σύμφωνα με το αεροπορικό εισιτήριο','flight')],
    }),
    route('21','airport-station','10:45','10:55','Vienna Airport Arrivals -> Flughafen Wien Bahnhof','Από τις αφίξεις ακολουθούμε τις πινακίδες Train / Bahnhof / ÖBB προς τον σιδηροδρομικό σταθμό του αεροδρομίου.', 'vienna-airport','Flughafen Wien Bahnhof, 1300 Schwechat',[
      walk('Vienna Airport arrivals, 1300 Schwechat','Flughafen Wien Bahnhof, 1300 Schwechat','Περίπου 5–10′ με τα πόδια'),
    ]),
  ], '', { static:true }),

  makeBlock('thu-train', 'Τρένο → Graz → ΟΦΗ ⚽', [
    route('21','rj750','12:02','15:00','RJ 750 — Flughafen Wien Bahnhof → Graz Hbf','Απευθείας Railjet. FLEX / Standard Group ticket: αν προλάβουμε νωρίτερο επιτρεπόμενο τρένο, πατάμε START όταν ξεκινήσει και οι επόμενες ώρες προσαρμόζονται αυτόματα. Η κράτηση θέσεων ισχύει αποκλειστικά για RJ 750.', 'Flughafen Wien Bahnhof, 1300 Schwechat','graz-hbf',[
      leg('RJ 750','Graz Hbf','Flughafen Wien Bahnhof, 1300 Schwechat','Graz Hauptbahnhof, Europaplatz 4, Graz','2 ώρες 58′ · χωρίς αλλαγή'),
    ],{icon:'🚆', category:'train', typeLabel:'ΤΡΕΝΟ', statuses:[status('TRAIN / FLEX','info'),status('RECHECK TIMETABLE')], hideMaps:true}),

    route('21','graz-transfer','15:00','15:20','Graz Hbf → Jakominiplatz','Μετά την άφιξη στο Graz, παίρνουμε το Tram 4 προς Jakominiplatz.', 'graz-hbf',JAKO,[
      leg('Tram 4','Liebenau/MURPARK','Graz Hauptbahnhof, Europaplatz, Graz',JAKO,'Περίπου 10′ στο τραμ + αναμονή / προσέγγιση'),
    ]),

    route('21','jako-stainzerbauer','15:20','15:30','Jakominiplatz -> Gasthaus Stainzerbauer','Από το Jakominiplatz πηγαίνουμε με τα πόδια στο Gasthaus Stainzerbauer.', JAKO,'stainzerbauer',[
      walk(JAKO,'Gasthaus Stainzerbauer, Bürgergasse 4, Graz','Περίπου 5–6′'),
    ]),

    visit('21','stainzerbauer','15:30','16:10','meal','Gasthaus Stainzerbauer','Παραδοσιακό αυστριακό/στυριακό Gasthaus. Πρόταση: Kürbiscremesuppe με στυριακό Kürbiskernöl.', ['stainzerbauer'],{
      category:'food', statuses:[status('RESERVE')],
    }),

    route('21','motel-checkin','16:10','16:25','Stainzerbauer -> Motel One Graz (Check-in)','Μετά το γεύμα πηγαίνουμε στο Motel One Graz για check-in.', 'stainzerbauer','motel-one',[
      walk('Gasthaus Stainzerbauer, Bürgergasse 4, Graz','Motel One Graz, Jakominiplatz 7, Graz','Περίπου 5–6′ + χρόνος check-in'),
    ],{icon:'🏨', category:'hotel', statuses:[status('BOOKED','success')]}),

    visit('21','motel-rest','16:25','16:40','rest','Motel One (REST)','Σύντομη ξεκούραση και προετοιμασία πριν φύγουμε για το γήπεδο.', ['motel-one'],{
      icon:'🏨', category:'hotel',
    }),

    route('21','stadium-tram','16:40','17:00','Αναχώρηση για Stadion Liebenau','Στουρμ Γκρατς - ΟΦΗ, UEFA Europa League.', 'motel-one','stadium',[
      leg('Tram 4','Liebenau/MURPARK',JAKO,STADIUM_STOP,'Περίπου 12–15′ με αναμονή, συν τελική προσέγγιση'),
    ],{scheduleLabel:'~16:40–17:00',source:grazSource}),

    visit('21','ofi','18:45','20:45','fixed','STURM GRAZ – ΟΦΗ','ΠΑΜΕ ΟΦΑΡΑ.', ['stadium'],{
      icon:'⚽', category:'match', typeLabel:'ΑΓΩΝΑΣ', fixedStart:at('21','18:45'), scheduleLabel:'18:45', durationLabel:'≈2 ώρες · η πραγματική λήξη μπορεί να διαφέρει', statuses:[status('MAIN EVENT','main')],
    }),

    route('21','stadium-return','20:45','21:20','Επιστροφή στο Motel One','Μετά τον αγώνα επιστρέφουμε στο Jakominiplatz. Το slot περιλαμβάνει έξοδο από τις κερκίδες, αναμονή και περπάτημα έως το ξενοδοχείο.', 'stadium','motel-one',[
      leg('Tram 4','Reininghaus',STADIUM_STOP,JAKO,'Σύνολο περίπου 35′ με έξοδο από το γήπεδο και αναμονή'),
    ],{scheduleLabel:'~20:45–21:20',source:grazSource}),

    slot('21','free','21:20',null,'free','FREE TIME','Ποτό, φαγητό, βόλτα ή ξεκούραση. Δεν υπάρχει άλλο οργανωμένο πρόγραμμα.',{
      scheduleLabel:'μετά', durationLabel:'Ελεύθερη διάρκεια', disableNavigation:true, category:'free',
    }),
  ], 'Πατάμε START μόνο όταν ξεκινήσει το τρένο από Vienna Airport. Αν πάρουμε νωρίτερο επιτρεπόμενο τρένο, οι επόμενες μη σταθερές ώρες μετακινούνται αυτόματα. Ο αγώνας παραμένει σταθερός στις 18:45.', {
    startLabel:'▶ START ΤΡΕΝΟΥ',
    dynamicTimes:true,
  }),
]
