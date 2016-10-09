'use strict';

function load_level(id){
    rpg_character_create({
      'color': settings_settings['color'],
      'height': 34,
      'inventory': [
        {
          'cost': 1,
          'costs': 'mana',
          'current': 10,
          'cursor': 'crosshair',
          'label': 'manabolt',
          'particle': {
            'color': '#00f',
            'damage': 1,
            'lifespan': 50,
            'speed-x': 5,
            'speed-y': 5,
          },
          'reload': 10,
          'type': 'particle',
        },
        {
          'cost': 10,
          'costs': 'mana',
          'current': 10,
          'cursor': 'crosshair',
          'label': 'create block',
          'reload': 10,
          'type': 'world-dynamic',
          'world-dynamic': {
            'color': '#151',
          },
        },
        {
          'cost': 1,
          'costs': 'mana',
          'current': 10,
          'cursor': 'pointer',
          'effect': {
            'damage': -1,
            'stat': 'health',
          },
          'label': 'heal',
          'reload': 10,
          'type': 'stat',
        },
        {
          'cost': 1,
          'costs': 'health',
          'current': 10,
          'cursor': 'crosshair',
          'label': 'lifebolt',
          'particle': {
            'color': '#0f0',
            'damage': 2,
            'lifespan': 100,
            'speed-x': 5,
            'speed-y': 5,
          },
          'reload': 10,
          'type': 'particle',
        },
      ],
      'player': true,
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
      'width': 34,
    });

    rpg_world_static.push({
      'color': '#333',
      'height': 250,
      'width': 200,
      'x': -50,
      'y': -125,
    });
    rpg_world_static.push({
      'color': '#020',
      'height': 650,
      'width': 475,
      'x': 150,
      'y': -225,
    });
    rpg_world_static.push({
      'color': '#321',
      'height': 50,
      'width': 150,
      'x': 150,
      'y': 75,
    });
    rpg_world_static.push({
      'color': '#321',
      'height': 650,
      'width': 50,
      'x': 300,
      'y': -225,
    });

    rpg_world_dynamic_create({
      'color': '#222',
      'height': 300,
      'width': 25,
      'x': -75,
      'y': -150,
    });
    rpg_world_dynamic_create({
      'color': '#222',
      'height': 25,
      'width': 175,
      'x': -50,
      'y': -150,
    });
    rpg_world_dynamic_create({
      'color': '#222',
      'height': 25,
      'width': 175,
      'x': -50,
      'y': 125,
    });
    rpg_world_dynamic_create({
      'color': '#222',
      'height': 325,
      'width': 25,
      'x': 125,
      'y': -250,
    });
    rpg_world_dynamic_create({
      'color': '#222',
      'height': 325,
      'width': 25,
      'x': 125,
      'y': 125,
    });
    rpg_world_dynamic_create({
      'color': '#222',
      'height': 25,
      'width': 475,
      'x': 150,
      'y': -250,
    });
    rpg_world_dynamic_create({
      'color': '#222',
      'height': 25,
      'width': 475,
      'x': 150,
      'y': 425,
    });
    rpg_world_dynamic_create({
      'collision': false,
      'color': '#66f',
      'effect': 1,
      'effect-stat': 'mana',
      'height': 50,
      'width': 50,
      'x': 400,
      'y': -75,
    });
    rpg_world_dynamic_create({
      'collision': false,
      'color': '#700',
      'effect': 1,
      'height': 50,
      'width': 50,
      'x': 450,
      'y': -75,
    });
    rpg_world_dynamic_create({
      'color': '#222',
      'height': 700,
      'width': 25,
      'x': 625,
      'y': -250,
    });

    rpg_character_create({
      'team': 0,
      'x': -25,
      'y': -100,
    });
    rpg_character_create({
      'inventory': [
        {
          'cost': 0,
          'costs': 'health',
          'current': 10,
          'label': 'manabolt',
          'particle': {
            'color': '#00f',
            'damage': 1,
            'lifespan': 50,
            'speed-x': 5,
            'speed-y': 5,
          },
          'reload': 10,
          'type': 'particle',
        },
      ],
      'stats': {
        'health': {
          'current': 10,
          'max': 10,
          'regeneration': {
            'current': 0,
            'max': 1000,
          },
        },
      },
      'x': 600,
      'y': 400,
    });
}
