import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { cargarTodo, seedSiVacio, db } from "./supabase.js";


const uid = (p) => p + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
const hoy = () => new Date().toISOString().slice(0, 10);
const fmtFecha = (iso) => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
// Compatibilidad: alumnos viejos tienen "name"; los nuevos, nombre + apellido + dni
const nombreCompleto = (s) => (s.apellido ? `${s.apellido}, ${s.nombre}` : (s.name || s.nombre || ""));
const limpiarDni = (d) => (d || "").replace(/[.\s]/g, "");
const DIA_IDX = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
// Devuelve todas las fechas (ISO) de un mes que caen en cierto dia de la semana
const fechasDelMes = (year, month, diaIdx) => {
  const out = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    if (d.getDay() === diaIdx) {
      out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
};
const dniValido = (d) => /^\d{7,8}$/.test(limpiarDni(d));

// ============ LOGO SPLASH FIT (imagen real incrustada) ============
const LOGO_B64 = "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";
const Logo = ({ size = 44 }) => (
  <img src={"data:image/jpeg;base64," + LOGO_B64} alt="Splash Fit"
    style={{ width: size, height: "auto", display: "block", margin: "0 auto" }} />
);
const LogoChip = ({ size = 30 }) => (
  <div style={{ background: "#fff", borderRadius: 8, padding: 3, display: "flex", alignItems: "center" }}>
    <Logo size={size} />
  </div>
);

// ============ APP PRINCIPAL ============
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [session, setSession] = useState(null); // usuario logueado

  // Cargar todo desde Supabase al iniciar
  const refrescar = useCallback(async () => {
    const fresco = await cargarTodo();
    setData(fresco);
    return fresco;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await seedSiVacio();      // precarga inicial solo si está vacío
        await refrescar();        // trae los datos reales
      } catch (e) {
        console.error(e);
        setSaveError(true);
      }
      setLoading(false);
    })();
  }, [refrescar]);

  // persist: recibe el estado nuevo (para pintar al instante) y una función
  // opcional que ejecuta el guardado real en Supabase.
  const persist = useCallback(async (next, guardar) => {
    setData(next); // respuesta visual inmediata
    if (!guardar) return;
    try {
      await guardar(db);
      setSaveError(false);
    } catch (e) {
      console.error(e);
      setSaveError(true);
      // si falló, recargamos para no quedar desincronizados
      try { await refrescar(); } catch {}
    }
  }, [refrescar]);

  if (loading || !data) {
    return (
      <div style={S.loadWrap}><Logo size={64} /><div style={S.loadText}>Cargando…</div></div>
    );
  }

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      {saveError && <div style={S.errBar}>Hubo un problema al guardar o conectar. Revisá internet y volvé a intentar.</div>}
      {!session ? (
        <Login data={data} onLogin={setSession} />
      ) : session.role === "admin" ? (
        <AdminPanel data={data} persist={persist} user={session} logout={() => setSession(null)} />
      ) : (
        <ProfePanel data={data} persist={persist} user={session} logout={() => setSession(null)} />
      )}
    </div>
  );
}

// ============ LOGIN ============
function Login({ data, onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const entrar = () => {
    const user = data.users.find(
      (x) => x.username.toLowerCase() === u.trim().toLowerCase() && x.password === p
    );
    if (!user) return setErr("Usuario o contraseña incorrectos.");
    if (!user.active) return setErr("Este usuario está dado de baja. Consultá con administración.");
    onLogin(user);
  };

  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <Logo size={72} />
          <div style={S.brandBig}>SPLASH <span style={{ color: NARANJA }}>FIT</span></div>
          <div style={S.brandSub}>Escuelas deportivas · Bariloche</div>
        </div>
        <label style={S.label}>Usuario</label>
        <input style={S.input} value={u} onChange={(e) => { setU(e.target.value); setErr(""); }} autoCapitalize="none" />
        <label style={{ ...S.label, marginTop: 12 }}>Contraseña</label>
        <input style={S.input} type="password" value={p}
          onChange={(e) => { setP(e.target.value); setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && entrar()} />
        {err && <div style={S.loginErr}>{err}</div>}
        <button style={{ ...S.btnPrimary, background: NARANJA, width: "100%", marginTop: 16, padding: "13px" }} onClick={entrar}>
          Entrar
        </button>
      </div>
    </div>
  );
}

// ============ BARRA SUPERIOR ============
function TopBar({ user, logout, subtitle }) {
  return (
    <header style={S.topBar}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <LogoChip />
        <div>
          <div style={S.topTitle}>SPLASH <span style={{ color: "#F5975B" }}>FIT</span></div>
          <div style={S.topSub}>{subtitle || user.name}</div>
        </div>
      </div>
      <button style={S.btnLogout} onClick={logout}>Salir</button>
    </header>
  );
}

// ============ PANEL DEL ADMINISTRADOR ============
function AdminPanel({ data, persist, user, logout }) {
  const [tab, setTab] = useState("actividades");
  return (
    <div style={S.page}>
      <TopBar user={user} logout={logout} subtitle="Administración" />
      <nav style={S.tabs}>
        {[["actividades", "Actividades"], ["profes", "Profes"], ["reportes", "Reportes"]].map(([k, l]) => (
          <button key={k} style={{ ...S.tab, ...(tab === k ? S.tabOn : {}) }} onClick={() => setTab(k)}>{l}</button>
        ))}
      </nav>
      {tab === "profes" && <AdminProfes data={data} persist={persist} />}
      {tab === "actividades" && <AdminActividades data={data} persist={persist} />}
      {tab === "reportes" && <Reportes data={data} />}
    </div>
  );
}

// ---- Gestión de profes ----
function AdminProfes({ data, persist }) {
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [editPass, setEditPass] = useState(null); // {id, value}
  const [err, setErr] = useState("");
  const profes = data.users.filter((u) => u.role === "profe");

  const agregar = () => {
    const { name, username, password } = form;
    if (!name.trim() || !username.trim() || !password.trim()) return setErr("Completá los tres campos.");
    if (data.users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase()))
      return setErr("Ese nombre de usuario ya existe. Elegí otro.");
    const nuevo = { id: uid("u"), name: name.trim(), username: username.trim(), password, role: "profe", active: true };
    persist(
      { ...data, users: [...data.users, nuevo] },
      (db) => db.addUser(nuevo)
    );
    setForm({ name: "", username: "", password: "" });
    setErr("");
  };

  const setActivo = (id, active) =>
    persist(
      { ...data, users: data.users.map((u) => (u.id === id ? { ...u, active } : u)) },
      (db) => db.updateUser(id, { active })
    );

  const guardarPass = () => {
    if (!editPass.value.trim()) return;
    const id = editPass.id, password = editPass.value;
    persist(
      { ...data, users: data.users.map((u) => (u.id === id ? { ...u, password } : u)) },
      (db) => db.updateUser(id, { password })
    );
    setEditPass(null);
  };

  return (
    <div style={S.section}>
      <div style={S.card}>
        <div style={S.cardTitle}>Agregar profe (o reemplazo)</div>
        <label style={S.label}>Nombre</label>
        <input style={S.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Marcos Suárez" />
        <label style={{ ...S.label, marginTop: 10 }}>Usuario</label>
        <input style={S.input} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Ej: marcos" autoCapitalize="none" />
        <label style={{ ...S.label, marginTop: 10 }}>Contraseña</label>
        <input style={S.input} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Ej: pileta123" />
        {err && <div style={S.loginErr}>{err}</div>}
        <button style={{ ...S.btnPrimary, marginTop: 12 }} onClick={agregar}>Dar de alta</button>
      </div>

      {profes.map((p) => (
        <div key={p.id} style={{ ...S.card, opacity: p.active ? 1 : 0.65 }}>
          <div style={S.rowBetween}>
            <div>
              <div style={S.itemTitle}>{p.name}</div>
              <div style={S.meta}>Usuario: {p.username} {p.active ? "· Acceso activo" : "· DADO DE BAJA (no puede entrar)"}</div>
            </div>
            {p.active ? (
              <button style={S.btnDanger} onClick={() => setActivo(p.id, false)}>Dar de baja</button>
            ) : (
              <button style={S.btnSmall} onClick={() => setActivo(p.id, true)}>Reactivar</button>
            )}
          </div>
          {editPass?.id === p.id ? (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input style={{ ...S.input, flex: 1 }} value={editPass.value} onChange={(e) => setEditPass({ ...editPass, value: e.target.value })} placeholder="Nueva contraseña" />
              <button style={S.btnSmall} onClick={guardarPass}>Guardar</button>
            </div>
          ) : (
            <button style={{ ...S.btnGhost, marginTop: 10 }} onClick={() => setEditPass({ id: p.id, value: "" })}>Cambiar contraseña</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- Gestión de actividades, horarios y listas ----
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function AdminActividades({ data, persist }) {
  const [abierta, setAbierta] = useState(null);
  const [nueva, setNueva] = useState({ name: "", profeId: "" });
  const [rename, setRename] = useState(null); // {id, value}
  const [horario, setHorario] = useState({ dia: "Lunes", hora: "18:00" });
  const [verLista, setVerLista] = useState(null); // horarioId
  const [confirmar, setConfirmar] = useState(null); // {tipo:'horario'|'actividad', id}
  const profes = data.users.filter((u) => u.role === "profe");
  const nombreProfe = (id) => data.users.find((u) => u.id === id)?.name || "Sin profe";

  const agregarActividad = () => {
    if (!nueva.name.trim() || !nueva.profeId) return;
    const act = { id: uid("a"), name: nueva.name.trim(), profeId: nueva.profeId, orden: data.activities.length, schedules: [] };
    persist(
      { ...data, activities: [...data.activities, act] },
      (db) => db.addActivity(act)
    );
    setNueva({ name: "", profeId: "" });
  };

  const renombrar = (actId) => {
    if (!rename.value.trim()) return setRename(null);
    const name = rename.value.trim();
    persist(
      { ...data, activities: data.activities.map((a) => (a.id === actId ? { ...a, name } : a)) },
      (db) => db.updateActivity(actId, { name })
    );
    setRename(null);
  };

  const cambiarProfe = (actId, profeId) =>
    persist(
      { ...data, activities: data.activities.map((a) => (a.id === actId ? { ...a, profeId } : a)) },
      (db) => db.updateActivity(actId, { profeId })
    );

  const agregarHorario = (actId) => {
    const label = `${horario.dia} ${horario.hora} hs`;
    const act = data.activities.find((a) => a.id === actId);
    if (act && act.schedules.some((h) => h.label === label)) return; // ya existe ese horario
    const nuevoHor = { id: uid("h"), label };
    persist(
      {
        ...data,
        activities: data.activities.map((a) =>
          a.id === actId ? { ...a, schedules: [...a.schedules, nuevoHor] } : a
        ),
      },
      (db) => db.addSchedule(actId, nuevoHor)
    );
  };

  const borrarHorario = (actId, horId) => {
    const students = { ...data.students }; delete students[horId];
    const attendance = { ...data.attendance }; delete attendance[horId];
    persist(
      {
        ...data,
        students,
        attendance,
        activities: data.activities.map((a) =>
          a.id === actId ? { ...a, schedules: a.schedules.filter((h) => h.id !== horId) } : a
        ),
      },
      (db) => db.deleteSchedule(horId)
    );
    setConfirmar(null);
  };

  const borrarActividad = (actId) => {
    const act = data.activities.find((a) => a.id === actId);
    const students = { ...data.students };
    const attendance = { ...data.attendance };
    (act?.schedules || []).forEach((h) => { delete students[h.id]; delete attendance[h.id]; });
    persist(
      { ...data, students, attendance, activities: data.activities.filter((a) => a.id !== actId) },
      (db) => db.deleteActivity(actId)
    );
    setConfirmar(null);
    setAbierta(null);
  };

  return (
    <div style={S.section}>
      <div style={S.card}>
        <div style={S.cardTitle}>Nueva actividad</div>
        <label style={S.label}>Nombre</label>
        <input style={S.input} value={nueva.name} onChange={(e) => setNueva({ ...nueva, name: e.target.value })} placeholder="Ej: Fútbol infantil" />
        <label style={{ ...S.label, marginTop: 10 }}>Profe a cargo</label>
        <select style={S.input} value={nueva.profeId} onChange={(e) => setNueva({ ...nueva, profeId: e.target.value })}>
          <option value="">Elegí un profe…</option>
          {profes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button style={{ ...S.btnPrimary, marginTop: 12 }} onClick={agregarActividad}>Crear actividad</button>
      </div>

      {data.activities.map((act) => (
        <div key={act.id} style={S.card}>
          <button className="rowBtn" style={S.expandHead} onClick={() => { setAbierta(abierta === act.id ? null : act.id); setVerLista(null); }}>
            <div>
              <div style={S.itemTitle}>{act.name}</div>
              <div style={S.meta}>{nombreProfe(act.profeId)} · {act.schedules.length} horario{act.schedules.length !== 1 ? "s" : ""}</div>
            </div>
            <span style={S.meta}>{abierta === act.id ? "▲" : "▼"}</span>
          </button>

          {abierta === act.id && (
            <div style={{ marginTop: 12 }}>
              {rename?.id === act.id ? (
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input style={{ ...S.input, flex: 1 }} value={rename.value} onChange={(e) => setRename({ ...rename, value: e.target.value })} />
                  <button style={S.btnSmall} onClick={() => renombrar(act.id)}>Guardar</button>
                </div>
              ) : (
                <button style={{ ...S.btnGhost, marginBottom: 10 }} onClick={() => setRename({ id: act.id, value: act.name })}>Cambiar nombre</button>
              )}

              <label style={S.label}>Profe a cargo</label>
              <select style={S.input} value={act.profeId} onChange={(e) => cambiarProfe(act.id, e.target.value)}>
                {profes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <div style={{ ...S.cardTitle, marginTop: 16 }}>Horarios</div>
              {act.schedules.map((h) => (
                <div key={h.id} style={S.listRow}>
                  <div style={{ fontWeight: 700 }}>{h.label}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {confirmar?.tipo === "horario" && confirmar.id === h.id ? (
                      <>
                        <button style={S.btnConfirm} onClick={() => borrarHorario(act.id, h.id)}>Sí, borrar</button>
                        <button style={S.btnGhost} onClick={() => setConfirmar(null)}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button style={S.btnSmall} onClick={() => setVerLista(verLista === h.id ? null : h.id)}>
                          {verLista === h.id ? "Cerrar lista" : "Ver lista"}
                        </button>
                        <button style={S.btnDanger} onClick={() => setConfirmar({ tipo: "horario", id: h.id })}>Borrar</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {act.schedules.map((h) =>
                verLista === h.id ? (
                  <RosterAdmin key={"r" + h.id} data={data} persist={persist} horarioId={h.id} label={`${act.name} · ${h.label}`} />
                ) : null
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <select style={{ ...S.input, flex: 1 }} value={horario.dia} onChange={(e) => setHorario({ ...horario, dia: e.target.value })}>
                  {DIAS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <input style={{ ...S.input, width: 110 }} type="time" value={horario.hora} onChange={(e) => setHorario({ ...horario, hora: e.target.value })} />
                <button style={S.btnSmall} onClick={() => agregarHorario(act.id)}>Agregar</button>
              </div>

              <div style={{ marginTop: 14, borderTop: "1px solid #EDF5F8", paddingTop: 12 }}>
                {confirmar?.tipo === "actividad" && confirmar.id === act.id ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "#C0503A", fontWeight: 700 }}>
                      ¿Eliminar "{act.name}" con todos sus horarios, listas y asistencias?
                    </span>
                    <button style={S.btnConfirm} onClick={() => borrarActividad(act.id)}>Sí, eliminar</button>
                    <button style={S.btnGhost} onClick={() => setConfirmar(null)}>Cancelar</button>
                  </div>
                ) : (
                  <button style={S.btnDanger} onClick={() => setConfirmar({ tipo: "actividad", id: act.id })}>Eliminar actividad</button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- Lista de alumnos (vista admin: alta + baja) ----
function RosterAdmin({ data, persist, horarioId, label }) {
  const alumnos = data.students[horarioId] || [];
  const activos = alumnos.filter((s) => s.active);
  const bajas = alumnos.filter((s) => !s.active);
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "" });
  const [err, setErr] = useState("");
  const [verBajas, setVerBajas] = useState(false);

  const agregar = () => {
    const nombre = form.nombre.trim(), apellido = form.apellido.trim(), dni = limpiarDni(form.dni);
    if (!nombre || !apellido || !dni) return setErr("Completá nombre, apellido y DNI.");
    if (!dniValido(dni)) return setErr("El DNI debe tener 7 u 8 números, sin puntos.");
    if (alumnos.some((s) => limpiarDni(s.dni) === dni))
      return setErr("Ya hay un alumno con ese DNI en esta lista.");
    const nuevo = { id: uid("s"), nombre, apellido, dni, tel: "", active: true, alta: hoy(), baja: null };
    persist(
      { ...data, students: { ...data.students, [horarioId]: [...alumnos, nuevo] } },
      (db) => db.addStudent(horarioId, nuevo)
    );
    setForm({ nombre: "", apellido: "", dni: "" });
    setErr("");
  };

  const setActivo = (id, active) => {
    const baja = active ? null : hoy();
    persist(
      {
        ...data,
        students: {
          ...data.students,
          [horarioId]: alumnos.map((s) => (s.id === id ? { ...s, active, baja } : s)),
        },
      },
      (db) => db.updateStudent(id, { active, baja })
    );
  };

  return (
    <div style={S.rosterBox}>
      <div style={S.cardTitle}>{label}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input style={{ ...S.input, flex: 1 }} placeholder="Nombre" value={form.nombre}
          onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setErr(""); }} />
        <input style={{ ...S.input, flex: 1 }} placeholder="Apellido" value={form.apellido}
          onChange={(e) => { setForm({ ...form, apellido: e.target.value }); setErr(""); }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input style={{ ...S.input, flex: 1 }} placeholder="DNI (sin puntos)" inputMode="numeric" value={form.dni}
          onChange={(e) => { setForm({ ...form, dni: e.target.value }); setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && agregar()} />
        <button style={S.btnSmall} onClick={agregar}>Agregar</button>
      </div>
      {err && <div style={S.loginErr}>{err}</div>}
      {activos.length === 0 && <p style={{ ...S.empty, marginTop: 8 }}>Lista vacía. Cargá los inscriptos arriba.</p>}
      {activos.map((s) => (
        <div key={s.id} style={S.listRow}>
          <div>
            <div style={{ fontWeight: 700 }}>{nombreCompleto(s)}</div>
            <div style={S.meta}>DNI: {s.dni || "sin cargar"} · Alta: {fmtFecha(s.alta)}{s.tel ? ` · Tel: ${s.tel}` : ""}</div>
          </div>
          <button style={S.btnDanger} onClick={() => setActivo(s.id, false)}>Dar de baja</button>
        </div>
      ))}
      {bajas.length > 0 && (
        <>
          <button style={{ ...S.btnGhost, marginTop: 8 }} onClick={() => setVerBajas(!verBajas)}>
            {verBajas ? "Ocultar" : "Ver"} dados de baja ({bajas.length})
          </button>
          {verBajas && bajas.map((s) => (
            <div key={s.id} style={{ ...S.listRow, opacity: 0.7 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{nombreCompleto(s)}</div>
                <div style={S.meta}>DNI: {s.dni || "sin cargar"} · Baja: {fmtFecha(s.baja)}{s.tel ? ` · Tel: ${s.tel}` : ""}</div>
              </div>
              <button style={S.btnSmall} onClick={() => setActivo(s.id, true)}>Reincorporar</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ============ PANEL DEL PROFE ============
function ProfePanel({ data, persist, user, logout }) {
  const misActividades = data.activities.filter((a) => a.profeId === user.id);
  const [actId, setActId] = useState(misActividades[0]?.id || null);
  const act = misActividades.find((a) => a.id === actId);
  const [horarioId, setHorarioId] = useState(null);

  useEffect(() => {
    // al cambiar de actividad, elegir el primer horario
    setHorarioId(act?.schedules[0]?.id || null);
  }, [actId]); // eslint-disable-line

  if (misActividades.length === 0) {
    return (
      <div style={S.page}>
        <TopBar user={user} logout={logout} />
        <p style={{ ...S.empty, margin: 16 }}>Todavía no tenés actividades asignadas. Consultá con administración.</p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <TopBar user={user} logout={logout} />
      <nav style={{ ...S.tabs, flexWrap: "wrap" }}>
        {misActividades.map((a) => (
          <button key={a.id} style={{ ...S.tab, ...(actId === a.id ? S.tabOn : {}) }} onClick={() => setActId(a.id)}>
            {a.name}
          </button>
        ))}
      </nav>

      {act && (
        <div style={S.section}>
          {act.schedules.length === 0 ? (
            <p style={S.empty}>Esta actividad todavía no tiene horarios cargados. Pedile a administración que los agregue.</p>
          ) : (
            <>
              <div style={S.chipRow}>
                {act.schedules.map((h) => (
                  <button key={h.id} style={{ ...S.chip, ...(horarioId === h.id ? S.chipOn : {}) }} onClick={() => setHorarioId(h.id)}>
                    {h.label}
                  </button>
                ))}
              </div>
              {horarioId && (
                <ClaseProfe data={data} persist={persist} horarioId={horarioId}
                  label={act.schedules.find((h) => h.id === horarioId)?.label || ""} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Toma de asistencia + lista (vista profe) ----
function ClaseProfe({ data, persist, horarioId, label }) {
  const alumnos = (data.students[horarioId] || []).filter((s) => s.active);
  const registros = data.attendance[horarioId] || {};
  const [fecha, setFecha] = useState(hoy());

  // Dias del mes que corresponden a esta clase (ej: todos los lunes)
  const diaIdx = DIA_IDX[(label || "").split(" ")[0]];
  const ahora = new Date();
  const [mes, setMes] = useState({ y: ahora.getFullYear(), m: ahora.getMonth() });
  const fechasMes = diaIdx === undefined ? [] : fechasDelMes(mes.y, mes.m, diaIdx);

  useEffect(() => {
    if (diaIdx === undefined) return;
    const h = hoy();
    const elegir = fechasMes.includes(h)
      ? h
      : [...fechasMes].reverse().find((f) => f <= h) || fechasMes[0];
    if (elegir) setFecha(elegir);
  }, [horarioId, mes.y, mes.m]); // eslint-disable-line
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", tel: "" });
  const [err, setErr] = useState("");
  const presentes = registros[fecha] || []; // ids de los presentes

  const toggle = (id) => {
    const estabaPresente = presentes.includes(id);
    const nuevos = estabaPresente ? presentes.filter((x) => x !== id) : [...presentes, id];
    persist(
      { ...data, attendance: { ...data.attendance, [horarioId]: { ...registros, [fecha]: nuevos } } },
      (db) => estabaPresente
        ? db.marcarAusente(horarioId, fecha, id)
        : db.marcarPresente(horarioId, fecha, id)
    );
  };

  const agregarAlumno = () => {
    const nombre = form.nombre.trim(), apellido = form.apellido.trim(), dni = limpiarDni(form.dni);
    const tel = form.tel.trim();
    if (!nombre || !apellido || !dni || !tel) return setErr("Completá nombre, apellido, DNI y teléfono.");
    if (tel.replace(/\D/g, "").length < 6) return setErr("Revisá el teléfono: quedó muy corto.");
    if (!dniValido(dni)) return setErr("El DNI debe tener 7 u 8 números, sin puntos.");
    const lista = data.students[horarioId] || [];
    if (lista.some((s) => limpiarDni(s.dni) === dni))
      return setErr("Ya hay un alumno con ese DNI en esta lista.");
    const nuevo = { id: uid("s"), nombre, apellido, dni, tel, active: true, alta: hoy(), baja: null };
    persist(
      { ...data, students: { ...data.students, [horarioId]: [...lista, nuevo] } },
      (db) => db.addStudent(horarioId, nuevo)
    );
    setForm({ nombre: "", apellido: "", dni: "", tel: "" });
    setErr("");
  };

  return (
    <>
      <div style={S.card}>
        {diaIdx === undefined ? (
          <>
            <label style={S.label}>Fecha de la clase</label>
            <input type="date" style={S.input} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </>
        ) : (
          <>
            <div style={S.rowBetween}>
              <button style={S.btnGhost} onClick={() => setMes(mes.m === 0 ? { y: mes.y - 1, m: 11 } : { y: mes.y, m: mes.m - 1 })}>◀ Mes</button>
              <div style={{ fontWeight: 800, color: AZUL }}>{MESES[mes.m]} {mes.y}</div>
              <button style={S.btnGhost} onClick={() => setMes(mes.m === 11 ? { y: mes.y + 1, m: 0 } : { y: mes.y, m: mes.m + 1 })}>Mes ▶</button>
            </div>
            <div style={{ ...S.chipRow, marginTop: 12, marginBottom: 0 }}>
              {fechasMes.map((f) => (
                <button key={f} style={{ ...S.chip, ...(fecha === f ? S.chipOn : {}) }} onClick={() => setFecha(f)}>
                  {(label || "").split(" ")[0]} {parseInt(f.slice(8), 10)}{(registros[f] || []).length > 0 ? " ✓" : ""}
                </button>
              ))}
            </div>
            <p style={{ ...S.hint, margin: "10px 0 0" }}>
              Clase seleccionada: <strong>{fmtFecha(fecha)}</strong> · El ✓ marca clases con asistencia ya cargada.
            </p>
          </>
        )}
      </div>

      {alumnos.length === 0 ? (
        <p style={S.empty}>No hay alumnos en esta lista todavía. Podés sumar el primero abajo.</p>
      ) : (
        <>
          {alumnos.map((s) => {
            const presente = presentes.includes(s.id);
            return (
              <button key={s.id} className="rowBtn"
                style={{ ...S.attRow, background: presente ? "#E3F6EA" : "#FDEEEA", borderColor: presente ? "#7FC99A" : "#EDB9AC" }}
                onClick={() => toggle(s.id)}>
                <span style={{ textAlign: "left" }}>
                  <span style={{ fontWeight: 700, fontSize: 16, display: "block" }}>{nombreCompleto(s)}</span>
                  <span style={S.meta}>DNI: {s.dni || "sin cargar"}</span>
                </span>
                <span style={{ ...S.badge, background: presente ? "#1E8E4F" : "#C0503A" }}>
                  {presente ? "Presente" : "Ausente"}
                </span>
              </button>
            );
          })}
          <div style={S.summary}>
            <strong>{presentes.filter((id) => alumnos.some((a) => a.id === id)).length}</strong> presentes de <strong>{alumnos.length}</strong> · {fmtFecha(fecha)}
          </div>
          <p style={S.hint}>Todos arrancan en Ausente. Un toque en el nombre lo pasa a Presente (verde); otro toque lo vuelve a Ausente. Se guarda solo.</p>
        </>
      )}

      <div style={{ ...S.card, marginTop: 12 }}>
        <div style={S.cardTitle}>Sumar integrante nuevo</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Nombre" value={form.nombre}
            onChange={(e) => { setForm({ ...form, nombre: e.target.value }); setErr(""); }} />
          <input style={{ ...S.input, flex: 1 }} placeholder="Apellido" value={form.apellido}
            onChange={(e) => { setForm({ ...form, apellido: e.target.value }); setErr(""); }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="DNI (sin puntos)" inputMode="numeric" value={form.dni}
            onChange={(e) => { setForm({ ...form, dni: e.target.value }); setErr(""); }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Teléfono" inputMode="tel" value={form.tel}
            onChange={(e) => { setForm({ ...form, tel: e.target.value }); setErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && agregarAlumno()} />
          <button style={S.btnSmall} onClick={agregarAlumno}>Agregar</button>
        </div>
        {err && <div style={S.loginErr}>{err}</div>}
        <p style={{ ...S.hint, marginBottom: 0 }}>Las bajas de la lista las hace solo administración.</p>
      </div>
    </>
  );
}

// ============ REPORTES (ADMIN) ============
function Reportes({ data }) {
  const nombreProfe = (id) => data.users.find((u) => u.id === id)?.name || "—";
  const [detalle, setDetalle] = useState(null); // horarioId con resumen por alumno abierto
  const [msg, setMsg] = useState("");

  // Arma y descarga la planilla Excel con el balance completo
  const descargarBalance = () => {
    const filasClases = [];
    const filasAlumnos = [];
    data.activities.forEach((act) => {
      const profe = nombreProfe(act.profeId);
      act.schedules.forEach((h) => {
        const alumnos = data.students[h.id] || [];
        const activos = alumnos.filter((s) => s.active);
        const regs = data.attendance[h.id] || {};
        const fechas = Object.keys(regs).sort();
        let pres = 0;
        fechas.forEach((f) => (pres += regs[f].length));
        const posibles = fechas.length * activos.length;
        const pct = posibles > 0 ? Math.round((pres / posibles) * 100) : null;
        filasClases.push({
          "Actividad": act.name,
          "Profe": profe,
          "Horario": h.label,
          "Inscriptos": activos.length,
          "Clases dadas": fechas.length,
          "Promedio presentes por clase": fechas.length ? Math.round((pres / fechas.length) * 10) / 10 : "",
          "Asistencia %": pct === null ? "" : pct,
          "Ausentismo %": pct === null ? "" : 100 - pct,
        });
        alumnos.forEach((s) => {
          const vino = fechas.filter((f) => (regs[f] || []).includes(s.id)).length;
          filasAlumnos.push({
            "Actividad": act.name,
            "Horario": h.label,
            "Alumno": nombreCompleto(s),
            "DNI": s.dni || "",
            "Teléfono": s.tel || "",
            "Estado": s.active ? "Activo" : "Baja",
            "Clases dadas": fechas.length,
            "Presentes": vino,
            "Ausentes": fechas.length - vino,
            "Asistencia %": fechas.length ? Math.round((vino / fechas.length) * 100) : "",
          });
        });
      });
    });
    if (filasClases.length === 0) {
      setMsg("Todavía no hay horarios cargados para armar el balance.");
      return;
    }
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(filasClases);
    ws1["!cols"] = [{ wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 24 }, { wch: 12 }, { wch: 13 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Balance por clase");
    const ws2 = XLSX.utils.json_to_sheet(filasAlumnos);
    ws2["!cols"] = [{ wch: 22 }, { wch: 18 }, { wch: 26 }, { wch: 12 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Por alumno");
    XLSX.writeFile(wb, `balance-splash-fit-${hoy()}.xlsx`);
    setMsg("");
  };

  // Arma y descarga el listado general de faltas (para pasar a Socio Plus)
  const descargarFaltas = () => {
    const filasFaltas = [];
    const totalPorAlumno = {}; // dni+nombre -> resumen
    data.activities.forEach((act) => {
      act.schedules.forEach((h) => {
        const activos = (data.students[h.id] || []).filter((s) => s.active);
        const regs = data.attendance[h.id] || {};
        const fechas = Object.keys(regs).sort();
        fechas.forEach((f) => {
          const presentes = regs[f] || [];
          activos.forEach((s) => {
            if (!presentes.includes(s.id)) {
              filasFaltas.push({
                "Fecha": fmtFecha(f),
                "Actividad": act.name,
                "Horario": h.label,
                "Alumno": nombreCompleto(s),
                "DNI": s.dni || "",
              });
              const clave = (s.dni || "") + "|" + nombreCompleto(s);
              if (!totalPorAlumno[clave]) {
                totalPorAlumno[clave] = { "Alumno": nombreCompleto(s), "DNI": s.dni || "", "Actividad": act.name, "Total de faltas": 0 };
              }
              totalPorAlumno[clave]["Total de faltas"] += 1;
            }
          });
        });
      });
    });
    if (filasFaltas.length === 0) {
      setMsg("Todavía no hay faltas registradas para armar el listado.");
      return;
    }
    // Ordena el detalle por fecha (dd/mm/aaaa -> aaaa-mm-dd para comparar) y luego por alumno
    filasFaltas.sort((a, b) => {
      const fa = a["Fecha"].split("/").reverse().join("-");
      const fb = b["Fecha"].split("/").reverse().join("-");
      return fa === fb ? a["Alumno"].localeCompare(b["Alumno"]) : fa.localeCompare(fb);
    });
    const filasResumen = Object.values(totalPorAlumno).sort((a, b) => a["Alumno"].localeCompare(b["Alumno"]));
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(filasFaltas);
    ws1["!cols"] = [{ wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 26 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Faltas por fecha");
    const ws2 = XLSX.utils.json_to_sheet(filasResumen);
    ws2["!cols"] = [{ wch: 26 }, { wch: 12 }, { wch: 22 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Total por alumno");
    XLSX.writeFile(wb, `faltas-splash-fit-${hoy()}.xlsx`);
    setMsg("");
  };

  return (
    <div style={S.section}>
      <div style={S.card}>
        <div style={S.rowBetween}>
          <div>
            <div style={S.cardTitle}>Balance detallado</div>
            <p style={{ ...S.hint, margin: 0 }}>
              Descarga una planilla Excel con el % de asistencia y ausentismo de cada
              clase según sus inscriptos, más el detalle por alumno.
            </p>
          </div>
        </div>
        <button style={{ ...S.btnPrimary, marginTop: 10 }} onClick={descargarBalance}>
          ⬇ Descargar balance (Excel)
        </button>
      </div>
      <div style={S.card}>
        <div style={S.rowBetween}>
          <div>
            <div style={S.cardTitle}>Listado de faltas</div>
            <p style={{ ...S.hint, margin: 0 }}>
              Descarga una planilla Excel con todas las faltas registradas (fecha,
              actividad, horario, alumno y DNI), lista para pasar a Socio Plus.
            </p>
          </div>
        </div>
        <button style={{ ...S.btnPrimary, marginTop: 10 }} onClick={descargarFaltas}>
          ⬇ Descargar listado de faltas (Excel)
        </button>
        {msg && <div style={{ ...S.loginErr, marginTop: 10 }}>{msg}</div>}
      </div>
      {data.activities.length === 0 && <p style={S.empty}>No hay actividades cargadas.</p>}
      {data.activities.map((act) => {
        const porHorario = act.schedules.map((h) => {
          const alumnos = data.students[h.id] || [];
          const activos = alumnos.filter((s) => s.active);
          const regs = data.attendance[h.id] || {};
          const fechas = Object.keys(regs).filter((f) => (regs[f] || []).length >= 0).sort();
          let pres = 0;
          fechas.forEach((f) => (pres += regs[f].length));
          const posibles = fechas.length * activos.length;
          const pct = posibles > 0 ? Math.round((pres / posibles) * 100) : null;
          const promedio = fechas.length > 0 ? Math.round((pres / fechas.length) * 10) / 10 : null;
          return { h, alumnos, activos, regs, fechas, pres, pct, promedio };
        });

        let inscriptos = 0, clases = 0, sumP = 0, sumPos = 0;
        porHorario.forEach((x) => {
          inscriptos += x.activos.length;
          clases += x.fechas.length;
          sumP += x.pres;
          sumPos += x.fechas.length * x.activos.length;
        });
        const pctTotal = sumPos > 0 ? Math.round((sumP / sumPos) * 100) : null;

        return (
          <div key={act.id} style={S.card}>
            <div style={S.itemTitle}>{act.name}</div>
            <div style={S.meta}>{nombreProfe(act.profeId)}</div>
            <div style={S.statRow}>
              <div style={S.statBox}><div style={S.statNum}>{inscriptos}</div><div style={S.statLbl}>Inscriptos</div></div>
              <div style={S.statBox}><div style={S.statNum}>{clases}</div><div style={S.statLbl}>Clases dadas</div></div>
              <div style={S.statBox}>
                <div style={{ ...S.statNum, color: pctTotal === null ? "#8AA0B0" : pctTotal >= 70 ? "#1E8E4F" : pctTotal >= 40 ? "#C77F1A" : "#C0503A" }}>
                  {pctTotal === null ? "—" : pctTotal + "%"}
                </div>
                <div style={S.statLbl}>Asistencia</div>
              </div>
            </div>
            {pctTotal !== null && (
              <div style={S.barBg}><div style={{ ...S.barFill, width: pctTotal + "%" }} /></div>
            )}

            {porHorario.map(({ h, alumnos, activos, regs, fechas, pct, promedio }) => (
              <div key={h.id} style={S.balanceBox}>
                <div style={S.rowBetween}>
                  <div style={{ fontWeight: 800 }}>{h.label}</div>
                  <div style={S.meta}>{activos.length} inscriptos</div>
                </div>
                {fechas.length === 0 ? (
                  <div style={S.meta}>Sin clases registradas todavía.</div>
                ) : (
                  <div style={{ ...S.meta, marginTop: 4 }}>
                    {fechas.length} clase{fechas.length !== 1 ? "s" : ""} · promedio {promedio} presentes por clase ·{" "}
                    <span style={{ color: "#1E8E4F", fontWeight: 700 }}>{pct}% asistencia</span> ·{" "}
                    <span style={{ color: "#C0503A", fontWeight: 700 }}>{100 - pct}% ausentismo</span>
                  </div>
                )}
                {alumnos.length > 0 && fechas.length > 0 && (
                  <>
                    <button style={{ ...S.btnGhost, marginTop: 8 }} onClick={() => setDetalle(detalle === h.id ? null : h.id)}>
                      {detalle === h.id ? "Ocultar resumen por alumno" : "Ver resumen por alumno"}
                    </button>
                    {detalle === h.id && (
                      <div style={{ marginTop: 8 }}>
                        {[...alumnos]
                          .sort((a, b) => nombreCompleto(a).localeCompare(nombreCompleto(b)))
                          .map((s) => {
                            const vino = fechas.filter((f) => (regs[f] || []).includes(s.id)).length;
                            const pctA = Math.round((vino / fechas.length) * 100);
                            return (
                              <div key={s.id} style={S.histRow}>
                                <span>
                                  {nombreCompleto(s)}
                                  {!s.active && <span style={{ ...S.meta, marginLeft: 6 }}>(baja)</span>}
                                </span>
                                <span style={{ fontWeight: 700, color: pctA >= 70 ? "#1E8E4F" : pctA >= 40 ? "#C77F1A" : "#C0503A" }}>
                                  {vino}/{fechas.length} · {pctA}%
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {act.schedules.length === 0 && <div style={S.meta}>Sin horarios cargados.</div>}
          </div>
        );
      })}
    </div>
  );
}

// ============ ESTILOS ============
const CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  .rowBtn:active { transform: scale(0.985); }
  button, input, select { font-family: inherit; }
`;

const font = "'Trebuchet MS', 'Segoe UI', system-ui, -apple-system, sans-serif";
const AZUL = "#2C6E80";   // petroleo Splash Fit
const NARANJA = "#D95F27"; // naranja Splash Fit

const S = {
  app: { fontFamily: font, background: "#EEF4F5", minHeight: "100vh", color: "#12303F" },
  page: { maxWidth: 600, margin: "0 auto", paddingBottom: 40 },
  loadWrap: { display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", alignItems: "center", height: "100vh", background: "#EEF4F5", fontFamily: font },
  loadText: { color: "#4A6B7A" },
  errBar: { background: "#C0503A", color: "#fff", padding: "10px 16px", fontSize: 14, textAlign: "center" },

  loginWrap: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 16, background: `linear-gradient(180deg, #235968 0%, ${AZUL} 100%)` },
  loginCard: { background: "#fff", borderRadius: 18, padding: 24, width: "100%", maxWidth: 380, boxShadow: "0 8px 30px rgba(11,94,125,0.35)" },
  brandBig: { fontSize: 22, fontWeight: 800, letterSpacing: "0.18em", color: AZUL, marginTop: 8 },
  brandSub: { fontSize: 13, color: "#4A6B7A", marginBottom: 16 },
  loginErr: { background: "#FDEEEA", color: "#C0503A", borderRadius: 8, padding: "8px 12px", fontSize: 14, marginTop: 12 },

  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", background: AZUL, color: "#fff", padding: "12px 16px" },
  topTitle: { fontWeight: 800, letterSpacing: "0.15em", fontSize: 15 },
  topSub: { fontSize: 12, opacity: 0.85 },
  btnLogout: { background: "rgba(255,255,255,0.18)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 14, cursor: "pointer" },

  tabs: { display: "flex", background: "#CBE4ED", padding: 4, gap: 4, margin: "12px 16px", borderRadius: 10 },
  tab: { flex: 1, minWidth: 90, padding: "10px 6px", border: "none", borderRadius: 8, background: "transparent", color: "#33586A", fontSize: 14, cursor: "pointer" },
  tabOn: { background: "#fff", color: AZUL, fontWeight: 700 },

  section: { padding: "0 16px" },
  card: { background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: "0 1px 3px rgba(11,94,125,0.10)" },
  cardTitle: { fontWeight: 800, fontSize: 15, marginBottom: 10, color: AZUL },
  itemTitle: { fontWeight: 800, fontSize: 17 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  expandHead: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" },

  label: { display: "block", fontSize: 13, fontWeight: 700, color: "#33586A", marginBottom: 5 },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #B9D2DC", fontSize: 16, width: "100%", background: "#fff" },
  meta: { fontSize: 12, color: "#5A7684", marginTop: 2 },
  empty: { background: "#fff", border: "1px dashed #B9D2DC", borderRadius: 10, padding: 16, color: "#5A7684", fontSize: 14, textAlign: "center" },
  hint: { fontSize: 13, color: "#5A7684", lineHeight: 1.5 },

  listRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F4FAFC", border: "1px solid #DCEBF1", borderRadius: 10, padding: "10px 12px", marginBottom: 8, gap: 8 },
  rosterBox: { background: "#F4FAFC", border: "1px solid #CBE4ED", borderRadius: 12, padding: 14, margin: "4px 0 12px" },

  attRow: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: 14, border: "1px solid", borderRadius: 10, marginBottom: 8, cursor: "pointer", transition: "transform .05s", textAlign: "left" },
  badge: { color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, minWidth: 78, textAlign: "center" },
  summary: { background: "#fff", border: "1px solid #DCEBF1", borderRadius: 10, padding: "12px 14px", fontSize: 15, marginTop: 4 },

  chipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { padding: "8px 14px", borderRadius: 20, border: "1px solid #B9D2DC", background: "#fff", color: "#33586A", fontSize: 14, cursor: "pointer" },
  chipOn: { background: AZUL, color: "#fff", borderColor: AZUL, fontWeight: 700 },

  statRow: { display: "flex", gap: 8, margin: "12px 0" },
  statBox: { flex: 1, background: "#F4FAFC", borderRadius: 10, padding: "10px 8px", textAlign: "center" },
  statNum: { fontSize: 22, fontWeight: 800, color: AZUL },
  statLbl: { fontSize: 12, color: "#5A7684" },
  barBg: { background: "#DCEBF1", borderRadius: 20, height: 10, overflow: "hidden", marginBottom: 10 },
  barFill: { background: `linear-gradient(90deg, ${AZUL}, ${NARANJA})`, height: "100%", borderRadius: 20 },
  balanceBox: { background: "#F4FAFC", border: "1px solid #DCEBF1", borderRadius: 10, padding: "10px 12px", marginTop: 8 },
  histRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", fontSize: 14, borderTop: "1px solid #EDF5F8", gap: 8 },

  btnPrimary: { background: AZUL, color: "#fff", border: "none", borderRadius: 8, padding: "11px 18px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  btnSmall: { background: AZUL, color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  btnConfirm: { background: "#C0503A", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  btnDanger: { background: "#fff", color: "#C0503A", border: "1px solid #E8BCB0", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  btnGhost: { background: "#fff", color: AZUL, border: "1px solid #B9D2DC", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};
