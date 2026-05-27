# fb2skill-cli

Command-line wrapper for `fb2skill-core`. Exposes the `fb2skill` console script.

```
fb2skill -f <project-folder> -o <out-dir> \
         -e opc.tcp://host:4840 \
         -bI http://example.org/myproject \
         -rI my_plc \
         [--namespace-index 2] [--only sk1,sk2] [--verify]
```

See repo root `README.md` for the full design.
