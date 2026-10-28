import imageSources from './image-sources.json' with { type: 'json' }

const entries = [
  [
    "motel-one",
    "Motel One Graz",
    "Jakominiplatz 7, 8010 Graz, Austria",
    "Το ξενοδοχείο μας στο Graz, πάνω στον κεντρικό κόμβο Jakominiplatz.",
    "https://www.motel-one.com/en/hotels/graz/hotel-graz/"
  ],
  [
    "ananas",
    "Austria Trend Hotel Ananas Wien",
    "Sonnenhofgasse 8–10, 1050 Wien, Austria",
    "Η βάση μας για δύο νύχτες στη Βιέννη. Διεύθυνση Rechte Wienzeile 93–95, είσοδος Sonnenhofgasse 8–10.",
    "https://www.austria-trend.at/en/hotels/ananas/contact"
  ],
  [
    "stainzerbauer",
    "Gasthaus Stainzerbauer",
    "Bürgergasse 4, 8010 Graz, Austria",
    "Παραδοσιακό αυστριακό/στυριακό Gasthaus. Επιλογή: κολοκυθόσουπα Kürbiscremesuppe με Kürbiskernöl.",
    "https://www.stainzerbauer.at/restaurant/"
  ],
  [
    "der-steirer",
    "Der Steirer",
    "Belgiergasse 1, 8020 Graz, Austria",
    "Στυριακή κουζίνα με χαρακτηριστικό Backhendl, τραγανό τηγανητό κοτόπουλο.",
    "https://www.der-steirer.at/"
  ],
  [
    "eis-greissler",
    "Eis-Greissler — Rotenturmstraße",
    "Rotenturmstraße 14, 1010 Wien, Austria",
    "Αυστριακό παγωτό με τοπικές και περιφερειακές γεύσεις. Απαιτείται έλεγχος χειμερινού ωραρίου.",
    "https://www.eis-greissler.at/standort/wien-rotenturmstrasse/"
  ],
  [
    "figlmueller",
    "Figlmüller Original — Wollzeile",
    "Wollzeile 5, 1010 Wien, Austria",
    "Το ιστορικό original με το μεγάλο χοιρινό Figlmüller Schnitzel. Επιλέγουμε το κατάστημα της Wollzeile.",
    "https://www.figlmueller.at/wollzeile/"
  ],
  [
    "demel",
    "Demel",
    "Kohlmarkt 14, 1010 Wien, Austria",
    "Ιστορικό αυτοκρατορικό ζαχαροπλαστείο. Επιλογή: Kaiserschmarrn ή Apfelstrudel.",
    "https://www.demel.com/pages/contact"
  ],
  [
    "meissl-schadn",
    "Meissl & Schadn Wien",
    "Schubertring 10–12, 1010 Wien, Austria",
    "Βιεννέζικη κουζίνα και αυθεντικό Wiener Schnitzel από μοσχάρι.",
    "https://meisslundschadn.at/en/meissl-schadn-vienna/"
  ],
  [
    "graz-hauptplatz",
    "Hauptplatz Graz",
    "Hauptplatz, 8010 Graz, Austria",
    "Η ιστορική κεντρική πλατεία του Graz, με Rathaus και ιστορικές προσόψεις.",
    "https://www.graztourismus.at/"
  ],
  [
    "herrengasse",
    "Herrengasse",
    "Herrengasse, 8010 Graz, Austria",
    "Ο βασικός ιστορικός δρόμος του κέντρου, με συνέχεια προς το Landhaus.",
    "https://www.graztourismus.at/"
  ],
  [
    "graz-landhaus",
    "Landhaushof",
    "Landhaushof, Herrengasse 16, 8010 Graz, Austria",
    "Αναγεννησιακή αυλή με στοές, μέσα στο ιστορικό Landhaus.",
    "https://www.graztourismus.at/de/sightseeing-kultur/sehenswuerdigkeiten/landhaushof_shg_1466"
  ],
  [
    "graz-dom",
    "Graz Cathedral",
    "Grazer Dom, Bürgergasse 1, 8010 Graz, Austria",
    "Ο γοτθικός καθεδρικός της πόλης, δίπλα στο αυτοκρατορικό Mausoleum.",
    "https://graz-dom.graz-seckau.at/"
  ],
  [
    "graz-mausoleum",
    "Mausoleum Ferdinand II",
    "Mausoleum, Bürgergasse 1, 8010 Graz, Austria",
    "Αυτοκρατορικό μαυσωλείο με χαρακτηριστικούς θόλους. Τον χειμώνα προβλέπεται εξωτερική θέαση· εσωτερική επίσκεψη μόνο με συνεννόηση.",
    "https://www.graztourismus.at/en/sightseeing-culture/sights/mausoleum_shg_1468"
  ],
  [
    "graz-staircase",
    "Double Spiral Staircase",
    "Doppelwendeltreppe, Hofgasse 15, 8010 Graz, Austria",
    "Η διπλή ελικοειδής σκάλα στη Burg: δύο σκάλες που χωρίζουν και ξανασυναντιούνται.",
    "https://www.graztourismus.at/de/sightseeing-kultur/sehenswuerdigkeiten/grazer-burg-doppelwendeltreppe_shg_1444"
  ],
  [
    "graz-uhrturm",
    "Schlossberg & Uhrturm",
    "Uhrturm, Am Schlossberg, 8010 Graz, Austria",
    "Ο εμβληματικός πύργος του ρολογιού με πανοραμική θέα στην πόλη. Ανάβαση και κατάβαση με Schlossberglift.",
    "https://www.holding-graz.at/en/activities/schlossberg/schlossberg-lifts/"
  ],
  [
    "murinsel",
    "Murinsel",
    "Murinsel, Lendkai 19, 8020 Graz, Austria",
    "Μοντέρνα μεταλλική νησίδα και χώρος εκδηλώσεων μέσα στον ποταμό Mur.",
    "https://murinselgraz.at/"
  ],
  [
    "kunsthaus",
    "Kunsthaus Graz",
    "Lendkai 1, 8020 Graz, Austria",
    "Το φουτουριστικό μουσείο σύγχρονης τέχνης. Το κοινό πρόγραμμα αφορά κυρίως το εξωτερικό του κτιρίου.",
    "https://www.museum-joanneum.at/kunsthaus-graz"
  ],
  [
    "stadium",
    "Stadion Graz-Liebenau",
    "Stadion Graz-Liebenau, Ivica-Osim-Platz 1, 8041 Graz, Austria",
    "Το γήπεδο του Sturm Graz – ΟΦΗ, ο βασικός προορισμός του ταξιδιού.",
    "https://sksturm.at/n/das-sind-unsere-spieltermine-in-der-europa-league"
  ],
  [
    "vienna-airport",
    "Vienna Airport",
    "Vienna International Airport, 1300 Schwechat, Austria",
    "Το αεροδρόμιο της Βιέννης και η σύνδεσή του με τον σταθμό Flughafen Wien Bahnhof.",
    "https://www.viennaairport.com/"
  ],
  [
    "graz-hbf",
    "Graz Hauptbahnhof",
    "Graz Hauptbahnhof, Europaplatz 4, 8020 Graz, Austria",
    "Ο κεντρικός σιδηροδρομικός σταθμός του Graz.",
    "https://www.oebb.at/"
  ],
  [
    "wien-hbf",
    "Wien Hauptbahnhof",
    "Wien Hauptbahnhof, Am Hauptbahnhof 1, 1100 Wien, Austria",
    "Ο κεντρικός σιδηροδρομικός σταθμός της Βιέννης.",
    "https://www.oebb.at/"
  ],
  [
    "opera",
    "Vienna State Opera",
    "Opernring 2, 1010 Wien, Austria",
    "Η Κρατική Όπερα της Βιέννης, αφετηρία της βόλτας με τραμ στη Ringstrasse.",
    "https://www.wiener-staatsoper.at/"
  ],
  [
    "parliament",
    "Austrian Parliament",
    "Dr.-Karl-Renner-Ring 3, 1010 Wien, Austria",
    "Το μνημειακό κτίριο του αυστριακού Κοινοβουλίου στη Ringstrasse.",
    "https://www.parlament.gv.at/"
  ],
  [
    "rathaus",
    "Vienna Rathaus",
    "Friedrich-Schmidt-Platz 1, 1010 Wien, Austria",
    "Το νεογοτθικό Δημαρχείο της Βιέννης, ορατό από τη διαδρομή του τραμ.",
    "https://www.wien.gv.at/"
  ],
  [
    "burgtheater",
    "Burgtheater",
    "Universitätsring 2, 1010 Wien, Austria",
    "Το ιστορικό θέατρο απέναντι από το Rathaus, πάνω στη Ringstrasse.",
    "https://www.burgtheater.at/"
  ],
  [
    "schoenbrunn",
    "Schönbrunn Palace",
    "Schönbrunner Schloßstraße 47, 1130 Wien, Austria",
    "Τα θερινά αυτοκρατορικά ανάκτορα των Αψβούργων. Προτεραιότητα στην εσωτερική επίσκεψη.",
    "https://www.schoenbrunn.at/en/visitor-information/opening-times"
  ],
  [
    "karlskirche",
    "Karlskirche",
    "Kreuzherrengasse 1, 1040 Wien, Austria",
    "Μπαρόκ εκκλησία με μεγάλο τρούλο και δύο χαρακτηριστικές κολόνες.",
    "https://www.karlskirche.at/en/visitor-information/"
  ],
  [
    "stephansdom",
    "Stephansplatz & Stephansdom",
    "Stephansdom, Stephansplatz 3, 1010 Wien, Austria",
    "Η καρδιά της ιστορικής Βιέννης και ο γοτθικός Καθεδρικός του Αγίου Στεφάνου.",
    "https://stephanskirche.at/info.php"
  ],
  [
    "belvedere",
    "Upper Belvedere",
    "Prinz-Eugen-Straße 27, 1030 Wien, Austria",
    "Μπαρόκ ανάκτορο και μουσείο τέχνης. Βασικός στόχος: The Kiss του Gustav Klimt.",
    "https://www.belvedere.at/en/visit/upper-belvedere"
  ],
  [
    "hofburg",
    "Hofburg — Sisi Museum & Imperial Apartments",
    "Sisi Museum, Hofburg, Michaelerkuppel, 1010 Wien, Austria",
    "Τα αυτοκρατορικά διαμερίσματα του Franz Joseph και της Elisabeth (Sisi).",
    "https://www.sisimuseum-hofburg.at/en/visitor-information/opening-hours/"
  ],
  [
    "michaelerplatz",
    "Michaelerplatz",
    "Michaelerplatz, 1010 Wien, Austria",
    "Η πλατεία μπροστά στην αυτοκρατορική πρόσοψη και την κεντρική είσοδο του Hofburg.",
    "https://www.sisimuseum-hofburg.at/"
  ],
  [
    "heldenplatz",
    "Hofburg courtyards & Heldenplatz",
    "Heldenplatz, 1010 Wien, Austria",
    "Οι αυλές του αυτοκρατορικού συγκροτήματος και η μεγάλη ιστορική πλατεία Heldenplatz.",
    "https://www.hofburg-wien.at/"
  ],
  [
    "prunksaal",
    "Prunksaal — Austrian National Library",
    "Josefsplatz 1, 1010 Wien, Austria",
    "Εντυπωσιακή μπαρόκ αίθουσα με ζωγραφισμένο τρούλο, ιστορικές υδρόγειους και περίπου 200.000 βιβλία.",
    "https://www.onb.ac.at/museen/prunksaal/oeffnungszeiten"
  ]
]

export const places = Object.fromEntries(entries.map(([id, name, address, description, website]) => [id, {
  id, name, address, description, website,
  photo: imageSources[id] ? { ...imageSources[id], thumb: 'images/' + id + '-thumb.webp', full: 'images/' + id + '.webp', alt: name } : null,
}]))


