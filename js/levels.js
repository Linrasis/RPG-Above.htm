'use strict';

function load_level(id){
    rpg_character_create({
      'color': settings_settings['color'],
      'height': 34,
      'inventory': [
        rpg_item_create({
          'cursor': 'pointer',
          'label': 'Scroll of Manabolt',
          'spell': {
            'color': '#00f',
            'cost': 1,
            'damage': 1,
            'reload': 10,
          },
        }),
        rpg_item_create({
          'cursor': 'pointer',
          'label': 'Scroll of Healthbolt',
          'spell': {
            'color': '#0f0',
            'cost': 1,
            'costs': 'health',
            'damage': 1,
            'reload': 10,
          },
        }),
        rpg_item_create({
          'cursor': 'pointer',
          'label': 'Barricade',
          'spell': {
            'color': '#00f',
            'cost': 10,
            'reload': 10,
            'type': 'character',
          },
        }),
        rpg_item_create({
          'cursor': 'pointer',
          'label': 'Heal',
          'spell': {
            'color': '#00f',
            'cost': 1,
            'damage': -1,
            'reload': 10,
            'type': 'stat',
          },
        }),
      ],
      'player': true,
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
        rpg_item_create({
          'label': 'Scroll of Manabolt',
          'owner': 2,
          'spell': {
            'color': '#00f',
            'damage': 1,
            'reload': 10,
          },
        }),
      ],
      'x': 600,
      'y': 400,
    });
}
