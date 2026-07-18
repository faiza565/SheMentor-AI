import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, Search, User, MessageCircle, Target, BookOpen, Users,
  ArrowRight, Star, Send, LogOut, Menu, X, CheckCircle2, Circle,
  Briefcase, GraduationCap, TrendingUp
} from "lucide-react";

/* ---------------------------------------------------------
   SheMentor — MVP
   Palette: ink #241726, paper #FAF6F2, gold #C9A227,
            rose #C97F8A, sage #7A8B6F
--------------------------------------------------------- */

const FONT_LINK_ID = "shementor-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const COLORS = {
  ink: "#241726",
  paper: "#FAF6F2",
  gold: "#C9A227",
  rose: "#C97F8A",
  sage: "#7A8B6F",
  inkSoft: "#4A3B4F",
  line: "#E4DAD3",
};

const inputStyle = {

  padding: "12px 14px",
  borderRadius: "12px",
  border: `1.5px solid ${COLORS.line}`,
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  outline: "none",
  color: "#241726",
  background: "#ffffff",
  caretColor: "#241726",

};

const PATH_STAGES = [
  { key: "explore", label: "Explore", icon: Search },
  { key: "match", label: "Match", icon: Sparkles },
  { key: "learn", label: "Learn", icon: BookOpen },
  { key: "grow", label: "Grow", icon: TrendingUp },
];

function Pathway({ activeIndex = 1, size = "normal" }) {
  const w = size === "small" ? 320 : 640;
  const h = size === "small" ? 90 : 140;
  const nodeCount = PATH_STAGES.length;
  const pad = size === "small" ? 30 : 60;
  const step = (w - pad * 2) / (nodeCount - 1);
  const baseY = h / 2 + 10;
  const amp = size === "small" ? 14 : 22;

  const points = PATH_STAGES.map((s, i) => {
    const x = pad + step * i;
    const y = baseY + (i % 2 === 0 ? -amp : amp);
    return { ...s, x, y, i };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `Q ${(points[i - 1].x + p.x) / 2} ${p.y + (i % 2 === 0 ? amp : -amp)}, ${p.x} ${p.y}`))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h + 40}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <path
        d={pathD}
        fill="none"
        stroke={COLORS.line}
        strokeWidth={size === "small" ? 2 : 3}
        strokeDasharray="1 10"
        strokeLinecap="round"
      />
      <path
        d={pathD}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={size === "small" ? 2 : 3}
        strokeLinecap="round"
        strokeDasharray={`${(activeIndex / (nodeCount - 1)) * 1000} 1000`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      {points.map((p) => {
        const done = p.i < activeIndex;
        const active = p.i === activeIndex;
        const Icon = p.icon;
        const r = size === "small" ? 14 : 20;
        return (
          <g key={p.key} transform={`translate(${p.x}, ${p.y})`}>
            <circle
              r={r}
              fill={done || active ? COLORS.ink : COLORS.paper}
              stroke={active ? COLORS.gold : COLORS.line}
              strokeWidth={active ? 3 : 2}
            />
            <foreignObject x={-r * 0.55} y={-r * 0.55} width={r * 1.1} height={r * 1.1}>
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={r} color={done || active ? COLORS.gold : COLORS.inkSoft} strokeWidth={2} />
              </div>
            </foreignObject>
            <text
              x={0}
              y={r + (size === "small" ? 16 : 22)}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize={size === "small" ? 10 : 13}
              fontWeight={active ? 700 : 500}
              fill={active ? COLORS.ink : COLORS.inkSoft}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Logo({ dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <div
        style={{
          width: 30, height: 30, borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%",
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.rose})`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <Sparkles size={15} color={COLORS.paper} strokeWidth={2.5} />
      </div>
      <span
        style={{
          fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, letterSpacing: "-0.01em",
          color: dark ? COLORS.paper : COLORS.ink,
        }}
      >
        SheMentor
      </span>
    </div>
  );
}

function Button({ children, variant = "primary", onClick, style, icon: Icon, type = "button" }) {
  const base = {
    fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14.5, padding: "12px 22px",
    borderRadius: 999, border: "none", cursor: "pointer", display: "inline-flex",
    alignItems: "center", gap: 8, transition: "transform 0.15s ease, box-shadow 0.15s ease",
  };
  const variants = {
    primary: { background: COLORS.ink, color: COLORS.paper },
    gold: { background: COLORS.gold, color: COLORS.ink },
    ghost: { background: "transparent", color: COLORS.ink, border: `1.5px solid ${COLORS.line}` },
    ghostLight: { background: "transparent", color: COLORS.paper, border: `1.5px solid rgba(250,246,242,0.35)` },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {Icon && <Icon size={16} strokeWidth={2.3} />}
      {children}
    </button>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ view, setView, isAuthed, onLogout }) {
  const [open, setOpen] = useState(false);
  const links = [
    { key: "landing", label: "Home" },
    { key: "mentors", label: "Mentors" },
    { key: "dashboard", label: "Dashboard" },
    { key: "chat", label: "AI Assistant" },
  ];
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 40, background: "rgba(250,246,242,0.9)",
      backdropFilter: "blur(8px)", borderBottom: `1px solid ${COLORS.line}`,
    }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto", padding: "16px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div onClick={() => setView("landing")}><Logo /></div>
        <div className="sm-nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {links.map((l) => (
            <span
              key={l.key}
              onClick={() => setView(l.key)}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 14.5, fontWeight: 500, cursor: "pointer",
                color: view === l.key ? COLORS.ink : COLORS.inkSoft,
                borderBottom: view === l.key ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                paddingBottom: 4,
              }}
            >
              {l.label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {isAuthed ? (
            <Button variant="ghost" icon={LogOut} onClick={onLogout}>Log out</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setView("auth")}>Log in</Button>
              <Button variant="gold" onClick={() => setView("auth")}>Get started</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- LANDING ---------------- */
const MODULES = [
  { icon: Sparkles, title: "AI mentor matching", desc: "Tell us your goal and skill level — we surface mentors ranked by real fit, not just a keyword search." },
  { icon: MessageCircle, title: "AI career assistant", desc: "Get a roadmap, a resume read, and mock interview practice, on demand, between sessions." },
  { icon: Target, title: "Goal tracking", desc: "Break a career goal into tasks you can actually check off, with your mentor watching progress." },
  { icon: BookOpen, title: "Learning hub", desc: "Curated courses and resources matched to your roadmap stage, not a generic catalog." },
  { icon: Users, title: "Community", desc: "Share wins, ask questions, and see how others further along solved the same problem." },
  { icon: Briefcase, title: "Mentorship booking", desc: "Find real availability and book a session in two taps, no email back-and-forth." },
];

function Landing({ setView }) {
  return (
    <div>
      {/* HERO */}
      <div style={{ background: COLORS.ink, color: COLORS.paper, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -120, right: -120, width: 340, height: 340, borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.rose}33, transparent 70%)`,
        }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "88px 24px 60px", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,162,39,0.15)",
            border: `1px solid ${COLORS.gold}55`, borderRadius: 999, padding: "6px 14px", marginBottom: 26,
          }}>
            <Sparkles size={13} color={COLORS.gold} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.gold, letterSpacing: "0.02em" }}>
              AI-POWERED MENTORSHIP FOR WOMEN
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "clamp(34px, 5.5vw, 58px)",
            lineHeight: 1.08, margin: 0, maxWidth: 720, letterSpacing: "-0.01em",
          }}>
            The career guidance gap, closed by a mentor <em style={{ color: COLORS.gold, fontStyle: "italic" }}>and</em> an AI that knows your path.
          </h1>
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.6, color: "#D8CBD3",
            maxWidth: 560, marginTop: 22,
          }}>
            SheMentor pairs you with a mentor suited to your exact goal, then keeps you moving between
            sessions with an AI assistant that builds your roadmap, reviews your resume, and preps you for interviews.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
            <Button variant="gold" icon={ArrowRight} onClick={() => setView("auth")}>Find your mentor</Button>
            <Button variant="ghostLight" onClick={() => setView("mentors")}>Browse mentors</Button>
          </div>

          <div style={{ marginTop: 64, background: "rgba(250,246,242,0.04)", border: `1px solid rgba(250,246,242,0.12)`, borderRadius: 20, padding: "28px 20px 10px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.06em", color: "#B7A6BE", marginBottom: 6 }}>
              YOUR JOURNEY, MAPPED
            </p>
            <Pathway activeIndex={1} />
          </div>
        </div>
      </div>

      {/* MODULES */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "76px 24px" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.08em", color: COLORS.rose, marginBottom: 8 }}>
          WHAT'S INSIDE
        </p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, color: COLORS.ink, margin: "0 0 40px", fontWeight: 600 }}>
          Everything a guided career needs
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {MODULES.map((m) => (
            <div key={m.title} style={{
              border: `1px solid ${COLORS.line}`, borderRadius: 18, padding: 26, background: "#fff",
              transition: "border-color 0.2s ease",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: `${COLORS.sage}1A`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <m.icon size={20} color={COLORS.sage} strokeWidth={2.2} />
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18.5, fontWeight: 600, color: COLORS.ink, margin: "0 0 8px" }}>
                {m.title}
              </h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, lineHeight: 1.55, color: COLORS.inkSoft, margin: 0 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: COLORS.rose, padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: COLORS.paper, margin: "0 0 20px", fontWeight: 600 }}>
          Your mentor is one goal away.
        </h2>
        <Button variant="primary" icon={ArrowRight} onClick={() => setView("auth")}>Create your profile</Button>
      </div>
    </div>
  );
}

/* ---------------- AUTH ---------------- */
function Auth({ onAuthed }) {

  const [mode, setMode] = useState("signup");

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    goal:"ML Engineer",
    level:"Beginner"
  });


  const submit = (e)=>{
    e.preventDefault();


    // SIGN UP
    if(mode==="signup"){

      if(!form.name || !form.email || !form.password){
        alert("Please fill all fields");
        return;
      }


      const newUser={
        name:form.name,
        email:form.email,
        password:form.password,
        goal:form.goal,
        level:form.level
      };


      localStorage.setItem(
        "shementor_user",
        JSON.stringify(newUser)
      );


      alert("Account created successfully");


      onAuthed(newUser);

    }



    // LOGIN
    else{


      const savedUser =
      JSON.parse(localStorage.getItem("shementor_user"));


      if(!savedUser){
        alert("No account found. Please signup first");
        return;
      }


      if(
        savedUser.email===form.email &&
        savedUser.password===form.password
      ){

        onAuthed(savedUser);

      }

      else{

        alert("Wrong email or password");

      }

    }

  };



return(
<div style={{
minHeight:"calc(100vh - 65px)",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:COLORS.paper,
padding:40
}}>


<form
onSubmit={submit}
style={{
background:"#fff",
padding:35,
borderRadius:20,
width:400,
display:"flex",
flexDirection:"column",
gap:15
}}
>


<h1 style={{
fontFamily:"'Fraunces',serif",
color:COLORS.ink
}}>
{mode==="signup"?"Create Profile":"Login"}
</h1>



{mode==="signup" &&

<input
placeholder="Name"
style={inputStyle}
value={form.name}
onChange={(e)=>
setForm({...form,name:e.target.value})
}
/>

}



<input
placeholder="Email"
style={inputStyle}
value={form.email}
onChange={(e)=>
setForm({...form,email:e.target.value})
}
/>



<input
placeholder="Password"
type="password"
style={inputStyle}
value={form.password}
onChange={(e)=>
setForm({...form,password:e.target.value})
}
/>



{mode==="signup" &&

<>

<select
style={inputStyle}
value={form.goal}
onChange={(e)=>
setForm({...form,goal:e.target.value})
}
>

<option>ML Engineer</option>
<option>Frontend Developer</option>
<option>Data Scientist</option>
<option>UI/UX Designer</option>

</select>


<select
style={inputStyle}
value={form.level}
onChange={(e)=>
setForm({...form,level:e.target.value})
}
>

<option>Beginner</option>
<option>Intermediate</option>
<option>Advanced</option>

</select>

</>

}




<Button
variant="gold"
type="submit"
style={{justifyContent:"center"}}
>

{
mode==="signup"
?"Create Account"
:"Login"
}

</Button>



<p
style={{
textAlign:"center",
cursor:"pointer",
color:COLORS.rose
}}

onClick={()=>{

setMode(
mode==="signup"
?"login"
:"signup"
)

}}

>

{
mode==="signup"
?"Already have account? Login"
:"Create new account"
}


</p>



</form>


</div>
)

}

/* ---------------- MENTORS ---------------- */
const MENTOR_DATA = [
  { name: "Sarah Khan", role: "Senior ML Engineer", company: "AI Labs", skills: ["Python", "ML", "Career Switch"], rating: 4.9, match: 94 },
  { name: "Amina Raza", role: "Product Designer", company: "Figtree", skills: ["UX", "Portfolio", "Design Systems"], rating: 4.8, match: 88 },
  { name: "Layla Ahmed", role: "Founder", company: "Zenith Co.", skills: ["Entrepreneurship", "Fundraising"], rating: 5.0, match: 81 },
  { name: "Nadia Farooq", role: "Data Scientist", company: "Insight Corp", skills: ["Python", "Statistics", "Interviews"], rating: 4.7, match: 90 },
  { name: "Mariam Bukhari", role: "Frontend Lead", company: "Webly", skills: ["React", "Mentorship", "Portfolio"], rating: 4.9, match: 85 },
  { name: "Zara Malik", role: "Research Scientist", company: "NeuraTech", skills: ["Research", "ML", "PhD Guidance"], rating: 4.9, match: 77 },
];

function MentorCard({ m }) {
  return (
    <div style={{ border: `1px solid ${COLORS.line}`, borderRadius: 18, padding: 22, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.rose})`,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17,
          }}>
            {m.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16.5, color: COLORS.ink }}>{m.name}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.inkSoft }}>{m.role} · {m.company}</div>
          </div>
        </div>
        <div style={{
          background: "#F0EDE3", borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4,
        }}>
          <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink }}>{m.rating}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "16px 0" }}>
        {m.skills.map((s) => (
          <span key={s} style={{
            fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, color: COLORS.sage,
            background: `${COLORS.sage}14`, borderRadius: 999, padding: "5px 10px",
          }}>{s}</span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.rose, fontWeight: 700 }}>
          {m.match}% match
        </div>
        <Button variant="ghost" style={{ padding: "8px 16px", fontSize: 13 }}>View profile</Button>
      </div>
    </div>
  );
}

function Mentors() {
  const [query, setQuery] = useState("");
  const filtered = MENTOR_DATA.filter((m) =>
    (m.name + m.role + m.skills.join(" ")).toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => b.match - a.match);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 24px 80px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 600, color: COLORS.ink, margin: "0 0 6px" }}>Find your mentor</h1>
      <p style={{ fontFamily: "Inter, sans-serif", color: COLORS.inkSoft, margin: "0 0 26px" }}>Ranked by fit to your goal, not just keywords.</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${COLORS.line}`, borderRadius: 12, padding: "12px 16px", background: "#fff", marginBottom: 28, maxWidth: 460 }}>
        <Search size={17} color={COLORS.inkSoft} />
        <input
          placeholder="Search by skill, role, or name..." value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ border: "none", outline: "none", fontFamily: "Inter, sans-serif", fontSize: 14.5, width: "100%" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {filtered.map((m) => <MentorCard key={m.name} m={m} />)}
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard({ user }) {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Complete profile & set your goal", done: true },
    { id: 2, label: "Get matched with a mentor", done: true },
    { id: 3, label: "Book your first session", done: false },
    { id: 4, label: "Finish 'Python for ML' module", done: false },
    { id: 5, label: "Build one portfolio project", done: false },
  ]);
  const toggle = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "44px 24px 80px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600, color: COLORS.ink, margin: "0 0 4px" }}>
        Welcome back, {user?.name || "Faiza"}
      </h1>
      <p style={{ fontFamily: "Inter, sans-serif", color: COLORS.inkSoft, margin: "0 0 32px" }}>
        Goal: <strong style={{ color: COLORS.ink }}>
{user?.goal || "Choose your goal"}
</strong>
      </p>

      <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 20, padding: "26px 20px 6px", marginBottom: 28 }}>
        <Pathway activeIndex={2} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22 }} className="sm-dash-grid">
        <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 18, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: COLORS.ink, margin: 0 }}>Your goal tasks</h3>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.sage, fontWeight: 700 }}>{doneCount}/{tasks.length} done</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tasks.map((t) => (
              <div key={t.id} onClick={() => toggle(t.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 8px", borderRadius: 10, cursor: "pointer",
              }}>
                {t.done ? <CheckCircle2 size={19} color={COLORS.sage} /> : <Circle size={19} color={COLORS.line} />}
                <span style={{
                  fontFamily: "Inter, sans-serif", fontSize: 14.5,
                  color: t.done ? COLORS.inkSoft : COLORS.ink,
                  textDecoration: t.done ? "line-through" : "none",
                }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.ink, borderRadius: 18, padding: 24, color: COLORS.paper }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, margin: "0 0 14px" }}>Recommended mentor</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.rose})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", fontWeight: 600,
            }}>SK</div>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14.5 }}>Sarah Khan</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#C8B9CE" }}>94% match · Senior ML Engineer</div>
            </div>
          </div>
          <Button variant="gold" style={{ width: "100%", justifyContent: "center" }}>Book a session</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- AI CHAT ---------------- */
function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your SheMentor AI career assistant. Ask me for a roadmap, resume feedback, or an interview question — I'll tailor it to your goal." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          
          messages: [
            {
              role: "user",
              content:
                "You are the SheMentor AI career assistant, embedded in a mentorship app for women. " +
                "Be warm, concise, and practical — give roadmaps as short numbered steps, keep replies under 150 words. " +
                "Conversation so far:\n" +
                nextMessages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`).join("\n"),
            },
          ],
        }),
      });
      const data = await resp.json();
      const text = data?.content?.find((c) => c.type === "text")?.text || "Sorry, I couldn't generate a response just now.";
      setMessages((cur) => [...cur, { role: "assistant", text }]);
    } catch (err) {
      setMessages((cur) => [...cur, { role: "assistant", text: "I'm having trouble connecting right now — please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 40px", height: "calc(100vh - 65px)", display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: COLORS.ink, margin: "0 0 18px" }}>AI Career Assistant</h1>
      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 18,
        padding: 20, display: "flex", flexDirection: "column", gap: 14,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "11px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? COLORS.ink : "#F3EEE9",
              color: m.role === "user" ? COLORS.paper : COLORS.ink,
              fontFamily: "Inter, sans-serif", fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-wrap",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "11px 16px", borderRadius: "16px 16px 16px 4px", background: "#F3EEE9", color: COLORS.inkSoft, fontFamily: "Inter, sans-serif", fontSize: 14 }}>
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask for a roadmap, resume tips, or an interview question..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <Button variant="gold" icon={Send} onClick={send} style={{ padding: "13px 18px" }} />
      </div>
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function SheMentorApp() {
  useFonts();
  const [view, setView] = useState("landing");
 const [user,setUser] = useState(
 JSON.parse(localStorage.getItem("shementor_user")) || null
);

  const handleAuthed = (u) => {
    setUser(u);
    setView("dashboard");
  };
  const handleLogout = () => {

    localStorage.removeItem("shementor_user");

    setUser(null);

    setView("landing");

};

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: COLORS.paper, minHeight: "100vh", color: COLORS.ink }}>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #9C8E97; }
        @media (max-width: 720px) {
          .sm-nav-links { display: none !important; }
          .sm-dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav view={view} setView={setView} isAuthed={!!user} onLogout={handleLogout} />
      {view === "landing" && <Landing setView={setView} />}
      {view === "auth" && <Auth onAuthed={handleAuthed} />}
      {view === "mentors" && <Mentors />}
      {view === "dashboard" && <Dashboard user={user} />}
      {view === "chat" && <Chat />}
    </div>
  );
}
