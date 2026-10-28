export const trip = {
  eyebrow: 'GRAZ TRIP', title: 'Graz',
  datesLabel: 'Το πραγματικό πρόγραμμα θα προστεθεί σύντομα',
  timeZone: 'Europe/Vienna', clockLabel: 'Ώρα Graz',
}
export const days = [{
  id: 'placeholder-day', short: 'Ημέρα 1', date: 'Προσωρινό',
  city: 'Graz', title: 'Βάση νέου ταξιδιού',
}]
export const blocksByDay = {
  'placeholder-day': [{
    id: 'placeholder-block', title: 'Δοκιμαστικό μπλοκ',
    plannedStart: null, startLabel: '▶ START',
    startHint: 'Προσωρινό παράδειγμα λειτουργίας, χωρίς πραγματικό πρόγραμμα ή ώρες ταξιδιού.',
    activities: [{
      id: 'placeholder-activity', type: 'activity', typeLabel: 'ΔΡΑΣΗ',
      duration: 0, icon: '📋', title: 'Αναμονή πραγματικού προγράμματος',
      description: 'Το itinerary θα συμπληρωθεί με τα στοιχεία που θα δοθούν. Δεν έχει οριστεί διάρκεια, διαδρομή ή προορισμός.',
      disableNavigation: true, showTimeRange: false,
    }],
  }],
}
export const prestartByDay = {
  'placeholder-day': {
    title: 'Καθαρή βάση ταξιδιού',
    text: 'Το START / END είναι διαθέσιμο για έλεγχο. Δεν έχουν προστεθεί ημερομηνίες, ξενοδοχεία, αξιοθέατα ή διαδρομές.',
  },
}
