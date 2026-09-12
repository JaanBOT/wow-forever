/**
 * Forever Roster backend — Google Apps Script web app backed by a Google Sheet.
 *
 * Setup (once):
 *  1. Create a blank Google Sheet.  Extensions → Apps Script.
 *  2. Replace the default code with this file.  Save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me.   Who has access: Anyone.
 *  4. Copy the web app URL (ends in /exec) into API_URL at the top of index.html.
 *
 * The script creates the sheets it needs on first run.
 */

const SHEETS = {
  roster: ["id", "name", "character", "faction", "race", "cls", "roles", "time", "days", "notes", "createdAt"],
  events: ["id", "title", "date", "time", "kind", "notes", "rsvps", "createdAt"],
  plan:   ["key", "value"],
};

function sheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}

function readAll(name) {
  const sh = sheet(name), cols = SHEETS[name];
  const rows = sh.getDataRange().getValues().slice(1);
  return rows.filter((r) => r[0] !== "").map((r) => {
    const o = {};
    cols.forEach((c, i) => { o[c] = r[i]; });
    if (o.roles !== undefined) o.roles = parseJson(o.roles, []);
    if (o.days !== undefined) o.days = parseJson(o.days, []);
    if (o.rsvps !== undefined) o.rsvps = parseJson(o.rsvps, {});
    if (o.date !== undefined) o.date = toIsoDate(o.date);
    return o;
  });
}

function toIsoDate(v) {
  if (Object.prototype.toString.call(v) === "[object Date]") return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  return String(v).slice(0, 10);
}

function parseJson(v, fallback) { try { return v === "" || v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } }

function findRow(name, id) {
  const ids = sheet(name).getRange(2, 1, Math.max(1, sheet(name).getLastRow() - 1), 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function snapshot() {
  const plan = {};
  readAll("plan").forEach((r) => { plan[r.key] = parseJson(r.value, r.value); });
  return { roster: readAll("roster"), events: readAll("events"), plan: plan, serverTime: new Date().toISOString() };
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return out(snapshot());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const a = body.action;
    const clean = (s, n) => String(s == null ? "" : s).slice(0, n || 240);

    if (a === "addRoster") {
      const d = body.data || {};
      const id = Utilities.getUuid();
      sheet("roster").appendRow([id, clean(d.name, 40), clean(d.character, 24), clean(d.faction, 1), clean(d.race, 30), clean(d.cls, 20),
        JSON.stringify(Array.isArray(d.roles) ? d.roles.slice(0, 3) : []), clean(d.time, 40), JSON.stringify(Array.isArray(d.days) ? d.days.slice(0, 7) : []), clean(d.notes), new Date().toISOString()]);
      return out({ ok: true, id: id, ...snapshot() });
    }
    if (a === "deleteRoster") {
      const r = findRow("roster", body.id); if (r > 0) sheet("roster").deleteRow(r);
      return out({ ok: true, ...snapshot() });
    }
    if (a === "addEvent") {
      const d = body.data || {};
      const id = Utilities.getUuid();
      sheet("events").appendRow([id, clean(d.title, 60), "'" + clean(d.date, 10), clean(d.time, 40), clean(d.kind, 20), clean(d.notes), "{}", new Date().toISOString()]);
      return out({ ok: true, id: id, ...snapshot() });
    }
    if (a === "deleteEvent") {
      const r = findRow("events", body.id); if (r > 0) sheet("events").deleteRow(r);
      return out({ ok: true, ...snapshot() });
    }
    if (a === "rsvp") {
      const r = findRow("events", body.id);
      if (r > 0) {
        const col = SHEETS.events.indexOf("rsvps") + 1;
        const cell = sheet("events").getRange(r, col);
        const rsvps = parseJson(cell.getValue(), {});
        const who = clean(body.who, 64), v = clean(body.value, 8);
        if (!v || v === "none") delete rsvps[who]; else rsvps[who] = v;
        cell.setValue(JSON.stringify(rsvps));
      }
      return out({ ok: true, ...snapshot() });
    }
    if (a === "setPlan") {
      const sh = sheet("plan");
      const entries = body.data || {};
      Object.keys(entries).forEach((k) => {
        const r = findRow("plan", k), val = JSON.stringify(entries[k]);
        if (r > 0) sh.getRange(r, 2).setValue(val); else sh.appendRow([k, val]);
      });
      return out({ ok: true, ...snapshot() });
    }
    return out({ ok: false, error: "unknown action" });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
