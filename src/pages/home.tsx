import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "wouter";
import { createPortal } from "react-dom";
import studiosData from "@/data/studios.json";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  TrendingUp,
  Users,
  MapPin,
  Split,
  XOctagon,
  Info,
  Search,
  X,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Lightbulb,
  ExternalLink,
  Rocket,
  ChevronsRight,
  RotateCcw,
  GitBranch,
  Sparkles,
} from "lucide-react";

// --- Constants ---
const PIXELS_PER_YEAR = 240;
const START_YEAR = 1994;
const END_YEAR = 2026;
const TOTAL_YEARS = END_YEAR - START_YEAR + 1;
const TIMELINE_HEIGHT = TOTAL_YEARS * PIXELS_PER_YEAR;
const PIXELS_PER_MONTH = PIXELS_PER_YEAR / 12;

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- Types ---
type EventType =
  | "first_release"
  | "sequel_release"
  | "prequel_release"
  | "spinoff_release"
  | "remaster_release"
  | "founded"
  | "acquisition"
  | "leadership"
  | "expansion"
  | "spinoff"
  | "closure";

interface StudioEvent {
  year: number;
  month: number;
  type: EventType;
  title: string;
  description: string;
  link?: string;
}

interface FoundingMember {
  name: string;
  position: string;
  weight: number;
  stillPresent: boolean;
}

interface Studio {
  id: string;
  name: string;
  color: string;
  founded: number;
  logo?: string;
  foundingMembers: FoundingMember[];
  events: StudioEvent[];
}

// --- Helpers ---
function calcTheseusStatus(members: FoundingMember[]): number {
  const totalWeight = members.reduce((s, m) => s + m.weight, 0);
  if (totalWeight === 0) return 0;
  const presentWeight = members.filter((m) => m.stillPresent).reduce((s, m) => s + m.weight, 0);
  return Math.round((presentWeight / totalWeight) * 100);
}

function theseusColor(pct: number): string {
  if (pct >= 70) return "#43BF8E";
  if (pct >= 35) return "#FFB347";
  return "#FF6B6B";
}

function getEventIcon(type: EventType) {
  switch (type) {
    case "first_release":   return Rocket;
    case "sequel_release":  return ChevronsRight;
    case "prequel_release": return RotateCcw;
    case "spinoff_release": return GitBranch;
    case "remaster_release":return Sparkles;
    case "founded":         return Building;
    case "acquisition":     return TrendingUp;
    case "leadership":      return Users;
    case "expansion":       return MapPin;
    case "spinoff":         return Split;
    case "closure":         return XOctagon;
    default:                return Info;
  }
}

function getEventColor(type: EventType) {
  switch (type) {
    case "first_release":   return "text-yellow-400";
    case "sequel_release":  return "text-blue-400";
    case "prequel_release": return "text-purple-400";
    case "spinoff_release": return "text-orange-400";
    case "remaster_release":return "text-cyan-400";
    case "founded":         return "text-blue-400";
    case "acquisition":     return "text-green-400";
    case "leadership":      return "text-purple-400";
    case "expansion":       return "text-yellow-400";
    case "spinoff":         return "text-orange-400";
    case "closure":         return "text-red-400";
    default:                return "text-gray-400";
  }
}

function formatMonth(month: number) {
  return new Date(2000, month - 1, 1).toLocaleString("default", { month: "short" });
}

function eventMatchesQuery(event: StudioEvent, query: string): boolean {
  if (!query.trim()) return false;
  const q = query.toLowerCase();
  return (
    event.title.toLowerCase().includes(q) ||
    event.description.toLowerCase().includes(q)
  );
}

// --- Components ---

function TheseusPanel({
  studio,
  anchorRect,
  onClose,
}: {
  studio: Studio;
  anchorRect: DOMRect;
  onClose: () => void;
}) {
  const pct = calcTheseusStatus(studio.foundingMembers);
  const color = theseusColor(pct);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Defer so the click that opened the panel doesn't immediately close it
    const id = setTimeout(() => document.addEventListener("mousedown", handleClick), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  const presentCount = studio.foundingMembers.filter((m) => m.stillPresent).length;
  const totalCount = studio.foundingMembers.length;

  const panelTop = anchorRect.bottom + 8;
  const panelLeft = anchorRect.left;

  return createPortal(
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="w-72 z-[9999] rounded-xl shadow-2xl backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col"
      style={{
        position: "fixed",
        top: panelTop,
        left: panelLeft,
        maxHeight: `calc(100vh - ${panelTop + 16}px)`,
        background: "hsl(var(--card) / 0.97)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Panel header */}
      <div
        className="flex-none px-4 py-3 border-b border-white/8 flex items-center justify-between"
        style={{ background: `${studio.color}14` }}
      >
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">
            Theseus Status
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono" style={{ color }}>
              {pct}%
            </span>
            <span className="text-xs text-muted-foreground">
              {presentCount}/{totalCount} founders remain
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          data-testid="button-close-theseus"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex-none h-1 w-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        />
      </div>

      {/* Members list — scrollable */}
      <div className="overflow-y-auto min-h-0 p-3 flex flex-col gap-2">
        {studio.foundingMembers.map((member) => (
          <div
            key={member.name}
            className="flex items-start gap-3 p-2.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: member.stillPresent ? `${studio.color}10` : "rgba(255,255,255,0.02)",
              borderColor: member.stillPresent ? `${studio.color}30` : "rgba(255,255,255,0.06)",
            }}
            data-testid={`member-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {member.stillPresent ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-none" style={{ color: studio.color }} />
            ) : (
              <XCircle className="w-4 h-4 mt-0.5 flex-none text-muted-foreground/40" />
            )}
            <div className="min-w-0">
              <p
                className="text-sm font-semibold leading-none mb-1 truncate"
                style={{ color: member.stillPresent ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {member.name}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground/60 truncate">
                {member.position}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: member.stillPresent ? `${studio.color}20` : "rgba(255,255,255,0.05)",
                    color: member.stillPresent ? studio.color : "rgba(255,255,255,0.3)",
                    border: `1px solid ${member.stillPresent ? studio.color + "40" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  {member.stillPresent ? "Active" : "Departed"}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/40">
                  weight&nbsp;{member.weight}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>,
    document.body
  );
}

function EventCard({
  event,
  studioColor,
  highlight,
}: {
  event: StudioEvent;
  studioColor: string;
  highlight: boolean;
}) {
  const Icon = getEventIcon(event.type);
  const typeColor = getEventColor(event.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 w-72 backdrop-blur-xl rounded-lg shadow-2xl p-4 left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-auto"
      style={{
        backgroundColor: "hsl(var(--card) / 0.97)",
        border: highlight
          ? "1px solid rgba(255,255,255,0.35)"
          : "1px solid rgba(255,255,255,0.10)",
        boxShadow: highlight
          ? `0 0 24px ${studioColor}60, 0 8px 32px rgba(0,0,0,0.5)`
          : "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div className="absolute top-1/2 -left-4 w-4 h-px bg-white/20 -translate-y-1/2" />
      <div
        className="absolute top-1/2 -left-4 w-1.5 h-1.5 rounded-full -translate-y-1/2 -translate-x-1/2"
        style={{ backgroundColor: studioColor }}
      />
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-1.5 rounded-md bg-white/5 border border-white/5 ${typeColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
          {formatMonth(event.month)} {event.year} &bull; {event.type}
        </div>
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-1.5">{event.title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors group/link"
          data-testid="link-event-reference"
        >
          <ExternalLink className="w-3 h-3 flex-none group-hover/link:text-foreground/60 transition-colors" />
          <span className="truncate underline underline-offset-2 decoration-white/20 group-hover/link:decoration-white/40">
            {event.link.replace(/^https?:\/\//, "")}
          </span>
        </a>
      )}
    </motion.div>
  );
}

function EventDot({
  event,
  studioColor,
  searchQuery,
}: {
  event: StudioEvent;
  studioColor: string;
  searchQuery: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const yearDiff = event.year - START_YEAR;
  const monthFraction = (event.month - 1) / 12;
  const topPosition = (yearDiff + monthFraction) * PIXELS_PER_YEAR;

  const Icon = getEventIcon(event.type);

  const isSearchActive = searchQuery.trim().length > 0;
  const isMatch = isSearchActive && eventMatchesQuery(event, searchQuery);
  const isDimmed = isSearchActive && !isMatch;

  const dotBorderColor = isMatch ? "#ffffff" : studioColor;
  const dotGlow = isMatch
    ? `0 0 0 3px ${studioColor}, 0 0 20px ${studioColor}, 0 0 40px ${studioColor}80`
    : isHovered
    ? `0 0 15px ${studioColor}80`
    : `0 0 5px ${studioColor}40`;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-20 group"
      style={{ top: `${topPosition}px`, opacity: isDimmed ? 0.15 : 1, transition: "opacity 0.3s ease" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`dot-${event.year}-${event.month}-${event.type}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isMatch ? 1.25 : 1 }}
        transition={
          isMatch
            ? { type: "spring", stiffness: 300, damping: 20 }
            : { delay: 0.5 + Math.random() * 0.5, type: "spring" }
        }
        className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-125 hover:z-30 bg-background"
        style={{
          borderColor: dotBorderColor,
          boxShadow: dotGlow,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        <Icon className="w-3.5 h-3.5 opacity-80" style={{ color: isMatch ? "#ffffff" : studioColor }} />
        {isHovered && !isMatch && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: studioColor }} />
        )}
        {isMatch && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: studioColor }} />
        )}
      </motion.div>

      <AnimatePresence>
        {(isHovered || isMatch) && (
          <EventCard event={event} studioColor={studioColor} highlight={isMatch} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StudioColumn({
  studio,
  searchQuery,
}: {
  studio: Studio;
  searchQuery: string;
}) {
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isSearchActive = searchQuery.trim().length > 0;
  const hasMatch = isSearchActive && studio.events.some((e) => eventMatchesQuery(e, searchQuery));

  const pct = calcTheseusStatus(studio.foundingMembers);
  const tColor = theseusColor(pct);

  const handleHeaderClick = useCallback(() => {
    if (anchorRect) {
      setAnchorRect(null);
    } else {
      const rect = headerRef.current?.getBoundingClientRect();
      if (rect) setAnchorRect(rect);
    }
  }, [anchorRect]);

  return (
    <div className="relative flex-none w-64 md:w-80 group">
      {/* Header — clickable for Theseus panel */}
      <div
        ref={headerRef}
        className="sticky top-24 z-40 bg-background/90 backdrop-blur-md border-b border-white/5 h-44 flex flex-col cursor-pointer select-none transition-colors hover:bg-white/[0.03]"
        style={{ opacity: isSearchActive && !hasMatch ? 0.35 : 1 }}
        onClick={handleHeaderClick}
        data-testid={`header-studio-${studio.id}`}
      >
        {/* Logo / image slot */}
        <div className="flex-1 px-6 py-4 flex items-center justify-center border-b border-white/5 overflow-hidden">
          {studio.logo ? (
            <img
              src={studio.logo}
              alt={studio.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div
              className="w-full h-full rounded border border-dashed flex items-center justify-center text-[9px] font-mono tracking-widest uppercase"
              style={{ borderColor: `${studio.color}30`, color: `${studio.color}40` }}
            >
              logo
            </div>
          )}
        </div>

        {/* Franchise name + meta */}
        <div className="px-6 pt-2.5 pb-3 flex flex-col justify-end h-20">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            {studio.name}
            <ChevronDown
              className="w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200"
              style={{ transform: anchorRect ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: studio.color }} />
              <span className="text-xs font-mono text-muted-foreground">Est. {studio.founded}</span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: tColor }}>
              Theseus&nbsp;{pct}%
            </span>
            {isSearchActive && hasMatch && (
              <span
                className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${studio.color}25`,
                  color: studio.color,
                  border: `1px solid ${studio.color}50`,
                }}
              >
                match
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Theseus Panel — rendered via portal to escape overflow clipping */}
      <AnimatePresence>
        {anchorRect && (
          <TheseusPanel
            studio={studio}
            anchorRect={anchorRect}
            onClose={() => setAnchorRect(null)}
          />
        )}
      </AnimatePresence>

      {/* Timeline Container */}
      <div className="relative w-full" style={{ height: `${TIMELINE_HEIGHT}px` }}>
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px transition-opacity duration-500 opacity-20 group-hover:opacity-50"
          style={{ backgroundColor: studio.color, boxShadow: `0 0 10px ${studio.color}` }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-64 opacity-50"
          style={{ backgroundImage: `linear-gradient(to bottom, ${studio.color}, transparent)` }}
        />
        {studio.events.map((event, idx) => (
          <EventDot
            key={`${studio.id}-${idx}`}
            event={event}
            studioColor={studio.color}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}

function TimeAxis() {
  const years = Array.from({ length: TOTAL_YEARS }, (_, i) => START_YEAR + i);

  return (
    <div className="flex-none w-28 bg-background/90 backdrop-blur-xl border-l border-white/10 z-50">
      {/* Spacer matching pt-24 on the columns wrapper so year labels align with events */}
      <div className="h-24" />
      <div className="sticky top-24 z-40 bg-background/90 backdrop-blur-md border-b border-white/5 h-44 flex items-end px-4 pb-5">
        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Timeline</span>
      </div>
      <div className="relative" style={{ height: `${TIMELINE_HEIGHT}px` }}>
        {years.map((year, i) => (
          <div
            key={year}
            className="absolute left-0 right-0"
            style={{ top: `${i * PIXELS_PER_YEAR}px`, height: `${PIXELS_PER_YEAR}px` }}
          >
            {MONTH_LABELS.map((label, mi) => {
              const isJan = mi === 0;
              return (
                <div
                  key={mi}
                  className="absolute left-0 right-0 flex items-center"
                  style={{ top: `${mi * PIXELS_PER_MONTH}px` }}
                >
                  <div
                    className="flex-none h-px"
                    style={{
                      width: isJan ? "100%" : "8px",
                      backgroundColor: isJan ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                    }}
                  />
                  <span
                    className="absolute left-2 leading-none font-mono"
                    style={{
                      top: "1px",
                      fontSize: isJan ? "11px" : "8px",
                      fontWeight: isJan ? 700 : 400,
                      color: isJan ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)",
                    }}
                  >
                    {isJan ? String(year) : label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleClear = useCallback(() => onChange(""), [onChange]);
  return (
    <div className="relative flex items-center pointer-events-auto">
      <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search people or events..."
        data-testid="input-search"
        className="h-9 w-64 rounded-md bg-white/5 border border-white/10 pl-8 pr-8 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          data-testid="button-clear-search"
          className="absolute right-2.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const studios = studiosData.studios as Studio[];
  const [searchQuery, setSearchQuery] = useState("");

  const matchCount = searchQuery.trim()
    ? studios.reduce((acc, s) => acc + s.events.filter((e) => eventMatchesQuery(e, searchQuery)).length, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-white/10">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* Header */}
      <div className="sticky top-0 left-0 h-24 z-50 flex items-center px-8 gap-8 bg-gradient-to-b from-background via-background/90 to-transparent">
        <div className="pointer-events-none">
          <h1 className="text-2xl font-bold tracking-tighter">Theseus Status</h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">GAME FRANCHISE TRACKER</p>
        </div>
        <div className="w-px h-8 bg-white/10 pointer-events-none" />
        <div className="flex flex-col gap-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          {searchQuery.trim() && (
            <p className="text-[10px] font-mono text-muted-foreground/60 pl-1">
              {matchCount === 0 ? "No matches found" : `${matchCount} event${matchCount !== 1 ? "s" : ""} matched`}
            </p>
          )}
        </div>

        </div>

      {/* Disclaimer button — fixed top-right, always above Timeline column */}
      <Link
        href="/disclaimer"
        data-testid="link-disclaimer"
        className="fixed top-4 right-32 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/5 transition-all text-[11px] font-mono uppercase tracking-widest group"
        title="Disclaimer"
      >
        <Lightbulb className="w-3.5 h-3.5 group-hover:text-yellow-400 transition-colors" />
        <span>Disclaimer</span>
      </Link>

      {/* Main Canvas */}
      <div className="flex -mt-24">
        <div className="flex-1 overflow-x-auto">
          <div className="flex pb-32 min-w-max">
            <div className="flex pt-24">
              {studios.map((studio) => (
                <StudioColumn key={studio.id} studio={studio} searchQuery={searchQuery} />
              ))}
              <div className="w-8 flex-none" />
            </div>
          </div>
        </div>
        <TimeAxis />
      </div>
    </div>
  );
}
