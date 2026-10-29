import thursday from './thursday.js'
import friday from './friday.js'
import saturday from './saturday.js'
import sunday from './sunday.js'

export const trip = {
  eyebrow: 'ΑΥΣΤΡΙΑ TRIP 2026', title: 'Γκράτς - Βιέννη',
  currencyLabel: 'Νόμισμα : Ευρώ (EUR / €)', datesLabel: '21–24 Ιανουαρίου 2027', timeZone: 'Europe/Vienna', clockLabel: 'Ώρα Αυστρίας',
  timeNote: 'Όλες οι ώρες είναι Αυστρίας, εκτός της αναχώρησης 06:00 από Ηράκλειο (ώρα Ελλάδας). Οι χρόνοι μετακίνησης είναι εκτιμήσεις με βάση το πρόγραμμα, όχι live δεδομένα.',
  checkedOn: '28/10/2026',
  priority: { title:'⚽ Sturm Graz – ΟΦΗ', label:'21/01 · 18:45 · ΠΡΩΤΗ ΠΡΟΤΕΡΑΙΟΤΗΤΑ' },
}
export const days = [
  { id:'thu', short:'Πέμπτη', date:'21/01', city:'Ηράκλειο → Βιέννη → Graz', title:'Πρώτα ο ΟΦΗ ⚽' },
  { id:'fri', short:'Παρασκευή', date:'22/01', city:'Graz → Βιέννη', title:'Τα σημαντικότερα του Graz · μετά Βιέννη' },
  { id:'sat', short:'Σάββατο', date:'23/01', city:'Βιέννη', title:'Ανάκτορα, ιστορικό κέντρο & τοπικό φαγητό' },
  { id:'sun', short:'Κυριακή', date:'24/01', city:'Βιέννη → Αθήνα → Ηράκλειο', title:'Hofburg, βιβλιοθήκη & επιστροφή' },
]
export const blocksByDay = { thu:thursday, fri:friday, sat:saturday, sun:sunday }
export const prestartByDay = {
  thu:{ title:'Πρώτη προτεραιότητα: Sturm Graz – ΟΦΗ, 18:45', text:'Δεν προσθέτουμε sightseeing πριν το γήπεδο. Κράτηση θέσεων μόνο για RJ 750· αν αλλάξει το τρένο, ελέγχουμε τους όρους FLEX και τις θέσεις.' },
  fri:{ title:'Check-out / αποσκευές πριν τη βόλτα αν δεν εγκριθεί 14:00', text:'Το late checkout δεν θεωρείται επιβεβαιωμένο. Κρατάμε το γεύμα 13:00 και το RJ 753 στις 15:00. Το Mausoleum τον χειμώνα προβλέπεται εξωτερικά.' },
  sat:{ title:'Timed entries και υποχρεωτική ξεκούραση 90′', text:'Στόχοι: Schönbrunn 10:00 και Upper Belvedere 17:00. Οι κρατήσεις εκκρεμούν. Για Pilgramgasse ελέγχουμε την πρόσβαση πριν χρησιμοποιήσουμε U4.' },
  sun:{ title:'Check-out και αποσκευές στη reception από το πρωί', text:'Δεν επιστρέφουμε για checkout. Μετά το γεύμα παραλαμβάνουμε μόνο τις βαλίτσες και κρατάμε στόχο VAB4 14:39 / πτήση 18:30.' },
}
export const travelNotes = [
  { title:'Pilgramgasse · VERIFY ACCESS', text:'Το Hotel Ananas αναφέρει περιορισμένη πρόσβαση χωρίς ανελκυστήρες. Οι νεότερες πληροφορίες Wiener Linien τοποθετούν τη νέα σύνδεση U2 το 2030, επομένως δεν θεωρούμε δεδομένη αποκατάσταση μέσα στο 2027. Προς κέντρο προτιμάμε 59A. Προς Schönbrunn η απευθείας U4 παραμένει η γρήγορη επιλογή· για πλήρη αποφυγή σκάλας ελέγχουμε 59A → Karlsplatz → U4 και δίνουμε επιπλέον χρόνο.', source:'https://tramwm.wienerlinien.at/web/guest/u2xu5/stationen/pilgramgasse' },
  { title:'Τρένα και λεωφορείο αεροδρομίου · RECHECK', text:'RJ 750 12:02–15:00, RJ 753 15:00–17:36 και VAB4 14:39 παραμένουν όπως δόθηκαν. Χρειάζεται τελικός έλεγχος ημερομηνίας, αποβάθρας, στάσης και τυχόν έργων. Δεν εμφανίζονται ως live δρομολόγια.', source:'https://www.oebb.at/' },
  { title:'Χειμώνας & χρόνοι μετακίνησης', text:'Τα slots διατηρούνται από το πρόγραμμά σας. Οι διαδρομές περιλαμβάνουν την προσέγγιση, αναμονή και αλλαγές όπου αναφέρονται. Σε χιόνι, ουρές ή καθυστερήσεις ελέγχουμε την επόμενη σταθερή ώρα. Το Google Maps μπορεί να προτείνει διαφορετική γραμμή· οι λεπτομέρειες του προγράμματος παραμένουν ο οδηγός μας.', source:'https://tramwm.wienerlinien.at/web/guest/fahrplaene' },
]
const statusTargets = [
 ['21-ofi','Sturm Graz – OFI','MAIN EVENT'], ['21-rj750','RJ 750','TRAIN / FLEX'], ['22-rj753','RJ 753','TRAIN'],
 ['21-motel-checkin','Motel One Graz','BOOKED'], ['22-ananas-checkin','Hotel Ananas Wien','BOOKED'],
 ['21-stainzerbauer','Stainzerbauer','RESERVE'], ['22-checkout','Motel One late checkout 14:00','CONFIRM'],
 ['22-steirer','Der Steirer','RESERVE'], ['22-icecream','Eis-Greissler','VERIFY OPENING'],
 ['23-schoenbrunn','Schönbrunn 10:00','BOOK TIMED ENTRY'], ['23-figlmueller','Figlmüller Original','RESERVE'],
 ['23-belvedere','Upper Belvedere ~17:00','BOOK TIMED ENTRY'], ['23-demel','Demel','NO RESERVATIONS'],
 ['24-sisi','Sisi Museum ~10:00','BOOK TIMED ENTRY'], ['24-library','Austrian National Library','OPEN / VISIT'],
 ['24-meissl','Meissl & Schadn','RESERVE'], ['24-vab4','VAB4 14:39','RECHECK TIMETABLE'],
]
export const reservationItems = statusTargets.map(([id,title,label]) => {
  const dayId = Object.keys(blocksByDay).find(day => blocksByDay[day].some(block => block.activities.some(a => a.id === id)))
  const activity = blocksByDay[dayId].flatMap(block => block.activities).find(a => a.id === id)
  return { id, title, dayId, ...activity.statuses.find(s => s.label === label) }
})
