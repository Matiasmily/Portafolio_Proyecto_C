function analizar() {
    const codigo = document.getElementById("codigo").value.trim();
    const resultado = document.getElementById("resultado");

    resultado.textContent = "";

    if (!codigo) {
        resultado.textContent = "// Error: entrada vacía";
        resultado.style.color = "var(--err-color, #f87171)";
        return;
    }

    const palabras = ["SI","ENTONCES","Y","O","NO","APROBAR","RECHAZAR","CONDICIONAR"];
    const operadores = [">=", "<=", ">", "<", "="];

    const tokens = codigo.match(/>=|<=|>|<|=|;|\w+/g);

    if (!tokens) {
        resultado.textContent = "// Error: no se encontraron tokens";
        return;
    }

    let salida = "// ─── ANÁLISIS LÉXICO ────────────────────\n";
    let hayErrorLexico = false;

    tokens.forEach(t => {
        if (palabras.includes(t)) {
            salida += `  ${t.padEnd(14)} →  PALABRA_RESERVADA\n`;
        } else if (operadores.includes(t)) {
            salida += `  ${t.padEnd(14)} →  OPERADOR\n`;
        } else if (/^\d+$/.test(t)) {
            salida += `  ${t.padEnd(14)} →  NÚMERO\n`;
        } else if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(t)) {
            salida += `  ${t.padEnd(14)} →  IDENTIFICADOR\n`;
        } else if (t === ";") {
            salida += `  ${t.padEnd(14)} →  SÍMBOLO\n`;
        } else {
            salida += `  ${t.padEnd(14)} →  ⚠ ERROR LÉXICO\n`;
            hayErrorLexico = true;
        }
    });

    salida += "\n// ─── ANÁLISIS SINTÁCTICO ─────────────────\n";

    const errores = [];
    if (tokens[0] !== "SI")              errores.push("  ✘ Falta palabra reservada SI al inicio");
    if (!tokens.includes("ENTONCES"))    errores.push("  ✘ Falta ENTONCES");
    if (!tokens.includes(";"))           errores.push("  ✘ Falta símbolo de fin de regla ';'");
    const tieneAccion = tokens.some(t => ["APROBAR","RECHAZAR","CONDICIONAR"].includes(t));
    if (!tieneAccion)                    errores.push("  ✘ Falta acción (APROBAR / RECHAZAR / CONDICIONAR)");

    if (errores.length > 0 || hayErrorLexico) {
        salida += errores.join("\n") || "";
        if (hayErrorLexico) salida += "\n  ✘ Se detectaron errores léxicos";
        salida += "\n\n  ✘ Regla inválida";
        resultado.style.color = "var(--err-color, #f87171)";
    } else {
        salida += "  ✔ Estructura SI ... ENTONCES ... ; detectada\n";

        // Tabla de símbolos
        salida += "\n// ─── TABLA DE SÍMBOLOS ───────────────────\n";
        const ids = tokens.filter(t => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(t) && !palabras.includes(t));
        const unique = [...new Set(ids)];
        if (unique.length === 0) {
            salida += "  (sin identificadores)\n";
        } else {
            unique.forEach((id, i) => {
                salida += `  ${String(i+1).padStart(3,'0')}  ${id.padEnd(14)} →  número  /  uso: condición\n`;
            });
        }

        salida += "\n// ─── RESULTADO ───────────────────────────\n";
        salida += "  ✔ Regla compilada exitosamente";
        resultado.style.color = "var(--green, #22c55e)";
    }

    resultado.textContent = salida;
}

function limpiar() {
    document.getElementById("codigo").value = "";
    const r = document.getElementById("resultado");
    r.textContent = "// Escribe una regla y presiona Compilar...";
    r.style.color = "";
}

// ─── SCROLL REVEAL ───────────────────────────────────────────
(function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Use custom delay if set via --d, otherwise stagger by index
                if (!el.style.getPropertyValue('--d')) {
                    const siblings = [...el.parentElement.querySelectorAll('.reveal')];
                    const idx = siblings.indexOf(el);
                    el.style.setProperty('--d', (idx * 0.07) + 's');
                }
                // Slight delay so CSS var is applied before class triggers animation
                requestAnimationFrame(() => el.classList.add('visible'));
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// Smooth Scroll Mejorado 
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        e.preventDefault();
        
        const headerOffset = 90;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});