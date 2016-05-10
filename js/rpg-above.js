'use strict';

function draw_logic(){
    buffer.save();
    buffer.translate(
      x,
      y
    );

    buffer.save();
    buffer.translate(
      -player['x'],
      -player['y']
    );

    // Draw static world objects.
    for(var object in world_static){
        buffer.fillStyle = world_static[object]['color'];
        buffer.fillRect(
          world_static[object]['x'],
          world_static[object]['y'],
          world_static[object]['width'],
          world_static[object]['height']
        );
    }

    // Draw dynamic world objects.
    for(var object in world_dynamic){
        buffer.fillStyle = world_dynamic[object]['color'];
        buffer.fillRect(
          world_dynamic[object]['x'],
          world_dynamic[object]['y'],
          world_dynamic[object]['width'],
          world_dynamic[object]['height']
        );
    }

    // Draw NPCs.
    for(var npc in npcs){
        buffer.fillStyle = npcs[npc]['color'];
        buffer.fillRect(
          npcs[npc]['x'] - npcs[npc]['width-half'],
          npcs[npc]['y'] - npcs[npc]['height-half'],
          npcs[npc]['width'],
          npcs[npc]['height']
        );
    }

    // Draw particles.
    for(var particle in particles){
        buffer.fillStyle = particles[particle]['color'];
        buffer.fillRect(
          particles[particle]['x'] - particles[particle]['width-half'],
          particles[particle]['y'] - particles[particle]['height-half'],
          particles[particle]['width'],
          particles[particle]['height']
        );
    }

    buffer.restore();

    // Draw player and targeting direction.
    buffer.fillStyle = settings['color'];
    buffer.fillRect(
      -17,
      -17,
      34,
      34
    );
    var endpoint = get_fixed_length_line(
      0,
      0,
      mouse_x - x,
      mouse_y - y,
      25
    );
    buffer.beginPath();
    buffer.moveTo(
      0,
      0
    );
    buffer.lineTo(
      endpoint['x'],
      endpoint['y']
    );
    buffer.closePath();
    buffer.strokeStyle = '#fff';
    buffer.stroke();

    buffer.restore();

    // Draw UI.
    buffer.fillStyle = '#444';
    buffer.fillRect(
      0,
      0,
      200,
      250
    );

    buffer.fillStyle = '#0a0';
    buffer.fillRect(
      0,
      0,
      200 * (player['stats']['health']['current'] / player['stats']['health']['max']),
      100
    );
    buffer.fillStyle = '#66f';
    buffer.fillRect(
      0,
      100,
      200 * (player['stats']['mana']['current'] / player['stats']['mana']['max']),
      100
    );

    // Setup text display.
    buffer.fillStyle = '#fff';
    buffer.font = '23pt sans-serif';
    buffer.textAlign = 'center';
    buffer.textBaseline = 'middle';

    buffer.fillText(
      player['stats']['health']['current'],
      50,
      25
    );
    buffer.fillText(
      player['stats']['health']['max'],
      50,
      75
    );
    buffer.fillText(
      player['stats']['mana']['current'],
      50,
      125
    );
    buffer.fillText(
      player['stats']['mana']['max'],
      50,
      175
    );

    buffer.font = '16pt sans-serif';
    buffer.fillText(
      parseInt(
        player['stats']['health']['current'] * 100 / player['stats']['health']['max'],
        10
      ) + '%',
      150,
      25
    );
    buffer.fillText(
      player['stats']['health']['regeneration']['current']
        + '/' + player['stats']['health']['regeneration']['max'],
      150,
      75
    );
    buffer.fillText(
      parseInt(
        player['stats']['mana']['current'] * 100 / player['stats']['mana']['max'],
        10
      ) + '%',
      150,
      125
    );
    buffer.fillText(
      player['stats']['mana']['regeneration']['current']
        + '/' + player['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    // Draw selected UI.
    buffer.textAlign = 'left';
    if(ui === 1){
        buffer.fillText(
          'CHARACTER',
          205,
          13
        );

    }else if(ui === 2){
        buffer.fillText(
          'Inventory is empty.',
          205,
          13
        );

    }else if(ui === 3){
        for(var spell in player['spellbar']){
            buffer.fillText(
              spell
                + ': '
                + player['spellbar'][spell]
                + (spell == player['selected']
                  ? ', selected'
                  : ''
                ),
              205,
              25 * parseInt(
                spell,
                10
              ) - 12
            );
        }
    }

    // Draw game over messages.
    if(!game_running){
        buffer.font = '23pt sans-serif';
        buffer.textAlign = 'center';
        buffer.fillText(
          'ESC = Main Menu',
          x,
          220
        );

        buffer.fillStyle = '#f00';
        buffer.font = '42pt sans-serif';
        buffer.fillText(
          'YOU ARE DEAD',
          x,
          175
        );
    }
}

function logic(){
    if(!game_running){
        return;
    }

    // Regenerate player health and mana.
    if(player['stats']['health']['current'] < player['stats']['health']['max']){
        player['stats']['health']['regeneration']['current'] += 1;
        if(player['stats']['health']['regeneration']['current'] >= player['stats']['health']['regeneration']['max']){
            player['stats']['health']['current'] += 1;
            player['stats']['health']['regeneration']['current'] = 0;
        }
    }

    if(player['stats']['mana']['current'] < player['stats']['mana']['max']){
        player['stats']['mana']['regeneration']['current'] += 1;
        if(player['stats']['mana']['regeneration']['current'] >= player['stats']['mana']['regeneration']['max']){
            player['stats']['mana']['current'] += 1;
            player['stats']['mana']['regeneration']['current'] = 0;
        }
    }

    var player_dx = 0;
    var player_dy = 0;

    // Add player key movments to dx and dy, if still within level boundaries.
    if(key_left){
        player_dx -= 2;
    }

    if(key_right){
        player_dx += 2;
    }

    if(key_down){
        if(player_dx != 0){
            player_dx = player_dx / 2 * Math.SQRT2;
            player_dy += Math.SQRT2;

        }else{
            player_dy += 2;
        }
    }

    if(key_up){
        if(player_dx != 0){
            player_dx = player_dx / 2 * Math.SQRT2;
            player_dy -= Math.SQRT2;

        }else{
            player_dy -= 2;
        }
    }

    // Check for player collision with dynamic world objects.
    for(var object in world_dynamic){
        if(world_dynamic[object]['effect'] === 0
          && !world_dynamic[object]['collision']){
            continue;
        }

        if(player['x'] + player_dx - 17 > world_dynamic[object]['x'] + world_dynamic[object]['width']
          || player['x'] + player_dx + 17 < world_dynamic[object]['x']
          || player['y'] + player_dy - 17 > world_dynamic[object]['y'] + world_dynamic[object]['height']
          || player['y'] + player_dy + 17 < world_dynamic[object]['y']){
            continue;
        }

        if(world_dynamic[object]['effect'] > 0){
            effect_player(
              world_dynamic[object]['effect-stat'],
              world_dynamic[object]['effect']
            );
        }

        if(!world_dynamic[object]['collision']){
            continue;
        }

        if(player['y'] > world_dynamic[object]['y'] - 17
          && player['y'] < world_dynamic[object]['y'] + world_dynamic[object]['height'] + 17){
            if(key_left
              && player['y'] + player_dy + 17 > world_dynamic[object]['y']
              && player['y'] + player_dy - 17 < world_dynamic[object]['y'] + world_dynamic[object]['height']
              && player['x'] + player_dx - 17 < world_dynamic[object]['x'] + world_dynamic[object]['width']){
                player_dx = 0;

            }else if(key_right
              && player['y'] + player_dy + 17 > world_dynamic[object]['y']
              && player['y'] + player_dy - 17 < world_dynamic[object]['y'] + world_dynamic[object]['height']
              && player['x'] + player_dx + 17 > world_dynamic[object]['x']){
                player_dx = 0;
            }
        }

        if(key_down
          && player['x'] + player_dx + 17 > world_dynamic[object]['x']
          && player['x'] + player_dx - 17 < world_dynamic[object]['x'] + world_dynamic[object]['width']
          && player['y'] + player_dy + 17 > world_dynamic[object]['y']){
            player_dy = 0;

        }else if(key_up
          && player['x'] + player_dx + 17 > world_dynamic[object]['x']
          && player['x'] + player_dx - 17 < world_dynamic[object]['x'] + world_dynamic[object]['width']
          && player['y'] + player_dy - 17 < world_dynamic[object]['y'] + world_dynamic[object]['height']){
            player_dy = 0;
        }
    }

    // Update actual player position.
    player['x'] += player_dx;
    player['y'] += player_dy;

    // Update player spells.
    for(var spell in player['spellbook']){
        if(player['spellbook'][spell]['current'] < player['spellbook'][spell]['reload']){
            player['spellbook'][spell]['current'] += 1;
        }
    }

    // Check if player wants to fire selected spell
    //   and fire it if they do and it can be fired.
    var selected = player['spellbar'][player['selected']];

    if(mouse_lock_x > -1
      && player['spellbook'][selected]['current'] >= player['spellbook'][selected]['reload']
      && player['stats'][player['spellbook'][selected]['costs']]['current'] >= player['spellbook'][selected]['cost']){
        player['spellbook'][selected]['current'] = 0;
        player['stats'][player['spellbook'][selected]['costs']]['current'] = Math.max(
          player['stats'][player['spellbook'][selected]['costs']]['current'] - player['spellbook'][selected]['cost'],
          0
        );

        // Handle particle-creating spells.
        if(player['spellbook'][selected]['type'] === 'particle'){
            var speeds = get_movement_speed(
              player['x'],
              player['y'],
              player['x'] + mouse_x - x,
              player['y'] + mouse_y - y
            );
            var particle = {};
            for(var property in player['spellbook'][selected]['particle']){
                particle[property] = player['spellbook'][selected]['particle'][property];
            }
            particle['dx'] = mouse_x > x ? speeds[0] : -speeds[0];
            particle['dy'] = mouse_y > y ? speeds[1] : -speeds[1];
            particle['x'] = player['x'];
            particle['y'] = player['y'];

            create_particle(particle);

        }else if(player['spellbook'][selected]['type'] === 'stat'){
            effect_player(
              player['spellbook'][selected]['effect']['stat'],
              player['spellbook'][selected]['effect']['damage']
            );

        }else if(player['spellbook'][selected]['type'] === 'world-dynamic'){
            var worlddynamic = {};
            for(var property in player['spellbook'][selected]['world-dynamic']){
                worlddynamic[property] = player['spellbook'][selected]['world-dynamic'][property];
            }
            worlddynamic['x'] = player['x'] + mouse_x - x;
            worlddynamic['y'] = player['y'] + mouse_y - y;

            create_world_dynamic(worlddynamic);
        }
    }

    // Handle NPCs.
    for(var npc in npcs){
        if(npcs[npc]['selected'] == void 0){
            continue;
        }

        for(var spell in npcs[npc]['spellbook']){
            if(npcs[npc]['spellbook'][spell]['current'] < npcs[npc]['spellbook'][spell]['reload']){
                npcs[npc]['spellbook'][spell]['current'] += 1;
                continue;
            }

            if(npcs[npc]['selected'] !== spell){
                continue;
            }

            npcs[npc]['spellbook'][spell]['current'] = 0;

            // Create NPC-created particle.
            var speeds = get_movement_speed(
              npcs[npc]['x'],
              npcs[npc]['y'],
              player['x'],
              player['y']
            );
            var particle = {};
            for(var property in npcs[npc]['spellbook'][spell]){
                particle[property] = npcs[npc]['spellbook'][spell][property];
            }
            particle['dx'] = player['x'] > npcs[npc]['x'] ? speeds[0] : -speeds[0];
            particle['dy'] = player['y'] > npcs[npc]['y'] ? speeds[1] : -speeds[1];
            particle['owner'] = npc;
            particle['x'] = npcs[npc]['x'];
            particle['y'] = npcs[npc]['y'];

            create_particle(particle);
            break;
        }
    }

    handle_particles();

    if(player['stats']['health']['current'] <= 0){
        game_running = false;
    }
}

function mouse_wheel(e){
    if(mode <= 0){
        return;
    }

    select_spell(
      player['selected']
        + (
          (e.wheelDelta || -e.detail) > 0
            ? -1
            : 1
        )
    );
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    var ids = {
      'audio-volume': 1,
      'character-key': 'C',
      'color': '#009900',
      'inventory-key': 'B',
      'movement-keys': 'WASD',
      'ms-per-frame': 25,
      'spellbook-key': 'V',
    };
    for(var id in ids){
        document.getElementById(id).value = ids[id];
    }

    save();
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'ms-per-frame': 25,
    };
    for(var id in ids){
        settings[id] = parseFloat(document.getElementById(id).value);

        if(settings[id] == ids[id]
          || isNaN(settings[id])){
            window.localStorage.removeItem('RPG-Above.htm-' + id);

        }else{
            window.localStorage.setItem(
              'RPG-Above.htm-' + id,
              settings[id]
            );
        }
    }

    ids = {
      'character-key': 'C',
      'color': '#009900',
      'inventory-key': 'B',
      'movement-keys': 'WASD',
      'spellbook-key': 'V',
    };
    for(id in ids){
        settings[id] = document.getElementById(id).value;

        if(settings[id] === ids[id]){
            window.localStorage.removeItem('RPG-Above.htm-' + id);

        }else{
            window.localStorage.setItem(
              'RPG-Above.htm-' + id,
              settings[id]
            );
        }
    }
}

function setmode_logic(newgame){
    game_running = true;
    npcs.length = 0;
    particles.length = 0;
    world_dynamic.length = 0;
    world_static.length = 0;

    // Main menu mode.
    if(mode === 0){
        document.body.innerHTML = '<div><div><a onclick="setmode(1, true)">Test Level</a></div></div><div class=right><div><input disabled value=Click>Cast Spell<br><input id=character-key maxlength=1 value='
          + settings['character-key'] + '>Character Info<br><input id=inventory-key maxlength=1 value='
          + settings['inventory-key'] + '>Inventory<br><input disabled value=ESC>Main Menu<br><input id=movement-keys maxlength=4 value='
          + settings['movement-keys'] + '>Move ↑←↓→<br><input disabled value="0 - 9">Select Spell<br><input id=spellbook-key maxlength=1 value='
          + settings['spellbook-key'] + '>Spellbook</div><hr><div><input id=audio-volume max=1 min=0 step=0.01 type=range value='
          + settings['audio-volume'] + '>Audio<br><input id=color type=color value='
          + settings['color'] + '>Color<br><input id=ms-per-frame value='
          + settings['ms-per-frame'] + '>ms/Frame<br><a onclick=reset()>Reset Settings</a></div></div>';

    // New game mode.
    }else{
        if(newgame){
            save();
        }

        ui = 0;
        //select_spell(player['selected']);
    }
}

var game_running = false;
var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var mouse_lock_x = 0;
var mouse_lock_y = 0;
var mouse_x = 0;
var mouse_y = 0;
var settings = {
  'audio-volume': window.localStorage.getItem('RPG-Above.htm-audio-volume') !== null
    ? parseFloat(window.localStorage.getItem('RPG-Above.htm-audio-volume'))
    : 1,
  'character-key': window.localStorage.getItem('RPG-Above.htm-character-key') || 'C',
  'color': window.localStorage.getItem('RPG-Above.htm-color') || '#009900',
  'inventory-key': window.localStorage.getItem('RPG-Above.htm-inventory-key') || 'B',
  'movement-keys': window.localStorage.getItem('RPG-Above.htm-movement-keys') || 'WASD',
  'ms-per-frame': parseInt(window.localStorage.getItem('RPG-Above.htm-ms-per-frame'), 10) || 25,
  'spellbook-key': window.localStorage.getItem('RPG-Above.htm-spellbook-key') || 'V',
};

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        setmode(
          0,
          true
        );
        return;

    }else if(key > 47
      && key < 58){
        select_spell(
          key === 48
            ? 10
            : key - 48
        );
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings['movement-keys'][0]){
        key_up = true;

    }else if(key === settings['movement-keys'][1]){
        key_left = true;

    }else if(key === settings['movement-keys'][2]){
        key_down = true;

    }else if(key === settings['movement-keys'][3]){
        key_right = true;

    }else if(key === settings['character-key']){
        ui = ui === 1
          ? 0
          : 1;

    }else if(key === settings['inventory-key']){
        ui = ui === 2
          ? 0
          : 2;

    }else if(key === settings['spellbook-key']){
        ui = ui === 3
          ? 0
          : 3;
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][0]){
        key_up = false;

    }else if(key === settings['movement-keys'][1]){
        key_left = false;

    }else if(key === settings['movement-keys'][2]){
        key_down = false;

    }else if(key === settings['movement-keys'][3]){
        key_right = false;
    }
};

window.onload = function(e){
    if('onmousewheel' in window){
        window.onmousewheel = mouse_wheel;

    }else{
        document.addEventListener(
          'DOMMouseScroll',
          mouse_wheel,
          false
        );
    }

    init_canvas();
};

window.onmousedown = function(e){
    if(mode <= 0
      || (mouse_x <= 200
        && mouse_y <= 250)){
        return;
    }

    e.preventDefault();
    mouse_lock_x = mouse_x;
    mouse_lock_y = mouse_y;
};

window.onmousemove = function(e){
    if(mode <= 0
      || !game_running){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

window.onmouseup = function(e){
    mouse_lock_x = -1;
};
