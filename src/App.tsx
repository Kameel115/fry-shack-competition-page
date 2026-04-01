import { useState, useRef } from "react";
import type { FormEvent } from "react";
import fryShackLogo from "../WhatsApp_Image_2026-03-30_at_3.28.40_PM-removebg-preview.png";
import globeTrotterLogo from "../gm logo-2_page-0001-Photoroom-bg removed.png";
import heroBg from "../paras-kapoor-yCsS66_HTEE-unsplash.jpg";
import igIcon from "../instagram.png";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type FormData = {
  fullName: string;
  contactNumber: string;
  instagramHandle: string;
  sharedStory: string;
};

const emptyForm: FormData = {
  fullName: "",
  contactNumber: "",
  instagramHandle: "",
  sharedStory: "",
};

function isValidImage(file: File) {
  return file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: data }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const json = await res.json();
  return json.secure_url as string;
}

async function submitToSupabase(payload: Record<string, string>) {
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/entries`, {
    method: "POST",
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      submitted_at: payload.submittedAt,
      full_name: payload.fullName,
      contact_number: payload.contactNumber,
      instagram_handle: payload.instagramHandle,
      shared_story: payload.sharedStory,
      receipt_url: payload.receiptUrl,
      story_screenshot_url: payload.storyScreenshotUrl,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Supabase submission failed");
  }
}

// ── Instagram icon shared component ──────────────────────────────────────────
function IgIcon() {
  return <img src={igIcon} alt="Instagram" className="h-5 w-5 shrink-0 object-contain" />;
}

// ── Close button ──────────────────────────────────────────────────────────────
function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
      aria-label="Close"
    >
      ✕
    </button>
  );
}

// ── shared sheet wrapper ──────────────────────────────────────────────────────
function BottomSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg overflow-y-auto text-white shadow-2xl"
        style={{
          maxHeight: "92vh",
          animation: "slideUp 0.28s cubic-bezier(0.32,0.72,0,1)",
          background: "#000",
          borderTop: "1px solid rgba(255,184,0,0.18)",
          borderRadius: "1.5rem 1.5rem 0 0",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-[#FFB800]/30" />
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Requirements Bottom Sheet ─────────────────────────────────────────────────
function RequirementsDialog({
  onClose,
  onEnter,
}: {
  onClose: () => void;
  onEnter: () => void;
}) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="px-6 pb-8 pt-3">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
              The Fry Shack × The Globe Trotter
            </p>
            <h2
              className="mt-1 text-2xl font-black leading-tight"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
            >
              <span className="text-[#FFB800]">Entry </span>
              <span className="text-[#D32F2F]">Requirements.</span>
            </h2>
          </div>
          <button onClick={onClose} className="mt-1 text-[#E0E0E0]/40 hover:text-[#E0E0E0] text-lg leading-none transition">✕</button>
        </div>

        {/* Dates pill */}
        <div className="mb-4 flex gap-3">
          <span className="rounded-full border border-[#FFB800]/25 bg-[#FFB800]/10 px-3 py-1 text-xs font-semibold text-[#FFB800]">
            🗓 Valid 4–6 April
          </span>
          <span className="rounded-full border border-[#FFB800]/25 bg-[#FFB800]/10 px-3 py-1 text-xs font-semibold text-[#FFB800]">
            🎟 Every purchase = 1 entry
          </span>
        </div>

        {/* Requirements list */}
        <div className="mb-5 space-y-3 rounded-2xl border border-white/8 bg-white/5 p-4 text-sm">
          <p className="flex gap-2.5 text-[#E0E0E0]">
            <span className="shrink-0">✅</span>
            <span>Follow <strong className="text-white">@TheFryShack</strong> & <strong className="text-white">@TheGlobeTrotter</strong> on Instagram</span>
          </p>
          <div className="h-px bg-white/8" />
          <p className="flex gap-2.5 text-[#E0E0E0]">
            <span className="shrink-0">✅</span>
            <span>Share your <strong className="text-white">Fry Shack Fix</strong> on your story and tag both pages</span>
          </p>
          <div className="h-px bg-white/8" />
          <p className="flex gap-2.5 text-xs text-red-400/90">
            <span className="shrink-0">❗</span>
            <span>Entries that don't meet these requirements won't be eligible</span>
          </p>
        </div>

        <p className="mb-5 text-center text-xs tracking-wide text-[#E0E0E0]/40">
          📅 Winner announced <span className="text-[#E0E0E0]/70 font-semibold">8 April</span> on Instagram
        </p>

        <button
          onClick={onEnter}
          className="w-full rounded-2xl py-4 font-black text-black shadow-lg transition hover:brightness-105 active:scale-[0.98]"
          style={{ background: "linear-gradient(to bottom, #FFD000, #FF9500)" }}
        >
          Got it — Enter Now 🍟
        </button>
      </div>
    </BottomSheet>
  );
}

// ── Entry Form Bottom Sheet ───────────────────────────────────────────────────
function EntryFormDialog({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ receipt?: string; story?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const receiptRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLInputElement>(null);

  const handleFile = (
    field: "receipt" | "story",
    file: File | null
  ) => {
    if (!file) return;
    if (!isValidImage(file)) {
      setFileErrors((p) => ({
        ...p,
        [field]: "Please upload an image under 5MB.",
      }));
      return;
    }
    setFileErrors((p) => ({ ...p, [field]: undefined }));
    if (field === "receipt") setReceiptFile(file);
    else setStoryFile(file);
  };

  const canSubmit =
    form.fullName.trim() &&
    form.contactNumber.trim() &&
    form.instagramHandle.trim() &&
    form.sharedStory &&
    receiptFile &&
    storyFile;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const receiptUrl = await uploadToCloudinary(receiptFile!);
      let storyUrl = "";
      if (storyFile) storyUrl = await uploadToCloudinary(storyFile);
      await submitToSupabase({
        submittedAt: new Date().toISOString(),
        fullName: form.fullName,
        contactNumber: form.contactNumber,
        instagramHandle: form.instagramHandle,
        sharedStory: form.sharedStory,
        receiptUrl,
        storyScreenshotUrl: storyUrl,
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheet onClose={onClose}>

        <div className="px-6 pb-8 pt-3">
          {submitted ? (
            // ── Success state ────────────────────────────────────────────────
            <div className="py-4 text-center">
              <p className="text-5xl">🎉</p>
              <h3
                className="mt-4 text-2xl font-black"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
              >
                <span className="text-[#FFB800]">You're officially </span>
                <span className="text-[#D32F2F]">entered!</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#E0E0E0]">
                Congratulations! We've received your entry. Good luck — we can't wait to see you again! 🍟✈️
              </p>
              <div className="mt-5 space-y-2 rounded-2xl border border-white/8 bg-white/5 p-4 text-left text-xs text-[#E0E0E0]/70">
                <p>⚠️ Entries without valid proof of purchase may be disqualified</p>
                <p>💥 Every purchase = another entry!</p>
                <p>📅 Winner announced <span className="font-bold text-[#E0E0E0]">8 April</span> on Instagram</p>
              </div>
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-2xl py-4 font-black text-black shadow-lg transition hover:brightness-105 active:scale-[0.98]"
                style={{ background: "linear-gradient(to bottom, #FFD000, #FF9500)" }}
              >
                Close
              </button>
            </div>
          ) : (
            // ── Form ─────────────────────────────────────────────────────────
            <>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFB800]/60">
                    The Fry Shack × The Globe Trotter
                  </p>
                  <h2
                    className="mt-1 text-2xl font-black leading-tight"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
                  >
                    <span className="text-[#FFB800]">Enter the </span>
                    <span className="text-[#D32F2F]">Giveaway.</span>
                  </h2>
                </div>
                <button onClick={onClose} className="mt-1 text-[#E0E0E0]/40 hover:text-[#E0E0E0] text-lg leading-none transition">✕</button>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB800]/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Please enter your full name"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-[#E0E0E0] placeholder-white/30 outline-none transition focus:border-[#FFB800]/50 focus:bg-white/12"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB800]/80">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Please provide your contact number"
                    value={form.contactNumber}
                    onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-[#E0E0E0] placeholder-white/30 outline-none transition focus:border-[#FFB800]/50 focus:bg-white/12"
                    required
                  />
                </div>

                {/* Instagram Handle */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB800]/80">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@yourusername"
                    value={form.instagramHandle}
                    onChange={(e) => setForm((p) => ({ ...p, instagramHandle: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-[#E0E0E0] placeholder-white/30 outline-none transition focus:border-[#FFB800]/50 focus:bg-white/12"
                    required
                  />
                </div>

                {/* Proof of Purchase */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB800]/80">
                    Proof of Purchase
                  </label>
                  <p className="mb-2 text-xs text-[#E0E0E0]/40">Upload a photo of your Fry Shack receipt</p>
                  <div
                    onClick={() => receiptRef.current?.click()}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#FFB800]/30 bg-[#FFB800]/5 px-4 py-3.5 transition hover:border-[#FFB800]/60 hover:bg-[#FFB800]/10"
                  >
                    <span className="text-xl">🧾</span>
                    <span className="text-sm text-[#E0E0E0]/70">
                      {receiptFile ? <span className="text-[#FFB800]">{receiptFile.name}</span> : "Tap to upload receipt"}
                    </span>
                  </div>
                  <input ref={receiptRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleFile("receipt", e.target.files?.[0] ?? null)} />
                  {fileErrors.receipt && <p className="mt-1 text-xs text-red-400">{fileErrors.receipt}</p>}
                </div>

                {/* Shared Story */}
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB800]/80">
                    Did you share your Fry Shack Fix on your story and tag both pages?
                  </label>
                  <div className="flex gap-3">
                    {["yes", "no"].map((val) => (
                      <label
                        key={val}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold transition ${
                          form.sharedStory === val
                            ? "border-[#FFB800] bg-[#FFB800]/15 text-[#FFB800]"
                            : "border-white/10 bg-white/5 text-[#E0E0E0]/60 hover:border-white/20"
                        }`}
                      >
                        <input type="radio" name="sharedStory" value={val}
                          checked={form.sharedStory === val}
                          onChange={() => setForm((p) => ({ ...p, sharedStory: val }))}
                          className="hidden" />
                        {val === "yes" ? "✅ Yes" : "❌ No"}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Story Screenshot — always required */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB800]/80">
                    Screenshot of Your Instagram Story
                  </label>
                  <p className="mb-2 text-xs text-[#E0E0E0]/40">Upload a screenshot of your story tagging both pages</p>
                  <div
                    onClick={() => storyRef.current?.click()}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#FFB800]/30 bg-[#FFB800]/5 px-4 py-3.5 transition hover:border-[#FFB800]/60 hover:bg-[#FFB800]/10"
                  >
                    <span className="text-xl">📸</span>
                    <span className="text-sm text-[#E0E0E0]/70">
                      {storyFile ? <span className="text-[#FFB800]">{storyFile.name}</span> : "Tap to upload story screenshot"}
                    </span>
                  </div>
                  <input ref={storyRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleFile("story", e.target.files?.[0] ?? null)} />
                  {fileErrors.story && <p className="mt-1 text-xs text-red-400">{fileErrors.story}</p>}
                </div>

                {error && (
                  <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="w-full rounded-2xl py-4 font-black text-black shadow-lg transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: "linear-gradient(to bottom, #FFD000, #FF9500)" }}
                >
                  {submitting ? "Submitting…" : "Submit Entry 🍟"}
                </button>

                <p className="text-center text-xs tracking-wide text-[#E0E0E0]/35">
                  ⚠️ Entries without valid proof of purchase may be disqualified
                </p>
              </form>
            </>
          )}
        </div>
    </BottomSheet>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const [showRequirements, setShowRequirements] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasSeenRequirements, setHasSeenRequirements] = useState(false);

  const handleEnterClick = () => {
    if (!hasSeenRequirements) {
      setShowRequirements(true);
    } else {
      setShowForm(true);
    }
  };

  const handleRequirementsEnter = () => {
    setHasSeenRequirements(true);
    setShowRequirements(false);
    setShowForm(true);
  };

  return (
    <main className="min-h-screen font-sans">
      <section className="relative min-h-screen overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px)",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Logos */}
        <div className="absolute left-6 top-6 z-20 flex items-stretch border border-white/20 shadow-md sm:left-10 sm:top-10 lg:left-1/2 lg:-translate-x-1/2">
          <div className="flex items-center justify-center bg-black px-6 py-4 sm:px-8 sm:py-5">
            <img src={fryShackLogo} alt="The Fry Shack logo" className="h-16 w-auto object-contain sm:h-20" />
          </div>
          <div className="w-px bg-white/20" />
          <div className="flex items-center justify-center bg-white px-6 py-4 sm:px-8 sm:py-5">
            <img src={globeTrotterLogo} alt="The Globe Trotter logo" className="h-14 w-auto object-contain sm:h-18" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pt-40 sm:px-10 sm:pt-0 lg:items-center lg:justify-center">
          <div className="w-full max-w-[800px] lg:max-w-[720px] lg:text-center">

            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-white/70 sm:text-sm">
              The Fry Shack × The Globe Trotter
            </p>

            <h1
              className="text-[3.5rem] font-black leading-[0.95] tracking-[-0.02em] sm:text-[5.5rem] md:text-[7rem]"
              style={{ textShadow: "0 2px 6px rgba(0,0,0,0.95), 0 6px 30px rgba(0,0,0,0.75)" }}
            >
              <span className="text-[#FFB800]">The Social</span>
              <br />
              <span className="text-[#D32F2F]">Giveaway.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed tracking-wide text-[#E0E0E0] sm:text-xl md:text-2xl">
              Enter our social giveaway for a chance to win an exciting local experience!
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-bold sm:mt-12 sm:max-w-xl sm:flex-nowrap sm:text-base lg:mx-auto lg:justify-center">
              <button
                onClick={handleEnterClick}
                className="flex-1 rounded-full px-8 py-4 text-center font-black text-black shadow-xl transition-transform hover:scale-105 active:scale-95 lg:flex-none lg:min-w-[220px]"
                style={{ background: "linear-gradient(to bottom, #FFD000, #FF9500)" }}
              >
                Enter Now
              </button>
              <button
                onClick={() => setShowRequirements(true)}
                className="flex-1 rounded-full border border-[#FFB800] bg-transparent px-8 py-4 text-center font-bold text-[#FFB800] transition-all hover:scale-105 hover:bg-[#FFB800] hover:text-black active:scale-95 lg:flex-none lg:min-w-[220px]"
              >
                Requirements
              </button>
            </div>

            <div className="mt-10 flex flex-row flex-wrap gap-3 sm:flex-nowrap lg:justify-center">
              <a
                href="https://instagram.com/thefryshack"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-[#E0E0E0] backdrop-blur-sm transition hover:bg-white/20 lg:px-7"
              >
                <IgIcon />
                @TheFryShack
              </a>
              <a
                href="https://instagram.com/theglobetrotter"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-[#E0E0E0] backdrop-blur-sm transition hover:bg-white/20 lg:px-7"
              >
                <IgIcon />
                @TheGlobeTrotter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      {showRequirements && (
        <RequirementsDialog
          onClose={() => setShowRequirements(false)}
          onEnter={handleRequirementsEnter}
        />
      )}
      {showForm && (
        <EntryFormDialog onClose={() => setShowForm(false)} />
      )}
    </main>
  );
}

export default App;
