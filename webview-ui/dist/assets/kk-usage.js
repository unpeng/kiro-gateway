// Usage cards for the panel: "today on this machine", the relay's quota, and the relay's own records.
//
// The panel bundle is built from a Vue project that is not in this repository, so these cards live in their own hand-written
// module and the bundle only mounts them. They reuse the Vue runtime the bundle already loaded (the vendor chunk below), so
// there is one Vue instance on the page. The aliases are that chunk's export names:
//   B createVNode · r ref · f computed · w watch · l onMounted · z onUnmounted
//
// Each card takes the panel store as `store` and reads it directly: store.stats (pushed by the host on every request and
// pulled every 5 s), store.relayUsage (the answer to fetchRelayUsage) and store.mode (the route that is live).
import { B as h, r as ref, f as computed, w as watch, l as onMounted, z as onUnmounted } from "./vendor-vue-B4qPHn7c-20260808142753.js";

// ---------------------------------------------------------------------------
// Text. The bundle's dictionary is private to it, so these cards carry their own.
// ---------------------------------------------------------------------------
const EN = {
  "今日 · 本机": "Today · this machine",
  "实时": "Live",
  "进行中 ": "In flight ",
  "0 点起计": "since 00:00",
  "清零": "Reset",
  "确定清零？": "Reset today?",
  "确定": "Reset",
  "取消": "Cancel",
  "请求": "Requests",
  "失败 ": "failed ",
  "积分": "Credits",
  "网关结算": "from the relay",
  "按倍率": "by rate",
  "中转站未报": "not reported",
  "输入 tokens": "Input tokens",
  "输出 tokens": "Output tokens",
  "缓存命中 ": "cached ",
  "估算": "estimated",
  "按小时 · 积分": "Credits by hour",
  "按小时 · 请求": "Requests by hour",
  "最高 ": "peak ",
  " 点 · ": ":00 · ",
  "现在": "now",
  "额度": "Quota",
  "刚刚更新": "just updated",
  " 秒前更新": "s ago",
  " 分钟前更新": " min ago",
  "正在拉取…": "Loading…",
  "刷新额度": "Refresh quota",
  "5 小时": "5 hours",
  "今日": "Today",
  "本周": "This week",
  "本月": "This month",
  "累计": "Total",
  "总额度": "Credit cap",
  "不限制": "No limit",
  "接口没有返回 5 小时上限": "No 5-hour limit was reported",
  "接口没有返回本周上限": "No weekly limit was reported",
  "已用 ": "used ",
  "暂无读数": "No reading",
  "席位仪表这次没回数，不代表不限": "The seat meters sent nothing this time; the pool still has a limit",
  "还有 ": "in ",
  "即将重置": "resetting",
  "已超限": "over the limit",
  "席位池合计 · 这把 Key 没有单独限额": "Seat pool total · this key has no limit of its own",
  "这把 Key 自己的限额": "This key's own limits",
  "中转站没有返回额度窗口": "The relay reports no quota windows",
  "中转站还没配置好，先去「连接」填地址和 Key。": "The relay is not set up yet. Fill in the address and key under Connection.",
  "拉不到额度：": "Could not load the quota: ",
  "重试": "Retry",
  "中转站记录": "Relay records",
  "最近 ": "last ",
  " 次请求": " requests",
  "累计 ": "total ",
  "输入": "Input",
  "输出": "Output",
  "缓存命中": "Cache hits",
  " 次": " req",
  "打开网页用量面板": "Open the relay's usage page",
  "这家中转站没有逐笔记录。": "This relay keeps no per-request records.",
  " 分钟": " min",
  " 小时": " h",
  " 小时 ": " h ",
  " 天 ": " d ",
  " 分": " min",
  "不到 1 分钟": "under a minute",
};
const LANG = globalThis.__KK_LANG === "en" ? "en" : "zh";
const T = (s) => (LANG === "en" && Object.prototype.hasOwnProperty.call(EN, s) ? EN[s] : s);

// ---------------------------------------------------------------------------
// Styles. The bundle's styles are scoped to its own elements, so these cards bring theirs, on the same theme variables.
// ---------------------------------------------------------------------------
const CSS = `
.kku-card{border:1px solid var(--vscode-panel-border,rgba(127,127,127,.25));border-radius:8px;padding:12px;margin-bottom:12px}
.kku-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.kku-title{font-size:12px;font-weight:700;letter-spacing:.4px;color:var(--vscode-descriptionForeground)}
.kku-head-r{display:inline-flex;align-items:center;gap:8px;font-size:11px;color:var(--vscode-descriptionForeground);white-space:nowrap}
.kku-sub{font-size:11px;color:var(--vscode-descriptionForeground);margin:-4px 0 10px;display:flex;align-items:center;gap:6px}
.kku-dot{width:6px;height:6px;border-radius:50%;background:#52c41a;flex:none}
.kku-sub.on{color:#1677ff}.kku-sub.on .kku-dot{background:#1677ff;animation:kku-pulse 1.1s ease-in-out infinite}
@keyframes kku-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){.kku-sub.on .kku-dot{animation:none}}
.kku-link{background:none;border:0;padding:0;font:inherit;font-size:11px;color:var(--vscode-descriptionForeground);cursor:pointer}
.kku-link:hover{color:var(--vscode-foreground)}.kku-link.danger{color:#ff4d4f}
.kku-link:focus-visible,.kku-btn:focus-visible,.kku-icon:focus-visible{outline:1px solid var(--vscode-focusBorder,#1677ff);outline-offset:2px}
.kku-icon{background:none;border:0;padding:2px;cursor:pointer;color:var(--vscode-descriptionForeground);display:inline-flex}
.kku-icon:hover{color:var(--vscode-foreground)}.kku-icon[disabled]{opacity:.4;cursor:default}
.kku-icon.spin svg{animation:kku-spin .9s linear infinite}@keyframes kku-spin{to{transform:rotate(360deg)}}
.kku-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.kku-tile{border:1px solid rgba(128,128,128,.35);border-radius:8px;padding:8px 10px;background:var(--vscode-editorWidget-background,rgba(127,127,127,.06));min-width:0}
.kku-tile-l{font-size:11px;opacity:.7;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kku-tile-v{display:flex;align-items:baseline;justify-content:space-between;gap:6px}
.kku-num{font-size:17px;font-weight:600;line-height:1.2;font-variant-numeric:tabular-nums}
.kku-num.spend{color:#52c41a}
.kku-tile-s{font-size:10.5px;color:var(--vscode-descriptionForeground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kku-tile-s.bad{color:#ff4d4f}
.kku-chart-h{display:flex;justify-content:space-between;font-size:11px;color:var(--vscode-descriptionForeground);margin:12px 0 6px}
.kku-bars{display:flex;align-items:flex-end;gap:2px;height:40px}
.kku-bar{flex:1;min-width:0;border-radius:2px 2px 0 0;background:rgba(22,119,255,.45)}
.kku-bar.now{background:#1677ff}.kku-bar.later{background:rgba(127,127,127,.18)}
.kku-axis{position:relative;height:14px;font-size:9.5px;color:var(--vscode-descriptionForeground)}
.kku-axis span{position:absolute;top:2px;transform:translateX(-50%)}
.kku-axis .now{color:#1677ff}
.kku-q{padding:2px 0 10px}.kku-q+.kku-q{border-top:1px solid rgba(127,127,127,.15);padding-top:10px}
.kku-q-h{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px}
.kku-q-name{font-weight:600}
.kku-q-val{font-variant-numeric:tabular-nums}
.kku-track{height:6px;border-radius:3px;background:rgba(127,127,127,.2);margin:7px 0 6px;overflow:hidden}
.kku-fill{height:100%;border-radius:3px;background:#1677ff}
.kku-fill.warn{background:#faad14}.kku-fill.over{background:#ff4d4f}
.kku-q-s{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:var(--vscode-descriptionForeground);margin-top:4px}
.kku-q-s .bad{color:#ff4d4f}
.kku-pill{font-size:11px;border:1px solid rgba(127,127,127,.4);border-radius:9px;padding:0 8px;line-height:17px;white-space:nowrap}
.kku-pill.warn{border-color:transparent;color:#faad14;padding:0}
.kku-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;color:var(--vscode-descriptionForeground);border-top:1px solid rgba(127,127,127,.15);padding-top:10px;margin-top:2px}
.kku-src{border-radius:4px;padding:0 6px;line-height:18px;background:rgba(146,84,222,.18);color:#b37feb;white-space:nowrap}
.kku-msg{font-size:12px;color:var(--vscode-descriptionForeground)}.kku-msg.bad{color:#ff4d4f}
.kku-trio{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.kku-trio .kku-num{font-size:15px}
.kku-row{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px;margin-top:12px}
.kku-row b{font-weight:600;color:#52c41a;font-variant-numeric:tabular-nums}
.kku-thin{height:4px;border-radius:2px;background:rgba(127,127,127,.2);margin-top:5px;overflow:hidden}
.kku-thin>div{height:100%;background:#52c41a}
.kku-models{border-top:1px solid rgba(127,127,127,.15);margin-top:12px;padding-top:4px}
.kku-model{padding-top:8px}
.kku-model-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px}
.kku-model-h code{font-family:var(--vscode-editor-font-family,monospace);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kku-model-h span{display:inline-flex;gap:10px;white-space:nowrap;font-variant-numeric:tabular-nums}
.kku-model-h i{font-style:normal;color:var(--vscode-descriptionForeground);font-size:11px}
.kku-model-h b{font-weight:400;color:#52c41a}
.kku-model .kku-thin>div{background:rgba(22,119,255,.55)}
.kku-btn{width:100%;margin-top:12px;height:28px;border-radius:6px;border:1px solid rgba(127,127,127,.4);background:transparent;color:var(--vscode-foreground);font:inherit;font-size:12px;cursor:pointer}
.kku-btn:hover{border-color:#1677ff;color:#1677ff}
.kk-subtabs>.ant-tabs-nav{margin-bottom:12px}
`;
function ensureStyle() {
  if (document.getElementById("kku-style")) return;
  const el = document.createElement("style");
  el.id = "kku-style";
  el.textContent = CSS;
  document.head.appendChild(el);
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------
const finite = (v) => typeof v === "number" && Number.isFinite(v);
function compact(v) {
  const t = Number(v);
  if (!Number.isFinite(t) || t <= 0) return "0";
  const f = (n, s) => (t / n).toFixed(1).replace(/\.0$/, "") + s;
  return t >= 1e9 ? f(1e9, "B") : t >= 1e6 ? f(1e6, "M") : t >= 1e3 ? f(1e3, "K") : String(Math.round(t));
}
const credits2 = (v) => (finite(v) && v > 0 ? v.toFixed(2) : "0.00");
const count = (v) => (finite(v) ? Math.round(v).toLocaleString("en-US") : "0");
// Quota numbers: whole numbers grouped, small fractions to at most two places (1,234.5 / 35,000).
function amount(v) {
  if (!finite(v)) return "-";
  if (Math.abs(v) >= 1000 || v === Math.trunc(v)) return Math.round(v).toLocaleString("en-US");
  return String(parseFloat(v.toFixed(2)));
}
const pad = (n) => String(n).padStart(2, "0");
function clock(ms) {
  const d = new Date(ms);
  const now = new Date();
  const hm = pad(d.getHours()) + ":" + pad(d.getMinutes());
  if (d.toDateString() === now.toDateString()) return hm;
  if (d.getFullYear() === now.getFullYear()) return pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + hm;
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + hm;
}
function until(ms, now) {
  const m = Math.floor((ms - now) / 60000);
  if (m < 0) return T("即将重置");
  if (m < 1) return T("还有 ") + T("不到 1 分钟");
  if (m < 60) return T("还有 ") + m + T(" 分钟");
  const hr = Math.floor(m / 60);
  if (hr < 24) return T("还有 ") + hr + T(" 小时 ") + (m % 60) + T(" 分");
  const d = Math.floor(hr / 24);
  return T("还有 ") + d + T(" 天 ") + (hr % 24) + T(" 小时");
}
function ago(ms, now) {
  const s = Math.max(0, Math.floor((now - ms) / 1000));
  if (s < 10) return T("刚刚更新");
  if (s < 60) return s + T(" 秒前更新");
  return Math.floor(s / 60) + T(" 分钟前更新");
}

// A ticking "now" shared by the cards that show relative times.
function useNow(stepMs) {
  const now = ref(Date.now());
  let timer = null;
  onMounted(() => { timer = setInterval(() => { now.value = Date.now(); }, stepMs); });
  onUnmounted(() => { if (timer) clearInterval(timer); });
  return now;
}

const ICON_SYNC = () => h("svg", { viewBox: "0 0 16 16", width: 13, height: 13, fill: "none", stroke: "currentColor", "stroke-width": 1.5, "aria-hidden": "true" }, [
  h("path", { d: "M13.5 8a5.5 5.5 0 1 1-1.6-3.9", "stroke-linecap": "round" }),
  h("path", { d: "M13.6 2.2v2.6H11", "stroke-linecap": "round", "stroke-linejoin": "round" }),
]);

function tile(label, value, opts = {}) {
  return h("div", { class: "kku-tile" }, [
    h("div", { class: "kku-tile-l" }, label),
    h("div", { class: "kku-tile-v" }, [
      h("span", { class: ["kku-num", opts.spend ? "spend" : ""] }, value),
      opts.sub ? h("span", { class: ["kku-tile-s", opts.bad ? "bad" : ""], title: opts.sub }, opts.sub) : null,
    ]),
  ]);
}

// ---------------------------------------------------------------------------
// Today on this machine: every request that went through this window's gateway since 00:00 (or since "Reset").
// ---------------------------------------------------------------------------
export const KkToday = {
  name: "KkToday",
  props: { store: { type: Object, required: true } },
  setup(props) {
    ensureStyle();
    const confirming = ref(false);
    const now = useNow(60000);
    const s = computed(() => props.store.stats || {});
    const relayMode = computed(() => props.store.mode === "relay");
    const hours = computed(() => {
      const list = Array.isArray(s.value.hours) ? s.value.hours : [];
      return Array.from({ length: 24 }, (_, i) => ({ requests: Number(list[i] && list[i].requests) || 0, credits: Number(list[i] && list[i].credits) || 0 }));
    });
    return () => {
      const st = s.value;
      const inflight = Number(st.inflight) || 0;
      const since = Number(st.since) || 0;
      const midnight = new Date(now.value); midnight.setHours(0, 0, 0, 0);
      const sinceText = !since || since <= midnight.getTime() + 1000 ? T("0 点起计")
        : LANG === "en" ? "since " + clock(since) : clock(since) + " 起计";
      // The chart shows credits when there are any; a relay that reports no charge still gets a request histogram.
      const byCredits = hours.value.some((x) => x.credits > 0);
      const vals = hours.value.map((x) => (byCredits ? x.credits : x.requests));
      const max = Math.max(0, ...vals);
      const peak = max > 0 ? vals.indexOf(max) : -1;
      const cur = new Date(now.value).getHours();
      const errors = Number(st.errors) || 0;
      const cache = Number(st.cacheTokens) || 0;
      const head = h("div", { class: "kku-head" }, [
        h("span", { class: "kku-title" }, T("今日 · 本机")),
        confirming.value
          ? h("span", { class: "kku-head-r" }, [
              T("确定清零？"),
              h("button", { class: "kku-link danger", onClick: () => { confirming.value = false; props.store.resetStats(); } }, T("确定")),
              h("button", { class: "kku-link", onClick: () => { confirming.value = false; } }, T("取消")),
            ])
          : h("button", { class: "kku-link", onClick: () => { confirming.value = true; } }, T("清零")),
      ]);
      const sub = h("div", { class: ["kku-sub", inflight > 0 ? "on" : ""] }, [
        h("i", { class: "kku-dot" }),
        (inflight > 0 ? T("进行中 ") + inflight : T("实时")) + " · " + sinceText,
      ]);
      const creditSub = relayMode.value ? (Number(st.credits) > 0 ? T("网关结算") : T("中转站未报")) : T("按倍率");
      const grid = h("div", { class: "kku-grid" }, [
        tile(T("请求"), count(st.requests), { sub: errors > 0 ? T("失败 ") + count(errors) : "", bad: errors > 0 }),
        tile(T("积分"), credits2(Number(st.credits)), { spend: true, sub: creditSub }),
        tile(T("输入 tokens"), compact(st.inTokens), { sub: cache > 0 ? T("缓存命中 ") + compact(cache) : relayMode.value ? "" : T("估算") }),
        tile(T("输出 tokens"), compact(st.outTokens), { sub: relayMode.value ? "" : T("估算") }),
      ]);
      const chartHead = h("div", { class: "kku-chart-h" }, [
        h("span", null, byCredits ? T("按小时 · 积分") : T("按小时 · 请求")),
        peak >= 0 ? h("span", null, T("最高 ") + peak + T(" 点 · ") + (byCredits ? amount(max) : count(max))) : null,
      ]);
      const bars = h("div", { class: "kku-bars", role: "img", "aria-label": byCredits ? T("按小时 · 积分") : T("按小时 · 请求") },
        vals.map((v, i) => h("div", {
          key: i,
          class: ["kku-bar", i === cur ? "now" : i > cur ? "later" : ""],
          style: { height: (max > 0 ? Math.max(4, (v / max) * 100) : 4) + "%" },
          title: pad(i) + ":00 · " + count(hours.value[i].requests) + T(" 次") + (byCredits ? " · " + amount(hours.value[i].credits) : ""),
        })));
      const axis = h("div", { class: "kku-axis" }, [
        h("span", { style: { left: "2%" } }, "0"),
        h("span", { style: { left: "50%" } }, "12"),
        h("span", { class: "now", style: { left: ((cur + 0.5) / 24) * 100 + "%" } }, T("现在")),
        h("span", { style: { left: "98%" } }, "24"),
      ].filter((n, i) => !(i === 1 && Math.abs(cur - 12) < 3)));
      return h("section", { class: "kku-card" }, [head, sub, grid, chartHead, bars, axis]);
    };
  },
};

// ---------------------------------------------------------------------------
// Quota: the 5-hour and weekly windows (or the key's own limits), refreshed while the card is on screen.
// ---------------------------------------------------------------------------
const KIND_LABEL = { hour5: "5 小时", day: "今日", week: "本周", month: "本月", total: "累计", cap: "总额度" };
const NO_LIMIT = { hour5: "接口没有返回 5 小时上限", week: "接口没有返回本周上限" };
const SCOPE_TEXT = { pool: "席位池合计 · 这把 Key 没有单独限额", key: "这把 Key 自己的限额", relay: "中转站没有返回额度窗口" };
const REFRESH_MS = 60 * 1000;   // while the card is visible
const AFTER_REQUEST_MS = 3000;  // after a request finishes, so the numbers catch up with it

function quotaRow(r, now) {
  const name = h("span", { class: "kku-q-name" }, T(KIND_LABEL[r.kind] || r.kind));
  if (r.state === "unlimited") {
    return h("div", { class: "kku-q", key: r.kind }, [
      h("div", { class: "kku-q-h" }, [name, h("span", { class: "kku-pill" }, T("不限制"))]),
      h("div", { class: "kku-q-s" }, [
        h("span", null, NO_LIMIT[r.kind] ? T(NO_LIMIT[r.kind]) : ""),
        finite(r.used) ? h("span", null, T("已用 ") + amount(r.used)) : null,
      ]),
    ]);
  }
  if (r.state === "unknown") {
    return h("div", { class: "kku-q", key: r.kind }, [
      h("div", { class: "kku-q-h" }, [name, h("span", { class: "kku-pill warn" }, T("暂无读数"))]),
      h("div", { class: "kku-q-s" }, [h("span", null, T("席位仪表这次没回数，不代表不限"))]),
    ]);
  }
  const frac = finite(r.used) && finite(r.total) && r.total > 0 ? Math.min(1, Math.max(0, r.used / r.total)) : 0;
  const level = r.over ? "over" : frac >= 0.8 ? "warn" : "";
  return h("div", { class: "kku-q", key: r.kind }, [
    h("div", { class: "kku-q-h" }, [name, h("span", { class: "kku-q-val" }, amount(r.used) + " / " + amount(r.total))]),
    h("div", { class: "kku-track", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(frac * 100) }, [
      h("div", { class: ["kku-fill", level], style: { width: (frac > 0 ? Math.max(2, frac * 100) : 0) + "%" } }),
    ]),
    h("div", { class: "kku-q-s" }, [
      h("span", null, finite(r.resetAt) ? (LANG === "en" ? "resets " + clock(r.resetAt) : clock(r.resetAt) + " 重置") : ""),
      r.over ? h("span", { class: "bad" }, T("已超限")) : finite(r.resetAt) ? h("span", null, until(r.resetAt, now)) : null,
    ]),
  ]);
}

export const KkQuota = {
  name: "KkQuota",
  props: { store: { type: Object, required: true } },
  setup(props) {
    ensureStyle();
    const now = useNow(5000);
    const fetchNow = () => {
      const st = props.store;
      if (!st.relay || !st.relay.configured || st.relayUsage.loading) return;
      st.fetchRelayUsage(false);
    };
    const fetchedAt = () => {
      const p = props.store.relayUsage && props.store.relayUsage.payload;
      return (p && Number(p.at)) || 0;
    };
    let timer = null;
    let afterReq = null;
    const visible = () => document.visibilityState !== "hidden";
    const onVisible = () => { if (visible() && Date.now() - fetchedAt() >= REFRESH_MS) fetchNow(); };
    onMounted(() => {
      fetchNow();
      timer = setInterval(() => { if (visible()) fetchNow(); }, REFRESH_MS);
      document.addEventListener("visibilitychange", onVisible);
    });
    onUnmounted(() => {
      if (timer) clearInterval(timer);
      if (afterReq) clearTimeout(afterReq);
      document.removeEventListener("visibilitychange", onVisible);
    });
    // The card can mount before the host has said the relay is configured; fetch as soon as it is.
    watch(() => !!(props.store.relay && props.store.relay.configured), (ok) => { if (ok) fetchNow(); });
    // A request just finished: refresh a moment later, once the relay has booked it.
    watch(() => Number(props.store.stats && props.store.stats.inflight) || 0, (n, old) => {
      if (n >= old) return;
      if (afterReq) clearTimeout(afterReq);
      afterReq = setTimeout(() => { afterReq = null; if (visible()) fetchNow(); }, AFTER_REQUEST_MS);
    });
    return () => {
      const st = props.store;
      const u = st.relayUsage || {};
      const p = u.done && u.ok ? u.payload : null;
      const loading = !!u.loading;
      const head = h("div", { class: "kku-head" }, [
        h("span", { class: "kku-title" }, T("额度")),
        h("span", { class: "kku-head-r" }, [
          loading ? T("正在拉取…") : p ? ago(Number(p.at) || now.value, now.value) : "",
          h("button", {
            class: ["kku-icon", loading ? "spin" : ""], title: T("刷新额度"), "aria-label": T("刷新额度"),
            disabled: loading || !(st.relay && st.relay.configured), onClick: () => st.fetchRelayUsage(false),
          }, [ICON_SYNC()]),
        ]),
      ]);
      let body;
      if (!(st.relay && st.relay.configured)) {
        body = [h("div", { class: "kku-msg" }, T("中转站还没配置好，先去「连接」填地址和 Key。"))];
      } else if (u.done && !u.ok) {
        const msg = (u.payload && u.payload.message) || "";
        body = [h("div", { class: "kku-msg bad" }, [T("拉不到额度：") + msg + " ", h("button", { class: "kku-link", onClick: () => st.fetchRelayUsage(true) }, T("重试"))])];
      } else if (!p) {
        body = [h("div", { class: "kku-msg" }, T("正在拉取…"))];
      } else {
        const rows = Array.isArray(p.quotaRows) ? p.quotaRows : [];
        body = [
          ...rows.map((r) => quotaRow(r, now.value)),
          h("div", { class: "kku-foot" }, [
            h("span", null, T(SCOPE_TEXT[p.quotaScope] || "")),
            p.sourceLabel ? h("span", { class: "kku-src" }, p.sourceLabel) : null,
          ]),
        ];
      }
      return h("section", { class: "kku-card" }, [head, ...body]);
    };
  },
};

// ---------------------------------------------------------------------------
// The relay's own records: what its usage endpoint reports. For KiroTool-style relays that is the last N requests it
// replays (it can span several days), so it is labeled as such and kept apart from "today".
// ---------------------------------------------------------------------------
export const KkRelayRecords = {
  name: "KkRelayRecords",
  props: { store: { type: Object, required: true } },
  setup(props) {
    ensureStyle();
    return () => {
      const st = props.store;
      const u = st.relayUsage || {};
      const p = u.done && u.ok ? u.payload : null;
      if (!p) return null;
      const n = Number(p.totalRequests) || 0;
      const right = p.source === "kirotool" ? T("最近 ") + count(n) + T(" 次请求") : T("累计 ") + count(n) + T(" 次请求");
      const models = (Array.isArray(p.byModel) ? p.byModel : []).slice().sort((a, b) => (Number(b.credits) || 0) - (Number(a.credits) || 0)).slice(0, 8);
      const totalCredits = models.reduce((a, m) => a + (Number(m.credits) || 0), 0);
      const totalReq = models.reduce((a, m) => a + (Number(m.requests) || 0), 0);
      const cache = p.cache && finite(p.cache.hitRate) ? p.cache : null;
      const kids = [
        h("div", { class: "kku-head" }, [h("span", { class: "kku-title" }, T("中转站记录")), h("span", { class: "kku-head-r" }, right)]),
        h("div", { class: "kku-trio" }, [
          h("div", null, [h("div", { class: "kku-tile-l" }, T("积分")), h("div", { class: "kku-num" }, credits2(Number(p.totalCredits)))]),
          h("div", null, [h("div", { class: "kku-tile-l" }, T("输入")), h("div", { class: "kku-num" }, compact(p.totalInputTokens))]),
          h("div", null, [h("div", { class: "kku-tile-l" }, T("输出")), h("div", { class: "kku-num" }, compact(p.totalOutputTokens))]),
        ]),
      ];
      if (cache) {
        const pct = Math.max(0, Math.min(1, cache.hitRate));
        kids.push(h("div", { class: "kku-row" }, [h("span", null, T("缓存命中")), h("b", null, (pct * 100).toFixed(1) + "%")]));
        kids.push(h("div", { class: "kku-thin" }, [h("div", { style: { width: pct * 100 + "%" } })]));
      }
      if (models.length) {
        kids.push(h("div", { class: "kku-models" }, models.map((m) => {
          const share = totalCredits > 0 ? (Number(m.credits) || 0) / totalCredits : totalReq > 0 ? (Number(m.requests) || 0) / totalReq : 0;
          return h("div", { class: "kku-model", key: m.model }, [
            h("div", { class: "kku-model-h" }, [
              h("code", { title: m.model }, m.model),
              h("span", null, [h("i", null, count(m.requests) + T(" 次")), h("b", null, credits2(Number(m.credits)))]),
            ]),
            h("div", { class: "kku-thin" }, [h("div", { style: { width: share * 100 + "%" } })]),
          ]);
        })));
      } else if (!n) {
        kids.push(h("div", { class: "kku-msg", style: { marginTop: "10px" } }, T("这家中转站没有逐笔记录。")));
      }
      if (p.siteUrl) kids.push(h("button", { class: "kku-btn", onClick: () => st.openExternal(p.siteUrl) }, T("打开网页用量面板") + " ↗"));
      return h("section", { class: "kku-card" }, kids);
    };
  },
};

// The relay page's "Usage" tab: the three cards in order.
export const KkRelayUsage = {
  name: "KkRelayUsage",
  props: { store: { type: Object, required: true } },
  setup(props) {
    return () => h("div", null, [
      h(KkToday, { store: props.store }),
      h(KkQuota, { store: props.store }),
      h(KkRelayRecords, { store: props.store }),
    ]);
  },
};
