"use strict";
/* Sin persistencia: todo vive en memoria y se pierde al recargar.
   Para cambiar el contenido, edita HISTORIA (se descubre en orden). Cada momento tiene:
   y (fecha), i (ícono), t (título), x (texto), p (pista antes de descubrirlo),
   d / s (opcionales): [título, texto] de un desplegable (d va debajo del texto, s al final),
   y como máximo un bloque: tabs: [[etiqueta, texto], ...] (a: true abre la primera) ·
   temas: [[título, texto], ...] · barras: [[etiqueta, valor, %], ...] · quiz: true
   El cuestionario se edita en PREGUNTAS: [pregunta, [opciones], índice correcto, explicación]. */
const HISTORIA = [
  { y: "2007", i: "🌾", t: "Un tambo farmacéutico en el campo", p: "Todo empieza cerca de Baradero",
    x: "En el Tambo Farmacéutico de Bio Sidus, cerca de Baradero (provincia de Buenos Aires), nacieron en 2007 cuatro terneras llamadas Patagonia. La idea: que de adultas produzcan insulina humana en su leche." },
  { y: "Antes de seguir", i: "🔬", t: "Clon no es lo mismo que transgénico", p: "Dos palabras que se confunden",
    x: "Tocá cada palabra:", a: true,
    tabs: [["Clon", "Una copia genética de otro animal: tiene el mismo ADN."],
           ["Transgénico", "Un animal con un gen de otra especie. Acá, el gen de la insulina humana."],
           ["Las Patagonia", "Son las dos cosas a la vez: clones a los que antes se les modificó el ADN."]] },
  { y: "Antes de 2007", i: "🐑", t: "Un camino que empezó en 1996", p: "Las Patagonia tenían antecedentes",
    x: "Tocá cada hito:",
    temas: [["Dolly, 1996", "La clonación de mamíferos se hizo famosa con Dolly, una oveja británica."],
            ["Pampa, 2002", "Bio Sidus obtuvo en agosto la primera ternera clonada de Latinoamérica: una Jersey llamada Pampa."],
            ["Pampa Mansa, 2003", "Nació en septiembre. Era clonada y transgénica: llevaba el gen de la hormona de crecimiento humana."]] },
  { y: "Febrero y marzo de 2007", i: "🐄", t: "Nacen las terneras Patagonia I, II, III y IV", p: "Cuatro terneras Jersey",
    x: "Nacieron por cesárea. Tocá cada paso para ver cómo se hicieron:", a: true,
    tabs: [["1", "Se tomaron células de un feto de vaca y se cultivaron en el laboratorio."],
           ["2", "A esas células se les agregó el gen de la insulina humana."],
           ["3", "El núcleo modificado se colocó en un óvulo al que se le había quitado su núcleo."],
           ["4", "El embrión se implantó en el útero de otras vacas, que lo gestaron."],
           ["5", "Nacieron cuatro terneras Jersey: clones con el gen humano."]] },
  { y: "El objetivo", i: "💉", t: "Insulina que sale de la leche", p: "¿Para qué tanto esfuerzo?",
    x: "Las personas con diabetes necesitan insulina como medicamento, y la demanda es enorme y creciente. Bio Sidus dijo que la insulina de estas vacas costaría al menos 30 % menos. Es un cálculo de la empresa:",
    d: ["¿Qué es la insulina?", "Es una hormona que controla el azúcar (glucosa) en la sangre. Cuando el cuerpo no la produce o no alcanza, hay que recibirla como medicamento."],
    barras: [["Costo de la insulina actual (referencia)", "100", 100], ["Con las vacas Patagonia, según Bio Sidus", "70 o menos", 70]] },
  { y: "Un obstáculo", i: "⚠️", t: "La vaca también es sensible a la insulina", p: "Un problema inesperado",
    x: "Tocá cada paso:", a: true,
    tabs: [["Problema", "Si la vaca produjera insulina humana activa, le bajaría demasiado el azúcar en sangre y podría matarla."],
           ["Solución", "Los científicos modificaron el gen para que la leche tenga una versión precursora, que todavía no actúa como insulina."],
           ["Resultado", "Ya fuera de la vaca, se le agrega una enzima y se transforma en insulina humana."]] },
  { y: "17 de abril de 2007", i: "📣", t: "El anuncio", p: "La noticia se hace pública",
    x: "Bio Sidus presentó a las terneras en una conferencia de prensa. Según La Nación, Argentina pasaba a ser el único país con vacas transgénicas que producen insulina humana. Las terneras empezarían a producirla al llegar a adultas. La empresa calculó que unas 25 vacas cubrirían la demanda anual de insulina del país." },
  { y: "Agosto de 2007", i: "🏛️", t: "El Congreso lo celebra", p: "Hasta el Congreso opinó",
    x: "El 7 de agosto de 2007, la Comisión de Acción Social y Salud Pública de la Cámara de Diputados de la Nación firmó un dictamen. Aconsejaba expresar beneplácito por el logro de Bio Sidus.",
    s: ["Importante", "Esta historia usa fuentes de 2007. No cuenta lo que pasó después."] },
  { y: "Para terminar", i: "📝", t: "Cuestionario final", p: "Poné a prueba lo que descubriste",
    x: "Son 5 preguntas fáciles. Al final te damos un puntaje del 1 al 100.", quiz: true }
];

const PREGUNTAS = [
  ["¿Qué producirán en su leche las vacas Patagonia?", ["Insulina humana", "Vitaminas", "Miel"], 0, "Es un medicamento para tratar la diabetes."],
  ["¿En qué año nacieron las terneras Patagonia?", ["1996", "2002", "2007"], 2, "Nacieron entre febrero y marzo de 2007."],
  ["¿Cuántas terneras Patagonia nacieron?", ["2", "4", "25"], 1, "Fueron Patagonia I, II, III y IV."],
  ["¿Por qué la insulina activa sería un problema para la vaca?", ["Le bajaría demasiado el azúcar en sangre", "La dejaría sin hambre", "Le cambiaría el color"], 0, "Por eso la leche tiene una versión precursora, sin actividad."],
  ["¿De qué raza son las terneras Patagonia?", ["Jersey", "Aberdeen Angus", "Holando"], 0, "Las cuatro terneras son de raza Jersey."]
];

const linea = document.getElementById("linea");
const aviso = document.getElementById("aviso");
const btnSig = document.getElementById("sig");
const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
let n = 0;

function el(tag, clase, texto) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function boton(texto, clase, alClick) {
  const b = el("button", clase, texto);
  b.type = "button";
  b.addEventListener("click", alClick);
  return b;
}

function tabs(items, abierto) {
  const w = el("div", "tabs");
  const fila = el("div", "tabfila");
  const panel = el("p", "panel");
  panel.setAttribute("aria-live", "polite");
  panel.hidden = true;
  const bs = items.map(([et, tx]) => {
    const b = boton(et, "tab", () => {
      bs.forEach(o => o.setAttribute("aria-pressed", String(o === b)));
      panel.textContent = tx;
      panel.hidden = false;
    });
    b.setAttribute("aria-pressed", "false");
    fila.append(b);
    return b;
  });
  w.append(fila, panel);
  if (abierto) bs[0].click();
  return w;
}

function detalle(par, clase) {
  const d = el("details", clase);
  d.append(el("summary", null, par[0]), el("p", null, par[1]));
  return d;
}

function temas(items) {
  const w = el("div", "temas");
  items.forEach(par => w.append(detalle(par, "tema")));
  return w;
}

function barras(items) {
  const w = el("div", "barras");
  items.forEach(([et, val, pct]) => {
    const b = el("span", "relleno-b");
    b.style.setProperty("--w", pct + "%");
    const pista = el("div", "pista");
    pista.append(b);
    const f = el("div", "barra-fila");
    f.append(el("p", null, et + ": " + val), pista);
    w.append(f);
  });
  return w;
}

async function capturar(zona, btns, compartir) {
  const falla = () => { aviso.textContent = "No se pudo sacar la captura. Usá la captura de pantalla de tu dispositivo."; };
  if (typeof html2canvas === "undefined") { falla(); return; }
  btns.forEach(b => { b.disabled = true; });
  try {
    const canvas = await html2canvas(zona, {
      backgroundColor: "#0e2230",
      scale: 2,
      onclone: doc => { const c = doc.querySelector(".rcap"); if (c) c.style.display = "none"; }
    });
    const blob = await new Promise(ok => canvas.toBlob(ok, "image/png"));
    if (!blob) throw new Error("sin imagen");
    const archivo = new File([blob], "patagonia-2007-puntaje.png", { type: "image/png" });
    if (compartir && navigator.canShare && navigator.canShare({ files: [archivo] })) {
      await navigator.share({ files: [archivo], title: "Patagonia, 2007" });
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = archivo.name;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    aviso.textContent = compartir ? "Imagen del resultado lista" : "Imagen del resultado descargada";
  } catch (e) {
    if (e.name !== "AbortError") falla();
  }
  btns.forEach(b => { b.disabled = false; });
}

function quiz() {
  const w = el("div", "quiz");
  let i = 0, ok = 0;
  const total = PREGUNTAS.length;
  function pregunta() {
    w.replaceChildren();
    const [q, ops, c, fb] = PREGUNTAS[i];
    const nota = el("p", "qfb");
    nota.setAttribute("aria-live", "polite");
    const sig = boton(i + 1 < total ? "Siguiente pregunta" : "Ver mi puntaje", "qsig", () => {
      i++;
      if (i < total) pregunta(); else resultado();
    });
    sig.hidden = true;
    const lista = el("div", "qops");
    const bs = ops.map((t, k) => {
      const b = boton(t, "qop", () => {
        bs.forEach((o, j) => { o.disabled = true; if (j === c) o.classList.add("bien"); else if (o === b) o.classList.add("mal"); });
        if (k === c) ok++;
        nota.textContent = (k === c ? "¡Correcto! " : "No exactamente. ") + fb;
        sig.hidden = false;
        sig.scrollIntoView({ block: "nearest", behavior: reducido ? "auto" : "smooth" });
      });
      lista.append(b);
      return b;
    });
    w.append(el("p", "qn", "Pregunta " + (i + 1) + " de " + total), el("p", "qt", q), lista, nota, sig);
  }
  function resultado() {
    const pts = Math.max(1, Math.round(ok / total * 100));
    const msg = pts === 100 ? "¡Perfecto! Sos experto o experta en las vacas Patagonia."
      : pts >= 60 ? "¡Muy bien! Entendiste lo importante."
      : pts >= 40 ? "Vas bien. Con un repaso lo tenés."
      : "Todavía te falta. Volvé a recorrer la historia y probá otra vez.";
    const r = el("div", "resultado");
    const num = el("p", "rnum", String(pts));
    num.append(el("span", null, "/100"));
    const acc = el("div", "rcap");
    const btns = [];
    btns.push(boton("📸 Sacar captura de pantalla", "rbtn", () => capturar(r, btns, false)));
    if (navigator.share) btns.push(boton("📤 Compartir", "rbtn", () => capturar(r, btns, true)));
    acc.append(...btns);
    r.append(el("p", "rtit", "Patagonia, 2007 · Cuestionario"), num,
      el("p", null, "Acertaste " + ok + " de " + total + ". " + msg), acc);
    w.replaceChildren(r, boton("Repetir el cuestionario", "rehacer", () => { i = 0; ok = 0; pregunta(); }));
    aviso.textContent = "Tu puntaje es " + pts + " sobre 100";
    r.scrollIntoView({ block: "center", behavior: reducido ? "auto" : "smooth" });
  }
  pregunta();
  return w;
}

function nodo(m, nuevo) {
  const li = el("li", "nodo actual" + (nuevo ? " nuevo" : ""));
  li.append(el("span", "punto", m.i));
  const caja = el("div", "tarjeta");
  const h = el("h2", null, m.t);
  h.tabIndex = -1;
  caja.append(el("p", "fecha", m.y), h, el("p", null, m.x));
  if (m.d) caja.append(detalle(m.d, "sabias"));
  if (m.tabs) caja.append(tabs(m.tabs, m.a));
  if (m.temas) caja.append(temas(m.temas));
  if (m.barras) caja.append(barras(m.barras));
  if (m.s) caja.append(detalle(m.s, "sabias"));
  if (m.quiz) caja.append(quiz());
  li.append(caja);
  return li;
}

function bloqueado(m) {
  const li = el("li", "nodo bloq");
  li.append(el("span", "punto", "?"));
  const b = boton("", "misterio", () => revelar(true));
  b.append(el("span", "mt", "Toque aqui para descubrir"), el("span", "ms", m.p));
  li.append(b);
  return li;
}

function revelar(mover) {
  if (n >= HISTORIA.length) return;
  const viejo = linea.querySelector(".bloq");
  if (viejo) viejo.remove();
  const ant = linea.querySelector(".actual");
  if (ant) ant.classList.remove("actual", "nuevo");
  const m = HISTORIA[n++];
  const li = nodo(m, mover);
  if (ant) li.classList.add("crece");
  linea.append(li);
  if (n < HISTORIA.length) linea.append(bloqueado(HISTORIA[n]));
  actualizar();
  if (mover) {
    li.querySelector("h2").focus({ preventScroll: true });
    li.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" });
    aviso.textContent = "Descubriste: " + m.t;
  }
}

function actualizar() {
  const total = HISTORIA.length;
  document.getElementById("cuenta").textContent = n + " de " + total;
  document.getElementById("relleno").style.width = (n / total * 100) + "%";
  btnSig.hidden = n >= total;
  document.body.classList.toggle("completo", n >= total);
}

function reiniciar() {
  linea.replaceChildren();
  n = 0;
  revelar(false);
  window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
  aviso.textContent = "Recorrido reiniciado";
}

btnSig.addEventListener("click", () => revelar(true));
document.getElementById("reiniciar").addEventListener("click", reiniciar);
revelar(false);
