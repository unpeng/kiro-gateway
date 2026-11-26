# Kiro Gateway

English | [中文](README.zh-CN.md)

A Kiro extension that routes the built-in chat through a local gateway.

Two modes:

- **API key direct.** Use a Kiro API key (`ksk_`) or a JSON login (`refreshToken`) against Kiro's own service. No protocol translation. Supports several credentials, health checks, and automatic failover.
- **Relay.** Translate chat requests into Anthropic Messages and forward them to an Anthropic-compatible endpoint that you configure. The model list comes from that endpoint.

Each mode uses its own local ports. Direct mode uses `19820` and `19821`. Relay mode uses `19830` and `19831`. Credentials for one mode are not overwritten when you edit the other.

The extension id is `tesbo.kiro-gateway`. Commands and settings use the `kiroGateway` prefix, for example `kiroGateway.enabled`.

## Install

Kiro checks [Open VSX](https://open-vsx.org) for extension updates. Once Kiro Gateway is listed there, install it from Kiro's Extensions view. A new version shows up in the Extensions view, under Updates. With **Extensions: Auto Update** turned on, Kiro downloads it for you. After it is installed, the extension entry shows **Restart Extensions**. That restarts the extension host when you choose. The extension does not scan its own install folder and does not ask you to reload for an update.

A copy installed from a VSIX file stays outside that update list. Use the Extensions view if you want later versions to show up there.

Kiro reads the gateway endpoints once, when the window starts. After you turn the gateway on, or after you change mode, reload the window.

## Several windows and upgrades

Every Kiro window starts its own copy of the extension, but the local ports are fixed, so only one window holds them. The other windows stand by and take over when the holder goes away. Kiro sends every request to the holder, so the version that counts is the one running in the holder's window, not the one installed on disk.

After you install a new version, reload the window that holds the ports. Reloading only the window you are looking at is not enough: if another window still holds the ports with the old version, that old copy keeps forwarding and the new one stands by behind it.

From 2.0.13 on, a window that starts with a newer version asks an older holder to let go. It takes the ports within a second, the requests already running finish, and the old window shows a notice to reload itself. A holder older than 2.0.13 cannot be asked. The new window then warns that an older version holds the ports, and takes over by itself once the other Kiro windows are reloaded or closed.

To see which copy holds the ports, open Output → Kiro Gateway in each window. `listening on 127.0.0.1:19830` marks the holder, and the `plugin=` line at the top of the same log gives its version. A window on standby logs that another window holds the port.

## Publishing

Publish each release to Open VSX. Kiro can then update it from the Extensions view. The Open VSX namespace is `tesbo`.

Create an access token at [open-vsx.org](https://open-vsx.org) after signing the publisher agreement, then either:

```bash
npm run package
npx --yes ovsx publish *.vsix -p "$OVSX_PAT"
```

or add the token as the `OVSX_PAT` repository secret. The publish workflow runs when a GitHub release is published.

## API key direct

1. Open the **Kiro Gateway** sidebar.
2. Choose **API key direct**.
3. Add a `ksk_` key, or import a JSON credential.
4. Turn the gateway on and reload the window.

A JSON credential needs a `refreshToken`. Builder ID and IAM Identity Center credentials also need `clientId` and `clientSecret`. The same refresh token must not be used by both the plugin and Kiro's own login at the same time. Kiro rotates the refresh token on every successful refresh, and a second refresh of the old token invalidates the account.

The plugin stores JSON secrets in the extension's private state, not in `settings.json`. Exports from the panel contain the full credential. Do not commit those files.

## Relay

1. Choose **Relay**.
2. Enter the Anthropic base URL and the relay API key. A missing `/v1` is added automatically.
3. Test the connection. The test only lists models.
4. Save, turn the gateway on, and reload the window.

Saved relay settings are restored when the panel is opened again.

When the relay reports usage per request, each turn shows "Est. Credits Used" the way the official line does. The plugin sends `x-gateway-usage: v1`, and the relay appends one `gateway_usage` event with the charge to the end of the stream. A relay that does not support it is unaffected and the turn still shows the elapsed time only.

The relay usage card lists the 5-hour and weekly quota with their reset times when the relay reports them (a KiroTool-style `/api/pub/quota` that carries a `windows` list). A key with limits of its own shows those windows instead. Models are grouped without regard to case.

## Theme and language

The panel follows Kiro's light and dark theme. Text follows Kiro's language. Chinese and English are both included. `kiroGateway.language` can force one of them (`auto`, `zh`, or `en`). The button at the top of the panel switches between 中文 and EN.

## Routes

The two buttons at the top only change the page. The route that is running keeps running, including while this window is on standby and another window owns the ports. A line under the buttons names the live route. Use this page's route and reload asks before stopping it. Cancel leaves the current route running. Confirming writes the mode, rebinds the ports, and reloads the window. The gateway switch still turns the live route on or off.

## Development

`extension.js` and `relay.js` are the extension source. `webview-ui/dist` is the built panel. The Vue project that produced that bundle is not in this repository yet.

Do not commit API keys, refresh tokens, or account export files.

## License

MIT. See [LICENSE](LICENSE).
