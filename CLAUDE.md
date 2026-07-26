@AGENTS.md

# CONTEXTO DEL PROYECTO

App web personal para (1) cumplir **36 días de presencia en oficina por quarter fiscal** y (2) registrar y proyectar los gastos de viaje asociados. Single-user, gastos 100% de bolsillo. Este documento es la **fuente de verdad del dominio**: las reglas de aquí mandan sobre cualquier suposición.

---

## Glosario (vocabulario canónico)

- **Quarter (Q):** trimestre **fiscal**, año que inicia el 1-feb. Q1 1-feb–2-may · Q2 3-may–1-ago · Q3 2-ago–31-oct · Q4 1-nov–30-ene.
- **Viaje:** estancia con rango de fechas en CDMX. Unidad atómica del sistema.
- **Día contable:** día que suma a la meta de 36. Es derivado, no se captura.
- **Festivo:** día que NO cuenta (como un domingo) pero SÍ se muestra en el calendario.
- **Meta:** 36 días contables por quarter.

---

## Reglas de negocio (LOCKED)

1. El quarter es **fiscal** y arranca en febrero: Q1 1-feb–2-may · Q2 3-may–1-ago · Q3 2-ago–31-oct · Q4 1-nov–30-ene. Asignación de FY: **feb–dic → FY del mismo año; enero → FY del año anterior** (es la cola del FY que arrancó el feb previo). (feb-2026 → FY26 Q1; ago-2026 → FY26 Q3; ene-2027 → FY26 Q4.)
2. Cuentan **lunes a viernes**. Sábado NO cuenta. Domingo NO cuenta. Festivo NO cuenta.
3. Meta fija: **36 días contables por quarter**.
4. Todos los gastos son **de bolsillo**. NO existe lógica de reembolso.
5. Categorías de gasto: `hospedaje` | `avión` | `comida` | `extra`.
6. Los festivos deben **aparecer en el calendario** y deben ser **editables a mano** (manda el calendario de cierre de la empresa, no solo los feriados de ley).
7. Viaje y gasto se asignan al quarter **por su propia fecha, de forma independiente**. Un gasto NO tiene que caer dentro del rango de su viaje (el vuelo se paga antes).

---

## Modelo de datos (entidades canónicas)

**Quarter** — `id` (ej. `FY26-Q2`), `fechaInicio`, `fechaFin`, `metaDias` (default 36), `limite?` (total y/o por categoría).

**Festivo** — `fecha`, `nombre`, `origen` (`ley` | `empresa` | `personal`). Quarter derivado por fecha.

**Viaje** — `fechaLlegada`, `fechaSalida`, `ciudad`. Días contables y quarter(s) derivados.

**DiaContable** _(derivado)_ — `fecha`, `estado` (`cuenta` | `domingo` | `sabado` | `festivo` | `fuera-de-viaje`), `viajeId`.

**Gasto** — `monto`, `categoria`, `fecha`, `viajeId?`, `nota?`, `recibo?`.

---

## Reglas de cálculo (spec autoritativo)

**R0 — fecha → quarter:** función única según el mapeo fiscal. Se usa para clasificar viajes, días y gastos por separado.

**R1 — ¿día cuenta?** Contable ⇔ `(no domingo) Y (no sábado) Y (no festivo) Y (llegada ≤ día ≤ salida de algún viaje)`. Días de llegada/salida cuentan completos. Sin traslape de viajes.

**R2 — días cumplidos:** sumar **día por día**, no el viaje completo (un viaje puede cruzar la frontera del quarter).

```
diasCumplidos(Q) = Σ días contables (de todos los viajes) cuya fecha cae en Q
```

**R3 — ritmo / holgura:**

```
faltan               = meta − cumplidos
disponiblesRestantes = (días Lun–Vie de hoy a fin de Q) − (festivos en ese rango)
holgura              = disponiblesRestantes − faltan
```

`holgura ≥ 0` → factible · `holgura < 0` → ALERTA ROJA (imposible cumplir).

**R4 — costo por día:**

```
costoPorDia(Q) = gastoTotal(Q) ÷ diasCumplidos(Q)   // si cumplidos = 0 → mostrar "—"
```

**R5 — proyección de gasto:**

```
gastado    = Σ gastos del Q (por fecha del gasto)
proyeccion = gastado + (faltan × costoPorDia)        // estimado lineal; sobreestima vuelos ya pagados
```

Comparar `proyeccion` vs `limite` → verde / amarillo / rojo.

---

## Casos borde (MUST handle)

- **Festivo en día laboral** (mayoría de feriados MX): recorta un viaje Lun–Vie en un día contable. El ritmo debe descontarlo automáticamente.
- **Viaje que cruza quarters** (ej. 1-ago/2-ago): repartir días por fecha (R2).
- **Gasto fuera del rango del viaje:** válido; clasificar por fecha del gasto.
- **División entre cero:** sin días cumplidos no se calcula costo por día.

---

## Pantallas

1. **Dashboard** del quarter actual: progreso de días (`x/36`), barra de presupuesto, indicador de ritmo/holgura.
2. **Calendario** por quarter: viajes como bloques; días que cuentan resaltados; domingos y festivos en gris (festivos con nombre).
3. **Viajes:** lista con días contables + gastos + costo total + costo por día.
4. **Gastos:** captura + filtros por categoría / quarter / viaje.

---

## Fuera de alcance (NON-GOALS)

- Multiusuario / autenticación compleja (es single-user).
- Reembolsos o aprobaciones.
- Medios días de llegada/salida (perilla futura, no v1).
- Planeador de escenarios de viajes → **iteración 2**, no v1.

---

## Prioridades de v1

1. Modelo con **Viaje** como núcleo.
2. **Indicador de ritmo/holgura** desde el día uno.
3. **Festivos editables** como entidad de primera clase.
