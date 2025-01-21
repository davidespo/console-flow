# console-flow Logging Library

## Options - TODO

CF_LOGGING_FORMAT

## Development

```sh
$ npm install
$ npm run build
$ npm publish --access public
```

## Roadmap

- [x] add plugin support
- [x] add cloud formats
- [/] support [Structured Logging](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry) format
- [ ] create MCD plugin
- [ ] Add `instanceId` when format=`json` or `cloud`
- [ ] set default options based on format
- [ ] support custom cli formats
- [ ] allow icons only for levels

## Structured Logging

<https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry>

```text
NOTICE
ALERT
EMERGENCY
```
