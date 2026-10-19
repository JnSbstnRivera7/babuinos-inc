# REGLA DURA — Babuinos es PERSONAL, no es de la empresa

**Babuinos Inc es un proyecto personal de Juan. No tiene NADA que ver con
Windmar Home, que es donde trabaja.** Esto no es una preferencia de estilo: es
la regla que no se rompe.

| | Va a | NUNCA a |
| --- | --- | --- |
| **GitHub** | `JnSbstnRivera7` (personal, **con el 7**) | `JnSbstnRivera` (empresa, sin el 7) |
| **Vercel** | equipo `jn-sbstn-s-projects` (personal) | `jnsbstnprojects` (empresa) |
| **Supabase** | el proyecto personal de Babuinos | el de Windmar Home |

**Los dos nombres se parecen y ahí está la trampa:** `jn-sbstn-s-projects` es
el personal y `jnsbstnprojects` es el de la empresa. Mirar el guion.

## Por qué el `git push` normal falla

El `gh` de esta máquina está logueado con la cuenta de **la empresa**, así que
un `git push` a secas devuelve **403**. Hay que empujar con el PAT personal en
la URL, sin guardarlo en el remote:

```bash
git push "https://x-access-token:<GITHUB_PAT>@github.com/JnSbstnRivera7/<repo>.git" main
```

El PAT, el token de Vercel y las demás claves están en `CREDENCIALES.local.md`
de la carpeta del proyecto — **local, nunca se sube**.

## Y no desplegar sin que Juan lo pida

Un `git push` a `main` **dispara el despliegue en Vercel**. Así que no se
pushea "de paso": sólo cuando Juan lo pide.

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
