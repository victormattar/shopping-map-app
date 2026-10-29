/**
 * MAP DATA - Geometría y Coordenadas del Centro Comercial
 * TERRAZAS SHOPPING SANTIAGO
 * Soporte para Planta Baja (PB) y Planta Alta (PA)
 */

window.SHOPPING_MAP_DATA = {
  // =========================================================================
  // PLANTA BAJA (PB)
  // =========================================================================
  PB: {
    name: 'Planta Baja',
    level: 0,
    image: 'floorplan_pb.png',
    viewBox: '0 0 457 610',
    width: 457,
    height: 610,

    mallBoundary: {
      points: '20,15 235,15 235,35 255,35 255,15 275,15 275,35 320,35 320,15 345,15 345,75 435,75 435,575 320,575 320,600 280,600 280,565 220,565 220,600 20,600 20,15',
      stroke: '#1E293B',
      strokeWidth: 3
    },

    entrances: [
      { id: 'acceso-norte', label: 'Acceso Norte Principal', arrowPoints: '280,38 290,58 285,58 285,75 275,75 275,58 270,58', color: '#3B82F6' },
      { id: 'acceso-sur', label: 'Acceso Sur Principal', arrowPoints: '250,595 240,575 245,575 245,558 255,558 255,575 260,575', color: '#3B82F6' }
    ],

    staticAreas: [
      { id: 'salida-emergencia-oeste', type: 'rect', x: 30, y: 279, width: 20, height: 160, fill: '#002060', stroke: '#001030', label: 'Salida de Emergencia' },
      { id: 'salida-emergencia-este', type: 'rect', x: 410, y: 279, width: 20, height: 200, fill: '#002060', stroke: '#001030', label: 'Salida de Emergencia' },
      { id: 'pasillo-tecnico-oeste', type: 'rect', x: 30, y: 439, width: 20, height: 100, fill: '#7030A0', stroke: '#4A1D6E', label: 'Pasillo Técnico' },
      { id: 'pasillo-tecnico-este', type: 'rect', x: 390, y: 479, width: 40, height: 100, fill: '#7030A0', stroke: '#4A1D6E', label: 'Pasillo Técnico' },
      { id: 'acceso-vereda-so', type: 'rect', x: 30, y: 539, width: 124, height: 20, fill: '#A0D080', stroke: '#6E9C54', label: 'Área Verde / Acceso' },
      { id: 'acceso-vereda-se', type: 'rect', x: 320, y: 579, width: 110, height: 19, fill: '#A0D080', stroke: '#6E9C54', label: 'Área Verde / Acceso' },
      { id: 'acceso-modulo-blanco', type: 'rect', x: 154, y: 539, width: 61, height: 20, fill: '#FFFFFF', stroke: '#000000', label: '' }
    ],

    modules: [
      // ALA OESTE
      { id: 'local-15', number: '15', type: 'polygon', points: '30,41 110,41 110,20 230,20 230,159 30,159', labelX: 130, labelY: 90, label: '15', fontSize: 16, originalColor: '#FFFFFF', isAnchor: true },
      { id: 'local-14', number: '14', type: 'rect', x: 30, y: 159, width: 80, height: 20, labelX: 70, labelY: 173, label: '14', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-13', number: '13', type: 'rect', x: 30, y: 179, width: 80, height: 20, labelX: 70, labelY: 193, label: '13', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-12', number: '12', type: 'rect', x: 30, y: 199, width: 80, height: 20, labelX: 70, labelY: 213, label: '12', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'ascensor-1', number: 'ASC-1', type: 'rect', x: 50, y: 219, width: 40, height: 20, labelX: 70, labelY: 233, label: 'Ascensor', fontSize: 8, originalColor: '#A6A6A6', isService: true },
      { id: 'local-11', number: '11', type: 'rect', x: 30, y: 239, width: 80, height: 40, labelX: 70, labelY: 263, label: '11', fontSize: 14, originalColor: '#FFFFFF' },
      { id: 'local-10', number: '10', type: 'rect', x: 50, y: 279, width: 60, height: 20, labelX: 80, labelY: 293, label: '10', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-9', number: '9', type: 'rect', x: 50, y: 299, width: 60, height: 20, labelX: 80, labelY: 313, label: '9', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-8', number: '8', type: 'rect', x: 50, y: 319, width: 60, height: 20, labelX: 80, labelY: 333, label: '8', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-7', number: '7', type: 'rect', x: 50, y: 339, width: 60, height: 20, labelX: 80, labelY: 353, label: '7', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-6', number: '6', type: 'rect', x: 50, y: 359, width: 60, height: 20, labelX: 80, labelY: 373, label: '6', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-5', number: '5', type: 'rect', x: 50, y: 379, width: 60, height: 20, labelX: 80, labelY: 393, label: '5', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-4', number: '4', type: 'rect', x: 50, y: 399, width: 60, height: 20, labelX: 80, labelY: 413, label: '4', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'ascensor-2', number: 'ASC-2', type: 'rect', x: 50, y: 419, width: 40, height: 20, labelX: 70, labelY: 433, label: 'Ascensor', fontSize: 8, originalColor: '#A6A6A6', isService: true },
      { id: 'banos-sur', number: 'BAÑ-S', type: 'rect', x: 50, y: 439, width: 40, height: 20, labelX: 70, labelY: 453, label: 'Baños', fontSize: 8, originalColor: '#A6A6A6', isService: true },
      { id: 'local-3', number: '3', type: 'rect', x: 50, y: 459, width: 60, height: 20, labelX: 80, labelY: 473, label: '3', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-2', number: '2', type: 'rect', x: 50, y: 479, width: 60, height: 20, labelX: 80, labelY: 493, label: '2', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-1', number: '1', type: 'rect', x: 50, y: 499, width: 60, height: 20, labelX: 80, labelY: 513, label: '1', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-0', number: '0', type: 'rect', x: 50, y: 519, width: 60, height: 20, labelX: 80, labelY: 533, label: '0', fontSize: 11, originalColor: '#FFFFFF' },

      // ISLA NORTE
      { id: 'local-16', number: '16', type: 'rect', x: 140, y: 179, width: 75, height: 20, labelX: 177, labelY: 193, label: '16', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-17', number: '17', type: 'rect', x: 140, y: 199, width: 75, height: 20, labelX: 177, labelY: 213, label: '17', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-19', number: '19', type: 'rect', x: 140, y: 219, width: 75, height: 20, labelX: 177, labelY: 233, label: '19', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-18', number: '18', type: 'rect', x: 215, y: 179, width: 30, height: 35, labelX: 230, labelY: 200, label: '18', fontSize: 10, originalColor: '#FFFFFF' },
      { id: 'local-20', number: '20', type: 'rect', x: 215, y: 214, width: 30, height: 25, labelX: 230, labelY: 230, label: '20', fontSize: 10, originalColor: '#FFFFFF' },

      // ESCALERAS NORTE
      { id: 'escaleras-norte', number: 'ESC-N', type: 'rect', x: 260, y: 179, width: 75, height: 20, labelX: 297, labelY: 193, label: 'Escaleras', fontSize: 9, originalColor: '#A6A6A6', isService: true },

      // ISLA CENTRAL
      { id: 'local-32', number: '32', type: 'rect', x: 170, y: 278, width: 120, height: 42, labelX: 230, labelY: 303, label: '32', fontSize: 15, originalColor: '#FFFFFF', isAnchor: true },
      { id: 'local-33', number: '33', type: 'rect', x: 170, y: 320, width: 60, height: 20, labelX: 200, labelY: 334, label: '33', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-34', number: '34', type: 'rect', x: 170, y: 340, width: 60, height: 20, labelX: 200, labelY: 354, label: '34', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-35', number: '35', type: 'rect', x: 170, y: 360, width: 60, height: 20, labelX: 200, labelY: 374, label: '35', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-36', number: '36', type: 'rect', x: 170, y: 380, width: 60, height: 20, labelX: 200, labelY: 394, label: '36', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-37', number: '37', type: 'rect', x: 170, y: 400, width: 60, height: 20, labelX: 200, labelY: 414, label: '37', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-38', number: '38', type: 'rect', x: 170, y: 420, width: 60, height: 20, labelX: 200, labelY: 434, label: '38', fontSize: 11, originalColor: '#FFFFFF' },

      { id: 'local-44', number: '44', type: 'rect', x: 230, y: 320, width: 60, height: 20, labelX: 260, labelY: 334, label: '44', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-43', number: '43', type: 'rect', x: 230, y: 340, width: 60, height: 20, labelX: 260, labelY: 354, label: '43', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-42', number: '42', type: 'rect', x: 230, y: 360, width: 60, height: 20, labelX: 260, labelY: 374, label: '42', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-41', number: '41', type: 'rect', x: 230, y: 380, width: 60, height: 20, labelX: 260, labelY: 394, label: '41', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-40', number: '40', type: 'rect', x: 230, y: 400, width: 60, height: 20, labelX: 260, labelY: 414, label: '40', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-39', number: '39', type: 'rect', x: 230, y: 420, width: 60, height: 20, labelX: 260, labelY: 434, label: '39', fontSize: 11, originalColor: '#FFFFFF' },

      // ESCALERAS SUR
      { id: 'escaleras-sur', number: 'ESC-S', type: 'rect', x: 155, y: 459, width: 60, height: 20, labelX: 185, labelY: 473, label: 'Escaleras', fontSize: 8, originalColor: '#A6A6A6', isService: true },

      // SECTOR AMARILLO (45-50)
      { id: 'banos-norte', number: 'BAÑ-N', type: 'rect', x: 350, y: 80, width: 80, height: 39, labelX: 390, labelY: 103, label: 'Baños', fontSize: 12, originalColor: '#A6A6A6', isService: true },
      { id: 'local-45', number: '45', type: 'rect', x: 350, y: 119, width: 80, height: 20, labelX: 390, labelY: 133, label: '45', fontSize: 11, originalColor: '#FFF280' },
      { id: 'local-46', number: '46', type: 'rect', x: 350, y: 139, width: 80, height: 20, labelX: 390, labelY: 153, label: '46', fontSize: 11, originalColor: '#FFF280' },
      { id: 'local-47', number: '47', type: 'rect', x: 350, y: 159, width: 80, height: 20, labelX: 390, labelY: 173, label: '47', fontSize: 11, originalColor: '#FFF280' },
      { id: 'local-48', number: '48', type: 'rect', x: 350, y: 179, width: 80, height: 20, labelX: 390, labelY: 193, label: '48', fontSize: 11, originalColor: '#FFF280' },
      { id: 'local-49', number: '49', type: 'rect', x: 350, y: 199, width: 80, height: 20, labelX: 390, labelY: 213, label: '49', fontSize: 11, originalColor: '#FFF280' },
      { id: 'local-50', number: '50', type: 'rect', x: 350, y: 219, width: 80, height: 20, labelX: 390, labelY: 233, label: '50', fontSize: 11, originalColor: '#FFF280' },

      // SECTOR MAGENTA (51-61)
      { id: 'local-51', number: '51', type: 'rect', x: 350, y: 239, width: 80, height: 40, labelX: 390, labelY: 263, label: '51', fontSize: 14, originalColor: '#C8287D' },
      { id: 'local-52', number: '52', type: 'rect', x: 350, y: 279, width: 60, height: 20, labelX: 380, labelY: 293, label: '52', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-53', number: '53', type: 'rect', x: 350, y: 299, width: 60, height: 20, labelX: 380, labelY: 313, label: '53', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-54', number: '54', type: 'rect', x: 350, y: 319, width: 60, height: 20, labelX: 380, labelY: 333, label: '54', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-55', number: '55', type: 'rect', x: 350, y: 339, width: 60, height: 20, labelX: 380, labelY: 353, label: '55', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-56', number: '56', type: 'rect', x: 350, y: 359, width: 60, height: 20, labelX: 380, labelY: 373, label: '56', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-57', number: '57', type: 'rect', x: 350, y: 379, width: 60, height: 20, labelX: 380, labelY: 393, label: '57', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-58', number: '58', type: 'rect', x: 350, y: 399, width: 60, height: 20, labelX: 380, labelY: 413, label: '58', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-59', number: '59', type: 'rect', x: 350, y: 419, width: 60, height: 20, labelX: 380, labelY: 433, label: '59', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-60', number: '60', type: 'rect', x: 350, y: 439, width: 60, height: 20, labelX: 380, labelY: 453, label: '60', fontSize: 11, originalColor: '#C8287D' },
      { id: 'local-61', number: '61', type: 'rect', x: 350, y: 459, width: 60, height: 20, labelX: 380, labelY: 473, label: '61', fontSize: 11, originalColor: '#C8287D' },

      // SECTOR CORAL (62-66)
      { id: 'local-62', number: '62', type: 'rect', x: 335, y: 479, width: 55, height: 20, labelX: 362, labelY: 493, label: '62', fontSize: 11, originalColor: '#FF5555' },
      { id: 'local-63', number: '63', type: 'rect', x: 335, y: 499, width: 55, height: 20, labelX: 362, labelY: 513, label: '63', fontSize: 11, originalColor: '#FF5555' },
      { id: 'local-64', number: '64', type: 'rect', x: 335, y: 519, width: 55, height: 20, labelX: 362, labelY: 533, label: '64', fontSize: 11, originalColor: '#FF5555' },
      { id: 'local-65', number: '65', type: 'rect', x: 335, y: 539, width: 55, height: 20, labelX: 362, labelY: 553, label: '65', fontSize: 11, originalColor: '#FF5555' },
      { id: 'local-66', number: '66', type: 'rect', x: 335, y: 559, width: 55, height: 20, labelX: 362, labelY: 573, label: '66', fontSize: 11, originalColor: '#FF5555' }
    ]
  },

  // =========================================================================
  // PLANTA ALTA (PA)
  // =========================================================================
  PA: {
    name: 'Planta Alta',
    level: 1,
    image: 'floorplan_pa.png',
    viewBox: '0 0 454 594',
    width: 454,
    height: 594,

    mallBoundary: {
      points: '20,15 235,15 235,35 255,35 255,15 275,15 275,35 320,35 320,15 345,15 345,75 435,75 435,575 320,575 320,594 280,594 280,565 220,565 220,594 20,594 20,15',
      stroke: '#1E293B',
      strokeWidth: 3
    },

    entrances: [],

    staticAreas: [
      { id: 'pa-salida-emergencia-oeste', type: 'rect', x: 34, y: 257, width: 20, height: 220, fill: '#002060', stroke: '#001030', label: 'Salida de Emergencia Oeste' },
      { id: 'pa-salida-emergencia-este', type: 'rect', x: 414, y: 277, width: 20, height: 260, fill: '#002060', stroke: '#001030', label: 'Salida de Emergencia Este' },
      { id: 'pa-ascensor-cuadro-azul', type: 'rect', x: 54, y: 417, width: 40, height: 20, fill: '#002060', stroke: '#001030', label: 'Área Técnica' },
      { id: 'pa-vacio-terraza-norte', type: 'rect', x: 249, y: 117, width: 90, height: 40, fill: '#D1D5DB', stroke: '#0F172A', label: 'Vacío / Terraza' },
      { id: 'pa-vacio-central-este', type: 'rect', x: 249, y: 197, width: 90, height: 40, fill: '#D1D5DB', stroke: '#0F172A', label: 'Vacío sobre Planta Baja' },
      { id: 'pa-patio-vacio-central', type: 'rect', x: 144, y: 337, width: 180, height: 100, fill: '#FFF9E6', stroke: '#0F172A', label: 'Atrio Central' },
      { id: 'pa-escal-descanso', type: 'rect', x: 264, y: 457, width: 30, height: 40, fill: '#D1D5DB', stroke: '#0F172A', label: 'Descanso Escaleras' },
      { id: 'pa-vereda-so', type: 'rect', x: 34, y: 517, width: 124, height: 21, fill: '#A0D080', stroke: '#6E9C54', label: 'Área Verde' },
      { id: 'pa-vereda-se', type: 'rect', x: 324, y: 557, width: 110, height: 20, fill: '#A0D080', stroke: '#6E9C54', label: 'Área Verde' }
    ],

    modules: [
      // SECTOR CINES & MULTIESPACIO
      { id: 'sala-1', number: 'Sala 1', type: 'rect', x: 34, y: 38, width: 60, height: 38, labelX: 64, labelY: 57, label: 'Sala 1', fontSize: 10, originalColor: '#FFFFFF' },
      { id: 'sala-2', number: 'Sala 2', type: 'rect', x: 34, y: 76, width: 60, height: 41, labelX: 64, labelY: 96, label: 'Sala 2', fontSize: 10, originalColor: '#FFFFFF' },
      { id: 'sala-3', number: 'Sala 3', type: 'rect', x: 34, y: 117, width: 60, height: 40, labelX: 64, labelY: 137, label: 'Sala 3', fontSize: 10, originalColor: '#FFFFFF' },
      { id: 'sala-4', number: 'Sala 4', type: 'rect', x: 34, y: 157, width: 60, height: 40, labelX: 64, labelY: 177, label: 'Sala 4', fontSize: 10, originalColor: '#FFFFFF' },

      { id: 'multiespacio', number: 'Multiespacio', type: 'rect', x: 114, y: 18, width: 120, height: 79, labelX: 174, labelY: 57, label: 'Multiespacio', fontSize: 13, originalColor: '#FFFFFF', isAnchor: true },
      { id: 'candy', number: 'Candy', type: 'rect', x: 114, y: 97, width: 60, height: 40, labelX: 144, labelY: 117, label: 'Candy', fontSize: 11, originalColor: '#FFFFFF' },

      // ALA OESTE PA
      { id: 'pa-ascensor-1', number: 'ASC-N', type: 'rect', x: 54, y: 197, width: 40, height: 20, labelX: 74, labelY: 207, label: 'Ascensor', fontSize: 8, originalColor: '#A6A6A6', isService: true },
      { id: 'local-81', number: '81', type: 'rect', x: 34, y: 217, width: 80, height: 40, labelX: 74, labelY: 237, label: '81', fontSize: 14, originalColor: '#FFFFFF' },
      { id: 'local-80', number: '80', type: 'rect', x: 54, y: 257, width: 60, height: 20, labelX: 84, labelY: 267, label: '80', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-79', number: '79', type: 'rect', x: 54, y: 277, width: 60, height: 20, labelX: 84, labelY: 287, label: '79', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-78', number: '78', type: 'rect', x: 54, y: 297, width: 60, height: 20, labelX: 84, labelY: 307, label: '78', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-77', number: '77', type: 'rect', x: 54, y: 317, width: 60, height: 20, labelX: 84, labelY: 327, label: '77', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-76', number: '76', type: 'rect', x: 54, y: 337, width: 60, height: 20, labelX: 84, labelY: 347, label: '76', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-75', number: '75', type: 'rect', x: 54, y: 357, width: 60, height: 20, labelX: 84, labelY: 367, label: '75', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-74', number: '74', type: 'rect', x: 54, y: 377, width: 60, height: 20, labelX: 84, labelY: 387, label: '74', fontSize: 11, originalColor: '#FFFFFF' },

      { id: 'pa-ascensor-2', number: 'ASC-S', type: 'rect', x: 54, y: 397, width: 40, height: 20, labelX: 74, labelY: 407, label: 'Ascensor', fontSize: 8, originalColor: '#A6A6A6', isService: true },
      { id: 'local-73', number: '73', type: 'rect', x: 54, y: 457, width: 60, height: 20, labelX: 84, labelY: 467, label: '73', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-72', number: '72', type: 'rect', x: 54, y: 477, width: 60, height: 20, labelX: 84, labelY: 487, label: '72', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-71', number: '71', type: 'rect', x: 54, y: 497, width: 76, height: 20, labelX: 92, labelY: 507, label: '71', fontSize: 11, originalColor: '#FFFFFF' },

      // MODULOS NORTE & BALCON
      { id: 'local-82', number: '82', type: 'rect', x: 265, y: 76, width: 59, height: 21, labelX: 294, labelY: 86, label: '82', fontSize: 10, originalColor: '#FFFFFF' },
      { id: 'local-83', number: '83', type: 'rect', x: 219, y: 117, width: 30, height: 40, labelX: 234, labelY: 137, label: '83', fontSize: 10, originalColor: '#FFFFFF' },
      { id: 'local-84', number: '84', type: 'rect', x: 144, y: 177, width: 30, height: 20, labelX: 159, labelY: 187, label: '84', fontSize: 10, originalColor: '#FFFFFF' },
      { id: 'local-85', number: '85', type: 'rect', x: 174, y: 177, width: 30, height: 20, labelX: 189, labelY: 187, label: '85', fontSize: 10, originalColor: '#FFFFFF' },

      // ISLA CENTRAL PA
      { id: 'local-86', number: '86', type: 'rect', x: 144, y: 197, width: 150, height: 140, labelX: 219, labelY: 267, label: '86', fontSize: 16, originalColor: '#FFFFFF', isAnchor: true },
      { id: 'local-87', number: '87', type: 'rect', x: 294, y: 237, width: 30, height: 100, labelX: 309, labelY: 287, label: '87', fontSize: 11, originalColor: '#FFFFFF' },

      // ESCALERAS PA
      { id: 'pa-escaleras-norte', number: 'ESC-N', type: 'rect', x: 264, y: 177, width: 75, height: 20, labelX: 301, labelY: 187, label: 'Escaleras', fontSize: 9, originalColor: '#A6A6A6', isService: true },
      { id: 'pa-escaleras-sur', number: 'ESCAL', type: 'rect', x: 159, y: 457, width: 60, height: 60, labelX: 189, labelY: 487, label: 'Escal.', fontSize: 9, originalColor: '#A6A6A6', isService: true },

      // ALA ESTE PA
      { id: 'pa-banos', number: 'BAÑOS', type: 'rect', x: 354, y: 76, width: 80, height: 41, labelX: 394, labelY: 96, label: 'Baños', fontSize: 12, originalColor: '#A6A6A6', isService: true },
      { id: 'local-88', number: '88', type: 'rect', x: 354, y: 117, width: 80, height: 20, labelX: 394, labelY: 127, label: '88', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-89', number: '89', type: 'rect', x: 354, y: 137, width: 80, height: 20, labelX: 394, labelY: 147, label: '89', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-90', number: '90', type: 'rect', x: 354, y: 157, width: 80, height: 20, labelX: 394, labelY: 167, label: '90', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-91', number: '91', type: 'rect', x: 354, y: 177, width: 80, height: 20, labelX: 394, labelY: 187, label: '91', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-92', number: '92', type: 'rect', x: 354, y: 197, width: 80, height: 20, labelX: 394, labelY: 207, label: '92', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-93', number: '93', type: 'rect', x: 354, y: 217, width: 80, height: 20, labelX: 394, labelY: 227, label: '93', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-94', number: '94', type: 'rect', x: 354, y: 237, width: 80, height: 40, labelX: 394, labelY: 257, label: '94', fontSize: 13, originalColor: '#FFFFFF' },

      { id: 'local-95', number: '95', type: 'rect', x: 354, y: 277, width: 60, height: 20, labelX: 384, labelY: 287, label: '95', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-96', number: '96', type: 'rect', x: 354, y: 297, width: 60, height: 20, labelX: 384, labelY: 307, label: '96', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-97', number: '97', type: 'rect', x: 354, y: 317, width: 60, height: 20, labelX: 384, labelY: 327, label: '97', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-98', number: '98', type: 'rect', x: 354, y: 337, width: 60, height: 20, labelX: 384, labelY: 347, label: '98', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-99', number: '99', type: 'rect', x: 354, y: 357, width: 60, height: 20, labelX: 384, labelY: 367, label: '99', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-100', number: '100', type: 'rect', x: 354, y: 377, width: 60, height: 20, labelX: 384, labelY: 387, label: '100', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-101', number: '101', type: 'rect', x: 354, y: 397, width: 60, height: 20, labelX: 384, labelY: 407, label: '101', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-102', number: '102', type: 'rect', x: 354, y: 417, width: 60, height: 20, labelX: 384, labelY: 427, label: '102', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-103', number: '103', type: 'rect', x: 354, y: 437, width: 60, height: 20, labelX: 384, labelY: 447, label: '103', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-104', number: '104', type: 'rect', x: 354, y: 457, width: 60, height: 20, labelX: 384, labelY: 467, label: '104', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-105', number: '105', type: 'rect', x: 354, y: 477, width: 60, height: 20, labelX: 384, labelY: 487, label: '105', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-106', number: '106', type: 'rect', x: 354, y: 497, width: 60, height: 20, labelX: 384, labelY: 507, label: '106', fontSize: 11, originalColor: '#FFFFFF' },
      { id: 'local-107', number: '107', type: 'rect', x: 354, y: 517, width: 60, height: 20, labelX: 384, labelY: 527, label: '107', fontSize: 11, originalColor: '#FFFFFF' },

      { id: 'local-108', number: '108', type: 'rect', x: 324, y: 537, width: 90, height: 20, labelX: 369, labelY: 547, label: '108', fontSize: 11, originalColor: '#FFFFFF' }
    ]
  }
};
