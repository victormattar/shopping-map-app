# 🏬 Terrazas Shopping Santiago — Plano Interactivo

Aplicación web interactiva para visualizar y gestionar los locales comerciales de **Terrazas Shopping Santiago**.

## ✨ Características

- 🗺️ **Mapa SVG interactivo** con pan & zoom suave (mouse + touch)
- 🏢 **Soporte multi-piso**: Planta Baja (PB) y Planta Alta (PA)
- 🔍 **Buscador en tiempo real** por número, nombre, rubro o empresa
- 📊 **KPIs dinámicos** de ocupación por piso
- 📋 **Inspector lateral** con datos completos del local
- ✏️ **Edición inline**: nombre, rubro, estado, inquilino, contrato, campos personalizados, notas
- 🎨 **Modos de visualización**: Plano original, Vectorial, Ocupación, Rubros
- 📱 **Acceso móvil** vía código QR desde la misma red WiFi
- 💾 **Persistencia JSON** con exportación CSV/JSON y respaldo
- 🔄 **Sin dependencias externas**: solo Python estándar como backend

## 🚀 Iniciar

```bash
python server.py 8000
```

Luego abre [http://localhost:8000](http://localhost:8000) en tu navegador.

### Acceso desde el celular

1. Conecta el celular a la misma red WiFi
2. Haz clic en el ícono 📱 del header
3. Escanea el código QR o ingresa la URL

## 📁 Estructura

```
shopping-map-app/
├── server.py              # Backend Python (REST API)
├── iniciar_app.bat        # Launcher Windows
├── data/
│   └── stores.json        # Base de datos de locales
└── public/
    ├── index.html          # Interfaz principal
    ├── styles.css          # Estilos
    ├── app.js              # Motor de mapa interactivo
    ├── map-data.js         # Geometría SVG de los módulos
    ├── logo.png            # Logo Terrazas Shopping
    ├── floorplan_pb.png    # Plano Planta Baja
    └── floorplan_pa.png    # Plano Planta Alta
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla, SVG
- **Backend**: Python 3 (http.server stdlib)
- **Datos**: JSON plano

## 📄 Licencia

MIT
