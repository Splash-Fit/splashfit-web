import { createClient } from "@supabase/supabase-js";

// Datos públicos del proyecto Splash Fit (seguros para el navegador)
const SUPABASE_URL = "https://olkjuvqlchldtipdtcbh.supabase.co";
const SUPABASE_KEY = "sb_publishable_NHKH8trqz_zGe44I4QMxwQ_FiTfimrr";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Cargar TODO desde la base de datos y armarlo como lo usa la app ----
export async function cargarTodo() {
  const [u, a, h, al, as] = await Promise.all([
    supabase.from("usuarios").select("*"),
    supabase.from("actividades").select("*").order("orden"),
    supabase.from("horarios").select("*"),
    supabase.from("alumnos").select("*"),
    supabase.from("asistencias").select("*"),
  ]);
  if (u.error || a.error || h.error || al.error || as.error) {
    throw (u.error || a.error || h.error || al.error || as.error);
  }

  // Armar actividades con sus horarios
  const activities = a.data.map((act) => ({
    id: act.id,
    name: act.nombre,
    profeId: act.profe_id,
    orden: act.orden,
    schedules: h.data
      .filter((x) => x.actividad_id === act.id)
      .map((x) => ({ id: x.id, label: x.label })),
  }));

  // Armar alumnos por horario
  const students = {};
  al.data.forEach((s) => {
    if (!students[s.horario_id]) students[s.horario_id] = [];
    students[s.horario_id].push({
      id: s.id, nombre: s.nombre, apellido: s.apellido, dni: s.dni,
      tel: s.tel, active: s.active, alta: s.alta, baja: s.baja,
    });
  });

  // Armar asistencias: { horarioId: { fecha: [alumnoId,...] } }
  const attendance = {};
  as.data.forEach((r) => {
    if (!attendance[r.horario_id]) attendance[r.horario_id] = {};
    if (!attendance[r.horario_id][r.fecha]) attendance[r.horario_id][r.fecha] = [];
    attendance[r.horario_id][r.fecha].push(r.alumno_id);
  });

  const users = u.data.map((x) => ({
    id: x.id, name: x.nombre, username: x.username,
    password: x.password, role: x.role, active: x.active,
  }));

  return { users, activities, students, attendance };
}

// ---- Operaciones individuales (cada cambio se guarda al instante) ----

export const db = {
  // Usuarios
  addUser: (u) => supabase.from("usuarios").insert({
    id: u.id, nombre: u.name, username: u.username, password: u.password, role: u.role, active: u.active,
  }),
  updateUser: (id, campos) => {
    const map = {};
    if ("name" in campos) map.nombre = campos.name;
    if ("username" in campos) map.username = campos.username;
    if ("password" in campos) map.password = campos.password;
    if ("role" in campos) map.role = campos.role;
    if ("active" in campos) map.active = campos.active;
    return supabase.from("usuarios").update(map).eq("id", id);
  },

  // Actividades
  addActivity: (a) => supabase.from("actividades").insert({
    id: a.id, nombre: a.name, profe_id: a.profeId, orden: a.orden || 0,
  }),
  updateActivity: (id, campos) => {
    const map = {};
    if ("name" in campos) map.nombre = campos.name;
    if ("profeId" in campos) map.profe_id = campos.profeId;
    return supabase.from("actividades").update(map).eq("id", id);
  },
  deleteActivity: (id) => supabase.from("actividades").delete().eq("id", id),

  // Horarios
  addSchedule: (actId, h) => supabase.from("horarios").insert({
    id: h.id, actividad_id: actId, label: h.label,
  }),
  deleteSchedule: (id) => supabase.from("horarios").delete().eq("id", id),

  // Alumnos
  addStudent: (horId, s) => supabase.from("alumnos").insert({
    id: s.id, horario_id: horId, nombre: s.nombre, apellido: s.apellido || "",
    dni: s.dni || "", tel: s.tel || "", active: s.active, alta: s.alta, baja: s.baja,
  }),
  updateStudent: (id, campos) => {
    const map = {};
    if ("active" in campos) map.active = campos.active;
    if ("baja" in campos) map.baja = campos.baja;
    if ("alta" in campos) map.alta = campos.alta;
    return supabase.from("alumnos").update(map).eq("id", id);
  },

  // Asistencia: marcar presente = insertar; desmarcar = borrar
  marcarPresente: (horId, fecha, alumnoId) => supabase.from("asistencias").insert({
    horario_id: horId, fecha, alumno_id: alumnoId,
  }),
  marcarAusente: (horId, fecha, alumnoId) => supabase.from("asistencias")
    .delete().eq("horario_id", horId).eq("fecha", fecha).eq("alumno_id", alumnoId),
};

// ---- Precarga inicial: solo si la base está vacía ----
import { SEED } from "./seed.js";

export async function seedSiVacio() {
  const { data, error } = await supabase.from("usuarios").select("id").limit(1);
  if (error) throw error;
  if (data && data.length > 0) return false; // ya hay datos, no hacer nada

  // Insertar usuarios
  await supabase.from("usuarios").insert(
    SEED.users.map((u) => ({
      id: u.id, nombre: u.name, username: u.username,
      password: u.password, role: u.role, active: u.active,
    }))
  );
  // Actividades
  await supabase.from("actividades").insert(
    SEED.activities.map((a, i) => ({
      id: a.id, nombre: a.name, profe_id: a.profeId, orden: i,
    }))
  );
  // Horarios
  const horarios = [];
  SEED.activities.forEach((a) =>
    a.schedules.forEach((h) => horarios.push({ id: h.id, actividad_id: a.id, label: h.label }))
  );
  if (horarios.length) await supabase.from("horarios").insert(horarios);
  // Alumnos
  const alumnos = [];
  Object.entries(SEED.students).forEach(([horId, lista]) =>
    lista.forEach((s) =>
      alumnos.push({
        id: s.id, horario_id: horId, nombre: s.nombre, apellido: s.apellido || "",
        dni: s.dni || "", tel: s.tel || "", active: s.active, alta: s.alta, baja: s.baja,
      })
    )
  );
  if (alumnos.length) await supabase.from("alumnos").insert(alumnos);
  return true;
}
