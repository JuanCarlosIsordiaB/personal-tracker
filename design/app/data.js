/* ============================================================
   Office Tracker — modelo de datos, helpers de fecha y cálculo
   Framework-free. Se expone en window.TRK
   ============================================================ */
(function () {
  // ---- Formato de dinero (MXN con decimales) -------------------
  function money(n, dec) {
    if (dec === undefined) dec = true;
    return '$' + Number(n).toLocaleString('es-MX', {
      minimumFractionDigits: dec ? 2 : 0,
      maximumFractionDigits: dec ? 2 : 0,
    });
  }

  // ---- Fechas (local, sin sustos de timezone) ------------------
  function parseD(s) {
    if (s instanceof Date) return s;
    var p = s.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function ymd(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function dow(d) { return parseD(d).getDay(); } // 0=Dom ... 6=Sáb
  function sameDay(a, b) { return ymd(parseD(a)) === ymd(parseD(b)); }

  var DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var DIAS_L = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function fmtShort(d) { d = parseD(d); return d.getDate() + ' ' + MESES[d.getMonth()]; }       // 13 oct
  function fmtMed(d) { d = parseD(d); return DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()]; } // Lun 13 oct
  function fmtRange(a, b) {                                                                       // 13–18 oct
    a = parseD(a); b = parseD(b);
    if (a.getMonth() === b.getMonth()) return a.getDate() + '–' + b.getDate() + ' ' + MESES[a.getMonth()];
    return a.getDate() + ' ' + MESES[a.getMonth()] + ' – ' + b.getDate() + ' ' + MESES[b.getMonth()];
  }

  // ---- Regla 0: fecha → quarter fiscal -------------------------
  // FY: jul–dic pertenece al FY del año siguiente; ene–jun al mismo año.
  // Q1 jul-sep, Q2 oct-dic, Q3 ene-mar, Q4 abr-jun.
  function quarterOf(d) {
    d = parseD(d);
    var m = d.getMonth(); // 0..11
    var y = d.getFullYear();
    var fy, q;
    if (m >= 6) { fy = y + 1; } else { fy = y; }   // jul(6)..dic -> next year
    if (m >= 6 && m <= 8) q = 1;        // jul-sep
    else if (m >= 9 && m <= 11) q = 2;  // oct-dic
    else if (m >= 0 && m <= 2) q = 3;   // ene-mar
    else q = 4;                          // abr-jun
    return { fy: fy, q: q, label: 'FY' + String(fy).slice(2) + ' Q' + q };
  }

  // ---- Datos de ejemplo ---------------------------------------
  // "Hoy" del prototipo: dentro de FY26 Q2 (oct–dic 2025), historia "vas bien".
  var TODAY = '2025-11-24';

  var QUARTER = {
    id: 'FY26-Q2', fy: 26, q: 2, label: 'FY26 · Q2',
    titulo: 'Oct – Dic 2025',
    inicio: '2025-10-01', fin: '2025-12-31',
    meta: 36, limite: 130000,
  };

  // Festivos (entidad de primera clase, editables)
  var HOLIDAYS = [
    { fecha: '2025-11-17', nombre: 'Día de la Revolución', origen: 'ley' },
    { fecha: '2025-12-12', nombre: 'Cierre de empresa', origen: 'empresa' },
    { fecha: '2025-12-25', nombre: 'Navidad', origen: 'ley' },
    { fecha: '2025-12-24', nombre: 'Nochebuena (medio día)', origen: 'empresa' },
  ];
  function isHoliday(d) { return HOLIDAYS.find(function (h) { return sameDay(h.fecha, d); }); }

  // Gastos (asignados al quarter por SU PROPIA fecha)
  var EXPENSES = [
    // Viaje 1
    { id: 'e1', tripId: 't1', cat: 'avion', monto: 3900, fecha: '2025-09-28', nota: 'Vuelo redondo SLP–MEX (comprado antes)' },
    { id: 'e2', tripId: 't1', cat: 'hospedaje', monto: 9500, fecha: '2025-10-18', nota: 'Hotel Reforma · 5 noches' },
    { id: 'e3', tripId: 't1', cat: 'comida', monto: 4300, fecha: '2025-10-17', nota: 'Comidas semana' },
    { id: 'e4', tripId: 't1', cat: 'extra', monto: 700, fecha: '2025-10-16', nota: 'Uber al aeropuerto' },
    // Viaje 2
    { id: 'e5', tripId: 't2', cat: 'avion', monto: 3700, fecha: '2025-10-10', nota: 'Vuelo redondo SLP–MEX' },
    { id: 'e6', tripId: 't2', cat: 'hospedaje', monto: 9000, fecha: '2025-11-01', nota: 'Hotel Roma · 5 noches' },
    { id: 'e7', tripId: 't2', cat: 'comida', monto: 3900, fecha: '2025-10-31', nota: 'Comidas semana' },
    { id: 'e8', tripId: 't2', cat: 'extra', monto: 700, fecha: '2025-10-29', nota: 'Taxi / varios' },
    // Viaje 3
    { id: 'e9', tripId: 't3', cat: 'avion', monto: 4100, fecha: '2025-10-28', nota: 'Vuelo redondo SLP–MEX' },
    { id: 'e10', tripId: 't3', cat: 'hospedaje', monto: 9500, fecha: '2025-11-15', nota: 'Hotel Roma · 5 noches' },
    { id: 'e11', tripId: 't3', cat: 'comida', monto: 4000, fecha: '2025-11-14', nota: 'Comidas semana' },
    { id: 'e12', tripId: 't3', cat: 'extra', monto: 700, fecha: '2025-11-12', nota: 'Uber / café' },
  ];

  // Viajes — la unidad atómica
  var TRIPS = [
    { id: 't1', ciudad: 'CDMX', llegada: '2025-10-13', salida: '2025-10-18' },
    { id: 't2', ciudad: 'CDMX', llegada: '2025-10-27', salida: '2025-11-01' },
    { id: 't3', ciudad: 'CDMX', llegada: '2025-11-10', salida: '2025-11-15' },
  ];

  var CAT = {
    avion: { label: 'Avión', color: '#3B82C4', icon: 'plane' },
    hospedaje: { label: 'Hospedaje', color: '#7A6CE0', icon: 'bed' },
    comida: { label: 'Comida', color: '#E0903B', icon: 'food' },
    extra: { label: 'Extra', color: '#5BA88A', icon: 'extra' },
  };

  // ---- Regla 1 & 2: días contables ----------------------------
  // Un día cuenta si: no domingo, no festivo, y dentro del rango de un viaje.
  function tripDays(trip) {
    var out = [];
    var d = parseD(trip.llegada);
    var end = parseD(trip.salida);
    while (d <= end) {
      var isSun = d.getDay() === 0;
      var hol = isHoliday(d);
      var estado = 'cuenta';
      if (isSun) estado = 'domingo';
      else if (hol) estado = 'festivo';
      out.push({ fecha: ymd(d), dow: d.getDay(), estado: estado, holiday: hol, tripId: trip.id });
      d = addDays(d, 1);
    }
    return out;
  }
  function countableOf(trip) {
    return tripDays(trip).filter(function (x) { return x.estado === 'cuenta'; }).length;
  }
  function expensesOf(tripId) {
    return EXPENSES.filter(function (e) { return e.tripId === tripId; });
  }
  function tripTotal(tripId) {
    return expensesOf(tripId).reduce(function (s, e) { return s + e.monto; }, 0);
  }

  // ---- Regla 3: capacidad restante / holgura ------------------
  // Días Lun–Sáb de hoy(incl) a fin de quarter, menos festivos.
  function availableFrom(fromD, toD) {
    var d = parseD(fromD), end = parseD(toD), n = 0;
    while (d <= end) {
      if (d.getDay() !== 0 && !isHoliday(d)) n++;
      d = addDays(d, 1);
    }
    return n;
  }

  // ---- Totales del quarter (dataset real) ---------------------
  function cumplidos() {
    return TRIPS.reduce(function (s, t) { return s + countableOf(t); }, 0);
  }
  function gastado() {
    return EXPENSES.reduce(function (s, e) { return s + e.monto; }, 0);
  }
  function catTotals() {
    var o = { avion: 0, hospedaje: 0, comida: 0, extra: 0 };
    EXPENSES.forEach(function (e) { o[e.cat] += e.monto; });
    return o;
  }

  // ---- Escenarios para previsualizar el semáforo --------------
  // 'bien' es el dataset real. 'justo' y 'riesgo' son hipotéticos.
  function computeStatus(scenario) {
    var meta = QUARTER.meta;
    var s;
    if (scenario === 'justo') {
      s = { cumplidos: 14, disponibles: 18, gastado: 45000, costoDia: 3214.29, limite: 110000 };
    } else if (scenario === 'riesgo') {
      s = { cumplidos: 12, disponibles: 14, gastado: 61000, costoDia: 5083.33, limite: 130000 };
    } else {
      var c = cumplidos();
      var g = gastado();
      s = {
        cumplidos: c,
        disponibles: availableFrom(TODAY, QUARTER.fin),
        gastado: g,
        costoDia: c ? g / c : null,
        limite: QUARTER.limite,
      };
    }
    s.meta = meta;
    s.faltan = Math.max(0, meta - s.cumplidos);
    s.holgura = s.disponibles - s.faltan;
    s.proyeccion = s.costoDia != null ? s.gastado + s.faltan * s.costoDia : null;
    // semáforo de días (holgura)
    s.diasNivel = s.holgura <= 0 ? 'rojo' : (s.holgura < 5 ? 'amarillo' : 'verde');
    // semáforo de presupuesto
    var ratio = s.proyeccion != null ? s.proyeccion / s.limite : 0;
    s.dineroNivel = ratio > 1 ? 'rojo' : (ratio > 0.85 ? 'amarillo' : 'verde');
    s.ratio = ratio;
    return s;
  }

  window.TRK = {
    money: money, parseD: parseD, ymd: ymd, addDays: addDays, dow: dow, sameDay: sameDay,
    DIAS: DIAS, DIAS_L: DIAS_L, MESES: MESES, MESES_L: MESES_L,
    fmtShort: fmtShort, fmtMed: fmtMed, fmtRange: fmtRange,
    quarterOf: quarterOf, isHoliday: isHoliday,
    TODAY: TODAY, QUARTER: QUARTER, HOLIDAYS: HOLIDAYS, EXPENSES: EXPENSES, TRIPS: TRIPS, CAT: CAT,
    tripDays: tripDays, countableOf: countableOf, expensesOf: expensesOf, tripTotal: tripTotal,
    availableFrom: availableFrom, cumplidos: cumplidos, gastado: gastado, catTotals: catTotals,
    computeStatus: computeStatus,
  };
})();
