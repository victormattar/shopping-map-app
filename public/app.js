/**
 * SHOPPING MALL INTERACTIVE MAP ENGINE
 * High-performance pan/zoom SVG canvas, module deep-dive, live inspector,
 * store editing, custom attributes, search, filtering, and data persistence.
 */

(function () {
  'use strict';

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    stores: [],
    currentFloor: 'PB', // 'PB' (Planta Baja) | 'PA' (Planta Alta)
    selectedStoreId: null,
    viewMode: 'original', // 'original' | 'vector' | 'status' | 'category'
    statusFilter: 'all',  // 'all' | 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento'
    categoryFilter: 'all',
    searchQuery: '',
    showLabels: true,
    blueprintOpacity: 0.85,

    // Pan & Zoom Camera Matrix
    view: {
      scale: 1,
      x: 0,
      y: 0,
      minScale: 0.7,
      maxScale: 6.0,
      baseWidth: 457,
      baseHeight: 610,
      isPanning: false,
      startX: 0,
      startY: 0
    },

    categoryColors: {
      'Indumentaria y Moda': '#3B82F6',
      'Moda Internacional': '#2563EB',
      'Moda Joven': '#1D4ED8',
      'Moda Femenina': '#60A5FA',
      'Moda Juvenil': '#93C5FD',
      'Indumentaria Casual': '#38BDF8',
      'Indumentaria Jeanswear': '#0284C7',
      'Moda y Vestir': '#0369A1',
      'Deportes y Calzado': '#10B981',
      'Deportes y Moda Urbana': '#059669',
      'Gastronomía y Comida Rápida': '#F59E0B',
      'Gastronomía Hamburguesas': '#D97706',
      'Gastronomía / Restauración': '#B45309',
      'Sandwiches y Ensaladas': '#FBBF24',
      'Cafetería de Especialidad': '#B45309',
      'Cafetería y Pastelería': '#78350F',
      'Cafetería y Chocolates': '#92400E',
      'Helados Artesanales & Paletas': '#F97316',
      'Tecnología y Electrónica': '#8B5CF6',
      'Tecnología y Móviles': '#7C3AED',
      'Accesorios Celulares': '#6D28D9',
      'Joyería y Accesorios': '#EC4899',
      'Joyería y Charms': '#DB2777',
      'Salud y Farmacia': '#14B8A6',
      'Cosmética y Maquillaje': '#F43F5E',
      'Juegos y Entretenimiento': '#A855F7',
      'Juguetes y Coleccionables': '#E11D48',
      'Librería y Música': '#64748B',
      'Hogar y Decoración': '#0D9488',
      'Hogar e Indumentaria': '#475569',
      'Óptica y Accesorios': '#06B6D4',
      'Servicios Públicos': '#94A3B8',
      'Circulación Vertical': '#64748B',
      'Golosinas y Snacks': '#FB7185'
    }
  };

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const dom = {
    // Viewport & SVG
    mapViewport: document.getElementById('mapViewport'),
    mallMapSvg: document.getElementById('mallMapSvg'),
    mapStage: document.getElementById('mapStage'),
    blueprintImage: document.getElementById('blueprintImage'),
    vectorBaseLayer: document.getElementById('vectorBaseLayer'),
    staticFeaturesGroup: document.getElementById('staticFeaturesGroup'),
    entranceArrowsGroup: document.getElementById('entranceArrowsGroup'),
    storeModulesGroup: document.getElementById('storeModulesGroup'),
    selectionIndicatorGroup: document.getElementById('selectionIndicatorGroup'),

    // Floating Controls
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    resetZoomBtn: document.getElementById('resetZoomBtn'),
    focusActiveBtn: document.getElementById('focusActiveBtn'),
    toggleLabelsBtn: document.getElementById('toggleLabelsBtn'),
    opacitySlider: document.getElementById('opacitySlider'),
    opacityVal: document.getElementById('opacityVal'),

    // Legend & Minimap
    mapLegend: document.getElementById('mapLegend'),
    legendToggle: document.getElementById('legendToggle'),
    minimapContainer: document.getElementById('minimapContainer'),
    minimapSvg: document.getElementById('minimapSvg'),
    minimapIndicator: document.getElementById('minimapIndicator'),
    mapTooltip: document.getElementById('mapTooltip'),

    // Search & Filters
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    searchResultsDropdown: document.getElementById('searchResultsDropdown'),
    viewModeSelect: document.getElementById('viewModeSelect'),
    statusFilterChips: document.getElementById('statusFilterChips'),
    categoryFilter: document.getElementById('categoryFilter'),

    // KPIs
    kpiOccupancy: document.getElementById('kpiOccupancy'),
    kpiAvailable: document.getElementById('kpiAvailable'),
    kpiTotal: document.getElementById('kpiTotal'),
    countAll: document.getElementById('countAll'),
    countDisponible: document.getElementById('countDisponible'),
    countOcupado: document.getElementById('countOcupado'),
    countReservado: document.getElementById('countReservado'),
    countMantenimiento: document.getElementById('countMantenimiento'),

    // Inspector Panel
    inspectorPanel: document.getElementById('inspectorPanel'),
    closePanelBtn: document.getElementById('closePanelBtn'),
    zoomOutToOverviewBtn: document.getElementById('zoomOutToOverviewBtn'),
    openEditBtn: document.getElementById('openEditBtn'),
    quickToggleStatusBtn: document.getElementById('quickToggleStatusBtn'),

    panelModuleNum: document.getElementById('panelModuleNum'),
    panelStatusBadge: document.getElementById('panelStatusBadge'),
    panelZone: document.getElementById('panelZone'),
    panelStoreName: document.getElementById('panelStoreName'),
    panelCategory: document.getElementById('panelCategory'),
    panelArea: document.getElementById('panelArea'),
    panelRent: document.getElementById('panelRent'),
    panelMaintenance: document.getElementById('panelMaintenance'),
    panelUpdatedAt: document.getElementById('panelUpdatedAt'),

    // Panel Tabs & Panes
    panelTabBtns: document.querySelectorAll('.panel-tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    panelTenantCompany: document.getElementById('panelTenantCompany'),
    panelTenantContact: document.getElementById('panelTenantContact'),
    panelTenantPhone: document.getElementById('panelTenantPhone'),
    panelTenantEmail: document.getElementById('panelTenantEmail'),
    panelWhatsappLink: document.getElementById('panelWhatsappLink'),
    panelEmailLink: document.getElementById('panelEmailLink'),
    panelContractStart: document.getElementById('panelContractStart'),
    panelContractEnd: document.getElementById('panelContractEnd'),
    contractNoticeBadge: document.getElementById('contractNoticeBadge'),
    panelSchedule: document.getElementById('panelSchedule'),
    panelFeaturesList: document.getElementById('panelFeaturesList'),
    panelArchZone: document.getElementById('panelArchZone'),

    // Custom Fields & Notes
    customFieldsCount: document.getElementById('customFieldsCount'),
    panelCustomFieldsList: document.getElementById('panelCustomFieldsList'),
    addCustomFieldBtn: document.getElementById('addCustomFieldBtn'),
    notesCount: document.getElementById('notesCount'),
    panelNotesList: document.getElementById('panelNotesList'),
    newNoteInput: document.getElementById('newNoteInput'),
    newNoteAuthor: document.getElementById('newNoteAuthor'),
    submitNoteBtn: document.getElementById('submitNoteBtn'),

    // Edit Modal
    editModalOverlay: document.getElementById('editModalOverlay'),
    closeEditModalBtn: document.getElementById('closeEditModalBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),
    editStoreForm: document.getElementById('editStoreForm'),
    editStoreId: document.getElementById('editStoreId'),
    editNumber: document.getElementById('editNumber'),
    editName: document.getElementById('editName'),
    editCategory: document.getElementById('editCategory'),
    editZone: document.getElementById('editZone'),
    editArea: document.getElementById('editArea'),
    editRent: document.getElementById('editRent'),
    editMaintenance: document.getElementById('editMaintenance'),
    editTenantCompany: document.getElementById('editTenantCompany'),
    editTenantContact: document.getElementById('editTenantContact'),
    editTenantPhone: document.getElementById('editTenantPhone'),
    editTenantEmail: document.getElementById('editTenantEmail'),
    editContractStart: document.getElementById('editContractStart'),
    editContractEnd: document.getElementById('editContractEnd'),
    editSchedule: document.getElementById('editSchedule'),
    editFeatures: document.getElementById('editFeatures'),
    modalAddCustomFieldBtn: document.getElementById('modalAddCustomFieldBtn'),
    modalCustomFieldsContainer: document.getElementById('modalCustomFieldsContainer'),

    // Settings & Export Modal
    settingsBtn: document.getElementById('settingsBtn'),
    exportBtn: document.getElementById('exportBtn'),
    settingsModalOverlay: document.getElementById('settingsModalOverlay'),
    closeSettingsModalBtn: document.getElementById('closeSettingsModalBtn'),
    downloadJsonBtn: document.getElementById('downloadJsonBtn'),
    downloadCsvBtn: document.getElementById('downloadCsvBtn'),
    uploadJsonBtn: document.getElementById('uploadJsonBtn'),
    importJsonFileInput: document.getElementById('importJsonFileInput'),
    resetDatabaseBtn: document.getElementById('resetDatabaseBtn'),
    toastContainer: document.getElementById('toastContainer'),

    // Mobile Connect
    mobileConnectBtn: document.getElementById('mobileConnectBtn'),
    mobileModalOverlay: document.getElementById('mobileModalOverlay'),
    closeMobileModalBtn: document.getElementById('closeMobileModalBtn'),
    qrCodeImg: document.getElementById('qrCodeImg'),
    mobileUrlInput: document.getElementById('mobileUrlInput'),
    copyMobileUrlBtn: document.getElementById('copyMobileUrlBtn'),

    // Floor Switcher
    btnFloorPB: document.getElementById('btnFloorPB'),
    btnFloorPA: document.getElementById('btnFloorPA'),

    // Category Custom Input
    editCategoryCustom: document.getElementById('editCategoryCustom'),

    // Auth & Login
    loginOverlay: document.getElementById('loginOverlay'),
    loginForm: document.getElementById('loginForm'),
    loginPasswordInput: document.getElementById('loginPasswordInput'),
    loginErrorMsg: document.getElementById('loginErrorMsg'),
    logoutBtn: document.getElementById('logoutBtn'),
    settingsAuthGroup: document.getElementById('settingsAuthGroup'),
    changePasswordsForm: document.getElementById('changePasswordsForm'),
    newAdminPassInput: document.getElementById('newAdminPassInput'),
    newGuestPassInput: document.getElementById('newGuestPassInput')
  };

  // Auth state
  const auth = {
    token: localStorage.getItem('shopping_auth_token') || null,
    role: localStorage.getItem('shopping_auth_role') || null, // 'admin' | 'guest'
    
    getHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      return headers;
    },

    setSession(token, role) {
      this.token = token;
      this.role = role;
      localStorage.setItem('shopping_auth_token', token);
      localStorage.setItem('shopping_auth_role', role);
      this.applyRoleRestrictions();
    },

    clearSession() {
      this.token = null;
      this.role = null;
      localStorage.removeItem('shopping_auth_token');
      localStorage.removeItem('shopping_auth_role');
      if (dom.loginOverlay) {
        dom.loginOverlay.style.display = 'flex';
        dom.loginPasswordInput.value = '';
        dom.loginErrorMsg.style.display = 'none';
        dom.loginPasswordInput.focus();
      }
    },

    applyRoleRestrictions() {
      const isAdmin = this.role === 'admin';
      
      // If guest, hide edit buttons and danger zone in settings
      if (dom.openEditBtn) dom.openEditBtn.style.display = isAdmin ? 'inline-flex' : 'none';
      if (dom.quickToggleStatusBtn) dom.quickToggleStatusBtn.style.display = isAdmin ? 'inline-flex' : 'none';
      if (dom.addCustomFieldBtn) dom.addCustomFieldBtn.style.display = isAdmin ? 'inline-block' : 'none';
      if (dom.submitNoteBtn) dom.submitNoteBtn.style.display = isAdmin ? 'inline-flex' : 'none';
      if (dom.settingsAuthGroup) dom.settingsAuthGroup.style.display = isAdmin ? 'block' : 'none';
      if (dom.resetDatabaseBtn) {
        const dangerZone = dom.resetDatabaseBtn.closest('.danger-zone');
        if (dangerZone) dangerZone.style.display = isAdmin ? 'block' : 'none';
      }
      if (dom.uploadJsonBtn) {
        const importGroup = dom.uploadJsonBtn.closest('.settings-group');
        if (importGroup) importGroup.style.display = isAdmin ? 'block' : 'none';
      }
    }
  };

  // =========================================================================
  // API CLIENT & PERSISTENCE
  // =========================================================================
  const api = {
    async fetchStores() {
      try {
        const res = await fetch('/api/stores');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.stores)) {
            // Backup to localStorage
            localStorage.setItem('shopping_stores_cache', JSON.stringify(data.stores));
            return data.stores;
          }
        }
      } catch (e) {
        console.warn('API error, falling back to localStorage cache:', e);
      }
      const local = localStorage.getItem('shopping_stores_cache');
      return local ? JSON.parse(local) : [];
    },

    async updateStore(storeId, updates) {
      try {
        const res = await fetch(`/api/stores/${encodeURIComponent(storeId)}`, {
          method: 'PUT',
          headers: auth.getHeaders(),
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.store) {
            return data.store;
          }
        }
      } catch (e) {
        console.warn('API update failed, updating local state:', e);
      }
      // Offline fallback: find and update in state.stores and cache
      const idx = state.stores.findIndex(s => s.id === storeId || s.number === storeId);
      if (idx !== -1) {
        state.stores[idx] = { ...state.stores[idx], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem('shopping_stores_cache', JSON.stringify(state.stores));
        return state.stores[idx];
      }
      return null;
    },

    async addNote(storeId, text, author) {
      try {
        const res = await fetch(`/api/stores/${encodeURIComponent(storeId)}/notes`, {
          method: 'POST',
          headers: auth.getHeaders(),
          body: JSON.stringify({ text, author })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.note) {
            return data.note;
          }
        }
      } catch (e) {
        console.warn('API add note failed:', e);
      }
      // Offline fallback
      const store = state.stores.find(s => s.id === storeId || s.number === storeId);
      if (store) {
        if (!Array.isArray(store.notes)) store.notes = [];
        const note = {
          id: 'note-' + Date.now(),
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: author || 'Administración',
          text
        };
        store.notes.unshift(note);
        store.updatedAt = new Date().toISOString();
        localStorage.setItem('shopping_stores_cache', JSON.stringify(state.stores));
        return note;
      }
      return null;
    },

    async resetDatabase() {
      try {
        const res = await fetch('/api/reset', {
          method: 'POST',
          headers: auth.getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stores) {
            localStorage.setItem('shopping_stores_cache', JSON.stringify(data.stores));
            return data.stores;
          }
        }
      } catch (e) {
        console.warn('Reset API failed:', e);
      }
      return null;
    },

    async importDatabase(jsonData) {
      try {
        const res = await fetch('/api/import', {
          method: 'POST',
          headers: auth.getHeaders(),
          body: JSON.stringify(jsonData)
        });
        if (res.ok) {
          const data = await res.json();
          return data.success;
        }
      } catch (e) {
        console.warn('Import API failed:', e);
      }
      return false;
    }
  };

  function getCurrentFloorData() {
    const data = window.SHOPPING_MAP_DATA;
    if (!data) return null;
    return data[state.currentFloor] || data.PB;
  }

  function switchFloor(floor) {
    if (state.currentFloor === floor) return;
    state.currentFloor = floor;

    if (dom.btnFloorPB) dom.btnFloorPB.classList.toggle('active', floor === 'PB');
    if (dom.btnFloorPA) dom.btnFloorPA.classList.toggle('active', floor === 'PA');

    const floorData = getCurrentFloorData();
    if (!floorData) return;

    state.view.baseWidth = floorData.width || 457;
    state.view.baseHeight = floorData.height || 610;
    dom.mallMapSvg.setAttribute('viewBox', floorData.viewBox || '0 0 457 610');
    dom.blueprintImage.setAttribute('href', floorData.image);
    dom.blueprintImage.setAttribute('width', state.view.baseWidth);
    dom.blueprintImage.setAttribute('height', state.view.baseHeight);

    const outerWalls = document.getElementById('vectorOuterWalls');
    if (outerWalls && floorData.mallBoundary) {
      outerWalls.setAttribute('points', floorData.mallBoundary.points);
    }

    closeInspectorPanel();

    renderStaticMapFeatures();
    renderStoreModules();
    renderMinimap();

    populateCategoryFilter();
    updateKpisAndCounters();

    fitMapToScreen(true);
    showToast(`Cambiado a ${floorData.name}`, 'success');
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  async function initApp() {
    setupPanAndZoom();
    setupEventListeners();

    // Check if session token exists
    if (auth.token) {
      try {
        const verifyRes = await fetch('/api/auth/verify', { headers: auth.getHeaders() });
        if (verifyRes.ok) {
          const vData = await verifyRes.json();
          auth.setSession(auth.token, vData.role);
          if (dom.loginOverlay) dom.loginOverlay.style.display = 'none';
        } else {
          auth.clearSession();
        }
      } catch (err) {
        // Offline / fallback mode
        if (dom.loginOverlay) dom.loginOverlay.style.display = 'none';
        auth.applyRoleRestrictions();
      }
    } else {
      auth.clearSession();
    }

    // Load store data
    state.stores = await api.fetchStores();

    // Render static architectural features and modules
    renderStaticMapFeatures();
    renderStoreModules();
    renderMinimap();

    // Populate category dropdown and KPIs
    populateCategoryFilter();
    updateKpisAndCounters();

    // Center and fit full mall in viewport initially
    fitMapToScreen();
  }

  // =========================================================================
  // SVG RENDERING
  // =========================================================================
  function renderStaticMapFeatures() {
    const data = getCurrentFloorData();
    if (!data) return;

    // 1. Static technical areas
    dom.staticFeaturesGroup.innerHTML = '';
    (data.staticAreas || []).forEach(area => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', area.x);
      rect.setAttribute('y', area.y);
      rect.setAttribute('width', area.width);
      rect.setAttribute('height', area.height);
      rect.setAttribute('fill', area.fill || '#94A3B8');
      rect.setAttribute('stroke', area.stroke || '#0F172A');
      rect.setAttribute('stroke-width', '1');
      if (area.label) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = area.label;
        rect.appendChild(title);
      }
      dom.staticFeaturesGroup.appendChild(rect);
    });

    // 2. Entrance arrows
    dom.entranceArrowsGroup.innerHTML = '';
    (data.entrances || []).forEach(ent => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'entrance-indicator');

      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', ent.arrowPoints);
      poly.setAttribute('fill', ent.color || '#3B82F6');
      poly.setAttribute('stroke', '#1E40AF');
      poly.setAttribute('stroke-width', '1');

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = ent.label;
      poly.appendChild(title);

      g.appendChild(poly);
      dom.entranceArrowsGroup.appendChild(g);
    });
  }

  function renderStoreModules() {
    const data = getCurrentFloorData();
    if (!data || !Array.isArray(data.modules)) return;

    dom.storeModulesGroup.innerHTML = '';

    data.modules.forEach(geo => {
      const store = state.stores.find(s => s.id === geo.id || s.number === geo.number) || {
        id: geo.id,
        number: geo.number,
        name: geo.label,
        category: 'Comercial',
        status: 'ocupado',
        areaM2: 45
      };

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'store-module');
      g.setAttribute('id', `svg-${geo.id}`);
      g.setAttribute('data-id', geo.id);
      g.setAttribute('data-num', geo.number);

      // Create shape (rect or polygon)
      let shape;
      if (geo.type === 'polygon') {
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shape.setAttribute('points', geo.points);
      } else {
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        shape.setAttribute('x', geo.x);
        shape.setAttribute('y', geo.y);
        shape.setAttribute('width', geo.width);
        shape.setAttribute('height', geo.height);
      }

      shape.setAttribute('class', 'store-shape');
      shape.setAttribute('fill', getStoreFillColor(store, geo));

      // Create Text Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'store-label');
      text.setAttribute('x', geo.labelX);
      text.setAttribute('y', geo.labelY);
      text.setAttribute('font-size', geo.fontSize || 11);
      text.textContent = geo.label || geo.number;

      g.appendChild(shape);
      g.appendChild(text);

      // Store click handler: Zoom into module & open inspector!
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        selectStore(geo.id, true);
      });

      // Hover tooltip handler
      g.addEventListener('mouseenter', (e) => showTooltip(e, store, geo));
      g.addEventListener('mousemove', (e) => updateTooltipPosition(e));
      g.addEventListener('mouseleave', hideTooltip);

      dom.storeModulesGroup.appendChild(g);
    });

    applyFiltersAndVisualMode();
  }

  function getStoreFillColor(store, geo) {
    if (store.isService) {
      return '#A6A6A6';
    }

    if (state.viewMode === 'status') {
      const status = store.status || 'ocupado';
      switch (status) {
        case 'disponible': return '#10B981';
        case 'ocupado': return '#3B82F6';
        case 'reservado': return '#F59E0B';
        case 'mantenimiento': return '#EF4444';
        default: return '#3B82F6';
      }
    }

    if (state.viewMode === 'category') {
      const cat = store.category || '';
      return state.categoryColors[cat] || '#8B5CF6';
    }

    // Default 'original' or 'vector' view
    return geo.originalColor || store.originalColor || '#FFFFFF';
  }

  function applyFiltersAndVisualMode() {
    const data = getCurrentFloorData();
    if (!data) return;

    // Toggle blueprint image visibility / opacity
    if (state.viewMode === 'vector') {
      dom.blueprintImage.style.display = 'none';
      dom.vectorBaseLayer.style.display = 'block';
    } else {
      dom.blueprintImage.style.display = 'block';
      dom.blueprintImage.setAttribute('opacity', state.blueprintOpacity);
      dom.vectorBaseLayer.style.display = 'none';
    }

    // Update each module's color and dimmed status
    data.modules.forEach(geo => {
      const elem = document.getElementById(`svg-${geo.id}`);
      if (!elem) return;

      const store = state.stores.find(s => s.id === geo.id || s.number === geo.number);
      if (!store) return;

      const shape = elem.querySelector('.store-shape');
      if (shape) {
        shape.setAttribute('fill', getStoreFillColor(store, geo));
      }

      // Label visibility
      const label = elem.querySelector('.store-label');
      if (label) {
        label.style.display = state.showLabels ? 'block' : 'none';
        // Invert label text color if dark background
        if (state.viewMode === 'status' || state.viewMode === 'category') {
          label.setAttribute('fill', '#FFFFFF');
        } else if (geo.originalColor === '#C8287D' || geo.originalColor === '#FF5555') {
          label.setAttribute('fill', '#0F172A');
        } else {
          label.setAttribute('fill', '#0F172A');
        }
      }

      // Check Filter Matching
      let matches = true;

      // Status filter
      if (state.statusFilter !== 'all') {
        if (store.status !== state.statusFilter) matches = false;
      }

      // Category filter
      if (state.categoryFilter !== 'all') {
        if (store.category !== state.categoryFilter) matches = false;
      }

      // Search query filter
      if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        const num = (store.number || '').toLowerCase();
        const name = (store.name || '').toLowerCase();
        const cat = (store.category || '').toLowerCase();
        const tenant = (store.tenant?.company || '').toLowerCase();
        if (!num.includes(q) && !name.includes(q) && !cat.includes(q) && !tenant.includes(q)) {
          matches = false;
        }
      }

      if (matches) {
        elem.classList.remove('dimmed');
      } else {
        elem.classList.add('dimmed');
      }
    });

    updateSelectionRing();
    updateMinimap();
  }

  // =========================================================================
  // PAN AND ZOOM ENGINE
  // =========================================================================
  function setupPanAndZoom() {
    const vp = dom.mapViewport;

    // Mouse drag pan
    vp.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      state.view.isPanning = true;
      state.view.startX = e.clientX - state.view.x;
      state.view.startY = e.clientY - state.view.y;
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.view.isPanning) return;
      state.view.x = e.clientX - state.view.startX;
      state.view.y = e.clientY - state.view.startY;
      applyTransform();
    });

    window.addEventListener('mouseup', () => {
      state.view.isPanning = false;
    });

    // Wheel zoom towards pointer
    vp.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      zoomAtPoint(mouseX, mouseY, zoomFactor);
    }, { passive: false });

    // Touch support (pinch and pan)
    let initialTouchDist = null;
    let initialTouchCenter = null;

    vp.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        state.view.isPanning = true;
        state.view.startX = e.touches[0].clientX - state.view.x;
        state.view.startY = e.touches[0].clientY - state.view.y;
      } else if (e.touches.length === 2) {
        state.view.isPanning = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const rect = vp.getBoundingClientRect();
        initialTouchCenter = {
          x: (t1.clientX + t2.clientX) / 2 - rect.left,
          y: (t1.clientY + t2.clientY) / 2 - rect.top
        };
      }
    });

    vp.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && state.view.isPanning) {
        state.view.x = e.touches[0].clientX - state.view.startX;
        state.view.y = e.touches[0].clientY - state.view.startY;
        applyTransform();
      } else if (e.touches.length === 2 && initialTouchDist) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const newDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = newDist / initialTouchDist;
        initialTouchDist = newDist;
        zoomAtPoint(initialTouchCenter.x, initialTouchCenter.y, factor);
      }
    });

    vp.addEventListener('touchend', () => {
      state.view.isPanning = false;
      initialTouchDist = null;
    });

    window.addEventListener('resize', () => {
      updateMinimap();
    });
  }

  function zoomAtPoint(screenX, screenY, factor) {
    const prevScale = state.view.scale;
    let newScale = prevScale * factor;
    newScale = Math.max(state.view.minScale, Math.min(state.view.maxScale, newScale));

    // Calculate map point under screen coordinate
    const mapX = (screenX - state.view.x) / prevScale;
    const mapY = (screenY - state.view.y) / prevScale;

    // Reposition translation so mouse stays on same map point
    state.view.x = screenX - mapX * newScale;
    state.view.y = screenY - mapY * newScale;
    state.view.scale = newScale;

    applyTransform();
  }

  function applyTransform() {
    dom.mapStage.setAttribute('transform', `translate(${state.view.x}, ${state.view.y}) scale(${state.view.scale})`);
    updateMinimap();
  }

  function fitMapToScreen(smooth = false) {
    const vpRect = dom.mapViewport.getBoundingClientRect();
    const padding = 30;

    const availableWidth = vpRect.width - padding * 2;
    const availableHeight = vpRect.height - padding * 2;

    const scaleX = availableWidth / state.view.baseWidth;
    const scaleY = availableHeight / state.view.baseHeight;
    const targetScale = Math.min(scaleX, scaleY, 1.3);

    const targetX = (vpRect.width - state.view.baseWidth * targetScale) / 2;
    const targetY = (vpRect.height - state.view.baseHeight * targetScale) / 2;

    if (smooth) {
      animateCameraTo(targetX, targetY, targetScale, 400);
    } else {
      state.view.scale = targetScale;
      state.view.x = targetX;
      state.view.y = targetY;
      applyTransform();
    }
  }

  /**
   * DEEP DIVE ZOOM: Smoothly zooms into the clicked module!
   */
  function zoomToModule(moduleId, targetZoom = 3.2) {
    const geo = getCurrentFloorData()?.modules?.find(m => m.id === moduleId);
    if (!geo) return;

    // Get module bounding box
    let minX, minY, width, height;
    if (geo.type === 'polygon') {
      const pts = geo.points.trim().split(/\s+/).map(p => p.split(',').map(Number));
      const xs = pts.map(p => p[0]);
      const ys = pts.map(p => p[1]);
      minX = Math.min(...xs);
      minY = Math.min(...ys);
      width = Math.max(...xs) - minX;
      height = Math.max(...ys) - minY;
    } else {
      minX = geo.x;
      minY = geo.y;
      width = geo.width;
      height = geo.height;
    }

    const centerX = minX + width / 2;
    const centerY = minY + height / 2;

    const vpRect = dom.mapViewport.getBoundingClientRect();

    // Adjust target center: If the inspector panel is open, shift center to the left
    // so the focused store isn't hidden behind the panel!
    const panelWidth = dom.inspectorPanel.classList.contains('open') ? 440 : 0;
    const effectiveWidth = Math.max(200, vpRect.width - panelWidth);

    const targetScale = targetZoom;
    const targetX = (effectiveWidth / 2) - (centerX * targetScale);
    const targetY = (vpRect.height / 2) - (centerY * targetScale);

    animateCameraTo(targetX, targetY, targetScale, 500);
  }

  function animateCameraTo(targetX, targetY, targetScale, duration = 400) {
    const startX = state.view.x;
    const startY = state.view.y;
    const startScale = state.view.scale;
    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = easeInOutCubic(progress);

      state.view.x = startX + (targetX - startX) * ease;
      state.view.y = startY + (targetY - startY) * ease;
      state.view.scale = startScale + (targetScale - startScale) * ease;

      applyTransform();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // =========================================================================
  // MODULE SELECTION & INSPECTOR PANEL
  // =========================================================================
  function selectStore(storeId, triggerZoom = true) {
    state.selectedStoreId = storeId;

    // Deselect previous
    document.querySelectorAll('.store-module.selected').forEach(el => el.classList.remove('selected'));

    const elem = document.getElementById(`svg-${storeId}`);
    if (elem) {
      elem.classList.add('selected');
    }

    const store = state.stores.find(s => s.id === storeId || s.number === storeId);
    if (!store) return;

    // Open Inspector Side Panel
    openInspectorPanel(store);

    // Zoom in on the module!
    if (triggerZoom) {
      zoomToModule(storeId, store.isAnchor ? 2.3 : 3.4);
    }

    dom.focusActiveBtn.style.display = 'flex';
    updateSelectionRing();
  }

  function updateSelectionRing() {
    dom.selectionIndicatorGroup.innerHTML = '';
    if (!state.selectedStoreId) return;

    const geo = getCurrentFloorData()?.modules?.find(m => m.id === state.selectedStoreId);
    if (!geo) return;

    if (geo.type === 'polygon') {
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', geo.points);
      poly.setAttribute('class', 'selection-ring');
      dom.selectionIndicatorGroup.appendChild(poly);
    } else {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', geo.x - 2);
      rect.setAttribute('y', geo.y - 2);
      rect.setAttribute('width', geo.width + 4);
      rect.setAttribute('height', geo.height + 4);
      rect.setAttribute('rx', '3');
      rect.setAttribute('class', 'selection-ring');
      dom.selectionIndicatorGroup.appendChild(rect);
    }
  }

  function openInspectorPanel(store) {
    dom.panelModuleNum.textContent = `LOCAL #${store.number}`;
    dom.panelStoreName.textContent = store.name || 'Sin Asignar';
    dom.panelCategory.textContent = store.category || 'Rubro General';
    dom.panelZone.textContent = store.zone || 'Planta Baja';

    // Status Badge
    const status = store.status || 'ocupado';
    dom.panelStatusBadge.className = `status-badge badge-${status}`;
    dom.panelStatusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);

    // Stats
    dom.panelArea.textContent = `${store.areaM2 || 0} m²`;
    dom.panelRent.textContent = store.monthlyRentUSD ? `$ ${store.monthlyRentUSD.toLocaleString()} USD` : 'A consultar';
    dom.panelMaintenance.textContent = store.maintenanceUSD ? `$ ${store.maintenanceUSD.toLocaleString()} USD` : '$ 0 USD';

    // Tenant info
    const t = store.tenant || {};
    dom.panelTenantCompany.textContent = t.company || 'Sin Asignar';
    dom.panelTenantContact.textContent = t.contactPerson || 'No especificado';
    dom.panelTenantPhone.textContent = t.phone || '--';
    dom.panelTenantEmail.textContent = t.email || '--';

    // WhatsApp Link
    if (t.phone) {
      const cleanPhone = t.phone.replace(/[^0-9]/g, '');
      dom.panelWhatsappLink.href = `https://wa.me/${cleanPhone}`;
      dom.panelWhatsappLink.style.display = 'inline-block';
    } else {
      dom.panelWhatsappLink.style.display = 'none';
    }

    // Email Link
    if (t.email) {
      dom.panelEmailLink.href = `mailto:${t.email}?subject=Consulta Local ${store.number} - Shopping Mall`;
      dom.panelEmailLink.style.display = 'inline-block';
    } else {
      dom.panelEmailLink.style.display = 'none';
    }

    // Contract dates & alert
    dom.panelContractStart.textContent = t.contractStart || '--';
    dom.panelContractEnd.textContent = t.contractEnd || '--';

    if (t.contractEnd) {
      const endDate = new Date(t.contractEnd);
      const today = new Date();
      const diffMonths = (endDate.getFullYear() - today.getFullYear()) * 12 + (endDate.getMonth() - today.getMonth());
      if (diffMonths <= 3 && diffMonths >= 0) {
        dom.contractNoticeBadge.textContent = `⚠️ Próximo a vencer en ${diffMonths} meses`;
        dom.contractNoticeBadge.className = 'contract-notice warning';
        dom.contractNoticeBadge.style.display = 'block';
      } else if (diffMonths < 0) {
        dom.contractNoticeBadge.textContent = `🚨 Contrato Vencido`;
        dom.contractNoticeBadge.className = 'contract-notice expired';
        dom.contractNoticeBadge.style.display = 'block';
      } else {
        dom.contractNoticeBadge.style.display = 'none';
      }
    } else {
      dom.contractNoticeBadge.style.display = 'none';
    }

    dom.panelSchedule.textContent = store.schedule || 'Lunes a Domingo: 10:00 a 22:00';
    dom.panelArchZone.textContent = store.zone || 'Planta Principal';

    // Features / Instalaciones
    dom.panelFeaturesList.innerHTML = '';
    const features = Array.isArray(store.features) ? store.features : [];
    if (features.length > 0) {
      features.forEach(f => {
        const pill = document.createElement('span');
        pill.className = 'feature-pill';
        pill.textContent = `✓ ${f}`;
        dom.panelFeaturesList.appendChild(pill);
      });
    } else {
      dom.panelFeaturesList.innerHTML = '<span class="text-muted">Sin especificaciones cargadas</span>';
    }

    // Custom Fields
    renderCustomFieldsList(store);

    // Notes
    renderNotesTimeline(store);

    // Timestamp
    if (store.updatedAt) {
      const d = new Date(store.updatedAt);
      dom.panelUpdatedAt.textContent = `Actualizado: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      dom.panelUpdatedAt.textContent = '';
    }

    // Open panel drawer
    dom.inspectorPanel.classList.add('open');
  }

  function closeInspectorPanel() {
    dom.inspectorPanel.classList.remove('open');
    state.selectedStoreId = null;
    document.querySelectorAll('.store-module.selected').forEach(el => el.classList.remove('selected'));
    dom.selectionIndicatorGroup.innerHTML = '';
    dom.focusActiveBtn.style.display = 'none';
  }

  function renderCustomFieldsList(store) {
    dom.panelCustomFieldsList.innerHTML = '';
    const fields = Array.isArray(store.customFields) ? store.customFields : [];
    dom.customFieldsCount.textContent = fields.length;

    if (fields.length === 0) {
      dom.panelCustomFieldsList.innerHTML = '<div class="empty-state">No se han registrado campos adicionales. Usa "+ Agregar Campo" para incorporar información propia.</div>';
      return;
    }

    fields.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'custom-field-item';
      row.innerHTML = `
        <span class="custom-field-label">${escapeHtml(item.label)}:</span>
        <span class="custom-field-val">${escapeHtml(item.value)}</span>
      `;
      dom.panelCustomFieldsList.appendChild(row);
    });
  }

  function renderNotesTimeline(store) {
    dom.panelNotesList.innerHTML = '';
    const notes = Array.isArray(store.notes) ? store.notes : [];
    dom.notesCount.textContent = notes.length;

    if (notes.length === 0) {
      dom.panelNotesList.innerHTML = '<div class="empty-state">No hay notas registradas para este módulo aún.</div>';
      return;
    }

    notes.forEach(n => {
      const noteEl = document.createElement('div');
      noteEl.className = 'timeline-note';
      noteEl.innerHTML = `
        <div class="note-meta">
          <span class="note-author">${escapeHtml(n.author || 'Usuario')}</span>
          <span class="note-date">${escapeHtml(n.date || '')}</span>
        </div>
        <div class="note-text">${escapeHtml(n.text || '')}</div>
      `;
      dom.panelNotesList.appendChild(noteEl);
    });
  }

  // =========================================================================
  // EDIT MODAL & INCORPORATING NEW INFORMATION
  // =========================================================================
  function openEditModal(storeId) {
    const store = state.stores.find(s => s.id === storeId || s.number === storeId);
    if (!store) return;

    dom.editStoreId.value = store.id;
    dom.editNumber.value = store.number;
    dom.editName.value = store.name || '';
    dom.editZone.value = store.zone || '';
    dom.editArea.value = store.areaM2 || '';
    dom.editRent.value = store.monthlyRentUSD || '';
    dom.editMaintenance.value = store.maintenanceUSD || '';

    // Robust category dropdown handling
    const cat = store.category || '';
    const selectOptions = Array.from(dom.editCategory.options).map(o => o.value);
    if (selectOptions.includes(cat)) {
      dom.editCategory.value = cat;
      if (dom.editCategoryCustom) {
        dom.editCategoryCustom.style.display = 'none';
        dom.editCategoryCustom.value = '';
      }
    } else if (cat) {
      dom.editCategory.value = '__custom__';
      if (dom.editCategoryCustom) {
        dom.editCategoryCustom.style.display = 'block';
        dom.editCategoryCustom.value = cat;
      }
    } else {
      dom.editCategory.selectedIndex = 0;
      if (dom.editCategoryCustom) {
        dom.editCategoryCustom.style.display = 'none';
        dom.editCategoryCustom.value = '';
      }
    }

    // Status radio
    const statusRadio = document.querySelector(`input[name="editStatus"][value="${store.status || 'ocupado'}"]`);
    if (statusRadio) statusRadio.checked = true;

    // Tenant info
    const t = store.tenant || {};
    dom.editTenantCompany.value = t.company || '';
    dom.editTenantContact.value = t.contactPerson || '';
    dom.editTenantPhone.value = t.phone || '';
    dom.editTenantEmail.value = t.email || '';
    dom.editContractStart.value = t.contractStart || '';
    dom.editContractEnd.value = t.contractEnd || '';

    dom.editSchedule.value = store.schedule || '';
    dom.editFeatures.value = Array.isArray(store.features) ? store.features.join(', ') : '';

    // Dynamic custom fields container in modal
    dom.modalCustomFieldsContainer.innerHTML = '';
    const fields = Array.isArray(store.customFields) ? store.customFields : [];
    fields.forEach(f => addCustomFieldRow(f.label, f.value));

    dom.editModalOverlay.style.display = 'flex';
  }

  function addCustomFieldRow(label = '', value = '') {
    const row = document.createElement('div');
    row.className = 'dynamic-field-row';
    row.innerHTML = `
      <input type="text" class="custom-key-input" placeholder="Nombre del atributo (ej: Póliza)" value="${escapeHtml(label)}">
      <input type="text" class="custom-val-input" placeholder="Valor (ej: Mapfre #882)" value="${escapeHtml(value)}">
      <button type="button" class="btn-icon remove-row-btn" title="Eliminar campo">✕</button>
    `;
    row.querySelector('.remove-row-btn').addEventListener('click', () => row.remove());
    dom.modalCustomFieldsContainer.appendChild(row);
  }

  async function handleSaveStoreForm(e) {
    e.preventDefault();
    const storeId = dom.editStoreId.value;
    const store = state.stores.find(s => s.id === storeId || s.number === storeId);
    if (!store) return;

    const statusRadio = document.querySelector('input[name="editStatus"]:checked');
    const selectedStatus = statusRadio ? statusRadio.value : store.status;

    // Category resolution
    const chosenCat = dom.editCategory.value;
    const finalCategory = (chosenCat === '__custom__' && dom.editCategoryCustom)
      ? dom.editCategoryCustom.value.trim()
      : chosenCat.trim();

    if (!finalCategory) {
      showToast('Por favor selecciona o escribe un rubro comercial', 'error');
      return;
    }

    // Collect custom fields
    const customFields = [];
    dom.modalCustomFieldsContainer.querySelectorAll('.dynamic-field-row').forEach(row => {
      const k = row.querySelector('.custom-key-input').value.trim();
      const v = row.querySelector('.custom-val-input').value.trim();
      if (k && v) {
        customFields.push({ label: k, value: v });
      }
    });

    // Collect features
    const rawFeatures = dom.editFeatures.value.split(',').map(s => s.trim()).filter(Boolean);

    const updates = {
      name: dom.editName.value.trim(),
      category: finalCategory,
      status: selectedStatus,
      zone: dom.editZone.value.trim(),
      areaM2: parseFloat(dom.editArea.value) || 0,
      monthlyRentUSD: parseFloat(dom.editRent.value) || 0,
      maintenanceUSD: parseFloat(dom.editMaintenance.value) || 0,
      schedule: dom.editSchedule.value.trim(),
      features: rawFeatures,
      customFields: customFields,
      tenant: {
        company: dom.editTenantCompany.value.trim(),
        contactPerson: dom.editTenantContact.value.trim(),
        phone: dom.editTenantPhone.value.trim(),
        email: dom.editTenantEmail.value.trim(),
        contractStart: dom.editContractStart.value,
        contractEnd: dom.editContractEnd.value
      }
    };

    // Send update to API
    const updated = await api.updateStore(storeId, updates);
    if (updated) {
      // Update local array
      const idx = state.stores.findIndex(s => s.id === storeId || s.number === storeId);
      if (idx !== -1) {
        state.stores[idx] = updated;
      }

      showToast(`Local #${updated.number} modificado con éxito`, 'success');
      dom.editModalOverlay.style.display = 'none';

      // Re-render map and panel
      applyFiltersAndVisualMode();
      populateCategoryFilter();
      updateKpisAndCounters();
      openInspectorPanel(updated);
    } else {
      showToast('Error al guardar los cambios del local', 'error');
    }
  }

  // =========================================================================
  // HOVER TOOLTIPS
  // =========================================================================
  function showTooltip(e, store, geo) {
    const statusMap = {
      ocupado: 'Ocupado',
      disponible: 'Disponible',
      reservado: 'Reservado',
      mantenimiento: 'Mantenimiento'
    };

    dom.mapTooltip.innerHTML = `
      <div class="tooltip-num">LOCAL #${store.number}</div>
      <div class="tooltip-name">${escapeHtml(store.name || 'Sin Asignar')}</div>
      <div class="tooltip-meta">
        <span>${escapeHtml(store.category || '')}</span>
        <span>${store.areaM2 || 0} m²</span>
        <span class="status-badge badge-${store.status || 'ocupado'}">${statusMap[store.status] || store.status}</span>
      </div>
    `;
    dom.mapTooltip.style.display = 'block';
    updateTooltipPosition(e);
  }

  function updateTooltipPosition(e) {
    const vpRect = dom.mapViewport.getBoundingClientRect();
    const x = e.clientX - vpRect.left;
    const y = e.clientY - vpRect.top;
    dom.mapTooltip.style.left = `${x}px`;
    dom.mapTooltip.style.top = `${y}px`;
  }

  function hideTooltip() {
    dom.mapTooltip.style.display = 'none';
  }

  // =========================================================================
  // SEARCH & AUTOCOMPLETE
  // =========================================================================
  function handleSearchInput(e) {
    const query = e.target.value;
    state.searchQuery = query;

    if (query.trim()) {
      dom.clearSearchBtn.style.display = 'block';
      renderSearchResults(query.trim().toLowerCase());
    } else {
      dom.clearSearchBtn.style.display = 'none';
      dom.searchResultsDropdown.style.display = 'none';
    }

    applyFiltersAndVisualMode();
  }

  function renderSearchResults(q) {
    const matched = state.stores.filter(s => {
      // Only search within the current floor
      if (s.floor !== state.currentFloor) return false;
      const num = (s.number || '').toLowerCase();
      const name = (s.name || '').toLowerCase();
      const cat = (s.category || '').toLowerCase();
      const tenant = (s.tenant?.company || '').toLowerCase();
      return num.includes(q) || name.includes(q) || cat.includes(q) || tenant.includes(q);
    });

    if (matched.length === 0) {
      dom.searchResultsDropdown.innerHTML = '<div class="empty-state">No se encontraron locales que coincidan</div>';
      dom.searchResultsDropdown.style.display = 'block';
      return;
    }

    dom.searchResultsDropdown.innerHTML = '';
    matched.slice(0, 8).forEach(store => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="search-result-info">
          <span class="search-result-num">#${store.number}</span>
          <div>
            <div class="search-result-name">${escapeHtml(store.name || 'Sin Asignar')}</div>
            <div class="search-result-category">${escapeHtml(store.category || '')} · ${store.areaM2 || 0} m²</div>
          </div>
        </div>
        <span class="status-badge badge-${store.status || 'ocupado'}">${store.status}</span>
      `;
      item.addEventListener('click', () => {
        dom.searchResultsDropdown.style.display = 'none';
        selectStore(store.id, true);
      });
      dom.searchResultsDropdown.appendChild(item);
    });

    dom.searchResultsDropdown.style.display = 'block';
  }

  // =========================================================================
  // MINIMAP
  // =========================================================================
  function renderMinimap() {
    const floorData = getCurrentFloorData();
    if (!floorData) return;

    const w = floorData.width || 457;
    const h = floorData.height || 610;
    const img = floorData.image || 'floorplan_pb.png';

    dom.minimapSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    dom.minimapSvg.innerHTML = `
      <rect width="${w}" height="${h}" fill="#E2E8F0" />
      <image href="${img}" x="0" y="0" width="${w}" height="${h}" opacity="0.7" />
    `;
  }

  function updateMinimap() {
    const vpRect = dom.mapViewport.getBoundingClientRect();
    const mmRect = dom.minimapContainer.getBoundingClientRect();

    const scaleX = mmRect.width / state.view.baseWidth;
    const scaleY = mmRect.height / state.view.baseHeight;

    // Viewport coordinates in map space
    const visibleLeft = -state.view.x / state.view.scale;
    const visibleTop = -state.view.y / state.view.scale;
    const visibleWidth = vpRect.width / state.view.scale;
    const visibleHeight = vpRect.height / state.view.scale;

    // Indicator in minimap space
    const indLeft = Math.max(0, visibleLeft * scaleX);
    const indTop = Math.max(0, visibleTop * scaleY);
    const indWidth = Math.min(mmRect.width, visibleWidth * scaleX);
    const indHeight = Math.min(mmRect.height, visibleHeight * scaleY);

    dom.minimapIndicator.style.left = `${indLeft}px`;
    dom.minimapIndicator.style.top = `${indTop}px`;
    dom.minimapIndicator.style.width = `${indWidth}px`;
    dom.minimapIndicator.style.height = `${indHeight}px`;
  }

  // =========================================================================
  // KPIS & CATEGORY FILTER
  // =========================================================================
  function populateCategoryFilter() {
    const categories = new Set();
    // Only show categories from the current floor
    state.stores.filter(s => !s.isService && s.floor === state.currentFloor).forEach(s => {
      if (s.category) categories.add(s.category);
    });

    dom.categoryFilter.innerHTML = '<option value="all">Todos los rubros</option>';
    Array.from(categories).sort().forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      dom.categoryFilter.appendChild(opt);
    });

    // Reset filter value if now invalid
    if (state.categoryFilter !== 'all' && !categories.has(state.categoryFilter)) {
      state.categoryFilter = 'all';
      dom.categoryFilter.value = 'all';
    }
  }

  function updateKpisAndCounters() {
    // Only count commercial stores on the current floor
    const commercial = state.stores.filter(s => !s.isService && s.floor === state.currentFloor);
    const total = commercial.length;
    const occupied = commercial.filter(s => s.status === 'ocupado').length;
    const available = commercial.filter(s => s.status === 'disponible').length;
    const reserved = commercial.filter(s => s.status === 'reservado').length;
    const maintenance = commercial.filter(s => s.status === 'mantenimiento').length;

    const occPct = total > 0 ? Math.round((occupied / total) * 100) : 0;

    dom.kpiOccupancy.textContent = `${occPct}%`;
    dom.kpiAvailable.textContent = available;
    dom.kpiTotal.textContent = total;

    dom.countAll.textContent = total;
    dom.countDisponible.textContent = available;
    dom.countOcupado.textContent = occupied;
    dom.countReservado.textContent = reserved;
    dom.countMantenimiento.textContent = maintenance;
  }

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================
  function setupEventListeners() {
    // Zoom buttons
    dom.zoomInBtn.addEventListener('click', () => {
      const vpRect = dom.mapViewport.getBoundingClientRect();
      zoomAtPoint(vpRect.width / 2, vpRect.height / 2, 1.25);
    });

    dom.zoomOutBtn.addEventListener('click', () => {
      const vpRect = dom.mapViewport.getBoundingClientRect();
      zoomAtPoint(vpRect.width / 2, vpRect.height / 2, 0.8);
    });

    dom.resetZoomBtn.addEventListener('click', () => fitMapToScreen(true));

    dom.focusActiveBtn.addEventListener('click', () => {
      if (state.selectedStoreId) zoomToModule(state.selectedStoreId);
    });

    dom.toggleLabelsBtn.addEventListener('click', () => {
      state.showLabels = !state.showLabels;
      dom.toggleLabelsBtn.classList.toggle('active', state.showLabels);
      applyFiltersAndVisualMode();
    });

    // Opacity Slider
    dom.opacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.blueprintOpacity = val / 100;
      dom.opacityVal.textContent = `${val}%`;
      dom.blueprintImage.setAttribute('opacity', state.blueprintOpacity);
    });

    // View Mode Selector
    dom.viewModeSelect.addEventListener('change', (e) => {
      state.viewMode = e.target.value;
      applyFiltersAndVisualMode();
    });

    // Status Filter Chips
    dom.statusFilterChips.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      state.statusFilter = btn.dataset.status;
      applyFiltersAndVisualMode();
    });

    // Category Filter Select
    dom.categoryFilter.addEventListener('change', (e) => {
      state.categoryFilter = e.target.value;
      applyFiltersAndVisualMode();
    });

    // Search events
    dom.searchInput.addEventListener('input', handleSearchInput);
    dom.clearSearchBtn.addEventListener('click', () => {
      dom.searchInput.value = '';
      state.searchQuery = '';
      dom.clearSearchBtn.style.display = 'none';
      dom.searchResultsDropdown.style.display = 'none';
      applyFiltersAndVisualMode();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== dom.searchInput) {
        e.preventDefault();
        dom.searchInput.focus();
      }
      if (e.key === 'Escape') {
        dom.searchResultsDropdown.style.display = 'none';
        closeInspectorPanel();
        dom.editModalOverlay.style.display = 'none';
        dom.settingsModalOverlay.style.display = 'none';
      }
    });

    // Minimap click navigation
    dom.minimapContainer.addEventListener('click', (e) => {
      const rect = dom.minimapContainer.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width * state.view.baseWidth;
      const clickY = (e.clientY - rect.top) / rect.height * state.view.baseHeight;

      const vpRect = dom.mapViewport.getBoundingClientRect();
      const targetX = (vpRect.width / 2) - (clickX * state.view.scale);
      const targetY = (vpRect.height / 2) - (clickY * state.view.scale);

      animateCameraTo(targetX, targetY, state.view.scale, 300);
    });

    // Legend Toggle
    dom.legendToggle.addEventListener('click', () => {
      dom.mapLegend.classList.toggle('collapsed');
    });

    // Inspector Panel actions
    dom.closePanelBtn.addEventListener('click', closeInspectorPanel);
    dom.zoomOutToOverviewBtn.addEventListener('click', () => fitMapToScreen(true));

    dom.openEditBtn.addEventListener('click', () => {
      if (state.selectedStoreId) openEditModal(state.selectedStoreId);
    });

    dom.quickToggleStatusBtn.addEventListener('click', async () => {
      if (!state.selectedStoreId) return;
      const store = state.stores.find(s => s.id === state.selectedStoreId || s.number === state.selectedStoreId);
      if (!store) return;

      const nextStatus = store.status === 'ocupado' ? 'disponible' :
                         store.status === 'disponible' ? 'reservado' : 'ocupado';

      const updated = await api.updateStore(store.id, { status: nextStatus });
      if (updated) {
        const idx = state.stores.findIndex(s => s.id === store.id);
        if (idx !== -1) state.stores[idx] = updated;
        openInspectorPanel(updated);
        applyFiltersAndVisualMode();
        updateKpisAndCounters();
        showToast(`Estado cambiado a ${nextStatus.toUpperCase()}`, 'success');
      }
    });

    // Tabs navigation in inspector
    dom.panelTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.panelTabBtns.forEach(b => b.classList.remove('active'));
        dom.tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    // Add Custom Field button in Panel
    dom.addCustomFieldBtn.addEventListener('click', () => {
      if (state.selectedStoreId) openEditModal(state.selectedStoreId);
    });

    // Add Note in Panel
    dom.submitNoteBtn.addEventListener('click', async () => {
      if (!state.selectedStoreId) return;
      const text = dom.newNoteInput.value.trim();
      const author = dom.newNoteAuthor.value.trim() || 'Administración';
      if (!text) {
        showToast('Escribe un texto para la observación', 'error');
        return;
      }

      const note = await api.addNote(state.selectedStoreId, text, author);
      if (note) {
        dom.newNoteInput.value = '';
        const store = state.stores.find(s => s.id === state.selectedStoreId || s.number === state.selectedStoreId);
        if (store) renderNotesTimeline(store);
        showToast('Nota registrada con éxito', 'success');
      }
    });

    // Edit modal form submit
    dom.editStoreForm.addEventListener('submit', handleSaveStoreForm);
    dom.closeEditModalBtn.addEventListener('click', () => dom.editModalOverlay.style.display = 'none');
    dom.cancelEditBtn.addEventListener('click', () => dom.editModalOverlay.style.display = 'none');
    dom.modalAddCustomFieldBtn.addEventListener('click', () => addCustomFieldRow());

    // Settings Modal
    dom.settingsBtn.addEventListener('click', () => dom.settingsModalOverlay.style.display = 'flex');
    dom.exportBtn.addEventListener('click', () => dom.settingsModalOverlay.style.display = 'flex');
    dom.closeSettingsModalBtn.addEventListener('click', () => dom.settingsModalOverlay.style.display = 'none');

    dom.downloadJsonBtn.addEventListener('click', () => {
      window.location.href = '/api/export/json';
    });

    dom.downloadCsvBtn.addEventListener('click', () => {
      window.location.href = '/api/export/csv';
    });

    dom.uploadJsonBtn.addEventListener('click', () => dom.importJsonFileInput.click());
    dom.importJsonFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const json = JSON.parse(evt.target.result);
          const ok = await api.importDatabase(json);
          if (ok) {
            state.stores = await api.fetchStores();
            applyFiltersAndVisualMode();
            populateCategoryFilter();
            updateKpisAndCounters();
            dom.settingsModalOverlay.style.display = 'none';
            showToast('Base de datos restaurada correctamente', 'success');
          } else {
            showToast('Error al importar archivo', 'error');
          }
        } catch (err) {
          showToast('Archivo JSON no válido', 'error');
        }
      };
      reader.readAsText(file);
    });

    dom.resetDatabaseBtn.addEventListener('click', async () => {
      if (confirm('¿Estás seguro de restablecer todos los locales a los valores originales de fábrica? Se perderán las modificaciones no respaldadas.')) {
        const res = await api.resetDatabase();
        if (res) {
          state.stores = res;
          applyFiltersAndVisualMode();
          populateCategoryFilter();
          updateKpisAndCounters();
          if (state.selectedStoreId) {
            const current = state.stores.find(s => s.id === state.selectedStoreId);
            if (current) openInspectorPanel(current);
          }
          dom.settingsModalOverlay.style.display = 'none';
          showToast('Valores originales restablecidos', 'success');
        }
      }
    });

    // Mobile Connect QR Modal
    async function openMobileModal() {
      dom.mobileModalOverlay.style.display = 'flex';
      try {
        const res = await fetch('/api/network-info');
        if (res.ok) {
          const data = await res.json();
          const mobileUrl = data.mobileUrl;
          dom.mobileUrlInput.value = mobileUrl;
          dom.qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mobileUrl)}`;
          return;
        }
      } catch (e) {
        console.warn('Network info error:', e);
      }
      const fallbackUrl = window.location.origin;
      dom.mobileUrlInput.value = fallbackUrl;
      dom.qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(fallbackUrl)}`;
    }

    dom.mobileConnectBtn.addEventListener('click', openMobileModal);
    dom.closeMobileModalBtn.addEventListener('click', () => dom.mobileModalOverlay.style.display = 'none');
    dom.copyMobileUrlBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(dom.mobileUrlInput.value).then(() => {
          showToast('Dirección copiada al portapapeles', 'success');
        }).catch(() => {
          dom.mobileUrlInput.select();
          document.execCommand('copy');
          showToast('Dirección copiada', 'success');
        });
      } else {
        dom.mobileUrlInput.select();
        document.execCommand('copy');
        showToast('Dirección copiada', 'success');
      }
    });
    // Floor Switcher
    if (dom.btnFloorPB) {
      dom.btnFloorPB.addEventListener('click', () => switchFloor('PB'));
    }
    if (dom.btnFloorPA) {
      dom.btnFloorPA.addEventListener('click', () => switchFloor('PA'));
    }

    // Category Select → show/hide custom rubro input
    if (dom.editCategory) {
      dom.editCategory.addEventListener('change', (e) => {
        const isCustom = e.target.value === '__custom__';
        if (dom.editCategoryCustom) {
          dom.editCategoryCustom.style.display = isCustom ? 'block' : 'none';
          if (!isCustom) dom.editCategoryCustom.value = '';
        }
      });
    }

    // Login Form Submit
    if (dom.loginForm) {
      dom.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pwd = dom.loginPasswordInput.value.trim();
        if (!pwd) return;

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pwd })
          });
          const data = await res.json();
          if (data.success && data.token) {
            auth.setSession(data.token, data.role);
            dom.loginOverlay.style.display = 'none';
            showToast(data.role === 'admin' ? 'Bienvenido, Administrador' : 'Bienvenido (Modo Consulta)', 'success');
          } else {
            dom.loginErrorMsg.style.display = 'block';
            dom.loginPasswordInput.focus();
            dom.loginPasswordInput.select();
          }
        } catch (err) {
          showToast('Error al conectar con el servidor', 'error');
        }
      });
    }

    // Logout
    if (dom.logoutBtn) {
      dom.logoutBtn.addEventListener('click', () => {
        auth.clearSession();
        showToast('Sesión cerrada', 'success');
      });
    }

    // Change passwords form
    if (dom.changePasswordsForm) {
      dom.changePasswordsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newAdmin = dom.newAdminPassInput.value.trim();
        const newGuest = dom.newGuestPassInput.value.trim();
        if (!newAdmin && !newGuest) {
          showToast('Ingresa al menos una nueva contraseña', 'error');
          return;
        }

        try {
          const res = await fetch('/api/auth/change-passwords', {
            method: 'POST',
            headers: auth.getHeaders(),
            body: JSON.stringify({ admin_pass: newAdmin, guest_pass: newGuest })
          });
          const data = await res.json();
          if (data.success) {
            showToast('Contraseñas actualizadas con éxito', 'success');
            dom.newAdminPassInput.value = '';
            dom.newGuestPassInput.value = '';
          } else {
            showToast(data.error || 'Error al cambiar contraseñas', 'error');
          }
        } catch (err) {
          showToast('Error al conectar con el servidor', 'error');
        }
      });
    }
  }

  // =========================================================================
  // UTILITIES
  // =========================================================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
