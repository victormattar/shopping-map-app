#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shopping Map App - Servidor Backend & Servidor de Archivos Estáticos
Servidor ligero en Python estándar (sin dependencias externas).
Proporciona API RESTful para gestión de locales comerciales y persistencia.
"""

import os
import sys
import json
import csv
import io
import time
import socket
import urllib.parse
import webbrowser
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
UPLOADS_DIR = os.path.join(PUBLIC_DIR, 'uploads')
STORES_FILE = os.path.join(DATA_DIR, 'stores.json')
BACKUP_FILE = os.path.join(DATA_DIR, 'stores_backup.json')
AUTH_FILE = os.path.join(DATA_DIR, 'auth_config.json')

# Default passwords if not configured
DEFAULT_AUTH = {
    "admin_pass": "admin2026",
    "guest_pass": "terrazas2026"
}

def load_auth_config():
    if not os.path.exists(AUTH_FILE):
        with open(AUTH_FILE, 'w', encoding='utf-8') as f:
            json.dump(DEFAULT_AUTH, f, indent=2)
        return DEFAULT_AUTH
    try:
        with open(AUTH_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return DEFAULT_AUTH

def check_token(auth_header):
    if not auth_header:
        return None
    token = auth_header.replace('Bearer ', '').strip()
    cfg = load_auth_config()
    admin_token = hashlib.sha256(f"admin:{cfg.get('admin_pass')}".encode('utf-8')).hexdigest()
    guest_token = hashlib.sha256(f"guest:{cfg.get('guest_pass')}".encode('utf-8')).hexdigest()
    if token == admin_token:
        return 'admin'
    elif token == guest_token:
        return 'guest'
    return None

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)


def load_stores():
    if not os.path.exists(STORES_FILE):
        if os.path.exists(BACKUP_FILE):
            with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            save_stores(data)
            return data
        return []
    with open(STORES_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_stores(stores):
    with open(STORES_FILE, 'w', encoding='utf-8') as f:
        json.dump(stores, f, indent=2, ensure_ascii=False)


class AppRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, status_code, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status_code, message):
        self.send_json(status_code, {'success': False, 'error': message})

    def read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        raw = self.rfile.read(content_length)
        return json.loads(raw.decode('utf-8'))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # REST API Routes
        if path == '/api/auth/verify':
            token_role = check_token(self.headers.get('Authorization'))
            if token_role:
                self.send_json(200, {'success': True, 'role': token_role})
            else:
                self.send_error_json(401, 'Token no válido')
            return

        elif path == '/api/network-info':
            ip = get_local_ip()
            port = self.server.server_address[1]
            self.send_json(200, {
                'success': True,
                'localIp': ip,
                'port': port,
                'localUrl': f'http://localhost:{port}',
                'mobileUrl': f'http://{ip}:{port}'
            })
            return

        elif path == '/api/stores':
            stores = load_stores()
            self.send_json(200, {'success': True, 'stores': stores})
            return

        elif path.startswith('/api/stores/'):
            store_id = path[len('/api/stores/'):]
            stores = load_stores()
            found = next((s for s in stores if s.get('id') == store_id or s.get('number') == store_id), None)
            if found:
                self.send_json(200, {'success': True, 'store': found})
            else:
                self.send_error_json(404, f'Store {store_id} not found')
            return

        elif path == '/api/stats':
            stores = load_stores()
            commercial_stores = [s for s in stores if not s.get('isService')]
            total = len(commercial_stores)
            occupied = len([s for s in commercial_stores if s.get('status') == 'ocupado'])
            available = len([s for s in commercial_stores if s.get('status') == 'disponible'])
            reserved = len([s for s in commercial_stores if s.get('status') == 'reservado'])
            maintenance = len([s for s in commercial_stores if s.get('status') == 'mantenimiento'])

            total_m2 = sum(float(s.get('areaM2', 0) or 0) for s in commercial_stores)
            occupied_m2 = sum(float(s.get('areaM2', 0) or 0) for s in commercial_stores if s.get('status') == 'ocupado')
            available_m2 = sum(float(s.get('areaM2', 0) or 0) for s in commercial_stores if s.get('status') == 'disponible')
            total_rent = sum(float(s.get('monthlyRentUSD', 0) or 0) for s in commercial_stores if s.get('status') == 'ocupado')

            occupancy_pct = round((occupied / total * 100), 1) if total > 0 else 0

            stats = {
                'totalUnits': total,
                'occupied': occupied,
                'available': available,
                'reserved': reserved,
                'maintenance': maintenance,
                'occupancyPercentage': occupancy_pct,
                'totalM2': round(total_m2, 1),
                'occupiedM2': round(occupied_m2, 1),
                'availableM2': round(available_m2, 1),
                'estimatedMonthlyRentUSD': round(total_rent, 2)
            }
            self.send_json(200, {'success': True, 'stats': stats})
            return

        elif path == '/api/export/json':
            stores = load_stores()
            body = json.dumps(stores, indent=2, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Disposition', 'attachment; filename="shopping_mall_locales.json"')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        elif path == '/api/export/csv':
            stores = load_stores()
            output = io.StringIO()
            writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)
            writer.writerow(['ID', 'Número', 'Nombre Comercial', 'Rubro', 'Estado', 'Zona', 'Superficie (m2)', 'Alquiler (USD)', 'Expensas (USD)', 'Inquilino / Empresa', 'Contacto', 'Teléfono', 'Email', 'Fin Contrato'])
            for s in stores:
                t = s.get('tenant') or {}
                writer.writerow([
                    s.get('id', ''),
                    s.get('number', ''),
                    s.get('name', ''),
                    s.get('category', ''),
                    s.get('status', ''),
                    s.get('zone', ''),
                    s.get('areaM2', ''),
                    s.get('monthlyRentUSD', ''),
                    s.get('maintenanceUSD', ''),
                    t.get('company', ''),
                    t.get('contactPerson', ''),
                    t.get('phone', ''),
                    t.get('email', ''),
                    t.get('contractEnd', '')
                ])
            csv_bytes = output.getvalue().encode('utf-8-sig')
            self.send_response(200)
            self.send_header('Content-Type', 'text/csv; charset=utf-8')
            self.send_header('Content-Disposition', 'attachment; filename="locales_shopping.csv"')
            self.send_header('Content-Length', str(len(csv_bytes)))
            self.end_headers()
            self.wfile.write(csv_bytes)
            return

        # Serve static files from public/
        if path == '/' or path == '':
            file_path = os.path.join(PUBLIC_DIR, 'index.html')
        else:
            rel_path = path.lstrip('/')
            file_path = os.path.join(PUBLIC_DIR, rel_path)

        if os.path.isfile(file_path):
            self.serve_file(file_path)
        else:
            self.send_error(404, f'File not found: {path}')

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/auth/login':
            body = self.read_json_body()
            password = body.get('password', '').strip()
            cfg = load_auth_config()
            admin_pwd = cfg.get('admin_pass', DEFAULT_AUTH['admin_pass'])
            guest_pwd = cfg.get('guest_pass', DEFAULT_AUTH['guest_pass'])

            if password == admin_pwd:
                token = hashlib.sha256(f"admin:{admin_pwd}".encode('utf-8')).hexdigest()
                self.send_json(200, {'success': True, 'role': 'admin', 'token': token})
                return
            elif password == guest_pwd:
                token = hashlib.sha256(f"guest:{guest_pwd}".encode('utf-8')).hexdigest()
                self.send_json(200, {'success': True, 'role': 'guest', 'token': token})
                return
            else:
                self.send_error_json(401, 'Contraseña incorrecta')
                return

        elif path == '/api/auth/change-passwords':
            role = check_token(self.headers.get('Authorization'))
            if role != 'admin':
                self.send_error_json(403, 'Solo el Administrador puede cambiar las contraseñas')
                return
            body = self.read_json_body()
            new_admin = body.get('admin_pass', '').strip()
            new_guest = body.get('guest_pass', '').strip()
            cfg = load_auth_config()
            if new_admin:
                cfg['admin_pass'] = new_admin
            if new_guest:
                cfg['guest_pass'] = new_guest
            with open(AUTH_FILE, 'w', encoding='utf-8') as f:
                json.dump(cfg, f, indent=2)
            self.send_json(200, {'success': True, 'message': 'Contraseñas actualizadas correctamente'})
            return

        elif path.startswith('/api/stores/') and path.endswith('/notes'):
            parts = path.strip('/').split('/')
            store_id = parts[2]
            body = self.read_json_body()
            text = body.get('text', '').strip()
            author = body.get('author', 'Usuario').strip()

            if not text:
                self.send_error_json(400, 'El texto de la nota no puede estar vacío')
                return

            stores = load_stores()
            for s in stores:
                if s.get('id') == store_id or s.get('number') == store_id:
                    if 'notes' not in s or not isinstance(s['notes'], list):
                        s['notes'] = []
                    new_note = {
                        'id': f'note-{int(time.time()*1000)}',
                        'date': time.strftime('%Y-%m-%d %H:%M'),
                        'author': author or 'Administración',
                        'text': text
                    }
                    s['notes'].insert(0, new_note)
                    s['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%S')
                    save_stores(stores)
                    self.send_json(200, {'success': True, 'store': s, 'note': new_note})
                    return

            self.send_error_json(404, f'Store {store_id} not found')
            return

        elif path == '/api/reset':
            role = check_token(self.headers.get('Authorization'))
            if role != 'admin':
                self.send_error_json(403, 'Permiso denegado. Se requiere rol de Administrador.')
                return
            if os.path.exists(BACKUP_FILE):
                with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                save_stores(data)
                self.send_json(200, {'success': True, 'message': 'Datos reiniciados con éxito', 'stores': data})
            else:
                self.send_error_json(500, 'Archivo de respaldo no encontrado')
            return

        elif path == '/api/import':
            role = check_token(self.headers.get('Authorization'))
            if role != 'admin':
                self.send_error_json(403, 'Permiso denegado. Se requiere rol de Administrador.')
                return
            body = self.read_json_body()
            if isinstance(body, list) and len(body) > 0:
                save_stores(body)
                self.send_json(200, {'success': True, 'count': len(body)})
            elif isinstance(body, dict) and 'stores' in body and isinstance(body['stores'], list):
                save_stores(body['stores'])
                self.send_json(200, {'success': True, 'count': len(body['stores'])})
            else:
                self.send_error_json(400, 'Formato JSON inválido para importación')
            return

        else:
            self.send_error_json(404, 'Endpoint no encontrado')

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/stores/'):
            role = check_token(self.headers.get('Authorization'))
            if role != 'admin':
                self.send_error_json(403, 'Permiso denegado. Se requiere rol de Administrador para modificar locales.')
                return
            store_id = path[len('/api/stores/'):]
            updates = self.read_json_body()
            stores = load_stores()

            found_idx = None
            for idx, s in enumerate(stores):
                if s.get('id') == store_id or s.get('number') == store_id:
                    found_idx = idx
                    break

            if found_idx is not None:
                current = stores[found_idx]
                # Merge updates safely
                for k, v in updates.items():
                    if k == 'tenant' and isinstance(v, dict):
                        if 'tenant' not in current or not isinstance(current['tenant'], dict):
                            current['tenant'] = {}
                        current['tenant'].update(v)
                    else:
                        current[k] = v

                current['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%S')
                stores[found_idx] = current
                save_stores(stores)
                self.send_json(200, {'success': True, 'store': current})
            else:
                self.send_error_json(404, f'Store {store_id} not found')
            return

        self.send_error_json(404, 'Endpoint no encontrado')

    def serve_file(self, file_path):
        mime_types = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        }
        ext = os.path.splitext(file_path)[1].lower()
        content_type = mime_types.get(ext, 'application/octet-stream')

        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f'Error al leer archivo: {e}')


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


def find_free_port(start_port=8000, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return start_port


def run_server(port=None):
    if port is None:
        env_port = os.environ.get('PORT')
        if env_port:
            port = int(env_port)
        else:
            port = find_free_port(8000)

    # 0.0.0.0 binds to all interfaces, allowing access from mobile on local Wi-Fi or cloud hosting
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, AppRequestHandler)

    local_ip = get_local_ip()
    local_url = f'http://localhost:{port}'
    mobile_url = f'http://{local_ip}:{port}'

    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

    print('=' * 68)
    print('  [MALL MAP] MAPA INTERACTIVO DE CENTRO COMERCIAL')
    print('=' * 68)
    print(f'  -> En esta PC:   {local_url}')
    print(f'  -> En tu CELULAR: {mobile_url}')
    print('=' * 68)
    print('  * Asegurate de que tu celular este conectado a la misma red Wi-Fi.')
    print('  * Presiona Ctrl+C en esta terminal para detener el servidor.')
    print('=' * 68)

    try:
        webbrowser.open(local_url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nServidor detenido.')
        httpd.server_close()


if __name__ == '__main__':
    p = int(sys.argv[1]) if len(sys.argv) > 1 else None
    run_server(p)
