"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Navigation from "@/components/Navigation";
import type { CarMake, Color, Formula, AppSettings } from "@/types";
import { COLOR_TYPE_MAP } from "@/lib/constants";

// ---------- sub-components ----------

function TabBar({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  const tabs = [
    { key: "brands", label: "Brands" },
    { key: "colors", label: "Colors" },
    { key: "formulas", label: "Formulas" },
    { key: "settings", label: "Settings" },
  ];
  return (
    <div className="flex gap-0 border-b border-gray-200 mb-6">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            active === t.key
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Spinner() {
  return <div className="flex justify-center py-12 text-gray-400">Loading...</div>;
}

function alertSucceeded(msg: string) {
  // Tiny in-page toast; for now just alert
  alert(msg);
}

// ============= BRANDS TAB =============
function BrandsTab({
  brands,
  setBrands,
  colors,
  formulas,
  saving,
  onSave,
}: {
  brands: CarMake[];
  setBrands: (b: CarMake[]) => void;
  colors: Color[];
  formulas: Formula[];
  saving: boolean;
  onSave: (b: CarMake[]) => Promise<void>;
}) {
  const [editing, setEditing] = useState<CarMake | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<CarMake>({ id: "", name: "", region: "JPN" });

  function startAdd() {
    setAdding(true);
    setForm({ id: "", name: "", region: "JPN" });
  }
  function startEdit(b: CarMake) {
    setEditing(b);
    setForm({ ...b });
  }
  function cancel() {
    setAdding(false);
    setEditing(null);
  }
  function submit() {
    if (!form.id.trim() || !form.name.trim()) return;
    if (adding) {
      setBrands([...brands, form]);
    } else if (editing) {
      setBrands(brands.map((b) => (b.id === editing.id ? form : b)));
    }
    cancel();
  }
  async function handleDelete(b: CarMake) {
    if (
      colors.some((c) => c.make_id === b.id) ||
      !confirm(`Delete "${b.name}"? This will not affect colors.`)
    )
      return;
    setBrands(brands.filter((x) => x.id !== b.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{brands.length} brands</span>
        <button onClick={startAdd} className="rounded bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700">
          + Add Brand
        </button>
      </div>

      {(adding || editing) && (
        <div className="mb-4 flex gap-2 items-end bg-gray-50 p-3 rounded-lg">
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            ID
            <input className="rounded border px-2 py-1 text-sm" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editing} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Name
            <input className="rounded border px-2 py-1 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Region
            <select className="rounded border px-2 py-1 text-sm" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as CarMake["region"] })}>
              <option>JPN</option><option>EUR</option><option>USA</option><option>CHN</option><option>KOR</option>
            </select>
          </label>
          <button onClick={submit} className="rounded bg-green-600 px-3 py-1.5 text-sm text-white">Save</button>
          <button onClick={cancel} className="rounded border px-3 py-1.5 text-sm">Cancel</button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Region</th><th className="px-4 py-2 w-20">Actions</th></tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs">{b.id}</td>
                <td className="px-4 py-2">{b.name}</td>
                <td className="px-4 py-2">{b.region}</td>
                <td className="px-4 py-2 flex gap-1">
                  <button onClick={() => startEdit(b)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(b)} className="text-red-600 hover:underline text-xs">Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => onSave(brands)}
        disabled={saving}
        className="mt-4 rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Brands"}
      </button>
    </div>
  );
}

// ============= COLORS TAB =============
function ColorsTab({
  colors,
  setColors,
  brands,
  saving,
  onSave,
}: {
  colors: Color[];
  setColors: (c: Color[]) => void;
  brands: CarMake[];
  saving: boolean;
  onSave: (c: Color[]) => Promise<void>;
}) {
  const [editing, setEditing] = useState<Color | null>(null);
  const [adding, setAdding] = useState(false);
  const emptyColor: Color = { id: "", make_id: brands[0]?.id || "", color_code: "", color_name: "", color_type: "solid", hex_preview: "#000000", variants: [] };
  const [form, setForm] = useState<Color>(emptyColor);

  function startAdd() { setAdding(true); setForm(emptyColor); }
  function startEdit(c: Color) { setEditing(c); setForm({ ...c }); }
  function cancel() { setAdding(false); setEditing(null); }
  function submit() {
    if (!form.id || !form.color_code) return;
    if (adding) setColors([...colors, form]);
    else if (editing) setColors(colors.map((c) => (c.id === editing.id ? form : c)));
    cancel();
  }
  async function handleDelete(c: Color) { if (!confirm(`Delete ${c.color_name}?`)) return; setColors(colors.filter((x) => x.id !== c.id)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{colors.length} colors</span>
        <button onClick={startAdd} className="rounded bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700">+ Add Color</button>
      </div>

      {(adding || editing) && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-lg">
          <label className="flex flex-col gap-1 text-xs text-gray-500">ID<input className="rounded border px-2 py-1 text-sm" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editing} /></label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">Make
            <select className="rounded border px-2 py-1 text-sm" value={form.make_id} onChange={(e) => setForm({ ...form, make_id: e.target.value })}>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">Code<input className="rounded border px-2 py-1 text-sm" value={form.color_code} onChange={(e) => setForm({ ...form, color_code: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">Name<input className="rounded border px-2 py-1 text-sm" value={form.color_name} onChange={(e) => setForm({ ...form, color_name: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">Type
            <select className="rounded border px-2 py-1 text-sm" value={form.color_type} onChange={(e) => setForm({ ...form, color_type: e.target.value as Color["color_type"] })}>
              <option>solid</option><option>metallic</option><option>pearl</option><option>matte</option><option>candy</option><option>special</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">Hex<input type="color" className="h-8 w-16 rounded border" value={form.hex_preview} onChange={(e) => setForm({ ...form, hex_preview: e.target.value })} /></label>
          <div className="flex items-end gap-1">
            <button onClick={submit} className="rounded bg-green-600 px-3 py-1.5 text-sm text-white">Save</button>
            <button onClick={cancel} className="rounded border px-3 py-1.5 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-3 py-2">Swatch</th><th className="px-3 py-2">Code</th><th className="px-3 py-2">Name</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Make</th><th className="px-3 py-2 w-20">Actions</th></tr>
          </thead>
          <tbody>
            {colors.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2"><div className="w-6 h-6 rounded border" style={{ backgroundColor: c.hex_preview }} /></td>
                <td className="px-3 py-2 font-mono text-xs">{c.color_code}</td>
                <td className="px-3 py-2 text-xs max-w-[200px] truncate" title={c.color_name}>{c.color_name}</td>
                <td className="px-3 py-2"><span className={`rounded px-1.5 py-0.5 text-xs font-medium ${COLOR_TYPE_MAP[c.color_type]?.badge || ""}`}>{c.color_type}</span></td>
                <td className="px-3 py-2 text-xs">{brands.find((b) => b.id === c.make_id)?.name || c.make_id}</td>
                <td className="px-3 py-2 flex gap-1">
                  <button onClick={() => startEdit(c)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(c)} className="text-red-600 hover:underline text-xs">Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => onSave(colors)} disabled={saving} className="mt-4 rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
        {saving ? "Saving..." : "Save Colors"}
      </button>
    </div>
  );
}

// ============= FORMULAS TAB =============
function FormulasTab({
  formulas,
  setFormulas,
  colors,
  saving,
  onSave,
}: {
  formulas: Formula[];
  setFormulas: (f: Formula[]) => void;
  colors: Color[];
  saving: boolean;
  onSave: (f: Formula[]) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleDelete(f: Formula) {
    if (!confirm(`Delete formula ${f.id}?`)) return;
    setFormulas(formulas.filter((x) => x.id !== f.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{formulas.length} formulas</span>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 w-[30px]"></th>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Color</th>
              <th className="px-3 py-2">System</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Version</th>
              <th className="px-3 py-2">Components</th>
              <th className="px-3 py-2 w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formulas.map((f) => {
              const color = colors.find((c) => c.id === f.color_id);
              return (
                <>
                  <tr key={f.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
                    <td className="px-3 py-2 text-xs text-gray-400">{expanded === f.id ? "▼" : "▶"}</td>
                    <td className="px-3 py-2 font-mono text-xs">{f.id}</td>
                    <td className="px-3 py-2 text-xs max-w-[200px] truncate" title={color?.color_name}>{color?.color_name || f.color_id}</td>
                    <td className="px-3 py-2"><span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${f.paint_system === "2K" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>{f.paint_system}</span></td>
                    <td className="px-3 py-2 text-xs">{f.formula_type}</td>
                    <td className="px-3 py-2 text-xs">{f.version}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{f.components.length} toners</td>
                    <td className="px-3 py-2">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(f); }} className="text-red-600 hover:underline text-xs">Del</button>
                    </td>
                  </tr>
                  {expanded === f.id && (
                    <tr key={`${f.id}-detail`}>
                      <td colSpan={8} className="bg-gray-50 px-6 py-3">
                        <p className="text-xs text-gray-500 mb-2"><strong>Notes:</strong> {f.notes || "—"}</p>
                        <p className="text-xs text-gray-500 mb-2"><strong>Updated:</strong> {f.updated_at}</p>
                        <table className="w-full text-xs border">
                          <thead className="bg-white">
                            <tr><th className="px-2 py-1 text-left">Toner Code</th><th className="px-2 py-1 text-left">Toner Name</th><th className="px-2 py-1 text-right">%</th><th className="px-2 py-1 text-right">g/100g</th></tr>
                          </thead>
                          <tbody>
                            {f.components.map((comp) => (
                              <tr key={comp.toner_code} className="border-t">
                                <td className="px-2 py-1 font-mono">{comp.toner_code}</td>
                                <td className="px-2 py-1">{comp.toner_name}</td>
                                <td className="px-2 py-1 text-right">{comp.percentage}%</td>
                                <td className="px-2 py-1 text-right">{comp.grams_per_100g}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={() => onSave(formulas)} disabled={saving} className="mt-4 rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
        {saving ? "Saving..." : "Save Formulas"}
      </button>
    </div>
  );
}

// ============= SETTINGS TAB =============
function SettingsTab({
  settings,
  setSettings,
  saving,
  onSave,
}: {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  saving: boolean;
  onSave: (s: AppSettings) => Promise<void>;
}) {
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Finish Types</h3>
        <div className="flex flex-wrap gap-2">
          {settings.finishes.map((f, i) => (
            <span key={i} className="flex items-center gap-1 rounded border px-2 py-1 text-sm">
              {f}
              <button
                className="text-gray-400 hover:text-red-600 ml-1"
                onClick={() => setSettings({ ...settings, finishes: settings.finishes.filter((_, j) => j !== i) })}
              >×</button>
            </span>
          ))}
        </div>
        <input
          className="mt-2 rounded border px-2 py-1 text-sm w-40"
          placeholder="Add finish..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              setSettings({ ...settings, finishes: [...settings.finishes, e.currentTarget.value.trim()] });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Formula Types</h3>
        <div className="flex flex-wrap gap-2">
          {settings.types.map((tp, i) => (
            <span key={i} className="flex items-center gap-1 rounded border px-2 py-1 text-sm">
              {tp}
              <button className="text-gray-400 hover:text-red-600 ml-1" onClick={() => setSettings({ ...settings, types: settings.types.filter((_, j) => j !== i) })}>×</button>
            </span>
          ))}
        </div>
        <input
          className="mt-2 rounded border px-2 py-1 text-sm w-40"
          placeholder="Add type..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              setSettings({ ...settings, types: [...settings.types, e.currentTarget.value.trim()] });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>

      <div className="mb-6 flex gap-6">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Min Year
          <input type="number" className="rounded border px-2 py-1 w-24" value={settings.yearMin} onChange={(e) => setSettings({ ...settings, yearMin: parseInt(e.target.value) || 1990 })} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Max Year
          <input type="number" className="rounded border px-2 py-1 w-24" value={settings.yearMax} onChange={(e) => setSettings({ ...settings, yearMax: parseInt(e.target.value) || 2026 })} />
        </label>
      </div>

      <button onClick={() => onSave(settings)} disabled={saving} className="rounded bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}

// ============= MAIN PAGE =============
export default function AdminFormulasPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<CarMake[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ finishes: [], types: [], yearMin: 1990, yearMax: 2026 });
  const [tab, setTab] = useState("brands");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [b, c, f, s] = await Promise.all([
          fetch("/api/admin/brands").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/admin/colors").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/admin/formulas").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/admin/formula-settings").then((r) => (r.ok ? r.json() : { finishes: [], types: [], yearMin: 1990, yearMax: 2026 })),
        ]);
        setBrands(b);
        setColors(c);
        setFormulas(f);
        setSettings(s);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  async function saveBrands(data: CarMake[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/brands", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status === 401) { router.push("/login"); return; }
      if (res.ok) alertSucceeded("Brands saved!");
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function saveColors(data: Color[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/colors", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status === 401) { router.push("/login"); return; }
      if (res.ok) alertSucceeded("Colors saved!");
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function saveFormulas(data: Formula[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/formulas", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status === 401) { router.push("/login"); return; }
      if (res.ok) alertSucceeded("Formulas saved!");
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function saveSettings(data: AppSettings) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/formula-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.status === 401) { router.push("/login"); return; }
      if (res.ok) alertSucceeded("Settings saved!");
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="min-h-screen bg-gray-50"><SiteHeader subtitle="· Data Management" /><Navigation /><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader subtitle="· Data Management" />
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Formula Data Management</h2>
        <TabBar active={tab} onChange={setTab} />
        {tab === "brands" && <BrandsTab brands={brands} setBrands={setBrands} colors={colors} formulas={formulas} saving={saving} onSave={saveBrands} />}
        {tab === "colors" && <ColorsTab colors={colors} setColors={setColors} brands={brands} saving={saving} onSave={saveColors} />}
        {tab === "formulas" && <FormulasTab formulas={formulas} setFormulas={setFormulas} colors={colors} saving={saving} onSave={saveFormulas} />}
        {tab === "settings" && <SettingsTab settings={settings} setSettings={setSettings} saving={saving} onSave={saveSettings} />}
      </div>
    </div>
  );
}
