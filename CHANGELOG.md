# Changelog

## 2.0.14 — 2026-11-26

The relay page is split into Usage, Connection and Settings tabs, so the numbers are no longer mixed in with the forms. Usage has three cards: today on this machine, the quota, and the relay's own records. The connection and settings forms are the same as before, moved into their tabs.

Today's counters now count relay requests properly. Credits on the relay route were always 0, because the relay translation never reported a charge; they now come from the charge the relay appends to each stream, the same figure Kiro shows as Est. Credits Used. Tokens on the relay route are the upstream's own counts instead of a byte estimate, split into input (with the cached part) and output. Every request and charge also lands in a per-hour bucket, shown as a chart. The API key page uses the same card. Today's numbers saved by an older version keep their totals but have no hourly split.

The quota card always shows the 5-hour and weekly windows. A window the relay reports no limit for shows "No limit", with what was used when the relay says. A seat-pool reading that did not come back shows "No reading" rather than "No limit". A relay that reports no windows at all shows both as "No limit" and its credit cap, if any, on its own row. The card refreshes when the tab opens, every 60 seconds while it is on screen, and 3 seconds after a request finishes; it stops while the panel is hidden. The panel footer still shows `2026-11-06`.

## 2.0.13 — 2026-11-26

An upgrade no longer gets stuck behind an old copy in another Kiro window. The window that holds the gateway ports now says its version and window name when another copy checks on it. A copy that finds an older holder asks it to let go, takes the ports within a second, and the old window shows a notice to reload. Requests already running finish, and a request that reaches the old holder on a connection kept open is passed on to the new one. A holder older than 2.0.13 cannot be asked, so the new window warns that an older version holds the ports and says to reload the other windows. Two asks at most, then a warning, so a holder that agrees and keeps the port cannot cause a loop.

The relay usage card groups models without regard to case, so `GLM-5.4` and `glm-5.4` count as one model. It also lists the 5-hour and weekly quota, each with its reset time, when the relay sends a `windows` list. A key with limits of its own shows those windows instead (5-hour, daily, weekly, monthly, total). A relay that sends no `windows` keeps the single credit-cap line. The panel footer still shows `2026-11-06`.

## 2.0.12 — 2026-11-26

Relay mode shows "Est. Credits Used" again. The translation never sent Kiro's `meteringEvent` frame, so a relayed turn reported the elapsed time only. Each relay request now carries `x-gateway-usage: v1`. A relay that supports it appends one `gateway_usage` event with the request's charge to the end of the stream, and that charge is passed on to Kiro as the metering frame. A relay that does not support it is unaffected: the header is ignored and no frame is sent. The panel footer still shows `2026-11-06`.

## 2.0.11 — 2026-11-06

Relay mode now uses IPv4 (`family: 4`) and retries at most three times when TLS fails with `before secure TLS`. Same URL, same headers, same body. Timeouts and disconnects after the handshake are not resent. Official direct mode already did this; the chat line "无法连接中转站" was the relay path giving up on the first handshake drop. The panel footer still shows `2026-11-06`.

## 2.0.10 — 2026-11-06

The user-rate wait is 3s, then 6s, then 12s (at most three times). 2.0.9 waited 15s, which is longer than Kiro will hold a request with no bytes, so the toast became "Your connection was interrupted" after a successful resend. Still the same key, same endpoint, same body. The panel footer still shows `2026-11-06`.

## 2.0.9 — 2026-11-06

An HTTP 429 is treated as a user rate limit even when the body is only `ThrottlingException` / `Rate exceeded` and has no `USER_REQUEST_RATE_EXCEEDED` token. 2.0.8 missed those and handed the error to Kiro immediately if patience mode was off. The wait is still the same request, same key, same endpoint. The panel footer still shows `2026-11-06`.

## 2.0.8 — 2026-11-06

A user rate limit (`USER_REQUEST_RATE_EXCEEDED` / "sending requests faster") now waits for `retryAfter` (at least 15 seconds, at most three times) and resends the same request on the same key and endpoint. It does not switch endpoints, switch accounts, or rewrite the user message. The panel keeps one switch, on by default. Keyword match/reply rules and the 2-second retry interval are gone. After the waits are used up, the error goes back to Kiro. The panel footer shows `2026-11-06`.

## 2.0.7 — 2026-11-04

JSON BuilderId now uses Kiro's fixed profile `arn:aws:codewhisperer:us-east-1:638616132270:profile/AAAACCCCXXXX`. Github and Google use the other fixed profile unless the credential already has one. That replaces the IDE login's profile on proxied usage, models, chat, and MCP. A JSON key no longer keeps the official `/mcp` passthrough, and a window without this credential no longer restores official endpoints while the gateway is still on. The imported FREE / used / total chip is shown from the snapshot until live usage returns. The panel footer shows `2026-11-04`.

## 2.0.6 — 2026-11-03

The relay fallback-model field is gone. It was replacing the model selected in chat, so a Haiku turn still went out as whatever id was filled in there. The model id Kiro sends is now forwarded as-is, unless `kiroGateway.relayModelMapping` has an entry for it. A saved fallback value is cleared on startup. The panel footer still shows `2026-11-03`.

## 2.0.5 — 2026-11-03

Relay mode now tells Kiro when a reply has finished. Anthropic `stop_reason` is forwarded as `metadataEvent.stopReason` (`END_TURN`, `MAX_TOKENS`, `TOOL_USE`, and the other reasons Kiro already understands). A completed relay answer is no longer treated as truncated, so Kiro does not retry that turn or append a `Continue` user message. The panel footer still shows `2026-11-03`.

## 2.0.4 — 2026-11-03

The panel follows Kiro's language, with a Chinese / English switch at the top and a `kiroGateway.language` setting (`auto`, `zh`, `en`). The two buttons at the top only change the page. The route that is running stays until you confirm; confirming stops that route and reloads the window. Cancel leaves it running. Code comments in `extension.js` and `relay.js` are English.

## 2.0.3 — 2026-11-03

The Open VSX namespace is `tesbo`. The extension id is `tesbo.kiro-gateway`. Commands, settings, and saved state still use the `kiroGateway` prefix. The panel footer still shows the release date `2026-11-03`.

## 2.0.2 — 2026-11-03

The Open VSX namespace is `kiro-gateway`. The extension id is `kiro-gateway.kiro-gateway`. The `local` namespace already belonged to someone else, so 2.0.1 could not be published there.

Commands, settings, and saved state still use the `kiroGateway` prefix. The panel footer still shows the release date `2026-11-03`.

## 2.0.1 — 2026-11-03

Extension updates are left to Kiro. Install the extension from the Extensions view so Kiro can list a new version there and apply it with Restart Extensions. The extension no longer scans the local install every 10 seconds, and the panel no longer has an update banner or an auto-reload switch.

The panel footer still shows the release date `2026-11-03`.

## 2.0.0 — 2026-11-03

First public release of Kiro Gateway. The extension id is `local.kiro-gateway`. Commands, settings, and saved state use the `kiroGateway` prefix.

This repository starts at 2.0.0. It is the open-source line of the plugin that was previously installed as 1.1.46. Builds numbered 1.1.47 through 1.1.52 are not part of this repository and should not be installed over it.

The panel footer shows the version from `package.json` and the release date `2026-11-03`.
