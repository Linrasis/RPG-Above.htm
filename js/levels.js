'use strict';

function load_level(id){
    create_player({
      'spellbar': {
        1: 'manabolt',
        2: 'create block',
        3: 'lifebolt',
        4: 'heal',
        5: 'manabolt',
        6: 'manabolt',
        7: 'manabolt',
        8: 'manabolt',
        9: 'manabolt',
        10: 'manabolt',
      },
      'spellbook': {
        'create block': {
          'cost': 10,
          'costs': 'mana',
          'current': 10,
          'cursor': 'crosshair',
          'reload': 10,
          'type': 'world-dynamic',
          'world-dynamic': {
            'color': '#151',
          },
        },
        'heal': {
          'cost': 1,
          'costs': 'mana',
          'current': 10,
          'cursor': 'pointer',
          'effect': {
            'damage': -1,
            'stat': 'health',
          },
          'reload': 10,
          'type': 'stat',
        },
        'lifebolt': {
          'cost': 1,
          'costs': 'health',
          'current': 10,
          'cursor': 'crosshair',
          'particle': {
            'color': '#0f0',
            'damage': 2,
            'lifespan': 100,
          },
          'reload': 10,
          'type': 'particle',
        },
        'manabolt': {
          'cost': 1,
          'costs': 'mana',
          'current': 10,
          'cursor': 'crosshair',
          'particle': {
            'color': '#00f',
            'damage': 1,
            'lifespan': 50,
          },
          'reload': 10,
          'type': 'particle',
        },
      },
      'stats': {
        'health': {
          'current': 10,
          'max': 10,
          'regeneration': {
            'current': 0,
            'max': 1000,
          },
        },
        'mana': {
          'current': 10,
          'max': 10,
          'regeneration': {
            'current': 0,
            'max': 100,
          },
        },
      },
    });

    create_world_dynamic({
      'color': '#222',
      'height': 100,
      'width': 25,
      'x': -150,
      'y': -150,
    });
    create_world_dynamic({
      'color': '#222',
      'height': 25,
      'width': 100,
      'x': -125,
      'y': -150,
    });
    create_world_dynamic({
      'color': '#222',
      'height': 25,
      'width': 25,
      'x': 100,
      'y': -75,
    });
    create_world_dynamic({
      'collision': false,
      'color': '#700',
      'effect': 1,
      'height': 50,
      'width': 50,
      'x': 150,
      'y': 150,
    });
    create_world_dynamic({
      'collision': false,
      'color': '#66f',
      'effect': 1,
      'effect-stat': 'mana',
      'height': 50,
      'width': 50,
      'x': 100,
      'y': 150,
    });
    world_static.push({
      'color': '#333',
      'height': 500,
      'width': 500,
      'x': -250,
      'y': -250,
    });

    create_npc({
      'friendly': true,
      'x': -200,
      'y': 100,
    });
    create_npc({
      'selected': 'manabolt',
      'spellbook': {
        'manabolt': {
          'color': '#f00',
          'current': 0,
          'damage': 1,
          'lifespan': 50,
          'reload': 10,
        },
      },
      'stats': {
        'health': {
          'current': 10,
          'max': 10,
        },
      },
      'x': 200,
      'y': -100,
    });
}
