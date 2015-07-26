# translate-po

Uses [Google Translate](https://cloud.google.com/translate/docs) to convert a PO file into another language.

## Install

```
npm install -g translate-po
```

## Usage

```
APIKEY=<google-api-key> translate-po <input-po-file> <language> <output-po-file>
```

e.g.
```
APIKEY=xzy translate-po ~/app/en/messages.po it ~/app/it/messages.po
```

## License

MIT
