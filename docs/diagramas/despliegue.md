# Diagrama de despliegue — Lab Bank

Este documento contiene el diagrama de despliegue del sistema en dos formatos:

| Archivo | Uso |
|---|---|
| `despliegue.puml` | Fuente en PlantUML, con notación UML de despliegue. Editable en VS Code, IntelliJ o [PlantText](https://www.planttext.com/) |
| `despliegue.svg` | Imagen vectorial, para insertar en documentos sin perder calidad |
| `despliegue.png` | Imagen a 200 ppp, para pegar en presentaciones |
| `despliegue.pdf` | Una página A3 horizontal, lista para imprimir |
| Este archivo | Versión en Mermaid, que GitHub renderiza directamente |

![Diagrama de despliegue](despliegue.png)

## Versión en Mermaid

```mermaid
flowchart LR
    subgraph CLIENTE["Capa cliente"]
        direction TB
        PC["Equipo del usuario<br/>Windows / macOS / Linux<br/><i>device</i>"]
        NAV["Navegador de escritorio<br/>Chrome · Firefox · Edge<br/><i>execution environment</i>"]
        SPA["SPA Lab Bank<br/>index.html · JS · CSS<br/>React 19 + Axios<br/><i>artifact</i>"]
        MOV["Dispositivo movil<br/>Android / iOS<br/><i>device</i>"]
        NAVM["Navegador movil<br/>Chrome · Safari<br/><i>execution environment</i>"]
        SPAM["Misma SPA<br/>diseño adaptable<br/><i>artifact</i>"]
        PC --> NAV --> SPA
        MOV --> NAVM --> SPAM
    end

    subgraph NUBE["Nube publica — despliegue propuesto"]
        direction TB
        CDN["CDN / hosting estatico · PaaS<br/><i>device</i>"]
        DIST["frontend/dist<br/>bundle de produccion<br/><i>artifact</i>"]
        CDN --> DIST

        subgraph VM["Servidor de aplicaciones — maquina virtual (IaaS)"]
            direction TB
            RT["Motor de contenedores<br/>Docker / Podman · imagenes OCI"]
            NGINX["Contenedor: proxy inverso<br/>Nginx · TLS 1.3 · :443"]
            API["Contenedor: API REST<br/>JRE 17 · lab12026p.jar<br/>Spring Boot 3.5 · Tomcat :8080"]
            RT --> NGINX
            RT --> API
        end

        subgraph DBNODE["Servidor de base de datos"]
            direction TB
            MYSQL["MySQL 8.4<br/><i>execution environment</i>"]
            ESQ[("Esquema lab12026p<br/>customers · transaction")]
            VOL["Volumen persistente<br/>mysql-data<br/><i>artifact</i>"]
            MYSQL --> ESQ
            MYSQL --> VOL
        end
    end

    subgraph GH["GitHub — SaaS"]
        direction TB
        REPO["Repositorio<br/>isaacmgz/lab12026p"]
        RUNNER["GitHub Actions runner<br/>ubuntu-latest"]
        CI["ci.yml<br/>mvnw verify · npm build"]
        RUNNER --> CI
    end

    subgraph DEV["Equipo de desarrollo — on-premise (Fedora Linux)"]
        direction LR
        NODE["Node.js 22<br/>Vite dev server :5173"]
        JVM["JVM 21<br/>lab12026p.jar :8080"]
        POD["Podman 5.8<br/>contenedor MySQL 8.4 :3306"]
        NODE -->|"HTTP :8080 localhost"| JVM
        JVM -->|"JDBC :3306 localhost"| POD
    end

    NAV -->|"HTTPS / TLS 1.3<br/>descarga del bundle"| CDN
    NAVM -->|"HTTPS / TLS 1.3"| CDN
    NAV -->|"HTTPS · REST/JSON · CORS"| NGINX
    NAVM -->|"HTTPS · REST/JSON"| NGINX
    NGINX -->|"HTTP :8080<br/>red interna"| API
    API -->|"JDBC sobre TCP :3306 · TLS"| MYSQL
    RUNNER -->|"despliegue del bundle · HTTPS"| CDN
    RUNNER -->|"imagen OCI · HTTPS"| RT
    DEV -->|"Git sobre SSH :22"| REPO
```

## Aspectos de infraestructura representados

| Aspecto | Dónde aparece en el diagrama |
|---|---|
| **On-premise** | Equipo de desarrollo con Fedora Linux, donde hoy conviven los tres procesos |
| **Cloud** | Nube pública con hosting estático (PaaS), servidor de aplicaciones (IaaS) y base de datos gestionada; GitHub como SaaS |
| **Virtualización** | El servidor de aplicaciones es una máquina virtual sobre infraestructura del proveedor |
| **Contenedores** | Imágenes OCI ejecutadas por Docker/Podman: proxy inverso, API y MySQL |
| **Web** | Navegador de escritorio ejecutando la SPA descargada desde el CDN |
| **Mobile** | Navegador móvil consumiendo la misma SPA gracias al diseño adaptable |
| **Protocolos** | HTTPS/TLS 1.3, REST sobre JSON, HTTP interno, JDBC sobre TCP 3306, Git sobre SSH, distribución de imágenes OCI sobre HTTPS |
| **Persistencia** | Volumen persistente `mysql-data`, independiente del ciclo de vida del contenedor |

## Estado actual frente al propuesto

El **entorno de desarrollo** del diagrama es el que está verificado y funcionando: Vite, la API y MySQL en contenedor conviven en el mismo equipo y se comunican por puertos locales.

La **nube pública** corresponde al despliegue propuesto para producción. No requiere cambios en el código: los artefactos son los mismos (`lab12026p.jar` y el bundle estático) y la configuración de base de datos, puerto y orígenes permitidos viaja en variables de entorno, tal como se describe en el README.

## Cómo regenerar las imágenes

```bash
# Requiere plantuml (o el jar oficial) y Java 17+
java -jar plantuml.jar -tpng -Sdpi=200 -o . despliegue.puml
java -jar plantuml.jar -tsvg -o . despliegue.puml
```

El diagrama usa el motor de layout `smetana`, incluido en PlantUML, por lo que no necesita Graphviz instalado.
