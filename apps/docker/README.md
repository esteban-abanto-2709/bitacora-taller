# Docker (desarrollo)

Levanta el web (Next.js) en modo desarrollo. En Windows los cambios de código
no llegan solos al contenedor: reinícialo con `docker compose restart web`.

Desde esta carpeta:

```bash
docker compose up -d
```

Abre http://localhost:3000.

Para bajarlo:

```bash
docker compose down
```
